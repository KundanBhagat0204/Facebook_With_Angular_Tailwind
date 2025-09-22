import { Component } from '@angular/core';
import { Post } from '../model/post.model';
import { PostsService } from '../service/posts.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  posts: Post[] = [];
  constructor(private pservice: PostsService) {}
  ngOnInit(): void {
    // this.posts = [
    //   {
    //     id: 1,
    //     user: {
    //       name: 'Kundan Bhagat',
    //       avatar:
    //         'https://tse3.mm.bing.net/th/id/OIP.UxhCQPPe5EQMiSPKObh-dAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    //     },
    //     content: 'Loving this sunny day!',
    //     imageUrl: 'https://picsum.photos/600/400',
    //     likes: 25,
    //     comments: 4,
    //     shares: 2,
    //   },
    //   {
    //     id: 2,
    //     user: {
    //       name: 'Ruturaj Patil',
    //       avatar: 'https://i.pravatar.cc/40?img=2',
    //     },
    //     content: 'Check out this amazing view ',
    //     imageUrl: 'https://picsum.photos/600/401',
    //     likes: 40,
    //     comments: 10,
    //     shares: 5,
    //   },
    // ];
    this.pservice.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }
  likePost(post: Post) {
    post.likes++;
  }
  commentPost(post: Post) {
    post.comments++;
  }
  sharePost(post: Post) {
    post.shares++;
  }
}
