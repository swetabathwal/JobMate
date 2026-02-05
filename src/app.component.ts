import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { ReferralsComponent } from './components/referrals/referrals.component';
import { AppView } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, DashboardComponent, ChatbotComponent, PlaceholderComponent, ReferralsComponent],
})
export class AppComponent {
  activeView = signal<AppView>('dashboard');

  onNavigate(view: AppView): void {
    this.activeView.set(view);
  }
}
