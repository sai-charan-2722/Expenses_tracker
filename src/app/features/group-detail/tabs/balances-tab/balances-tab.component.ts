import { Component, Input } from '@angular/core';
import { StorageService } from '../../../../core/services/storage.service';
import { UiUtilsService } from '../../../../core/services/ui-utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balances-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balances-tab.component.html',
  styleUrl: './balances-tab.component.scss'
})
export class BalancesTabComponent {
  @Input() balances: any[] = [];

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

  avatarColor(userId: string): string {
    return this.uiUtils.avatarColor(userId);
  }

  getInitials(userId: string): string {
    const user = this.storageService.getUser(userId);
    return this.uiUtils.userInitials(user?.name || '?');
  }

  getBalanceClass(amount: number): string {
    if (amount > 0.01) return 'positive';
    if (amount < -0.01) return 'negative';
    return 'neutral';
  }

  getBalanceDescription(amount: number): string {
    if (amount > 0.01) return `gets back ${this.formatAmount(amount)}`;
    if (amount < -0.01) return `owes ${this.formatAmount(Math.abs(amount))}`;
    return 'settled up';
  }

  getBalanceAmountPrefix(amount: number): string {
    return amount > 0.01 ? '+' : '';
  }
}
