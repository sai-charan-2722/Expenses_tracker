import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavStateService {
  private _currentGroup: string | null = null;
  private _currentTab: string = 'expenses';

  // Events for nav-initiated actions
  createGroup = new EventEmitter<void>();
  addMember = new EventEmitter<void>();
  addExpense = new EventEmitter<void>();

  constructor() { }

  getCurrentGroup(): string | null {
    return this._currentGroup;
  }

  setCurrentGroup(groupId: string | null): void {
    this._currentGroup = groupId;
  }

  getCurrentTab(): string {
    return this._currentTab;
  }

  setCurrentTab(tab: string): void {
    this._currentTab = tab;
  }

  navigate(page: string, groupId: string | null = null): void {
    if (page === 'home') {
      this._currentGroup = null;
      this._currentTab = 'expenses';
    } else if (page === 'group' && groupId) {
      this._currentGroup = groupId;
      this._currentTab = 'expenses';
    }
  }
}
