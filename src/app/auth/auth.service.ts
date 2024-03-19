import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";

import { User } from "./user.model";
import { environment } from "src/environments/environment";
import * as fromApp from "../store/app.reducer"
import * as fromAuthActions from "./store/auth.actions";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    // user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}

    // signup(userEmail: string, userPassword: string) {
    //     return this.http.post<AuthResponseData>(
    //         'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
    //         {
    //             email: userEmail,
    //             password: userPassword,
    //             returnSecureToken: true
    //         }
    //     ).pipe(
    //         catchError(this.handleError),
    //         tap(responseData => {
    //             this.handleAuthentication(
    //                 responseData.email,
    //                 responseData.localId,
    //                 responseData.idToken,
    //                 responseData.expiresIn
    //             );
    //         })
    //     );
    // }

    // login(userEmail: string, userPassword: string) {
    //     return this.http.post<AuthResponseData>(
    //         'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
    //         {
    //             email: userEmail,
    //             password: userPassword,
    //             returnSecureToken: true
    //         }
    //     ).pipe(
    //         catchError(this.handleError),
    //         tap(responseData => {
    //             this.handleAuthentication(
    //                 responseData.email,
    //                 responseData.localId,
    //                 responseData.idToken,
    //                 responseData.expiresIn
    //             );
    //         })
    //     );
    // }

    autoLogin() {
        const userData: {
            email: string, 
            id: string, 
            _token: string, 
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );

        if(loadedUser.token) {
            // this.user.next(loadedUser);
            this.store.dispatch(fromAuthActions.authenticateSuccess({
                user: {
                    email: loadedUser.email,
                     id: loadedUser.id, 
                     token: loadedUser.token, 
                     expirationDate: new Date(userData._tokenExpirationDate)
                    }
            }));
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        // this.user.next(null);
        this.store.dispatch(fromAuthActions.logout());
        //this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
       this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleAuthentication(email: string, id: string, token: string, expiresIn: string) {
        const expirationDate = new Date(
            new Date().getTime() + +expiresIn * 1000
        );
        const user = new User(
            email,
            id,
            token,
            expirationDate
        );
        // this.user.next(user);
        this.store.dispatch(
            fromAuthActions.authenticateSuccess(
                {user: {email: email, id: id, token: token, expirationDate: expirationDate}}
            )
        )
        this.autoLogout(+expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured.';
        if(!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch(errorResponse.error.error.message) {
            case 'INVALID_LOGIN_CREDENTIALS':
                errorMessage = 'The email or password is invalid.';
                break;
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account.';
                break;
            
        }
        return throwError(errorMessage);
    }
}