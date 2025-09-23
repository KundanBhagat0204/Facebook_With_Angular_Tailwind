import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

interface Reel {
  id: number;
  user: { name: string; avatar: string };
  videoUrl: string;
  likes: number;
  comments: number;
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

  ngOnInit(): void {
    this.reels = [
      {
        id: 1,
        user: { name: 'John', avatar: 'https://i.pravatar.cc/40?img=1' },
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        likes: 120,
        comments: 30,
      },
      {
        id: 1,
        user: { name: 'Jane', avatar: 'https://i.pravatar.cc/40?img=2' },
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        likes: 200,
        comments: 45,
      },
    ];
  }
  ngAfterViewInit(): void {
    const options = {
      root: null,
      threshold: 0.75,
    };
    const observer = new IntersectionObserver((enteries) => {
      enteries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    }, options);

    this.videoElements.forEach((videoEl) =>
      observer.observe(videoEl.nativeElement)
    );
  }
}
