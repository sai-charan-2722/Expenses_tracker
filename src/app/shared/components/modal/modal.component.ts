import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string = '';

  close() {
    // We'll emit an event or call a service method
    // For now, we'll just rely on the parent component to handle closing
    // In a more complete implementation, we'd use an EventEmitter
    (window as any)._closeModalFn?.();
  }
}
