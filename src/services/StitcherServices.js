export class StitcherService {
  constructor() {
    this.isOpenCVReady = false;
    this.checkReady();
  }

  // Check if OpenCV is loaded in window
  checkReady() {
    if (window.cv && window.cv.Mat) {
      this.isOpenCVReady = true;
    } else {
      setTimeout(() => this.checkReady(), 500);
    }
  }

  // Load image element from selected file (JPEG, PNG, AVIF)
  loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Cylindrical coordinate transform
  cylindricalWarp(canvas, focalLength = 800) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const srcData = ctx.getImageData(0, 0, width, height);
    const dstData = ctx.createImageData(width, height);

    const cx = width / 2;
    const cy = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const theta = (x - cx) / focalLength;
        const h = (y - cy) / focalLength;

        const xSrc = Math.round(focalLength * Math.tan(theta) + cx);
        const ySrc = Math.round(focalLength * (h / Math.cos(theta)) + cy);

        if (xSrc >= 0 && xSrc < width && ySrc >= 0 && ySrc < height) {
          const dstIdx = (y * width + x) * 4;
          const srcIdx = (ySrc * width + xSrc) * 4;
          dstData.data[dstIdx] = srcData.data[srcIdx];
          dstData.data[dstIdx + 1] = srcData.data[srcIdx + 1];
          dstData.data[dstIdx + 2] = srcData.data[srcIdx + 2];
          dstData.data[dstIdx + 3] = srcData.data[srcIdx + 3];
        }
      }
    }
    ctx.putImageData(dstData, 0, 0);
  }
}