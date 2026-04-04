import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../../../../core/services/storage.service';
import { UiUtilsService } from '../../../../core/services/ui-utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-tab.component.html',
  styleUrl: './members-tab.component.scss'
})
export class MembersTabComponent {
  @Input() groupId: string = '';
  @Input() members: any[] = [];
  @Input() balances: any[] = [];
  @Output() openAddMember = new EventEmitter<void>();
  @Output() removeMember = new EventEmitter<{groupId: string, userId: string}>();

  constructor(
    private storageService: StorageService,
    private uiUtils: UiUtilsService
  ) {}

  formatAmount(n: number): string {
    return this.uiUtils.formatAmount(n);
  }

  getUserName(userId: string): string {
    const user = this.storageService.getUser(userId);
    return user ? user.name : userId;
  }

  getUserInitials(userId: string): string {
    const user = this.storageService.getUser(userId);
    return this.uiUtils.userInitials(user?.name || '?');
  }

  getAvatarColor(userId: string): string {
    return this.uiUtils.avatarColor(userId);
  }

  getBalanceAmount(userId: string): number {
    const balance = this.balances.find(b => b.userId === userId);
    return balance ? balance.amount : 0;
  }

  getBalanceChipClass(amount: number): string {
    if (amount > 0.01) return 'chip chip-success';
    if (amount < -0.01) return 'chip chip-danger';
    return 'chip chip-gray';
  }

  getBalanceChipText(amount: number): string {
    if (amount > 0.01) return `+${this.formatAmount(amount)}`;
    if (amount < -0.01) return this.formatAmount(Math.abs(amount));
    return 'Settled';
  }

  getPaidCount(userId: string): number {
    const expenses = this.storageService.getExpenses(this.groupId);
    return expenses.filter((e: any) => e.paidBy === userId).length;
  }

  onAddMember() {
    this.openAddMember.emit();
  }

  onRemoveMember(userId: string) {
    this.removeMember.emit({groupId: this.groupId, userId});
  }
}
