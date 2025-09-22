import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private postUrl = 'https://jsonplaceholder.typicode.com/posts';
  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get<any[]>(this.postUrl).pipe(
      map((posts) =>
        posts.slice(0, 10).map((p, index) => ({
          id: p.id,
          user: {
            name: `User ${p.userId + index}`,
            avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
          },
          content: p.body,
          imageUrl: `https://picsum.photos/600/40${index}`,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10),
        }))
      )
    );
  }
}
