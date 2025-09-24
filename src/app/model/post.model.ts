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
  comments: number;
  shares: number;
}
