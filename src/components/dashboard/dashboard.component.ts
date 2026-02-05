import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppView } from '../../models';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  view: AppView;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DashboardComponent {
  @Output() navigate = new EventEmitter<AppView>();

  features: FeatureCard[] = [
    { title: 'AI Assistant', description: 'Ask questions about careers, interviews, and more.', icon: 'fa-solid fa-robot', view: 'chatbot' },
    { title: 'Find Referrals', description: 'Connect with employees and get referred to top companies.', icon: 'fa-solid fa-people-arrows', view: 'referrals' },
    { title: 'Resume Builder', description: 'Craft the perfect resume with AI-powered suggestions.', icon: 'fa-solid fa-file-invoice', view: 'resume' },
    { title: 'Job Trends', description: 'Discover what skills and roles are currently in demand.', icon: 'fa-solid fa-chart-line', view: 'trends' },
    { title: 'My Notes', description: 'Keep track of your applications, interviews, and contacts.', icon: 'fa-solid fa-clipboard', view: 'notes' },
    { title: 'Company Reviews', description: 'Read and share honest reviews about company culture.', icon: 'fa-solid fa-star', view: 'reviews' },
  ];

  onNavigate(view: AppView) {
    this.navigate.emit(view);
  }
}
