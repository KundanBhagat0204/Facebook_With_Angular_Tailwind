export interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}
