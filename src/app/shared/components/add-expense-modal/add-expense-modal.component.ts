import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-add-expense-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-expense-modal.component.html',
  styleUrl: './add-expense-modal.component.scss'
})
export class AddExpenseModalComponent {
  @Input() groupId = '';
  @Input() initialPayer = '';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  categories = [
    { id: 'food', label: 'Food & Drinks' },
    { id: 'travel', label: 'Travel' },
    { id: 'accommodation', label: 'Accommodation' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'other', label: 'Other' },
  ];
  members: any[] = [];
  splitSelected: string[] = [];

  titleVal = '';
  amountVal = '';
  categoryVal = 'food';
  paidByVal = '';
  dateVal = '';

  showTitleError = false;
  showAmountError = false;
  showPayerError = false;
  showSplitError = false;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const group = this.storageService.getGroup(this.groupId);
    if (group) {
      this.members = group.memberIds.map((id: string) => this.storageService.getUser(id)).filter(Boolean);
      this.splitSelected = this.members.map((m: any) => m.id);
      if (this.members.length > 0) this.paidByVal = this.members[0].id;
    }
  }

  toggleSplit(userId: string) {
    const idx = this.splitSelected.indexOf(userId);
    if (idx >= 0) this.splitSelected.splice(idx, 1);
    else this.splitSelected.push(userId);
  }

  validate(): boolean {
    this.showTitleError = !this.titleVal.trim();
    this.showAmountError = !this.amountVal || Number(this.amountVal) <= 0;
    this.showPayerError = !this.paidByVal;
    this.showSplitError = this.splitSelected.length === 0;
    return !this.showTitleError && !this.showAmountError && !this.showPayerError && !this.showSplitError;
  }

  onSubmit() {
    if (!this.validate()) return;

    const expense = {
      id: this.generateId(),
      groupId: this.groupId,
      title: this.titleVal.trim(),
      amount: parseFloat(this.amountVal),
      paidBy: this.paidByVal,
      splitBetween: [...this.splitSelected],
      date: this.dateVal ? new Date(this.dateVal + 'T00:00:00').toISOString() : new Date().toISOString(),
      category: this.categoryVal,
      createdAt: new Date().toISOString(),
    };

    this.storageService.saveExpense(expense);
    this.submit.emit();
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
}
