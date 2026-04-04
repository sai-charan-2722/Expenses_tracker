import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { NavStateService } from '../../../core/services/nav-state.service';
import { UiUtilsService } from '../../../core/services/ui-utils.service';
import { CreateGroupModalComponent } from '../components/create-group-modal/create-group-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CreateGroupModalComponent, ConfirmModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  groups: any[] = [];
  showCreateGroupModal = false;
  showConfirmModal = false;
  confirmMessage = '';
  pendingDeleteGroupId = '';

  constructor(
    private storageService: StorageService,
    private router: Router,
    private navState: NavStateService,
    private uiUtils: UiUtilsService,
    private snackbarService: SnackbarService
  ) {
    // Listen for nav-initiated create-group requests
    this.navState.createGroup.subscribe(() => {
      this.showCreateGroupModal = true;
    });
    this.loadGroups();
  }

  loadGroups() {
    this.groups = this.storageService.getGroups();
  }

  navigateToGroup(groupId: string) {
    this.router.navigate(['/group', groupId]);
    this.navState.navigate('group', groupId);
  }

  openCreateGroupModal() {
    this.showCreateGroupModal = true;
  }

  closeCreateGroupModal() {
    this.showCreateGroupModal = false;
  }

  handleCreateGroup(group: any) {
    for (const memberId of group.memberIds) {
      const user = this.storageService.getUser(memberId);
      if (user) {
        this.storageService.saveUser(user);
      }
    }
    if (!this.storageService.getGroup(group.id)) {
      this.storageService.saveGroup(group);
    }
    this.showCreateGroupModal = false;
    this.loadGroups();
    this.snackbarService.show('Group created!', 'success');
  }

  openDeleteGroupModal(event: Event, groupId: string) {
    event.stopPropagation();
    const group = this.storageService.getGroup(groupId);
    this.confirmMessage = `Delete "${group?.name}"? This cannot be undone.`;
    this.pendingDeleteGroupId = groupId;
    this.showConfirmModal = true;
  }

  onConfirmDelete() {
    if (this.pendingDeleteGroupId) {
      this.storageService.deleteGroup(this.pendingDeleteGroupId);
      this.pendingDeleteGroupId = '';
      this.loadGroups();
      this.snackbarService.show('Group deleted', 'success');
      this.closeConfirmModal();
    }
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.pendingDeleteGroupId = '';
  }

  // Helper methods for UI
  formatAmount(n: number): string {
    return this.uiUtils.formatAmount(n);
  }

  getCatEmoji(cat: string): string {
    return this.uiUtils.getCatEmoji(cat);
  }

  avatarColor(userId: string): string {
    return this.uiUtils.avatarColor(userId);
  }

  userInitials(name: string): string {
    return this.uiUtils.userInitials(name);
  }

  // Additional helper methods needed for the template
  getTotalAmount(groupId: string): number {
    const expenses = this.storageService.getExpenses(groupId);
    return expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
  }

  getExpenseCount(groupId: string): number {
    return this.storageService.getExpenses(groupId).length;
  }

  getUserInitials(userId: string): string {
    const user = this.storageService.getUser(userId);
    if (!user) return '?';
    const parts = user.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
    }
    return user.name.slice(0,2).toUpperCase();
  }

  getMemberNames(memberIds: string[]): string {
    return memberIds.map(id => {
      const user = this.storageService.getUser(id);
      return user ? user.name.split(' ')[0] : '?';
    }).join(', ');
  }

  getMemberCountTextOffset(count: number): number {
    if (count <= 4) {
      return count * 8 + 8;
    } else {
      return 4 * 8 + 8;
    }
  }
}
