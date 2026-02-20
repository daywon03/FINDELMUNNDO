import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HomePage = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Check if intro has been shown before
    const introShown = sessionStorage.getItem('fdm_intro_shown');
    if (introShown) {
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('fdm_intro_shown', 'true');
    setShowIntro(false);
    setTimeout(() => setIntroComplete(true), 800);
  };

  return (
    <>
      {/* Intro Screen */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="intro-screen"
            data-testid="intro-screen"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-4">
                  FINDELMUNDO<span className="text-fdm-accent">.</span>
                </h1>
                <p className="font-body text-fdm-text-secondary text-sm md:text-base tracking-widest uppercase mb-12">
                  Audio • Vidéo • Photographie
                </p>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                onClick={handleEnter}
                className="btn-brutalist"
                data-testid="enter-button"
              >
                Entrer dans l'univers
              </motion.button>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100px' }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="h-px bg-fdm-accent mx-auto mt-16"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {introComplete && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen md:ml-20"
            data-testid="home-main-content"
          >
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center hero-bg">
              <div className="absolute inset-0 overlay-dark" />
              
              <div className="relative z-10 text-center px-8">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
                >
                  CRÉATEUR<br />
                  <span className="text-fdm-accent">D'UNIVERS</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="font-body text-fdm-text-secondary max-w-xl mx-auto mb-12"
                >
                  Direction artistique visuelle centrée sur l'humain, la texture et l'intensité émotionnelle. 
                  Des atmosphères brutes, contrastées et incarnées.
                </motion.p>

                <motion.a
                  href="/portfolio"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="btn-brutalist inline-block"
                  data-testid="hero-portfolio-link"
                >
                  Découvrir le portfolio
                </motion.a>
              </div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ChevronDown className="text-fdm-text-secondary" size={24} />
                </motion.div>
              </motion.div>

              {/* Japanese Text Decoration */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                <span className="jp-decoration">芸術的方向</span>
              </div>
            </section>

            {/* Featured Section */}
            <section className="py-24 md:py-40 px-8 md:px-16">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <span className="text-fdm-accent text-xs uppercase tracking-widest">Direction Artistique</span>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter mt-4">
                    UNE VISION<br />SINGULIÈRE
                  </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p className="text-fdm-text-secondary leading-relaxed mb-6">
                      Une exploration profonde de l'humain, de la texture et de l'intensité émotionnelle. 
                      Création d'atmosphères brutes, contrastées et incarnées, avec un regard porté sur le réalisme 
                      et une esthétique volontairement abrasive.
                    </p>
                    <p className="text-fdm-text-secondary leading-relaxed">
                      L'approche est dynamique, mettant l'accent sur le mouvement, la transformation et la recherche de sens, 
                      dans le but de proposer une lecture directe, percutante et cohérente.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="border-l border-fdm-accent pl-6">
                      <h3 className="font-display text-xl mb-2">Réalisme Brut</h3>
                      <p className="text-fdm-text-secondary text-sm">Une représentation authentique, sans fard, privilégiant les imperfections.</p>
                    </div>
                    <div className="border-l border-fdm-border pl-6">
                      <h3 className="font-display text-xl mb-2">Fortes Contrastes</h3>
                      <p className="text-fdm-text-secondary text-sm">Des jeux intenses entre lumière et ombre pour créer du drame.</p>
                    </div>
                    <div className="border-l border-fdm-border pl-6">
                      <h3 className="font-display text-xl mb-2">Influence Japonaise</h3>
                      <p className="text-fdm-text-secondary text-sm">Rigueur, authenticité et attention à l'espace.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-40 px-8 md:px-16 border-t border-fdm-border">
              <div className="max-w-4xl mx-auto text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display text-3xl md:text-5xl font-bold tracking-tighter mb-8"
                >
                  PRÊT À CRÉER<br />
                  <span className="text-fdm-accent">ENSEMBLE</span> ?
                </motion.h2>
                
                <motion.a
                  href="/contact"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="btn-brutalist inline-block"
                  data-testid="cta-contact-link"
                >
                  Me Contacter
                </motion.a>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-8 md:px-16 border-t border-fdm-border">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="font-display text-xl font-bold tracking-tighter">
                  FINDELMUNDO<span className="text-fdm-accent">.</span>
                </div>
                <p className="text-fdm-text-secondary text-sm">
                  © {new Date().getFullYear()} Tous droits réservés
                </p>
              </div>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;
