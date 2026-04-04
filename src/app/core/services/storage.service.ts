import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;  // userId
  splitBetween: string[]; // userIds
  date: string; // ISO string
  category: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  emoji: string;
  memberIds: string[];
  createdAt: string;
}

export interface Balance {
  userId: string;
  amount: number;  // positive=owed to, negative=owes
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _key = 'splitsmart_v2';
  private _state: any = null;

  private _defaultState() {
    return { groups: [], users: {}, expenses: [] };
  }

  load() {
    try {
      const raw = localStorage.getItem(this._key);
      this._state = raw ? JSON.parse(raw) : this._defaultState();
    } catch(e) {
      this._state = this._defaultState();
    }
    return this._state;
  }

  save() {
    try {
      localStorage.setItem(this._key, JSON.stringify(this._state));
    } catch(e) {}
  }

  getState() {
    return this._state || this.load();
  }

  /** @returns {Group[]} */
  getGroups() {
    return this.getState().groups || [];
  }

  /** @returns {Group|undefined} */
  getGroup(id: string) {
    return this.getGroups().find((g: { id: string }) => g.id === id);
  }

  /** @returns {User} */
  getUser(id: string) {
    return (this.getState().users || {})[id];
  }

  getUsers() {
    return this.getState().users || {};
  }

  /** @returns {Expense[]} */
  getExpenses(groupId: string) {
    return (this.getState().expenses || []).filter((e: { groupId: string }) => e.groupId === groupId);
  }

  saveGroup(group: Group) {
    const s = this.getState();
    const idx = s.groups.findIndex((g: Group) => g.id === group.id);
    if (idx >= 0) {
      s.groups[idx] = group;
    } else {
      s.groups.push(group);
    }
    this.save();
    return group;
  }

  deleteGroup(id: string) {
    const s = this.getState();
    s.groups = s.groups.filter((g: Group) => g.id !== id);
    s.expenses = s.expenses.filter((e: Expense) => e.groupId !== id);
    this.save();
  }

  saveUser(user: User) {
    const s = this.getState();
    if (!s.users) {
      s.users = {};
    }
    s.users[user.id] = user;
    this.save();
    return user;
  }

  saveExpense(expense: Expense) {
    const s = this.getState();
    const idx = s.expenses.findIndex((e: Expense) => e.id === expense.id);
    if (idx >= 0) {
      s.expenses[idx] = expense;
    } else {
      s.expenses.push(expense);
    }
    this.save();
    return expense;
  }

  deleteExpense(id: string) {
    const s = this.getState();
    s.expenses = s.expenses.filter((e: Expense) => e.id !== id);
    this.save();
  }
}
