import { useEffect, useRef } from 'react';

/**
 * BlockchainVideo Component
 * Renders an auto-playing, looping video with fallback handling
 * Uses a 16:9 aspect ratio container
 */
function BlockchainVideo() {
  // Create a ref to store the video element
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let playAttempt; // Interval reference for play attempts

    if (video) {
      /**
       * Handler for when video is ready to play
       * Attempts to play the video every 300ms until successful
       * This helps handle browsers that block autoplay
       */
      const handleCanPlay = () => {
        playAttempt = setInterval(() => {
          video.play()
            .then(() => {
              // Clear interval once video plays successfully
              clearInterval(playAttempt);
            })
            .catch(error => {
              // Log failed play attempts (common in browsers with strict autoplay policies)
              console.log("Play attempt failed:", error);
            });
        }, 300);
      };

      // Add event listener for when video can play
      video.addEventListener('canplay', handleCanPlay);

      // Cleanup function to remove event listeners and stop video
      return () => {
        if (playAttempt) {
          clearInterval(playAttempt);
        }
        video.removeEventListener('canplay', handleCanPlay);
        video.pause();
        video.currentTime = 0;
      };
    }
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    // Container with 16:9 aspect ratio (56.25% = 9/16)
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-contain bg-black rounded-lg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
      >
        <source src="/videos/upload.mp4" type="video/mp4" />
        {/* Fallback text for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default BlockchainVideo; 