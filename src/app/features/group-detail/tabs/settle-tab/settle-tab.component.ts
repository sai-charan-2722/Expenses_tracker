import { Component, Input } from '@angular/core';
import { StorageService } from '../../../../core/services/storage.service';
import { UiUtilsService } from '../../../../core/services/ui-utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settle-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settle-tab.component.html',
  styleUrl: './settle-tab.component.scss'
})
export class SettleTabComponent {
  @Input() settlements: any[] = [];

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
}
