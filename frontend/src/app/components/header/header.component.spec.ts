import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AccountService } from '../../services/account.service';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const fakeAccountService = createSpyObj('AccountService', [
    'logout',
    'tokenValue',
    'token'
  ]);

  fakeAccountService.token = of({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: AccountService,
          useValue: fakeAccountService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    it('should call logout', () => {
      component.logout();
      expect(fakeAccountService.logout).toHaveBeenCalled();
    });
  });
});
