import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    @ViewChild('authForm') authForm: NgForm;
    isLoginMode = true;
    isLoading = false;
    error:string = null;

    constructor(private authService: AuthService) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit() {
        if(!this.authForm.valid){
            return;
        }
        const email = this.authForm.value.email;
        const password = this.authForm.value.password;
        let authObservable: Observable<AuthResponseData>;

        this.isLoading = true;

        if(this.isLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signup(email, password);
        }

        authObservable.subscribe(
            responseData => {
                console.log(responseData);
                this.isLoading = false;
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            }
        )

        this.authForm.reset();
    }
}