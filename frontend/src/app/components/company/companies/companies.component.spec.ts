import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesComponent } from './companies.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { CompanyService } from '../../../services/company.service';
import { of } from 'rxjs';

describe('CompaniesComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;

  const fakeCompanyService = createSpyObj('CompanyService', [
    'getAllCompanies'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompaniesComponent],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: CompanyService,
          useValue: fakeCompanyService
        }
      ]
    }).compileComponents();

    fakeCompanyService.getAllCompanies.and.returnValue(of([]));

    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.companies).not.toBeNull();
    expect(fakeCompanyService.getAllCompanies).toHaveBeenCalled();
  });
});
