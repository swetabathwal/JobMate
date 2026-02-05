import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PlaceholderComponent {
  featureName = input.required<string>();
  icon = input<string>('fa-solid fa-cogs');
}
