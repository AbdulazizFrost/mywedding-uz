import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Disc, Volume2, VolumeX } from 'lucide-react';

export default function FloatingMusicPlayer({ music, primaryColor = '#2c2c2c', secondaryColor = '#d4af37' }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    // If URL changes, pause current
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [music?.url]);

  if (!music?.enabled || !music?.url) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn('Playback blocked or failed:', err);
          setIsPlaying(false);
          setAudioError(true);
        });
    }
  };

  return (
    <>
      <audio 
        ref={audioRef}
        src={music.url}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setAudioError(true)}
      />

      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* Animated Glow Pulse */}
          {isPlaying && (
            <div 
              className="absolute inset-0 rounded-full opacity-40 blur-lg animate-pulse" 
              style={{ backgroundColor: secondaryColor }} 
            />
          )}
          
          <button 
            onClick={togglePlay}
            type="button"
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-black/10"
          >
            {/* Spinning Disc */}
            <div className={`flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
              <Disc size={28} style={{ color: isPlaying ? secondaryColor : primaryColor }} />
            </div>
            
            {/* Center icon indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {isPlaying ? (
                <Pause size={12} className="text-black bg-white/90 p-0.5 rounded-full shadow-sm" />
              ) : (
                <Play size={12} className="text-black bg-white/90 p-0.5 rounded-full shadow-sm ml-0.5" />
              )}
            </div>
          </button>

          {/* Song Tooltip */}
          {music.title && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              🎵 {music.title}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
