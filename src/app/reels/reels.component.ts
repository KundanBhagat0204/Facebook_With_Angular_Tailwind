import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ReelsService } from '../service/reels.service';

interface Reel {
  id: number;
  user: { name: string; avatar: string };
  videoUrl: string;
  likes: number;
  comments: number;
  isMuted?: boolean;
}

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.css'],
})
export class ReelsComponent {
  reels: Reel[] = [];
  @ViewChildren('videoElement') videoElements!: QueryList<
    ElementRef<HTMLVideoElement>
  >;
  constructor(private reel: ReelsService) {}

  ngOnInit(): void {
    // this.reels = [
    //   {
    //     id: 1,
    //     user: { name: 'John', avatar: 'https://i.pravatar.cc/40?img=1' },
    //     videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    //     likes: 120,
    //     comments: 30,
    //   },
    //   {
    //     id: 1,
    //     user: { name: 'Jane', avatar: 'https://i.pravatar.cc/40?img=2' },
    //     videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    //     likes: 200,
    //     comments: 45,
    //   },
    // ];
    this.reel.getReels().subscribe((data) => {
      this.reels = data.map((r: any) => ({ ...r, isMuted: true }));
      console.log('Fetched reels: ', this.reels);

      setTimeout(() => {
        this.observeVideo();
      }, 0);
    });
  }
  private observeVideo(): void {
    const options = {
      root: null,
      threshold: 0.75,
    };
    const observer = new IntersectionObserver(
      (enteries) => {
        enteries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {
            video.play().catch((err) => console.warn('Auto play Failed:', err));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.75 }
    );

    this.videoElements.forEach((videoEl) =>
      observer.observe(videoEl.nativeElement)
    );
  }
  toggleMute(video: HTMLVideoElement, reel: any) {
    video.muted = !video.muted;
    reel.isMuted = video.muted;
  }
  likeReel(reel: Reel) {
    reel.likes++;
  }
  commentReel(reel: Reel) {
    reel.comments++;
  }
}
