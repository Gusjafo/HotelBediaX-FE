import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        router = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [{ provide: Router, useValue: router }]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component and initialize the form', () => {
        expect(component).toBeTruthy();
        expect(component.form.contains('email')).toBeTrue();
        expect(component.form.contains('password')).toBeTrue();
    });

    it('should mark form as touched when submitting invalid form', () => {
        const markSpy = spyOn(component.form, 'markAllAsTouched');
        component.submit();
        expect(markSpy).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to dashboard on valid submit', () => {
        component.form.setValue({ email: 'test@example.com', password: '123456' });
        component.submit();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
});
