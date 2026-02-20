#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from pathlib import Path

class FindelmundoAPITester:
    def __init__(self, base_url="https://jewel-experience.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.admin_email = f"test_admin_{datetime.now().strftime('%H%M%S')}@FINDELMUNNDO.com"
        self.test_password = "TestPass123!"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_media_ids = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED")
        else:
            print(f"❌ {name}: FAILED - {details}")
        
        self.test_results.append({
            "test": name,
            "status": "PASSED" if success else "FAILED",
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'N/A')}"
            self.log_test("Root API Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root API Endpoint", False, str(e))
            return False

    def test_auth_register(self):
        """Test admin registration"""
        try:
            response = requests.post(
                f"{self.api_url}/auth/register",
                json={"email": self.admin_email, "password": self.test_password},
                timeout=10
            )
            success = response.status_code == 200
            if success:
                data = response.json()
                self.token = data.get("access_token")
                details = f"Token received, Admin ID: {data.get('admin', {}).get('id', 'N/A')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Admin Registration", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Registration", False, str(e))
            return False

    def test_auth_login(self):
        """Test admin login with existing credentials"""
        try:
            response = requests.post(
                f"{self.api_url}/auth/login",
                json={"email": self.admin_email, "password": self.test_password},
                timeout=10
            )
            success = response.status_code == 200
            if success:
                data = response.json()
                self.token = data.get("access_token")
                details = f"Login successful, Token refreshed"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_auth_me(self):
        """Test get current admin info"""
        if not self.token:
            self.log_test("Get Admin Info", False, "No auth token available")
            return False

        try:
            response = requests.get(
                f"{self.api_url}/auth/me",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Email: {data.get('email', 'N/A')}"
            
            self.log_test("Get Admin Info", success, details)
            return success
        except Exception as e:
            self.log_test("Get Admin Info", False, str(e))
            return False

    def test_media_get(self):
        """Test get all media"""
        try:
            response = requests.get(f"{self.api_url}/media", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Media count: {len(data)}"
            
            self.log_test("Get All Media", success, details)
            return success
        except Exception as e:
            self.log_test("Get All Media", False, str(e))
            return False

    def test_categories(self):
        """Test get categories"""
        try:
            response = requests.get(f"{self.api_url}/categories", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Categories count: {len(data)}"
            
            self.log_test("Get Categories", success, details)
            return success
        except Exception as e:
            self.log_test("Get Categories", False, str(e))
            return False

    def test_settings_get(self):
        """Test get site settings"""
        try:
            response = requests.get(f"{self.api_url}/settings", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Site title: {data.get('site_title', 'N/A')}"
            
            self.log_test("Get Site Settings", success, details)
            return success
        except Exception as e:
            self.log_test("Get Site Settings", False, str(e))
            return False

    def test_settings_update(self):
        """Test update site settings"""
        if not self.token:
            self.log_test("Update Site Settings", False, "No auth token available")
            return False

        try:
            settings_data = {
                "site_title": "FINDELMUNNDO Test",
                "tagline": "Audio • Video • Photography",
                "about_bio": "Test bio content",
                "contact_email": "test@FINDELMUNNDO.com"
            }
            
            response = requests.put(
                f"{self.api_url}/settings",
                json=settings_data,
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            self.log_test("Update Site Settings", success, details)
            return success
        except Exception as e:
            self.log_test("Update Site Settings", False, str(e))
            return False

    def test_contact_message(self):
        """Test sending contact message"""
        try:
            message_data = {
                "name": "Test User",
                "email": "test@example.com",
                "subject": "Test Message",
                "message": "This is a test message from the API test suite."
            }
            
            response = requests.post(
                f"{self.api_url}/contact",
                json=message_data,
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'N/A')}"
            
            self.log_test("Send Contact Message", success, details)
            return success
        except Exception as e:
            self.log_test("Send Contact Message", False, str(e))
            return False

    def test_get_contact_messages(self):
        """Test getting contact messages (admin only)"""
        if not self.token:
            self.log_test("Get Contact Messages", False, "No auth token available")
            return False

        try:
            response = requests.get(
                f"{self.api_url}/contact/messages",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Messages count: {len(data)}"
            
            self.log_test("Get Contact Messages", success, details)
            return success
        except Exception as e:
            self.log_test("Get Contact Messages", False, str(e))
            return False

    def test_media_upload_simulation(self):
        """Test media upload with simulated file"""
        if not self.token:
            self.log_test("Media Upload", False, "No auth token available")
            return False

        try:
            # Create a simple test file in memory
            files = {
                'file': ('test_image.jpg', b'fake_image_data', 'image/jpeg')
            }
            data = {
                'title': 'Test Upload Image',
                'description': 'Test description for uploaded image',
                'category': 'Portrait',
                'media_type': 'image'
            }
            
            response = requests.post(
                f"{self.api_url}/media/upload",
                files=files,
                data=data,
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=15
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                response_data = response.json()
                media_id = response_data.get('id')
                if media_id:
                    self.created_media_ids.append(media_id)
                details += f", Media ID: {media_id}"
            else:
                details += f", Response: {response.text[:200]}"
            
            self.log_test("Media Upload", success, details)
            return success
        except Exception as e:
            self.log_test("Media Upload", False, str(e))
            return False

    def test_media_delete(self):
        """Test media deletion"""
        if not self.token or not self.created_media_ids:
            self.log_test("Media Delete", False, "No auth token or media ID available")
            return False

        try:
            media_id = self.created_media_ids[0]
            response = requests.delete(
                f"{self.api_url}/media/{media_id}",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'N/A')}"
            
            self.log_test("Media Delete", success, details)
            return success
        except Exception as e:
            self.log_test("Media Delete", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print(f"🚀 Starting FINDELMUNNDO API Tests")
        print(f"🔗 Base URL: {self.base_url}")
        print(f"📧 Test admin email: {self.admin_email}")
        print("=" * 60)

        # Test basic connectivity first
        if not self.test_root_endpoint():
            print("\n❌ Root endpoint failed - stopping tests")
            return False

        # Test authentication flow
        if not self.test_auth_register():
            print("\n❌ Registration failed - stopping tests")
            return False

        self.test_auth_login()
        self.test_auth_me()

        # Test public endpoints
        self.test_media_get()
        self.test_categories()
        self.test_settings_get()
        self.test_contact_message()

        # Test authenticated endpoints
        self.test_get_contact_messages()
        self.test_settings_update()
        
        # Test media management
        self.test_media_upload_simulation()
        if self.created_media_ids:
            self.test_media_delete()

        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")

        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

    def save_results(self, output_file="/app/test_reports/backend_api_test.json"):
        """Save test results to JSON file"""
        results = {
            "test_run_timestamp": datetime.now().isoformat(),
            "base_url": self.base_url,
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "success_rate": f"{(self.tests_passed / self.tests_run * 100):.1f}%" if self.tests_run > 0 else "0%",
            "test_details": self.test_results
        }
        
        # Ensure directory exists
        Path("/app/test_reports").mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"💾 Test results saved to: {output_file}")

def main():
    """Main test runner"""
    tester = FindelmundoAPITester()
    
    try:
        success = tester.run_all_tests()
        tester.save_results()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())