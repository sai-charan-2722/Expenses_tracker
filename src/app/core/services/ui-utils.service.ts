import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UiUtilsService {
  private COLORS = ['av-0','av-1','av-2','av-3','av-4','av-5'];
  private CATEGORIES = [
    { id: 'food', label: 'Food & Drinks', emoji: '🍕' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'accommodation', label: 'Accommodation', emoji: '🏠' },
    { id: 'entertainment', label: 'Entertainment', emoji: '🎉' },
    { id: 'shopping', label: 'Shopping', emoji: '🛒' },
    { id: 'utilities', label: 'Utilities', emoji: '💡' },
    { id: 'other', label: 'Other', emoji: '💳' },
  ];

  constructor(private storageService: StorageService) { }

  getCatEmoji(cat: string): string {
    return (this.CATEGORIES.find(c => c.id === cat) || this.CATEGORIES[6]).emoji;
  }

  avatarColor(userId: string): string {
    let hash = 0;
    for (let c of userId) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
    return this.COLORS[hash % this.COLORS.length];
  }

  userInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
    return name.slice(0,2).toUpperCase();
  }

  formatAmount(n: number): string {
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
