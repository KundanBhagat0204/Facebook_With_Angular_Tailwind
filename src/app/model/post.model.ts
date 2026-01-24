export interface Post {
  id: number;
  timeAgo?: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  imageUrl?: string | null;
  likes: number;
  comments: any[]; // Updated to array
  shares: number;
  createdAt: any;
  liked?: boolean;
  showHeart?: boolean;
  reaction?: string;
  newComment?: string;
  showCommentBox?: boolean;
}
