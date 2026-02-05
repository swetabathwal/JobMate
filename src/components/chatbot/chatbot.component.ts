import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { ChatMessage } from '../../models';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class ChatbotComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  private geminiService = inject(GeminiService);
  
  userInput = signal('');
  thinkMore = signal(false);
  isLoading = signal(false);
  messages = signal<ChatMessage[]>([
    { author: 'bot', text: 'Hello! I am your career assistant. How can I help you plan your job switch today?' }
  ]);

  constructor() {
    effect(() => {
      // Auto-scroll when messages change
      if (this.messages()) {
        this.scrollToBottom();
      }
    });
  }

  async sendMessage(): Promise<void> {
    const userMessage = this.userInput().trim();
    if (!userMessage || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.messages.update(msgs => [...msgs, { author: 'user', text: userMessage }]);
    this.userInput.set('');
    
    // Add a thinking indicator for the bot
    this.messages.update(msgs => [...msgs, { author: 'bot', text: '...' }]);
    this.scrollToBottom();

    try {
      const response = await this.geminiService.generateText(userMessage, this.thinkMore());
      // FIX: Ensure immutability when updating signal state for OnPush change detection.
      // Instead of mutating the last message object, create a new array.
      this.messages.update(msgs => {
        if (msgs.length > 0 && msgs[msgs.length - 1].author === 'bot' && msgs[msgs.length - 1].text === '...') {
          // Replace the "thinking" message with the real response.
          return [...msgs.slice(0, -1), { author: 'bot', text: response }];
        }
        return [...msgs, { author: 'bot', text: response }]; // Fallback
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      this.messages.update(msgs => [...msgs, { author: 'error', text: `Error: ${errorMessage}` }]);
    } finally {
      this.isLoading.set(false);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      } catch (err) {
        console.error('Could not scroll to bottom:', err);
      }
    }, 0);
  }
}
