import { Injectable, ComponentRef, ApplicationRef, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalContainer: HTMLElement | null = null;
  private modalBackdrop: HTMLElement | null = null;
  private modalComponentRef: ComponentRef<any> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  open(component: any, inputs: Record<string, any> = {}): Promise<any> {
    // Create modal container if it doesn't exist
    if (!this.modalContainer) {
      this.createModalContainer();
    }

    // Create component factory and resolve it
    // For simplicity, we'll use ComponentFactoryResolver approach
    // In newer Angular versions, we'd use ViewContainerRef.createComponent

    // This is a simplified implementation - in practice, we'd need to use
    // Angular's dynamic component loading mechanisms
    return new Promise((resolve, reject) => {
      // For now, we'll just store the resolve function
      // In a full implementation, we'd create the component and handle its output
      (window as any)._modalResolve = resolve;
      (window as any)._modalReject = reject;
    });
  }

  close(result?: any) {
    if (this.modalContainer) {
      this.modalContainer.classList.remove('open');
    }
    if ((window as any)._modalResolve) {
      (window as any)._modalResolve(result);
      (window as any)._modalResolve = null;
      (window as any)._modalReject = null;
    }
  }

  private createModalContainer() {
    // Create backdrop
    this.modalBackdrop = document.createElement('div');
    this.modalBackdrop.className = 'modal-overlay';
    this.modalBackdrop.setAttribute('id', 'modal-overlay');
    this.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === this.modalBackdrop) {
        this.close();
      }
    });

    // Create modal container
    this.modalContainer = document.createElement('div');
    this.modalContainer.className = 'modal';
    this.modalContainer.setAttribute('id', 'modal');

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = `
      <span class="modal-title" id="modal-title"></span>
      <button class="btn-icon" onclick="window._closeModalFn()"><span class="material-icons-round">close</span></button>
    `;
    this.modalContainer.appendChild(modalHeader);

    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.setAttribute('id', 'modal-body');
    this.modalContainer.appendChild(modalBody);

    // Create modal footer
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    modalFooter.setAttribute('id', 'modal-footer');
    this.modalContainer.appendChild(modalFooter);

    // Assemble
    this.modalBackdrop.appendChild(this.modalContainer);
    document.body.appendChild(this.modalBackdrop);

    // Expose close function globally for inline handlers
    (window as any)._closeModalFn = () => this.close();
  }
}
