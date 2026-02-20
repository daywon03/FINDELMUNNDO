import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Send, Mail, Instagram, Twitter } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message envoyé avec succès!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen md:pt-20 pt-8 pb-24 md:pb-8" data-testid="contact-page">
      {/* Header */}
      <section className="px-8 md:px-16 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-fdm-accent font-display text-xs uppercase tracking-[0.3em] opacity-80">Contact</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mt-4">
            PARLONS<span className="text-fdm-accent">.</span>
          </h1>
        </motion.div>
      </section>

      {/* Content */}
      <section className="px-8 md:px-16">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <label className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary mb-2">
                  Nom
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input bg-fdm-surface border-fdm-border text-fdm-text focus:border-fdm-accent rounded-none"
                  placeholder="Votre nom"
                  data-testid="contact-name-input"
                />
              </div>

              <div>
                <label className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input bg-fdm-surface border-fdm-border text-fdm-text focus:border-fdm-accent rounded-none"
                  placeholder="votre@email.com"
                  data-testid="contact-email-input"
                />
              </div>

              <div>
                <label className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary mb-2">
                  Sujet
                </label>
                <Input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input bg-fdm-surface border-fdm-border text-fdm-text focus:border-fdm-accent rounded-none"
                  placeholder="Objet de votre message"
                  data-testid="contact-subject-input"
                />
              </div>

              <div>
                <label className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="form-input bg-fdm-surface border-fdm-border text-fdm-text focus:border-fdm-accent rounded-none resize-none"
                  placeholder="Parlez-moi de votre projet..."
                  data-testid="contact-message-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-brutalist w-full flex items-center justify-center gap-2"
                data-testid="contact-submit-button"
              >
                {loading ? (
                  <span>Envoi en cours...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Envoyer</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-12"
          >
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight mb-6">
                Restons en contact
              </h2>
              <p className="text-fdm-text-secondary leading-relaxed">
                Vous avez un projet en tête ? Une collaboration à proposer ? 
                N'hésitez pas à me contacter. Je suis toujours ouvert aux nouvelles 
                opportunités créatives.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-fdm-border flex items-center justify-center">
                  <Mail size={20} className="text-fdm-accent" />
                </div>
                <div>
                  <span className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary">Email</span>
                  <a href="mailto:contact@FINDELMUNNDO.com" className="text-fdm-text hover:text-fdm-accent transition-colors">
                    contact@FINDELMUNNDO.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-fdm-border flex items-center justify-center">
                  <Instagram size={20} className="text-fdm-accent" />
                </div>
                <div>
                  <span className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary">Instagram</span>
                  <a href="https://instagram.com/FINDELMUNNDO" target="_blank" rel="noopener noreferrer" className="text-fdm-text hover:text-fdm-accent transition-colors">
                    @FINDELMUNNDO
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-fdm-border flex items-center justify-center">
                  <Twitter size={20} className="text-fdm-accent" />
                </div>
                <div>
                  <span className="block font-display text-xs uppercase tracking-[0.3em] opacity-80 text-fdm-text-secondary">Twitter</span>
                  <a href="https://twitter.com/FINDELMUNNDO" target="_blank" rel="noopener noreferrer" className="text-fdm-text hover:text-fdm-accent transition-colors">
                    @FINDELMUNNDO
                  </a>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="p-6 border border-fdm-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-display text-xs uppercase tracking-[0.3em] opacity-80">Disponible pour projets</span>
              </div>
              <p className="text-fdm-text-secondary text-sm">
                Actuellement ouvert aux collaborations et projets créatifs. 
                Délai de réponse habituel : 24-48h.
              </p>
            </div>

            {/* Japanese decoration */}
            <div className="hidden lg:block pt-8">
              <span className="text-fdm-border text-6xl font-jp">連絡</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map or Image Section */}
      <section className="px-8 md:px-16 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="aspect-[21/9] bg-fdm-surface overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1758045747219-b38d04de019b?crop=entropy&cs=srgb&fm=jpg&q=85"
              alt="Studio"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter text-center">
                CRÉONS<br />
                <span className="text-fdm-accent">ENSEMBLE</span>
              </h2>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 border-t border-fdm-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-display text-xl font-bold tracking-tighter">
            FINDELMUNNDO<span className="text-fdm-accent">.</span>
          </div>
          <p className="text-fdm-text-secondary text-sm">
            © {new Date().getFullYear()} Tous droits réservés
          </p>
        </div>
      </footer>
    </main>
  );
};

export default ContactPage;
