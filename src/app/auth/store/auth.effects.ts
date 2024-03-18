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

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
    
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
                            const expirationDate = new Date(
                             new Date().getTime() + +responseData.expiresIn * 1000
                            );
                            return fromAuthActions.login({
                                    user: {
                                        email: responseData.email, 
                                        id: responseData.localId, 
                                        token: responseData.idToken, 
                                        expirationDate: expirationDate
                                    }
                                });
                        }),
                        catchError(errorResponse => {
                            let errorMessage = 'An unknown error occured.';
                            if(!errorResponse.error || !errorResponse.error.error) {
                                return of(fromAuthActions.loginFail({message: errorMessage}));
                            }
                            switch(errorResponse.error.error.message) {
                                case 'INVALID_LOGIN_CREDENTIALS':
                                    errorMessage = 'The email or password is invalid.';
                                    break;
                                case 'EMAIL_EXISTS':
                                    errorMessage = 'The email address is already in use by another account.';
                                    break;
                                
                            }
                            return of(fromAuthActions.loginFail({message: errorMessage}));
                        })
                    );
                })
            )
    );

    authSuccess = createEffect(
        () => 
            this.actions$.pipe(
                ofType(fromAuthActions.login),
                tap(() => {
                    this.router.navigate(['/']);
                })
            ),
            {dispatch: false}
    )


    
}