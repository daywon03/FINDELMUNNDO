import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API, useAuth } from '../../App';
import { toast } from 'sonner';
import { Input } from '../../components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const response = await axios.post(`${API}${endpoint}`, { email, password });
      
      login(response.data.access_token, response.data.admin);
      toast.success(isRegister ? 'Compte créé avec succès!' : 'Connexion réussie!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || 'Erreur d\'authentification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold tracking-tighter">
            FINDELMUNNDO<span className="text-fdm-accent">.</span>
          </h1>
          <p className="text-fdm-text-secondary font-display text-xs mt-2 uppercase tracking-[0.3em] opacity-80">
            Espace Administration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
          <div>
            <label className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input bg-fdm-surface border-fdm-border text-fdm-text focus:border-fdm-accent rounded-none w-full"
              placeholder="admin@FINDELMUNNDO.com"
              data-testid="admin-email-input"
            />
          </div>

          <div>
            <label className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input bg-fdm-surface border-fdm-border text-fdm-text focus:border-fdm-accent rounded-none w-full pr-12"
                placeholder="••••••••"
                data-testid="admin-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-fdm-text-secondary hover:text-fdm-text"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-brutalist w-full"
            data-testid="admin-submit-button"
          >
            {loading ? 'Chargement...' : (isRegister ? 'Créer un compte' : 'Se connecter')}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-fdm-text-secondary hover:text-fdm-accent transition-colors text-sm"
            data-testid="toggle-auth-mode"
          >
            {isRegister ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
          </button>
        </div>

        {/* Back to site */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-fdm-text-secondary hover:text-fdm-text transition-colors font-display text-xs uppercase tracking-[0.3em] opacity-80"
          >
            ← Retour au site
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
