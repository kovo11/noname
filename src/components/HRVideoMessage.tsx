import React, { useState, useRef } from 'react';

interface HRVideoMessageProps {
  onVideoEnd?: () => void;
}

const HRVideoMessage: React.FC<HRVideoMessageProps> = ({ onVideoEnd }) => {
  const [isPlaying, setIsPlaying] = useState(true); // Start with true for autoplay
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay compliance
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
    // Auto-start playing when video is loaded
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Autoplay failed:', error);
        setIsPlaying(false); // If autoplay fails, show play button
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      border: '2px solid #667eea',
      borderRadius: '20px',
      padding: '30px',
      margin: '30px 0',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.1)',
      position: 'relative'
    }}>
      {/* Header with Christian's info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#f8f9fa',
          border: '3px solid #667eea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#667eea',
          fontWeight: 'bold',
          marginRight: '15px'
        }}>
          CO
        </div>
        <div>
          <h3 style={{
            margin: '0 0 5px 0',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#2d3748'
          }}>
            Christian Ostmo
          </h3>
          <p style={{
            margin: '0',
            fontSize: '0.9rem',
            color: '#667eea',
            fontWeight: '500'
          }}>
            Head of HR • Welcome Message
          </p>
        </div>
      </div>

      {/* Video Container */}
      <div style={{
        position: 'relative',
        borderRadius: '15px',
        overflow: 'hidden',
        background: hasError ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#000',
        aspectRatio: '16/9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {hasError ? (
          /* Video Placeholder */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '40px'
          }}>
            <i className="fas fa-video" style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.8 }}></i>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: '600' }}>
              Welcome Video Coming Soon
            </h3>
            <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.9 }}>
              Christian's personal welcome message will be available here shortly
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onLoadedData={handleLoadedData}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              console.log('Video not found - using placeholder');
              setIsLoaded(false);
              setHasError(true);
            }}
          >
            <source src="/videos/christian-ostmo-welcome.mp4" type="video/mp4" />
            <source src="./videos/christian-ostmo-welcome.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Play/Pause Button Overlay */}
        {(!isPlaying || !isLoaded) && !hasError && (
          <button
            onClick={handlePlayClick}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(102, 126, 234, 0.9)',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 1)';
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.9)';
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
          >
            {isLoaded ? (
              <i className="fas fa-play" style={{ marginLeft: '3px' }}></i>
            ) : (
              <i className="fas fa-spinner fa-spin"></i>
            )}
          </button>
        )}

        {/* Video Controls Bar */}
        {isPlaying && isLoaded && !hasError && (
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            padding: '20px 15px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={handlePlayClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <i className="fas fa-pause"></i>
              </button>
              <button
                onClick={toggleMute}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
              </button>
            </div>
            <div style={{
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Welcome to GitMatcher
            </div>
          </div>
        )}
      </div>

      {/* Message Preview Text */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(102, 126, 234, 0.05)',
        borderRadius: '10px',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <p style={{
          margin: '0',
          fontSize: '0.95rem',
          color: '#4a5568',
          lineHeight: '1.6',
          fontStyle: 'italic'
        }}>
          "Welcome to GitMatcher! I'm excited to personally guide you through our onboarding process. 
          In this brief message, I'll share what makes our team special and what you can expect 
          as you join our mission to connect developers worldwide."
        </p>
      </div>
    </div>
  );
};

export default HRVideoMessage;
