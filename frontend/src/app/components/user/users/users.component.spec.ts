import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import createSpyObj = jasmine.createSpyObj;
import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  const fakeAccountService = createSpyObj('AccountService', ['']);
  const fakeUserService = createSpyObj('UserService', [
    'activateUser',
    'getAllUsers'
  ]);
  const fakeRouter = createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: AccountService,
          useValue: fakeAccountService
        },
        {
          provide: UserService,
          useValue: fakeUserService
        },
        {
          provide: Router,
          useValue: fakeRouter
        }
      ]
    }).compileComponents();

    fakeUserService.getAllUsers.and.returnValue(of([]));
    fakeRouter.navigateByUrl.and.returnValue(
      new Promise((resolve: any): any => resolve({ exists: true }))
    );
    fakeAccountService.user = of({});

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init component', () => {
      component.ngOnInit();
      expect(component.users).not.toBeNull();
    });
  });

  describe('activate', () => {
    it('should activate user', fakeAsync(() => {
      fixture.detectChanges();
      component.activate(1);
      tick();
      expect(fakeUserService.activateUser).toHaveBeenCalled();
      expect(fakeRouter.navigateByUrl).toHaveBeenCalled();
      expect(fakeRouter.navigate).toHaveBeenCalled();
    }));
  });
});
