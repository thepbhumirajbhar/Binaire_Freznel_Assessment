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
}