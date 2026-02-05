import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { ResumeData, TemplateOption, WorkExperience, Education } from '../../models';

type AiModalState = {
  isOpen: boolean;
  fieldType: 'experience' | 'skills' | null;
  isLoading: boolean;
  jobDescription: string;
  suggestions: string[];
  index?: number; // For experience items
};

type AtsModalState = {
  isOpen: boolean;
  isLoading: boolean;
  jobDescription: string;
  result: { score: number; feedback: string } | null;
};

@Component({
  selector: 'app-resume-builder',
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class ResumeBuilderComponent {
  private geminiService = inject(GeminiService);

  step = signal(1); // 1: Template, 2: Content, 3: Finalize
  
  templates: TemplateOption[] = [
    { id: 'classic', name: 'Classic', thumbnailUrl: 'https://i.imgur.com/8d2F3a4.png' },
    { id: 'modern', name: 'Modern', thumbnailUrl: 'https://i.imgur.com/5N21V5U.png' },
    { id: 'creative', name: 'Creative', thumbnailUrl: 'https://i.imgur.com/1rqWwWw.png' },
  ];

  resume = signal<ResumeData>({
    template: 'modern',
    personal: { fullName: '', email: '', phone: '', location: '', website: '' },
    summary: '',
    experience: [{ jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }],
    skills: [''],
  });

  aiModalState = signal<AiModalState>({ isOpen: false, fieldType: null, isLoading: false, jobDescription: '', suggestions: [] });
  atsModalState = signal<AtsModalState>({ isOpen: false, isLoading: false, jobDescription: '', result: null });

  // --- Step Navigation ---
  nextStep() { this.step.update(s => Math.min(s + 1, 3)); }
  prevStep() { this.step.update(s => Math.max(s - 1, 1)); }
  setStep(newStep: number) { this.step.set(newStep); }
  selectTemplate(templateId: 'classic' | 'modern' | 'creative') {
    this.resume.update(r => ({ ...r, template: templateId }));
    this.nextStep();
  }

  // --- Dynamic Form Array Methods ---
  addExperience() { this.resume.update(r => ({ ...r, experience: [...r.experience, { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }] })); }
  removeExperience(index: number) { this.resume.update(r => ({ ...r, experience: r.experience.filter((_, i) => i !== index) })); }
  addEducation() { this.resume.update(r => ({ ...r, education: [...r.education, { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }] })); }
  removeEducation(index: number) { this.resume.update(r => ({ ...r, education: r.education.filter((_, i) => i !== index) })); }
  addSkill() { this.resume.update(r => ({ ...r, skills: [...r.skills, ''] })); }
  removeSkill(index: number) { this.resume.update(r => ({ ...r, skills: r.skills.filter((_, i) => i !== index) })); }
  trackByIndex(index: number): number { return index; }
  
  // --- AI Suggestion Modal ---
  openAiModal(fieldType: 'experience' | 'skills', index?: number) {
    this.aiModalState.set({ isOpen: true, fieldType, index, isLoading: false, jobDescription: '', suggestions: [] });
  }
  closeAiModal() { this.aiModalState.update(s => ({ ...s, isOpen: false })); }
  async getAiSuggestions() {
    const state = this.aiModalState();
    if (!state.jobDescription || !state.fieldType) return;
    this.aiModalState.update(s => ({ ...s, isLoading: true, suggestions: [] }));
    const suggestions = await this.geminiService.generateResumeKeywords(state.jobDescription, state.fieldType);
    this.aiModalState.update(s => ({ ...s, isLoading: false, suggestions }));
  }
  useSuggestion(suggestion: string) {
    const { fieldType, index } = this.aiModalState();
    if (fieldType === 'experience' && index !== undefined) {
      this.resume.update(r => {
        const newExp = [...r.experience];
        const currentDesc = newExp[index].description;
        newExp[index].description = (currentDesc ? currentDesc + '\n' : '') + `• ${suggestion}`;
        return { ...r, experience: newExp };
      });
    } else if (fieldType === 'skills') {
      this.resume.update(r => {
        const newSkills = [...r.skills.filter(s => s.trim() !== ''), suggestion];
        return { ...r, skills: newSkills };
      });
    }
    this.closeAiModal();
  }
  
  // --- ATS Analysis Modal ---
  openAtsModal() { this.atsModalState.set({ isOpen: true, isLoading: false, jobDescription: '', result: null }); }
  closeAtsModal() { this.atsModalState.update(s => ({ ...s, isOpen: false })); }
  async runAtsAnalysis() {
    if (!this.atsModalState().jobDescription) return;
    this.atsModalState.update(s => ({ ...s, isLoading: true, result: null }));
    const resumeText = this.getResumeAsText();
    const result = await this.geminiService.analyzeResumeATS(resumeText, this.atsModalState().jobDescription);
    this.atsModalState.update(s => ({ ...s, isLoading: false, result }));
  }

  // --- Utility ---
  private getResumeAsText(): string {
    const r = this.resume();
    let text = `Name: ${r.personal.fullName}\nSummary: ${r.summary}\nSkills: ${r.skills.join(', ')}\n\n`;
    text += "Experience:\n";
    r.experience.forEach(exp => {
      text += `- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.description}\n`;
    });
    text += "\nEducation:\n";
    r.education.forEach(edu => {
      text += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.school}\n`;
    });
    return text;
  }
}
