import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { UiUtilsService } from '../../../core/services/ui-utils.service';

@Component({
  selector: 'app-add-member-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-member-modal.component.html',
  styleUrl: './add-member-modal.component.scss'
})
export class AddMemberModalComponent {
  @Input() groupId = '';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  newMembers: string[] = [];
  memberInputText = '';
  showNameError = false;

  constructor(
    private storageService: StorageService,
    private uiUtils: UiUtilsService
  ) {}

  addMember() {
    if (!this.memberInputText.trim()) {
      this.showNameError = true;
      return;
    }
    this.showNameError = false;
    if (this.newMembers.includes(this.memberInputText.trim())) return;
    this.newMembers.push(this.memberInputText.trim());
    this.memberInputText = '';
  }

  removeMember(index: number) {
    this.newMembers.splice(index, 1);
  }

  onSubmit() {
    if (this.groupId && this.newMembers.length > 0) {
      const group = this.storageService.getGroup(this.groupId);
      if (group) {
        for (const name of this.newMembers) {
          const id = this.generateId();
          this.storageService.saveUser({ id, name });
          group.memberIds.push(id);
        }
        this.storageService.saveGroup(group);
      }
    }
    this.submit.emit();
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  getUserInitials(name: string): string {
    return this.uiUtils.userInitials(name);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
}
