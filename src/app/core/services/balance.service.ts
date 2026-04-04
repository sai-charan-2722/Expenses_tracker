import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface Balance {
  userId: string;
  amount: number;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  constructor(private storageService: StorageService) { }

  /**
   * Calculate per-member balance for a group
   * @param {string} groupId
   * @returns {Balance[]}
   */
  calculateBalances(groupId: string): Balance[] {
    const group = this.storageService.getGroup(groupId);
    if (!group) return [];
    const expenses = this.storageService.getExpenses(groupId);
    const balMap: Record<string, number> = {};
    group.memberIds.forEach((uid: string) => { balMap[uid] = 0; });

    expenses.forEach((exp: any) => {
      const share = Math.round((exp.amount / exp.splitBetween.length) * 100) / 100;
      const remainder = Math.round((exp.amount - share * exp.splitBetween.length) * 100) / 100;

      // Payer gets credit
      balMap[exp.paidBy] = (balMap[exp.paidBy] || 0) + exp.amount;

      // Each person in split owes their share
      exp.splitBetween.forEach((uid: string, i: number) => {
        const thisShare = i === 0 ? share + remainder : share;
        balMap[uid] = (balMap[uid] || 0) - thisShare;
      });
    });

    return Object.entries(balMap).map(([userId, amount]) => ({
      userId,
      amount: Math.round(amount * 100) / 100
    }));
  }

  /**
   * Minimise transactions settlement algorithm
   * @param {Balance[]} balances
   * @returns {Settlement[]}
   */
  calculateSettlements(balances: Balance[]): Settlement[] {
    const debtors = balances.filter(b => b.amount < -0.001).map(b => ({ ...b, amount: Math.abs(b.amount) }));
    const creditors = balances.filter(b => b.amount > 0.001).map(b => ({ ...b }));

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: Settlement[] = [];
    let di = 0, ci = 0;

    while (di < debtors.length && ci < creditors.length) {
      const d = debtors[di];
      const c = creditors[ci];
      const amt = Math.min(d.amount, c.amount);
      const rounded = Math.round(amt * 100) / 100;

      if (rounded > 0.01) {
        settlements.push({ from: d.userId, to: c.userId, amount: rounded });
      }

      d.amount = Math.round((d.amount - amt) * 100) / 100;
      c.amount = Math.round((c.amount - amt) * 100) / 100;

      if (d.amount <= 0.01) di++;
      if (c.amount <= 0.01) ci++;
    }

    return settlements;
  }

  getTotalExpenses(groupId: string): number {
    return this.storageService.getExpenses(groupId)
      .reduce((s: number, e: any) => s + e.amount, 0);
  }
}
