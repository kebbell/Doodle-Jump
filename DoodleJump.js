import React, { useEffect, useRef, useState } from 'react';

const DoodleJump = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 200, y: 400, width: 50, height: 20 });
  const [platforms, setPlatforms] = useState([{ x: 100, y: 300, width: 100, height: 10 }]);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [keys, setKeys] = useState({ left: false, right: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateGame = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update player position
      setPlayer((prev) => ({
        ...prev,
        x: prev.x + velocity.x,
        y: prev.y + velocity.y
      }));

      // Draw player
      ctx.fillStyle = 'green';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Draw platforms
      ctx.fillStyle = 'blue';
      platforms.forEach((platform) => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });

      // Gravity
      setVelocity((prev) => ({ ...prev, y: prev.y + 0.5 }));

      // Check for collisions with platforms
      platforms.forEach((platform) => {
        if (
          player.x < platform.x + platform.width &&
          player.x + player.width > platform.x &&
          player.y + player.height > platform.y &&
          player.y < platform.y + platform.height
        ) {
          setVelocity((prev) => ({ ...prev, y: -10 }));
        }
      });

      // Check boundaries
      if (player.x < 0) setPlayer((prev) => ({ ...prev, x: 0 }));
      if (player.x + player.width > canvas.width) setPlayer((prev) => ({ ...prev, x: canvas.width - player.width }));

      // Request next frame
      requestAnimationFrame(updateGame);
    };

    updateGame();
  }, [player, velocity, platforms]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setKeys((prev) => ({ ...prev, left: true }));
      if (e.key === 'ArrowRight') setKeys((prev) => ({ ...prev, right: true }));
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') setKeys((prev) => ({ ...prev, left: false }));
      if (e.key === 'ArrowRight') setKeys((prev) => ({ ...prev, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    setVelocity((prev) => ({
      ...prev,
      x: keys.left ? -5 : keys.right ? 5 : 0
    }));
  }, [keys]);

  return <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />;
};

export default DoodleJump;




