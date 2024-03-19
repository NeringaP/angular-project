import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import * as fromAuthActions from "./auth.actions";
import { environment } from "src/environments/environment";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (email: string, id: string, token: string, expiresIn: number) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    return fromAuthActions.authenticateSuccess({
            user: {
                email: email, 
                id: id, 
                token: token, 
                expirationDate: expirationDate
            }
        });
};

const handleError = (errorResponse) => {
    let errorMessage = 'An unknown error occured.';
    if(!errorResponse.error || !errorResponse.error.error) {
        return of(fromAuthActions.authenticateFail({message: errorMessage}));
    }
    switch(errorResponse.error.error.message) {
        case 'INVALID_LOGIN_CREDENTIALS':
            errorMessage = 'The email or password is invalid.';
            break;
        case 'EMAIL_EXISTS':
            errorMessage = 'The email address is already in use by another account.';
            break;
        
    }
    return of(fromAuthActions.authenticateFail({message: errorMessage}));
}

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
    
    authSignup = createEffect(
        () => 
            this.actions$.pipe(
                ofType(fromAuthActions.signupStart),
                switchMap((signupData) => {
                    return this.http.post<AuthResponseData>(
                        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                        {
                            email: signupData.credentials.email,
                            password: signupData.credentials.password,
                            returnSecureToken: true
                        }
                    ).pipe(
                        map(responseData => {
                            return handleAuthentication(responseData.email, responseData.idToken, responseData.idToken, +responseData.expiresIn);
                        }),
                        catchError(errorResponse => {
                            return handleError(errorResponse)
                        })
                    );
                })
            )
    );


    authLogin = createEffect(
        () => 
            this.actions$.pipe(
                ofType(fromAuthActions.loginStart),
                switchMap((authData) => {
                    return this.http.post<AuthResponseData>(
                        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                        {
                            email: authData.credentials.email,
                            password: authData.credentials.password,
                            returnSecureToken: true
                        }
                    ).pipe(
                        map(responseData => {
                            return handleAuthentication(responseData.email, responseData.idToken, responseData.idToken, +responseData.expiresIn);
                        }),
                        catchError(errorResponse => {
                            return handleError(errorResponse)
                        })
                    );
                })
            )
    );

    authRedirect = createEffect(
        () => 
            this.actions$.pipe(
                ofType(fromAuthActions.authenticateSuccess, fromAuthActions.logout),
                tap(() => {
                    this.router.navigate(['/']);
                })
            ),
            {dispatch: false}
    )


    
}