import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReelsService {
  constructor(private http: HttpClient) {}

  private reelsUrl =
    'https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/videos.json';
  getReels(): Observable<any> {
    return this.http.get<any[]>(this.reelsUrl).pipe(
      map((videos) =>
        videos.slice(0, 10).map((v, index) => ({
          id: v.id,
          user: {
            name: `User${index + 1}`,
            avatar: `https://i.pravatar.cc/150?img=${index + 5}`,
          },
          videoUrl: v.videoUrl,
          likes: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 200),
        }))
      )
    );
  }
}
