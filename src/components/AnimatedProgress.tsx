import { useState, useEffect } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'

interface AnimatedProgressProps {
  duration: number
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({ duration }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration]);

  return (
    <ProgressBar
      now={progress}
      // label={`${Math.round(progress)}%`}
      className=""
    />
  );
};

export default AnimatedProgress;