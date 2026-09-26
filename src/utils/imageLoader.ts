// Preloader and cache for InkBlade pose images
import { INKBLADE_POSES, PoseData } from '../data/posesData';

class ImageLoader {
  private cache: Map<string, HTMLImageElement> = new Map();
  private loadedCount: number = 0;
  private totalCount: number = 0;
  private isLoaded: boolean = false;
  private listeners: Array<(progress: number, total: number) => void> = [];

  constructor() {
    this.totalCount = INKBLADE_POSES.length;
  }

  public preloadAll(): Promise<void> {
    if (this.isLoaded) return Promise.resolve();

    return new Promise((resolve) => {
      let pending = INKBLADE_POSES.length;
      if (pending === 0) {
        this.isLoaded = true;
        resolve();
        return;
      }

      INKBLADE_POSES.forEach((pose) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = pose.url;
        img.onload = () => {
          this.cache.set(pose.file, img);
          this.cache.set(pose.id, img);
          this.loadedCount++;
          this.notifyProgress();
          pending--;
          if (pending <= 0) {
            this.isLoaded = true;
            resolve();
          }
        };
        img.onerror = () => {
          // Fallback if failed
          this.loadedCount++;
          this.notifyProgress();
          pending--;
          if (pending <= 0) {
            this.isLoaded = true;
            resolve();
          }
        };
      });
    });
  }

  public getImage(key: string): HTMLImageElement | undefined {
    return this.cache.get(key);
  }

  public onProgress(cb: (progress: number, total: number) => void) {
    this.listeners.push(cb);
    if (this.isLoaded) {
      cb(this.totalCount, this.totalCount);
    }
  }

  private notifyProgress() {
    this.listeners.forEach((cb) => cb(this.loadedCount, this.totalCount));
  }

  public isReady(): boolean {
    return this.isLoaded;
  }
}

export const imageLoader = new ImageLoader();
