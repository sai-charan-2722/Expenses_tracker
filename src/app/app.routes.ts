import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { GroupDetailComponent } from './features/group-detail/group-detail/group-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'group/:id', component: GroupDetailComponent }
];
