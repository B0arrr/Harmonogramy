import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentsComponent } from './employments.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { EmploymentService } from '../../../services/employment.service';
import { of } from 'rxjs';

describe('EmploymentsComponent', () => {
  let component: EmploymentsComponent;
  let fixture: ComponentFixture<EmploymentsComponent>;

  const fakeEmploymentService = createSpyObj('EmploymentService', [
    'getAllEmployments'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmploymentsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: EmploymentService,
          useValue: fakeEmploymentService
        }
      ]
    }).compileComponents();

    fakeEmploymentService.getAllEmployments.and.returnValue(of([]));

    fixture = TestBed.createComponent(EmploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.employments).not.toBeNull();
    expect(fakeEmploymentService.getAllEmployments).toHaveBeenCalled();
  });
});
