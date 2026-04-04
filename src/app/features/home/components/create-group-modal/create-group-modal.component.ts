import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../../core/services/storage.service';
import { UiUtilsService } from '../../../../core/services/ui-utils.service';

@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-group-modal.component.html',
  styleUrl: './create-group-modal.component.scss'
})
export class CreateGroupModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  emojis = ['✈️','🍕','🏠','🎉','🛒','🏋️','🎮','🌴','🚗','💼','🎵','🍺'];
  grpEmoji = '✈️';
  grpName = '';
  memberInputText = '';
  newMembers: {id: string, name: string}[] = [];
  submitted = false;
  showMemberError = false;

  constructor(
    private storageService: StorageService,
    private uiUtils: UiUtilsService
  ) {}

  selectEmoji(emoji: string) {
    this.grpEmoji = emoji;
  }

  addMember() {
    if (!this.memberInputText.trim()) {
      this.showMemberError = true;
      return;
    }
    this.showMemberError = false;
    this.newMembers.push({ id: this.generateId(), name: this.memberInputText.trim() });
    this.memberInputText = '';
  }

  removeMember(index: number) {
    this.newMembers.splice(index, 1);
  }

  submitCreateGroup() {
    if (!this.grpName.trim()) return;
    this.submitted = true;
    if (this.newMembers.length > 0) {
      this.newMembers.forEach(member => {
        this.storageService.saveUser(member);
      });
    }

    const group = {
      id: this.generateId(),
      name: this.grpName.trim(),
      emoji: this.grpEmoji,
      memberIds: this.newMembers.map(m => m.id),
      createdAt: new Date().toISOString()
    };

    this.storageService.saveGroup(group);
    this.submit.emit(group);
    this.close.emit();
  }

  getUserInitials(name: string): string {
    return this.uiUtils.userInitials(name);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
}
