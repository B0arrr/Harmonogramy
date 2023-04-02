import { Component } from '@angular/core';
import { Position } from '../../../models/position';
import { PositionService } from '../../../services/position.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent {
  positions?: Position[] | null;
  constructor(private positionService: PositionService) {
    this.positionService
      .getAllPositions()
      .subscribe((positions) => (this.positions = positions));
  }
}
