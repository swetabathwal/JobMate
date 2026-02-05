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

// --- Resume Builder Models ---

export interface WorkExperience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  template: 'classic' | 'modern' | 'creative';
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

export interface TemplateOption {
  id: 'classic' | 'modern' | 'creative';
  name: string;
  thumbnailUrl: string;
}
