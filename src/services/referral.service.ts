import { Injectable, signal } from '@angular/core';
import { JobOpening } from '../models';

const MOCK_OPENINGS: JobOpening[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Innovate Inc.',
    location: 'San Francisco, CA (Remote)',
    description: 'Join our team to build next-gen web applications using Angular and cutting-edge technologies. Experience with RxJS and state management is a plus.',
    postedBy: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alice'
  },
  {
    id: 2,
    title: 'Product Manager, AI',
    company: 'DataDriven Co.',
    location: 'New York, NY',
    description: 'Lead the product vision for our new AI platform. We are looking for someone passionate about machine learning and user experience.',
    postedBy: 'Bob Williams',
    avatar: 'https://i.pravatar.cc/150?u=bob'
  },
  {
    id: 3,
    title: 'Full-Stack Developer (Python/React)',
    company: 'CodeGenius',
    location: 'Austin, TX',
    description: 'We are hiring a versatile full-stack developer to work on our core platform. Strong skills in both backend and frontend development required.',
    postedBy: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?u=charlie'
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    company: 'Creative Solutions',
    location: 'Los Angeles, CA',
    description: 'Design beautiful and intuitive user interfaces for our mobile and web products. A strong portfolio is required.',
    postedBy: 'Diana Prince',
    avatar: 'https://i.pravatar.cc/150?u=diana'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private nextId = signal(MOCK_OPENINGS.length + 1);
  openings = signal<JobOpening[]>(MOCK_OPENINGS);

  addOpening(opening: Omit<JobOpening, 'id' | 'postedBy' | 'avatar'>): void {
    const newOpening: JobOpening = {
      ...opening,
      id: this.nextId(),
      postedBy: 'You', // In a real app, this would be the logged-in user
      avatar: `https://i.pravatar.cc/150?u=you`
    };
    this.openings.update(currentOpenings => [newOpening, ...currentOpenings]);
    this.nextId.update(id => id + 1);
  }
}
