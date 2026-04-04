import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { BalanceService } from '../../../core/services/balance.service';
import { UiUtilsService } from '../../../core/services/ui-utils.service';
import { NavStateService } from '../../../core/services/nav-state.service';
import { CommonModule } from '@angular/common';
import { ExpensesTabComponent } from '../tabs/expenses-tab/expenses-tab.component';
import { BalancesTabComponent } from '../tabs/balances-tab/balances-tab.component';
import { SettleTabComponent } from '../tabs/settle-tab/settle-tab.component';
import { MembersTabComponent } from '../tabs/members-tab/members-tab.component';
import { AddExpenseModalComponent } from '../../../shared/components/add-expense-modal/add-expense-modal.component';
import { AddMemberModalComponent } from '../../../shared/components/add-member-modal/add-member-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, ExpensesTabComponent, BalancesTabComponent, SettleTabComponent, MembersTabComponent, AddExpenseModalComponent, AddMemberModalComponent, ConfirmModalComponent],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.scss'
})
export class GroupDetailComponent implements OnInit {
  group: any = null;
  expenses: any[] = [];
  members: any[] = [];
  balances: any[] = [];
  settlements: any[] = [];
  totalExpenses: number = 0;
  avgPerPerson: number = 0;
  currentTab: string = 'expenses';
  colorIdx: number = 0;

  // Modal state
  showAddExpenseModal = false;
  showAddMemberModal = false;
  showConfirmModal = false;
  confirmMessage = '';
  confirmType: 'danger' | 'warning' = 'danger';
  pendingDeleteGroupId = '';
  pendingDeleteExpenseId = '';
  pendingRemoveUserId = '';

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private balanceService: BalanceService,
    private uiUtils: UiUtilsService,
    private navState: NavStateService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    // Listen for nav-initiated add member / add expense
    this.navState.addMember.subscribe(() => this.onAddMember());
    this.navState.addExpense.subscribe(() => this.onAddExpense());
  }

  ngOnInit() {
    const groupId = this.route.snapshot.paramMap.get('id');
    if (groupId) {
      this.loadGroup(groupId);
      this.navState.setCurrentGroup(groupId);
      this.navState.setCurrentTab('expenses');
    } else {
      this.router.navigate(['/']);
    }
  }

  loadGroup(groupId: string) {
    this.group = this.storageService.getGroup(groupId);
    if (!this.group) {
      this.router.navigate(['/']);
      return;
    }

    this.expenses = this.storageService.getExpenses(groupId);
    this.members = this.group.memberIds.map((id: string) => this.storageService.getUser(id)).filter(Boolean);
    this.balances = this.balanceService.calculateBalances(groupId);
    this.settlements = this.balanceService.calculateSettlements(this.balances);
    this.totalExpenses = this.balanceService.getTotalExpenses(groupId);
    this.avgPerPerson = this.members.length ? this.totalExpenses / this.members.length : 0;
    this.colorIdx = groupId.charCodeAt(0) % 6;
  }

  switchTab(tab: string) {
    this.currentTab = tab;
    this.navState.setCurrentTab(tab);
  }

  getTabLabel(tab: string): string {
    const labels: Record<string, string> = {
      expenses: 'Expenses',
      balances: 'Balances',
      settle: 'Settle Up',
      members: 'Members'
    };
    return labels[tab] || tab;
  }

  isTabActive(tab: string): boolean {
    return this.currentTab === tab;
  }

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

  avatarColor(userId: string): string {
    return this.uiUtils.avatarColor(userId);
  }

  userInitials(name: string): string {
    return this.uiUtils.userInitials(name);
  }

  // ── Modal methods ──
  onAddExpense() {
    this.showAddExpenseModal = true;
  }

  closeAddExpenseModal() {
    this.showAddExpenseModal = false;
  }

  handleAddExpense() {
    this.showAddExpenseModal = false;
    this.snackbarService.show('Expense added!', 'success');
    if (this.group) this.loadGroup(this.group.id);
  }

  onAddMember() {
    this.showAddMemberModal = true;
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
  }

  handleAddMember() {
    this.showAddMemberModal = false;
    this.snackbarService.show('Member(s) added!', 'success');
    if (this.group) this.loadGroup(this.group.id);
  }

  onDeleteExpense(expenseId: string) {
    this.confirmMessage = 'Delete this expense?';
    this.confirmType = 'danger';
    this.pendingDeleteExpenseId = expenseId;
    this.showConfirmModal = true;
  }

  onRemoveMemberModal(details: {groupId: string, userId: string}) {
    const user = this.storageService.getUser(details.userId);
    this.confirmMessage = `Remove "${user?.name}" from the group?`;
    this.confirmType = 'warning';
    this.pendingRemoveUserId = details.userId;
    this.showConfirmModal = true;
  }

  onConfirm() {
    if (this.pendingDeleteExpenseId) {
      this.storageService.deleteExpense(this.pendingDeleteExpenseId);
      this.pendingDeleteExpenseId = '';
      this.snackbarService.show('Expense deleted', 'success');
      if (this.group) this.loadGroup(this.group.id);
    } else if (this.pendingRemoveUserId) {
      const group = this.storageService.getGroup(this.group?.id);
      if (group) {
        group.memberIds = group.memberIds.filter((id: string) => id !== this.pendingRemoveUserId);
        this.storageService.saveGroup(group);
        this.pendingRemoveUserId = '';
        this.snackbarService.show('Member removed', 'success');
        this.loadGroup(this.group.id);
      }
    }
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.pendingDeleteExpenseId = '';
    this.pendingRemoveUserId = '';
  }
}
