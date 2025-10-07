import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { ReelsService } from '../service/reels.service';

interface Reel {
  id: number;
  user: { name: string; avatar: string };
  videoUrl: string;
  description: string;
  likes: number;
  comments: number;
  views: number;
  isMuted?: boolean;
  progress?: number;
  showHeart?: boolean;
  saved?: boolean;
}

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.css'],
})
export class ReelsComponent implements AfterViewInit {
  reels: Reel[] = [];
  @ViewChildren('videoElement') videoElements!: QueryList<
    ElementRef<HTMLVideoElement>
  >;

  showShareModal = false;
  shareLink = '';
  copied = false;

  // Base64 transparent PNG icons for save/saved:
  saveIcon = './assets/save.png';

  savedIcon = './assets/saved.png';
  private observe: IntersectionObserver | null = null;

  constructor(private reelService: ReelsService) {}

  ngOnInit(): void {
    this.reelService.getReels().subscribe((data) => {
      this.reels = data.map((r: any) => ({
        ...r,
        description: r.description || 'No description provided.',
        isMuted: true,
        progress: 0,
        showHeart: false,
        saved: false,
        views: r.views || Math.floor(Math.random() * 10000 + 1000),
      }));
    });
  }

  ngAfterViewInit(): void {
    this.videoElements.changes.subscribe(() => this.observeVideos());
    this.observeVideos();
  }

  private observeVideos(): void {
    const options = { root: null, threshold: 0.8 };
    if (this.observe) {
      this.observe.disconnect();
    }
    this.observe = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        const reel = this.reels.find((r) => video.src.includes(r.videoUrl));
        if (!reel) return;

        if (entry.isIntersecting) {
          this.pauseAllExcept(video);
          video.play().catch(() => {});
          reel.views++;
        } else {
          video.pause();
        }
      });
    }, options);

    this.videoElements.forEach((ve) => this.observe!.observe(ve.nativeElement));
  }

  private pauseAllExcept(playVideo: HTMLVideoElement) {
    this.videoElements.forEach((ve) => {
      if (ve.nativeElement !== playVideo && !ve.nativeElement.paused) {
        ve.nativeElement.pause();
      }
    });
  }

  toggleMute(video: HTMLVideoElement | undefined, reel: Reel) {
    if (!video) return;
    video.muted = !video.muted;
    reel.isMuted = video.muted;
  }

  getVideoElementByUrl(url: string): HTMLVideoElement | undefined {
    const ve = this.videoElements.find((ve) =>
      ve.nativeElement.src.includes(url)
    );
    return ve?.nativeElement;
  }

  likeReel(reel: Reel) {
    reel.likes++;
  }

  commentReel(reel: Reel) {
    reel.comments++;
  }

  updateProgress(event: Event, reel: Reel) {
    const video = event.target as HTMLVideoElement;
    const progress = (video.currentTime / video.duration) * 100 || 0;
    reel.progress = progress;
  }

  handleDoubleTap(reel: Reel) {
    if (!reel.showHeart) {
      reel.showHeart = true;
      reel.likes++;
      setTimeout(() => (reel.showHeart = false), 800);
    }
  }

  toggleSaveReel(reel: Reel) {
    reel.saved = !reel.saved;
  }

  openShareModal(reel: Reel) {
    this.shareLink = reel.videoUrl;
    this.showShareModal = true;
    this.copied = false;
  }

  closeShareModal() {
    this.showShareModal = false;
    this.shareLink = '';
  }

  copyShareLink() {
    navigator.clipboard.writeText(this.shareLink).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
