import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AccessPage} from './access.page';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {By} from '@angular/platform-browser';
import {of, throwError} from 'rxjs';
import {User} from '../../models/user';
import {Role} from '../../models/role.enum';
import { HttpErrorResponse } from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {provideTranslateService, TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth.service';

describe('AccessPage', () => {
  let component: AccessPage;
  let fixture: ComponentFixture<AccessPage>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {

    userServiceMock = jasmine.createSpyObj('UserService', ['requestAccess']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, AccessPage],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['setUser']) },
        provideRouter([]),
        provideTranslateService()
      ]
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', {
      ACCESS: {CODE_PLACEHOLDER: 'Codigo', ACCESS_BTN: 'Acceder'},
      ERRORS: {USER_CODE_INVALID: 'Codigo no Valido'}
    });
    translate.use('es');

    fixture = TestBed.createComponent(AccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind input to accessCode', async () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'abcd';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.accessCode).toBe('abcd');
  });

  it('should show error if code is incorrect', () => {

    userServiceMock.requestAccess.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'User not valid: wrong', errorCodes: ['user.code.invalid'] }
    })));

    component.accessCode = 'wrong';
    component.onSubmitAccess();
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css('.error-text')).nativeElement;
    expect(errorText.textContent).toContain('Codigo no Valido');
  });

  it('should display translated access labels', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    expect(input.placeholder).toBe('Codigo');
    expect(button.textContent).toContain('Acceder');
  });

  it('should not show error if code is correct', () => {
    const user: User = {id: 1, name: "Luis", code: "1234", roles: [Role.ADMIN], token: ""}
    const loginResponse = of(user);
    userServiceMock.requestAccess.and.returnValue(loginResponse);

    component.accessCode = '1234';
    component.onSubmitAccess();
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css('.error-text')).nativeElement;
    expect(errorText.textContent.trim()).toBe('');
  });
});
