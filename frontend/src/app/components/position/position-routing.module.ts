import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { LayoutComponent } from '../layout/layout.component';
import { NgModule } from '@angular/core';
import { PositionsComponent } from './positions/positions.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: PositionsComponent },
      { path: 'add', component: AddComponent },
      { path: 'edit/:id', component: EditComponent },

      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionRoutingModule {}
