import React, { useRef, useEffect } from "react";

const SoundWave = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const wave = {
      amplitude: 20,
      wavelength: 200,
      speed: 0.02,
      offset: 0,
      color: "rgba(255,255,255,0.05)",
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const y =
          height / 2 +
          Math.sin((x + wave.offset) * (2 * Math.PI) / wave.wavelength) *
            wave.amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      wave.offset += wave.speed * wave.wavelength;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default SoundWave;