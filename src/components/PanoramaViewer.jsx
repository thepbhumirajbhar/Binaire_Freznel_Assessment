import React, { useRef, useEffect, useState } from 'react';

export default function PanoramaViewer({ imageSrc, zoom, rotation }) {
  const canvasRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
      ctx.scale(zoom, zoom);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, zoom, rotation, pan]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-neutral-900 border border-neutral-800 rounded-xl h-[540px]">
      <canvas ref={canvasRef} width={820} height={480} className="bg-black rounded-lg shadow-inner canvas-grab" />
      <div className="text-xs text-neutral-400 mt-2">Interactive 2D Viewport Canvas</div>
    </div>
  );
}