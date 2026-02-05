import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppView } from '../../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class HeaderComponent {
  @Output() navigate = new EventEmitter<AppView>();

  onNavigate(view: AppView) {
    this.navigate.emit(view);
  }
}
