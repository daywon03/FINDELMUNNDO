import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API, useAuth } from '../../App';
import { toast } from 'sonner';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Image,
  Settings,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  MoreVertical,
  Upload,
  Star,
  X,
} from 'lucide-react';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/media', label: 'Médias', icon: Image },
    { path: '/admin/messages', label: 'Messages', icon: Mail },
    { path: '/admin/settings', label: 'Paramètres', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Déconnexion réussie');
  };

  return (
    <div className="min-h-screen bg-fdm-bg flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 fixed left-0 top-0 h-full flex flex-col">
        <div className="p-6 border-b border-fdm-border">
          <Link to="/" className="font-display text-xl font-bold tracking-tighter">
            FDM<span className="text-fdm-accent">.</span>
          </Link>
          <p className="text-fdm-text-secondary text-xs mt-1">Administration</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? 'bg-fdm-accent/10 text-fdm-accent border-l-2 border-fdm-accent'
                        : 'text-fdm-text-secondary hover:text-fdm-text hover:bg-fdm-surface'
                    }`}
                    data-testid={`admin-nav-${item.label.toLowerCase()}`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-fdm-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-fdm-accent/20 rounded-full flex items-center justify-center">
              <span className="text-fdm-accent font-bold">
                {admin?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{admin?.email}</p>
              <p className="text-xs text-fdm-text-secondary">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-fdm-text-secondary hover:text-fdm-accent transition-colors text-sm w-full"
            data-testid="admin-logout-button"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/media" element={<MediaManager />} />
          <Route path="/messages" element={<MessagesManager />} />
          <Route path="/settings" element={<SettingsManager />} />
          <Route path="*" element={<DashboardOverview />} />
        </Routes>
      </main>
    </div>
  );
};

// Dashboard Overview
const DashboardOverview = () => {
  const [stats, setStats] = useState({ media: 0, messages: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [mediaRes, messagesRes] = await Promise.all([
        axios.get(`${API}/media`),
        axios.get(`${API}/contact/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('fdm_token')}` },
        }).catch(() => ({ data: [] })),
      ]);
      setStats({
        media: mediaRes.data.length,
        messages: messagesRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div data-testid="dashboard-overview">
      <h1 className="font-display text-3xl font-bold tracking-tight mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border border-fdm-border"
        >
          <Image className="text-fdm-accent mb-4" size={24} />
          <p className="text-3xl font-display font-bold">{stats.media}</p>
          <p className="text-fdm-text-secondary text-sm">Médias</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 border border-fdm-border"
        >
          <Mail className="text-fdm-accent mb-4" size={24} />
          <p className="text-3xl font-display font-bold">{stats.messages}</p>
          <p className="text-fdm-text-secondary text-sm">Messages</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 border border-fdm-border"
        >
          <Star className="text-fdm-accent mb-4" size={24} />
          <p className="text-3xl font-display font-bold">∞</p>
          <p className="text-fdm-text-secondary text-sm">Possibilités</p>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/admin/media"
          className="btn-brutalist inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter un média
        </Link>
        <Link
          to="/"
          className="btn-brutalist inline-flex items-center gap-2"
          target="_blank"
        >
          Voir le site
        </Link>
      </div>
    </div>
  );
};

// Media Manager
const MediaManager = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'Portrait',
    media_type: 'image',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = ['Portrait', 'Architecture', 'Abstract', 'Experimental', 'Video'];

  const fetchMedia = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/media`);
      setMedia(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('category', uploadData.category);
    formData.append('media_type', uploadData.media_type);

    try {
      await axios.post(`${API}/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('fdm_token')}`,
        },
      });
      toast.success('Média uploadé avec succès!');
      setIsUploadOpen(false);
      setUploadData({ title: '', description: '', category: 'Portrait', media_type: 'image' });
      setFile(null);
      fetchMedia();
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce média ?')) return;

    try {
      await axios.delete(`${API}/media/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('fdm_token')}` },
      });
      toast.success('Média supprimé');
      fetchMedia();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleFeatured = async (item) => {
    try {
      await axios.put(
        `${API}/media/${item.id}`,
        { featured: !item.featured },
        { headers: { Authorization: `Bearer ${localStorage.getItem('fdm_token')}` } }
      );
      fetchMedia();
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  return (
    <div data-testid="media-manager">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Médias</h1>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <button className="btn-brutalist inline-flex items-center gap-2" data-testid="upload-media-button">
              <Plus size={16} />
              Ajouter
            </button>
          </DialogTrigger>
          <DialogContent className="bg-fdm-surface border-fdm-border max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Nouveau Média</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm text-fdm-text-secondary mb-2">Fichier</label>
                <div className="border border-dashed border-fdm-border p-8 text-center">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                    data-testid="file-input"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-fdm-text-secondary" size={32} />
                    <p className="text-sm text-fdm-text-secondary">
                      {file ? file.name : 'Cliquez pour sélectionner'}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-fdm-text-secondary mb-2">Titre</label>
                <Input
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                  className="bg-fdm-bg border-fdm-border rounded-none"
                  data-testid="upload-title-input"
                />
              </div>

              <div>
                <label className="block text-sm text-fdm-text-secondary mb-2">Description</label>
                <Textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="bg-fdm-bg border-fdm-border rounded-none"
                  rows={3}
                  data-testid="upload-description-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-fdm-text-secondary mb-2">Catégorie</label>
                  <Select
                    value={uploadData.category}
                    onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
                  >
                    <SelectTrigger className="bg-fdm-bg border-fdm-border rounded-none" data-testid="upload-category-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-fdm-surface border-fdm-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-fdm-text-secondary mb-2">Type</label>
                  <Select
                    value={uploadData.media_type}
                    onValueChange={(value) => setUploadData({ ...uploadData, media_type: value })}
                  >
                    <SelectTrigger className="bg-fdm-bg border-fdm-border rounded-none" data-testid="upload-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-fdm-surface border-fdm-border">
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Vidéo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="btn-brutalist w-full"
                data-testid="upload-submit-button"
              >
                {uploading ? 'Upload en cours...' : 'Uploader'}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading-line w-32"></div>
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-fdm-border">
          <Image className="mx-auto mb-4 text-fdm-text-secondary" size={48} />
          <p className="text-fdm-text-secondary">Aucun média pour le moment</p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="btn-brutalist mt-4"
          >
            Ajouter votre premier média
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group relative border border-fdm-border overflow-hidden"
              data-testid={`media-card-${item.id}`}
            >
              <div className="aspect-square bg-fdm-surface">
                {item.media_type === 'video' ? (
                  <video
                    src={item.file_url.startsWith('/') ? `${process.env.REACT_APP_BACKEND_URL}${item.file_url}` : item.file_url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={item.file_url.startsWith('/') ? `${process.env.REACT_APP_BACKEND_URL}${item.file_url}` : item.file_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-fdm-bg/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`p-2 border ${item.featured ? 'border-fdm-accent text-fdm-accent' : 'border-fdm-border text-fdm-text-secondary'}`}
                  title={item.featured ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Star size={18} fill={item.featured ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 border border-fdm-border text-fdm-text-secondary hover:border-red-500 hover:text-red-500"
                  data-testid={`delete-media-${item.id}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm truncate">{item.title}</p>
                <p className="text-xs text-fdm-text-secondary">{item.category}</p>
              </div>

              {/* Featured badge */}
              {item.featured && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-fdm-accent rounded-full" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Messages Manager
const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/contact/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('fdm_token')}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="messages-manager">
      <h1 className="font-display text-3xl font-bold tracking-tight mb-8">Messages</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading-line w-32"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-fdm-border">
          <Mail className="mx-auto mb-4 text-fdm-text-secondary" size={48} />
          <p className="text-fdm-text-secondary">Aucun message pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border border-fdm-border"
              data-testid={`message-${msg.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg">{msg.subject}</h3>
                  <p className="text-fdm-text-secondary text-sm">
                    De: {msg.name} ({msg.email})
                  </p>
                </div>
                <span className="text-xs text-fdm-text-secondary">
                  {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-fdm-text-secondary">{msg.message}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Settings Manager
const SettingsManager = () => {
  const [settings, setSettings] = useState({
    site_title: 'Findelmundo',
    tagline: 'Audio • Vidéo • Photographie',
    about_bio: '',
    contact_email: '',
    social_instagram: '',
    social_twitter: '',
    social_vimeo: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings({ ...settings, ...response.data });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/settings`, settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('fdm_token')}` },
      });
      toast.success('Paramètres enregistrés!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loading-line w-32"></div>
      </div>
    );
  }

  return (
    <div data-testid="settings-manager">
      <h1 className="font-display text-3xl font-bold tracking-tight mb-8">Paramètres</h1>

      <div className="max-w-2xl space-y-8">
        <section>
          <h2 className="font-display text-xl mb-4">Informations du site</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-fdm-text-secondary mb-2">Titre du site</label>
              <Input
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="bg-fdm-surface border-fdm-border rounded-none"
                data-testid="settings-title-input"
              />
            </div>
            <div>
              <label className="block text-sm text-fdm-text-secondary mb-2">Tagline</label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="bg-fdm-surface border-fdm-border rounded-none"
                data-testid="settings-tagline-input"
              />
            </div>
            <div>
              <label className="block text-sm text-fdm-text-secondary mb-2">Bio / À propos</label>
              <Textarea
                value={settings.about_bio}
                onChange={(e) => setSettings({ ...settings, about_bio: e.target.value })}
                className="bg-fdm-surface border-fdm-border rounded-none"
                rows={6}
                data-testid="settings-bio-input"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl mb-4">Contact</h2>
          <div>
            <label className="block text-sm text-fdm-text-secondary mb-2">Email de contact</label>
            <Input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="bg-fdm-surface border-fdm-border rounded-none"
              data-testid="settings-email-input"
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl mb-4">Réseaux sociaux</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-fdm-text-secondary mb-2">Instagram</label>
              <Input
                value={settings.social_instagram || ''}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="bg-fdm-surface border-fdm-border rounded-none"
                placeholder="@username"
                data-testid="settings-instagram-input"
              />
            </div>
            <div>
              <label className="block text-sm text-fdm-text-secondary mb-2">Twitter</label>
              <Input
                value={settings.social_twitter || ''}
                onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                className="bg-fdm-surface border-fdm-border rounded-none"
                placeholder="@username"
                data-testid="settings-twitter-input"
              />
            </div>
            <div>
              <label className="block text-sm text-fdm-text-secondary mb-2">Vimeo</label>
              <Input
                value={settings.social_vimeo || ''}
                onChange={(e) => setSettings({ ...settings, social_vimeo: e.target.value })}
                className="bg-fdm-surface border-fdm-border rounded-none"
                placeholder="URL Vimeo"
                data-testid="settings-vimeo-input"
              />
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-brutalist"
          data-testid="settings-save-button"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
