import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../../../../core/services/storage.service';
import { UiUtilsService } from '../../../../core/services/ui-utils.service';
import { CommonModule } from '@angular/common';
import { SortByDatePipe } from '../../../../shared/pipes/sort-by-date.pipe';


@Component({
  selector: 'app-expenses-tab',
  standalone: true,
  imports: [CommonModule, SortByDatePipe],
  templateUrl: './expenses-tab.component.html',
  styleUrl: './expenses-tab.component.scss'
})
export class ExpensesTabComponent {
  @Input() groupId: string = '';
  @Input() expenses: any[] = [];
  @Output() openAddExpense = new EventEmitter<void>();
  @Output() deleteExpense = new EventEmitter<string>();

  constructor(
    private storageService: StorageService,
    private uiUtils: UiUtilsService
  ) {}

  // Helper methods for UI
  formatAmount(n: number): string {
    return this.uiUtils.formatAmount(n);
  }

  formatDate(iso: string): string {
    return this.uiUtils.formatDate(iso);
  }

  getCatEmoji(cat: string): string {
    return this.uiUtils.getCatEmoji(cat);
  }

  // Methods to handle events
  onAddExpense() {
    this.openAddExpense.emit();
  }

  onDeleteExpense(expenseId: string) {
    this.deleteExpense.emit(expenseId);
  }

  getUserName(userId: string): string {
    const user = this.storageService.getUser(userId);
    return user ? user.name : userId;
  }
}
