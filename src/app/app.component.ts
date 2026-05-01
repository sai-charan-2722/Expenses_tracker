import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { NavComponent } from './shared/components/nav/nav.component';
import { NavStateService } from './core/services/nav-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Expenses_tracker';

  constructor(private navState: NavStateService) {}

  onCreateGroup(): void {
    this.navState.createGroup.emit();
  }

  onAddMember(): void {
    this.navState.addMember.emit();
  }

  onAddExpense(): void {
    this.navState.addExpense.emit();
  }
}
