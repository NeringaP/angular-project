import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer"
import * as fromAuthActions from "./store/auth.actions";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
    @ViewChild('authForm') authForm: NgForm;
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private storeSub: Subscription;

    constructor(private store: Store<fromApp.AppState>) {}
    
    ngOnInit(): void {
        this.storeSub = this.store.select('auth').subscribe(authState => {
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

        this.isLoading = true;

        if(this.isLoginMode) {
            this.store.dispatch(fromAuthActions.loginStart({credentials: {email: email, password: password}}))
        } else {
            this.store.dispatch(fromAuthActions.signupStart({credentials: {email: email, password: password}}))
        }

        this.authForm.reset();
    }

    onHandleError() {
        this.store.dispatch(fromAuthActions.clearError());
    }

    ngOnDestroy(): void {
        if(this.storeSub) {
            this.storeSub.unsubscribe();
        }

    }
}