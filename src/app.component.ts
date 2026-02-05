import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { ReferralsComponent } from './components/referrals/referrals.component';
import { ResumeBuilderComponent } from './components/resume-builder/resume-builder.component';
import { LandingComponent } from './components/landing/landing.component';
import { AppView } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, DashboardComponent, ChatbotComponent, PlaceholderComponent, ReferralsComponent, ResumeBuilderComponent, LandingComponent],
})
export class AppComponent {
  activeView = signal<AppView>('dashboard');
  isAuthenticated = signal(false);

  onNavigate(view: AppView): void {
    this.activeView.set(view);
  }

  login(): void {
    this.isAuthenticated.set(true);
    this.activeView.set('dashboard');
  }

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
