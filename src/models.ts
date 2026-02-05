export type AppView = 'dashboard' | 'chatbot' | 'referrals' | 'resume' | 'trends' | 'notes' | 'reviews';

export interface ChatMessage {
  author: 'user' | 'bot' | 'error';
  text: string;
}

export interface JobOpening {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  postedBy: string;
  avatar: string; // URL to an avatar image
}
