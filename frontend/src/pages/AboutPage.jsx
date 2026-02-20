import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API } from '../App';

const AboutPage = () => {
  const [settings, setSettings] = useState({
    site_title: 'FINDELMUNNDO',
    tagline: 'Audio • Vidéo • Photographie',
    about_bio: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const defaultBio = `
    Direction artistique visuelle centrée sur l'humain, la texture et l'intensité émotionnelle. 
    
    Mon travail explore des atmosphères brutes, contrastées et incarnées, avec un regard porté sur le réalisme, 
    la saturation du grain et une esthétique volontairement abrasive.
    
    Inspiré par la rigueur japonaise et l'authenticité, je propose une approche dynamique mettant l'accent sur 
    le mouvement, la transformation et la recherche de sens.
    
    L'objectif : construire un travail artistique exigeant, identifiable et évolutif, avec une lecture directe, 
    percutante et cohérente.
  `;

  return (
    <main className="min-h-screen md:pt-20 pt-8 pb-24 md:pb-8" data-testid="about-page">
      {/* Header */}
      <section className="px-8 md:px-16 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-fdm-accent font-display text-xs uppercase tracking-[0.3em] opacity-80">À Propos</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mt-4">
            L'ARTISTE<span className="text-fdm-accent">.</span>
          </h1>
        </motion.div>
      </section>

      {/* Content */}
      <section className="px-8 md:px-16">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-fdm-surface overflow-hidden">
              <img
                src="https://customer-assets.emergentagent.com/job_a37f3bd7-a8d8-48eb-9b1c-3cba3f5f1f82/artifacts/a20whzg6_background-image.jpg"
                alt="FINDELMUNNDO"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-fdm-accent -z-10" />
            
            {/* Japanese Text */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:block">
              <span className="jp-decoration">創造者</span>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight mb-2">
                {settings.site_title || 'FINDELMUNNDO'}
              </h2>
              <p className="text-fdm-accent font-display text-xs uppercase tracking-[0.3em] opacity-80">
                {settings.tagline || 'Audio • Vidéo • Photographie'}
              </p>
            </div>

            <div className="w-16 h-px bg-fdm-accent" />

            <div className="space-y-6 text-fdm-text-secondary leading-relaxed">
              {(settings.about_bio || defaultBio).split('\n').filter(p => p.trim()).map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>

            <div className="space-y-6 pt-8 border-t border-fdm-border">
              <div>
                <h3 className="font-display text-lg mb-4">Services</h3>
                <ul className="space-y-2 text-fdm-text-secondary">
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-fdm-accent rounded-full" />
                    Direction Artistique
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-fdm-accent rounded-full" />
                    Photographie
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-fdm-accent rounded-full" />
                    Vidéo & Production
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-fdm-accent rounded-full" />
                    Identité Visuelle
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-lg mb-4">Approche</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-fdm-border">
                    <span className="text-2xl font-display font-bold text-fdm-accent">01</span>
                    <p className="text-sm text-fdm-text-secondary mt-2">Réalisme Brut</p>
                  </div>
                  <div className="p-4 border border-fdm-border">
                    <span className="text-2xl font-display font-bold text-fdm-accent">02</span>
                    <p className="text-sm text-fdm-text-secondary mt-2">Haute Texture</p>
                  </div>
                  <div className="p-4 border border-fdm-border">
                    <span className="text-2xl font-display font-bold text-fdm-accent">03</span>
                    <p className="text-sm text-fdm-text-secondary mt-2">Contrastes Forts</p>
                  </div>
                  <div className="p-4 border border-fdm-border">
                    <span className="text-2xl font-display font-bold text-fdm-accent">04</span>
                    <p className="text-sm text-fdm-text-secondary mt-2">Vision Unique</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.02 }}
              className="btn-brutalist inline-block mt-8"
              data-testid="about-contact-button"
            >
              Collaborer
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="px-8 md:px-16 py-24 md:py-40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <blockquote className="font-display text-2xl md:text-4xl font-bold tracking-tight leading-tight">
            "L'art ne reproduit pas le visible, il rend visible."
          </blockquote>
          <cite className="block mt-6 text-fdm-text-secondary font-display text-xs uppercase tracking-[0.3em] opacity-80">
            — Paul Klee
          </cite>
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

export default AboutPage;
