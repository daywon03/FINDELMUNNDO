from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'findelmundo_secret_key_2024')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class AdminCreate(BaseModel):
    email: str
    password: str

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse

class MediaCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    category: str = "Portrait"
    media_type: str = "image"  # image or video

class MediaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    featured: Optional[bool] = None
    order: Optional[int] = None

class MediaResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    category: str
    media_type: str
    file_url: str
    thumbnail_url: Optional[str] = None
    featured: bool
    order: int
    created_at: str

class CategoryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    count: int

class AboutContent(BaseModel):
    bio: str
    artist_name: str
    tagline: str
    profile_image: Optional[str] = None

class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class SiteSettings(BaseModel):
    site_title: str = "Findelmundo"
    tagline: str = "Audio • Video • Photography"
    about_bio: str = ""
    contact_email: str = ""
    social_instagram: Optional[str] = None
    social_twitter: Optional[str] = None
    social_vimeo: Optional[str] = None

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(admin_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {"sub": admin_id, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(token: str = None):
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    
    # Remove 'Bearer ' prefix if present
    if token.startswith('Bearer '):
        token = token[7:]
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        admin_id = payload.get("sub")
        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        admin = await db.admins.find_one({"id": admin_id}, {"_id": 0})
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register_admin(data: AdminCreate):
    # Check if admin already exists
    existing = await db.admins.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    admin_id = str(uuid.uuid4())
    admin_doc = {
        "id": admin_id,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.admins.insert_one(admin_doc)
    
    token = create_access_token(admin_id)
    return TokenResponse(
        access_token=token,
        admin=AdminResponse(
            id=admin_id,
            email=data.email,
            created_at=admin_doc["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login_admin(data: AdminLogin):
    admin = await db.admins.find_one({"email": data.email}, {"_id": 0})
    if not admin or not verify_password(data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(admin["id"])
    return TokenResponse(
        access_token=token,
        admin=AdminResponse(
            id=admin["id"],
            email=admin["email"],
            created_at=admin["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=AdminResponse)
async def get_current_admin_info(authorization: str = None):
    from fastapi import Header
    admin = await get_current_admin(authorization)
    return AdminResponse(
        id=admin["id"],
        email=admin["email"],
        created_at=admin["created_at"]
    )

# ==================== MEDIA ROUTES ====================

@api_router.post("/media/upload", response_model=MediaResponse)
async def upload_media(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("Portrait"),
    media_type: str = Form("image"),
    authorization: str = None
):
    from fastapi import Header
    await get_current_admin(authorization)
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix.lower()
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{file_ext}"
    file_path = UPLOADS_DIR / filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get max order
    max_order_doc = await db.media.find_one(sort=[("order", -1)])
    next_order = (max_order_doc.get("order", 0) + 1) if max_order_doc else 1
    
    media_doc = {
        "id": file_id,
        "title": title,
        "description": description,
        "category": category,
        "media_type": media_type,
        "filename": filename,
        "file_url": f"/api/uploads/{filename}",
        "thumbnail_url": None,
        "featured": False,
        "order": next_order,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.media.insert_one(media_doc)
    
    return MediaResponse(
        id=file_id,
        title=title,
        description=description,
        category=category,
        media_type=media_type,
        file_url=media_doc["file_url"],
        thumbnail_url=None,
        featured=False,
        order=next_order,
        created_at=media_doc["created_at"]
    )

@api_router.get("/media", response_model=List[MediaResponse])
async def get_all_media(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    
    media_list = await db.media.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    return [MediaResponse(**m) for m in media_list]

@api_router.get("/media/{media_id}", response_model=MediaResponse)
async def get_media(media_id: str):
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return MediaResponse(**media)

@api_router.put("/media/{media_id}", response_model=MediaResponse)
async def update_media(media_id: str, data: MediaUpdate, authorization: str = None):
    from fastapi import Header
    await get_current_admin(authorization)
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.media.update_one({"id": media_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    return MediaResponse(**media)

@api_router.delete("/media/{media_id}")
async def delete_media(media_id: str, authorization: str = None):
    from fastapi import Header
    await get_current_admin(authorization)
    
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Delete file
    file_path = UPLOADS_DIR / media["filename"]
    if file_path.exists():
        file_path.unlink()
    
    await db.media.delete_one({"id": media_id})
    return {"message": "Media deleted successfully"}

# ==================== CATEGORIES ====================

@api_router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    categories = await db.media.aggregate(pipeline).to_list(100)
    return [
        CategoryResponse(id=str(uuid.uuid4()), name=c["_id"], count=c["count"])
        for c in categories
    ]

# ==================== SETTINGS ====================

@api_router.get("/settings", response_model=SiteSettings)
async def get_settings():
    settings = await db.settings.find_one({"type": "site"}, {"_id": 0})
    if not settings:
        return SiteSettings()
    return SiteSettings(**settings)

@api_router.put("/settings", response_model=SiteSettings)
async def update_settings(data: SiteSettings, authorization: str = None):
    from fastapi import Header
    await get_current_admin(authorization)
    
    settings_doc = data.model_dump()
    settings_doc["type"] = "site"
    
    await db.settings.update_one(
        {"type": "site"},
        {"$set": settings_doc},
        upsert=True
    )
    return data

# ==================== CONTACT ====================

@api_router.post("/contact")
async def send_contact_message(data: ContactMessage):
    message_doc = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "subject": data.subject,
        "message": data.message,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contact_messages.insert_one(message_doc)
    return {"message": "Message sent successfully"}

@api_router.get("/contact/messages")
async def get_contact_messages(authorization: str = None):
    from fastapi import Header
    await get_current_admin(authorization)
    
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return messages

# ==================== STATIC FILES ====================

@api_router.get("/")
async def root():
    return {"message": "Findelmundo API", "version": "1.0"}

# Include the router in the main app
app.include_router(api_router)

# Mount uploads directory for serving files
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
