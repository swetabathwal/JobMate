import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppView } from '../../models';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  view: AppView;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class LandingComponent {
  @Output() login = new EventEmitter<void>();

  showLoginModal = signal(false);
  isSigningIn = signal(false);

  features: FeatureCard[] = [
    { title: 'AI Assistant', description: 'Get expert advice on resumes, interviews, and career strategy.', icon: 'fa-solid fa-robot', view: 'chatbot' },
    { title: 'Referral Network', description: 'Connect directly with employees at top companies for referrals.', icon: 'fa-solid fa-people-arrows', view: 'referrals' },
    { title: 'AI Resume Builder', description: 'Craft a professional, ATS-friendly resume in minutes.', icon: 'fa-solid fa-file-invoice', view: 'resume' },
  ];

  openLoginModal(): void {
    this.showLoginModal.set(true);
  }

  closeLoginModal(): void {
    if (this.isSigningIn()) return;
    this.showLoginModal.set(false);
  }

  signIn(): void {
    this.isSigningIn.set(true);
    // Simulate API call to Google
    setTimeout(() => {
      this.login.emit();
      this.isSigningIn.set(false);
      this.showLoginModal.set(false);
    }, 1500);
  }
}
