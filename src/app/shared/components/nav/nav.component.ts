import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NavStateService } from '../../../core/services/nav-state.service';
import { StorageService } from '../../../core/services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  @Output() createGroup = new EventEmitter<void>();
  @Output() addMember = new EventEmitter<void>();
  @Output() addExpense = new EventEmitter<void>();

  constructor(private router: Router, private navState: NavStateService, private storageService: StorageService) {}

  navigateHome() {
    this.router.navigate(['/']);
    this.navState.navigate('home');
  }

  get showHomeActions(): boolean {
    return this.navState.getCurrentGroup() === null;
  }

  get currentGroup() {
    const groupId = this.navState.getCurrentGroup();
    return groupId ? this.storageService.getGroup(groupId) : null;
  }
}
