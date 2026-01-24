import { Component } from '@angular/core';
import { Post } from '../model/post.model';
import { PostsService } from '../service/posts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDistanceToNow } from 'date-fns';

const avatars = [
  'https://i.pravatar.cc/40?img=3',
  'https://i.pravatar.cc/40?img=4',
  'https://i.pravatar.cc/40?img=5',
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  posts: any[] = [];
  showModal = false;
  postForm!: FormGroup;
  previewUrl: string | null = null;
  // Mood selector
  mood: string = 'happy';
  moodList = [
    { value: 'happy', emoji: '😊' },
    { value: 'sad', emoji: '😢' },
    { value: 'excited', emoji: '🤩' },
    { value: 'tired', emoji: '😴' },
  ];
  // Emoji reactions
  reactionList = [
    { emoji: '🔥' },
    { emoji: '💯' },
    { emoji: '😆' },
    { emoji: '👏' },
    { emoji: '😭' },
  ];

  constructor(private pservice: PostsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    } else {
      this.pservice.getPosts().subscribe((data) => {
        this.posts = data.map((post: any) => ({
          ...post,
          timeAgo: this.computeTimeAgo(post.createdAt || new Date()),
          comments: [], // Initialize as empty array
          newComment: '',
          liked: false,
          showHeart: false,
          reaction: '',
        }));
        this.savePosts();
      });
    }
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
    this.mood = 'happy';
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file!');
        return;
      }
      this.postForm.patchValue({ file });
      this.previewUrl = URL.createObjectURL(file);
    }
  }
  removeImage() {
    this.previewUrl = null;
    this.postForm.patchValue({ file: null });
  }

  createPost() {
    if (this.postForm.invalid) return;
    const { content, file } = this.postForm.value;
    const now = new Date();
    const newPost = {
      id: Date.now(),
      timeAgo: 'Just now',
      user: { name: 'You', avatar: 'https://i.pravatar.cc/40' },
      content,
      imageUrl: this.previewUrl || null,
      likes: 0,
      comments: [],
      newComment: '',
      shares: 0,
      createdAt: now,
      mood: this.mood,
      liked: false,
      showHeart: false,
      reaction: '',
    };
    this.posts = [newPost, ...this.posts];
    this.savePosts();
    this.closeModal();
  }

  likePost(post: any, dblTap = false) {
    if (!post.liked) post.likes++;
    else post.likes--;
    post.liked = !post.liked;

    // Instagram-style animated heart for double-tap on image or icon
    if (dblTap) {
      post.showHeart = true;
      setTimeout(() => (post.showHeart = false), 900);
      if (!post.liked) post.liked = true; // ensure like on dbltap
    }
    this.savePosts();
  }

  addComment(post: any) {
    if (!post.newComment?.trim()) return;
    post.comments.push({
      name: 'You',
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      timeAgo: 'Just now',
      text: post.newComment,
    });

    post.newComment = '';
    this.savePosts();
  }

  replyComment(post: any, comment: any) {
    post.newComment = `@${comment.name} `;
    setTimeout(() => {
      const input = document.querySelector(
        'input[name="comment"]'
      ) as HTMLElement;
      input?.focus();
    }, 0);
  }

  // Unique: Animated sticker reaction
  addReaction(post: any, reaction: any) {
    post.reaction = reaction.emoji;
    setTimeout(() => (post.reaction = ''), 1500);
  }

  private computeTimeAgo(date: Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  sharePost(post: any) {
    post.shares++;
    this.savePosts();
  }

  toggleCommentBox(post: any) {
    post.showCommentBox = !post.showCommentBox;
  }

  savePosts() {
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }
}
