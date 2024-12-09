import { useEffect, useRef } from 'react';

function BlockchainVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let playAttempt;

    if (video) {
      // Wait for video to be loaded before playing
      const handleCanPlay = () => {
        playAttempt = setInterval(() => {
          video.play()
            .then(() => {
              clearInterval(playAttempt);
            })
            .catch(error => {
              console.log("Play attempt failed:", error);
              // Will try again in next interval
            });
        }, 300);
      };

      video.addEventListener('canplay', handleCanPlay);

      // Cleanup
      return () => {
        if (playAttempt) {
          clearInterval(playAttempt);
        }
        video.removeEventListener('canplay', handleCanPlay);
        video.pause();
        video.currentTime = 0;
      };
    }
  }, []);

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
      >
        <source src="/videos/upload.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default BlockchainVideo; 