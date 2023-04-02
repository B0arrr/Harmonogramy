import { AddComponent } from './add/add.component';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { NgModule } from '@angular/core';
import { PositionRoutingModule } from './position-routing.module';
import { PositionsComponent } from './positions/positions.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, PositionRoutingModule],
  declarations: [PositionsComponent, AddComponent, EditComponent]
})
export class PositionModule {}
