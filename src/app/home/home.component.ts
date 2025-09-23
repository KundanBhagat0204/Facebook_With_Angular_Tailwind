import { Component } from '@angular/core';
import { Post } from '../model/post.model';
import { PostsService } from '../service/posts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  posts: Post[] = [];
  showModal = false;
  postForm!: FormGroup;
  previewUrl: string | null = null;

  constructor(private pservice: PostsService, private fb: FormBuilder) {}
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

    this.postForm = this.fb.group({
      content: ['', Validators.required],
      file: [null],
    });
  }
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.postForm.reset();
    this.previewUrl = null;
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.postForm.patchValue({ file });
      this.previewUrl = URL.createObjectURL(file);
    }
  }
  createPost() {
    if (this.postForm.invalid) return;
    const { content, file } = this.postForm.value;

    this.posts.unshift({
      id: Date.now(),
      user: { name: 'You', avatar: 'https://i.pravatar.cc/40' },
      content,
      imageUrl: this.previewUrl,
      likes: 0,
      comments: 0,
      shares: 0,
    });
    this.closeModal();
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
