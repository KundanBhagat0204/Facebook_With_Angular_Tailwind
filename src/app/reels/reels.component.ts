import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { ReelsService } from '../service/reels.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
  commentsList?: any[];
  newComment?: string;
  showCommentBox?: boolean;
  showDescriptionModal?: boolean;
}

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.css'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({
          transform: 'translateY(100%)',
          opacity: 0
        }),
        animate('300ms ease-out', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          transform: 'translateY(100%)',
          opacity: 0
        }))
      ])
    ])
  ]
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
        commentsList: [],
        newComment: '',
        showCommentBox: false,
        showDescriptionModal: false,
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
    reel.showCommentBox = !reel.showCommentBox;
  }

  addComment(reel: Reel) {
    if (!reel.newComment?.trim()) return;
    
    const avatars = [
      'https://i.pravatar.cc/40?img=3',
      'https://i.pravatar.cc/40?img=4',
      'https://i.pravatar.cc/40?img=5',
    ];
    
    reel.commentsList!.push({
      name: 'You',
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      timeAgo: 'Just now',
      text: reel.newComment,
    });

    reel.comments = reel.commentsList!.length;
    reel.newComment = '';
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    // Check if click is outside any description modal
    if (!target.closest('.description-modal') && !target.closest('.three-dots-button')) {
      this.reels.forEach(reel => {
        if (reel.showDescriptionModal) {
          reel.showDescriptionModal = false;
        }
      });
    }
  }
}
