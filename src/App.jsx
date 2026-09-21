import React, { useState } from 'react';
import { StitcherService } from './services/StitcherServices';
import ControlsPanel from './components/ControlsPanel';
import PanoramaViewer from './components/PanoramaViewer';
import './styles/app.css';

const stitcher = new StitcherService();

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [stitchedImage, setStitchedImage] = useState(null);
  const [projection, setProjection] = useState('cylindrical');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [exportFormat, setExportFormat] = useState('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Ready: Select multiple images to stitch.');

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
    setStatusMsg(`${files.length} images selected (JPEG, PNG, AVIF supported).`);
  };

  // Run Panorama Stitching
  const handleStitch = async () => {
    if (selectedFiles.length < 2) {
      setStatusMsg('⚠️ Please select at least 2 overlapping images to stitch.');
      return;
    }

    setIsProcessing(true);
    setStatusMsg('Processing images with OpenCV and applying projection warp...');

    try {
      const loadedImgs = await Promise.all(selectedFiles.map((f) => stitcher.loadImage(f)));
      const resultDataUrl = await stitcher.stitchImages(loadedImgs, projection);
      setStitchedImage(resultDataUrl);
      setStatusMsg('✅ Panorama stitched successfully!');
    } catch (err) {
      console.error(err);
      setStatusMsg('❌ Stitching failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Panoramic Image Stitching Tool</h1>
          <p className="text-xs text-neutral-400 mt-1">Built with Electron, React, Tailwind & OpenCV.js</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-lg text-sm">
          Status: <span className="font-semibold text-emerald-400">{statusMsg}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <PanoramaViewer imageSrc={stitchedImage} zoom={zoom} rotation={rotation} />
        <ControlsPanel
          onFilesSelected={handleFilesSelected}
          onStitch={handleStitch}
          projection={projection}
          setProjection={setProjection}
          zoom={zoom}
          setZoom={setZoom}
          rotation={rotation}
          setRotation={setRotation}
          onExport={() => {}}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          isProcessing={isProcessing}
          canStitch={selectedFiles.length >= 2}
        />
      </div>
    </div>
  );
}