import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import axios from 'axios';
import { API } from '../App';

const PortfolioPage = () => {
  const [media, setMedia] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  // Placeholder images from design guidelines
  const placeholderMedia = [
    {
      id: '1',
      title: 'Portrait in Red Shadow',
      description: 'Exploration of light and shadow',
      category: 'Portrait',
      media_type: 'image',
      file_url: 'https://images.unsplash.com/photo-1770896687186-895de50a4123?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
    {
      id: '2',
      title: 'Concrete Brutalist',
      description: 'Architectural studies',
      category: 'Architecture',
      media_type: 'image',
      file_url: 'https://images.unsplash.com/photo-1630041353236-d1e5a3c23116?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
    {
      id: '3',
      title: 'Tall Dark Building',
      description: 'Urban landscapes',
      category: 'Architecture',
      media_type: 'image',
      file_url: 'https://images.unsplash.com/photo-1646421017564-346737c5c884?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
    {
      id: '4',
      title: 'Red Light Leak',
      description: 'Abstract compositions',
      category: 'Abstract',
      media_type: 'image',
      file_url: 'https://images.pexels.com/photos/28931572/pexels-photo-28931572.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    },
    {
      id: '5',
      title: 'Texture Study',
      description: 'Organic textures',
      category: 'Experimental',
      media_type: 'image',
      file_url: 'https://images.unsplash.com/photo-1758045747219-b38d04de019b?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
    {
      id: '6',
      title: 'Surface',
      description: 'Material exploration',
      category: 'Experimental',
      media_type: 'image',
      file_url: 'https://images.unsplash.com/photo-1694721065597-639c65e80c6b?crop=entropy&cs=srgb&fm=jpg&q=85',
    },
  ];

  useEffect(() => {
    fetchMedia();
    fetchCategories();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get(`${API}/media`);
      setMedia(response.data.length > 0 ? response.data : placeholderMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
      setMedia(placeholderMedia);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Extract categories from placeholder
      const cats = [...new Set(placeholderMedia.map(m => m.category))];
      setCategories(cats.map(c => ({ id: c, name: c, count: placeholderMedia.filter(m => m.category === c).length })));
    }
  };

  const filteredMedia = selectedCategory === 'all' 
    ? media 
    : media.filter(m => m.category === selectedCategory);

  const allCategories = categories.length > 0 
    ? categories 
    : [...new Set(media.map(m => m.category))].map(c => ({ name: c }));

  return (
    <main className="min-h-screen md:pt-20 pt-8 pb-24 md:pb-8" data-testid="portfolio-page">
      {/* Header */}
      <section className="px-8 md:px-16 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-fdm-accent font-display text-xs uppercase tracking-[0.3em] opacity-80">Portfolio</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mt-4 mb-8">
            TRAVAUX<span className="text-fdm-accent">.</span>
          </h1>
          <p className="text-fdm-text-secondary max-w-xl">
            Une sélection de travaux représentant l'exploration visuelle à travers 
            la photographie, la vidéo et les expériences audio-visuelles.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="px-8 md:px-16 mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`category-tag ${selectedCategory === 'all' ? 'active' : ''}`}
            data-testid="category-all"
          >
            Tous
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`category-tag ${selectedCategory === cat.name ? 'active' : ''}`}
              data-testid={`category-${cat.name.toLowerCase()}`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Media Grid */}
      <section className="px-8 md:px-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="loading-line w-32"></div>
          </div>
        ) : (
          <motion.div 
            className="masonry-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredMedia.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`masonry-item grid-item cursor-pointer ${index % 3 === 1 ? 'md:mt-12' : ''}`}
                  onClick={() => setSelectedMedia(item)}
                  data-testid={`media-item-${item.id}`}
                  data-cursor-hover
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-fdm-surface">
                    {item.media_type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.file_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => e.target.pause()}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full border border-fdm-text flex items-center justify-center">
                            <Play className="text-fdm-text ml-1" size={24} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.file_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  
                  <div className="grid-item-info">
                    <span className="text-fdm-accent font-display text-xs uppercase tracking-[0.3em] opacity-80">{item.category}</span>
                    <h3 className="font-display text-xl mt-2">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedMedia(null)}
            data-testid="media-modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute -top-12 right-0 p-2 text-fdm-text hover:text-fdm-accent transition-colors"
                data-testid="close-modal-button"
              >
                <X size={24} />
              </button>

              {selectedMedia.media_type === 'video' ? (
                <video
                  src={selectedMedia.file_url}
                  className="max-w-full max-h-[80vh] object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedMedia.file_url}
                  alt={selectedMedia.title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}

              <div className="mt-6 text-center">
                <span className="text-fdm-accent font-display text-xs uppercase tracking-[0.3em] opacity-80">{selectedMedia.category}</span>
                <h3 className="font-display text-2xl mt-2">{selectedMedia.title}</h3>
                {selectedMedia.description && (
                  <p className="text-fdm-text-secondary mt-2">{selectedMedia.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-24 py-12 px-8 md:px-16 border-t border-fdm-border">
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

export default PortfolioPage;
