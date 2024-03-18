import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer"
import * as fromAuthActions from "./store/auth.actions";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit{
    @ViewChild('authForm') authForm: NgForm;
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}
    
    ngOnInit(): void {
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
        })

    }

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
            // authObservable = this.authService.login(email, password);
            this.store.dispatch(fromAuthActions.loginStart({credentials: {email: email, password: password}}))
        } else {
            authObservable = this.authService.signup(email, password);
        }

        
        // authObservable.subscribe(
        //     responseData => {
        //         console.log(responseData);
        //         this.isLoading = false;
        //         this.router.navigate(['/recipes']);
        //     },
        //     errorMessage => {
        //         console.log(errorMessage);
        //         this.error = errorMessage;
        //         this.isLoading = false;
        //     }
        // )

        this.authForm.reset();
    }

    onHandleError() {
        this.error = null;
    }
}