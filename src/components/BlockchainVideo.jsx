import { useEffect, useRef } from 'react';

function BlockchainVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let playAttempt;

    if (video) {
      const handleCanPlay = () => {
        playAttempt = setInterval(() => {
          video.play()
            .then(() => {
              clearInterval(playAttempt);
            })
            .catch(error => {
              console.log("Play attempt failed:", error);
            });
        }, 300);
      };

      video.addEventListener('canplay', handleCanPlay);

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
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default BlockchainVideo; 