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

  // File select hote hi instant canvas preview set karna
  const handleFilesSelected = async (files) => {
    setSelectedFiles(files);
    setStatusMsg(`${files.length} images selected. Click 'Stitch Panorama' to process.`);

    if (files.length > 0) {
      const img = await stitcher.loadImage(files[0]);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setStitchedImage(canvas.toDataURL('image/png'));
    }
  };

  const handleStitch = async () => {
    if (selectedFiles.length === 0) {
      setStatusMsg('⚠️ Please select at least 1 or 2 images to stitch.');
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

  const handleExport = async () => {
    if (!stitchedImage) {
      setStatusMsg('⚠️ Please stitch a panorama first before exporting.');
      return;
    }

    const ext = exportFormat === 'image/jpeg' ? 'jpg' : exportFormat === 'image/avif' ? 'avif' : 'png';
    const fileName = `panorama_${projection}_${Date.now()}.${ext}`;

    if (window.electronAPI) {
      const res = await window.electronAPI.saveImage({ dataUrl: stitchedImage, defaultName: fileName });
      if (res.success) setStatusMsg(`✅ Exported to ${res.filePath}`);
    } else {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = stitchedImage;
      link.click();
      setStatusMsg(`✅ Downloaded ${fileName}`);
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
          onExport={handleExport}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          isProcessing={isProcessing}
          canStitch={selectedFiles.length >= 1}
        />
      </div>
    </div>
  );
}