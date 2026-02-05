import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// FIX: Import FormGroup to use as a type for the form property.
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { ReferralService } from '../../services/referral.service';
import { JobOpening } from '../../models';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ReferralsComponent {
  private referralService = inject(ReferralService);
  // FIX: Inject FormBuilder as a class property. This resolves the type inference issue where `fb.group` was not recognized.
  private fb = inject(FormBuilder);
  
  activeTab = 'find'; // 'find' or 'post'
  
  // Form for posting a new opening
  postOpeningForm: FormGroup;
  isPosting = false;

  // Signals for filtering and sorting
  filterTitle = signal('');
  filterCompany = signal('');
  filterLocation = signal('');
  sortBy = signal<'newest' | 'title'>('newest');

  // A computed signal to derive the visible openings based on filters and sorting
  filteredOpenings = computed(() => {
    const allOpenings = this.referralService.openings();
    const title = this.filterTitle().toLowerCase();
    const company = this.filterCompany().toLowerCase();
    const location = this.filterLocation().toLowerCase();
    const sort = this.sortBy();

    // 1. Filter the openings
    let filtered = allOpenings.filter(op => 
      op.title.toLowerCase().includes(title) &&
      op.company.toLowerCase().includes(company) &&
      op.location.toLowerCase().includes(location)
    );

    // 2. Sort the filtered results
    if (sort === 'title') {
      // Create a new array to sort, preserving the original order
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    // For 'newest', no sorting is needed as new items are prepended by default.

    return filtered;
  });

  constructor() {
    this.postOpeningForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'post') {
      this.postOpeningForm.reset();
      this.isPosting = false;
    }
  }

  requestReferral(opening: JobOpening): void {
    alert(`Referral request sent for the ${opening.title} position at ${opening.company}!`);
  }

  resetFilters(): void {
    this.filterTitle.set('');
    this.filterCompany.set('');
    this.filterLocation.set('');
    this.sortBy.set('newest');
  }
  
  postOpening(): void {
    if (this.postOpeningForm.invalid) {
      this.postOpeningForm.markAllAsTouched();
      return;
    }
    
    this.isPosting = true;
    const formValue = this.postOpeningForm.value;

    const newOpening = {
        title: formValue.title!,
        company: formValue.company!,
        location: formValue.location!,
        description: formValue.description!,
    };

    // Simulate network delay
    setTimeout(() => {
        this.referralService.addOpening(newOpening);
        this.postOpeningForm.reset();
        this.isPosting = false;
        // Switch back to the 'find' tab to see the new post
        this.activeTab = 'find';
    }, 1000);
  }
}
