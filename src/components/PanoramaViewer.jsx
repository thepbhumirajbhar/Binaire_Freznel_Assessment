import React, { useRef, useEffect, useState } from 'react';

export default function PanoramaViewer({ imageSrc, zoom, rotation }) {
  const canvasRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!imageSrc) {
      // Draw empty placeholder guide
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#737373';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷 Select images from the right panel to view & stitch', canvas.width / 2, canvas.height / 2);
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
      ctx.scale(zoom, zoom);
      ctx.rotate((rotation * Math.PI) / 180);

      // Fit image appropriately inside canvas viewport
      const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height, 1);
      const drawWidth = img.width * scaleFactor;
      const drawHeight = img.height * scaleFactor;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, zoom, rotation, pan]);

  const handleMouseDown = (e) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-neutral-900 border border-neutral-800 rounded-xl h-[560px]">
      <canvas
        ref={canvasRef}
        width={850}
        height={490}
        className="bg-neutral-950 rounded-lg shadow-inner canvas-grab border border-neutral-800"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="text-xs text-neutral-400 mt-3 font-medium flex gap-2">
        <span>🖱️ Drag to Pan</span>
        <span>•</span>
        <span>🔍 Use sliders for Zoom & Rotation</span>
      </div>
    </div>
  );
}