import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarElement: HTMLElement | null = null;
  private snackTimer: any = null;

  constructor() { }

  show(message: string, type: string = 'default', icon: string = 'check_circle'): void {
    this.clearTimer();

    // Create snackbar element if it doesn't exist
    if (!this.snackbarElement) {
      this.createSnackbarElement();
    }

    if (this.snackbarElement) {
      const msgElement = this.snackbarElement.querySelector('#snack-msg');
      const iconElement = this.snackbarElement.querySelector('#snack-icon');

      if (msgElement) msgElement.textContent = message;
      if (iconElement) iconElement.textContent = icon;

      this.snackbarElement.className = 'show' + (type !== 'default' ? ' ' + type : '');

      this.snackTimer = setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  hide() {
    if (this.snackbarElement) {
      this.snackbarElement.classList.remove('show');
    }
    this.clearTimer();
  }

  private clearTimer() {
    if (this.snackTimer) {
      clearTimeout(this.snackTimer);
      this.snackTimer = null;
    }
  }

  private createSnackbarElement() {
    this.snackbarElement = document.createElement('div');
    this.snackbarElement.setAttribute('id', 'snackbar');
    this.snackbarElement.innerHTML = `
      <span class="material-icons-round" id="snack-icon">check_circle</span>
      <span id="snack-msg"></span>
    `;
    document.body.appendChild(this.snackbarElement);
  }
}
