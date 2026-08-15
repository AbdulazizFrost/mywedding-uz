import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageLightbox({ images = [], selectedIndex, onClose, onSelectIndex }) {
  if (selectedIndex === null || selectedIndex < 0 || !images[selectedIndex]) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && selectedIndex < images.length - 1) onSelectIndex(selectedIndex + 1);
      if (e.key === 'ArrowLeft' && selectedIndex > 0) onSelectIndex(selectedIndex - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length, onClose, onSelectIndex]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Previous */}
        {selectedIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex(selectedIndex - 1);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Next */}
        {selectedIndex < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectIndex(selectedIndex + 1);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Main Image */}
        <motion.div
          key={selectedIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl max-h-[85vh] overflow-hidden rounded-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[selectedIndex]?.url}
            alt="Enlarged gallery photo"
            className="w-full h-full max-h-[85vh] object-contain select-none"
          />
        </motion.div>

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-mono text-sm tracking-widest bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
