import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionsComponent } from './positions.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { PositionService } from '../../../services/position.service';
import { of } from 'rxjs';

describe('PositionsComponent', () => {
  let component: PositionsComponent;
  let fixture: ComponentFixture<PositionsComponent>;

  const fakePositionService = createSpyObj('PositionService', [
    'getAllPositions'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositionsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: PositionService,
          useValue: fakePositionService
        }
      ]
    }).compileComponents();

    fakePositionService.getAllPositions.and.returnValue(of([]));

    fixture = TestBed.createComponent(PositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.positions).not.toBeNull();
    expect(fakePositionService.getAllPositions).toHaveBeenCalled();
  });
});
