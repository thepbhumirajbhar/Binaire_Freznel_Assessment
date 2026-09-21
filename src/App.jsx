import React, { useState } from 'react';
import './styles/app.css';

export default function App() {
  const [statusMsg, setStatusMsg] = useState('Ready: Select multiple images to stitch.');

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Top Header Bar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Panoramic Image Stitching Tool</h1>
          <p className="text-xs text-neutral-400 mt-1">Built with Electron, React, Tailwind & OpenCV.js</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-lg text-sm">
          Status: <span className="font-semibold text-emerald-400">{statusMsg}</span>
        </div>
      </div>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="text-neutral-500 text-sm">Viewer Area Loading...</div>
      </div>
    </div>
  );
}