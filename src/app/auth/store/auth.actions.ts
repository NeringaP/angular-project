import { createAction, props } from "@ngrx/store";

export const loginStart = createAction(
    '[Auth] Login Start',
    props<{credentials: {email: string, password: string}}>()
);

export const authenticateSuccess = createAction(
    '[Auth] Authenticate Success',
    props<{user: {email: string, id: string, token: string, expirationDate: Date, redirect: boolean}}>()
);

export const authenticateFail = createAction(
    '[Auth] Authenticate Fail',
    props<{message: string}>()
);

export const signupStart = createAction(
    '[Auth] Signup Start',
    props<{credentials: {email: string, password: string}}>()
);

export const autoLogin = createAction(
    '[Auth] Auto Login'
);

export const logout = createAction(
    '[Auth] Logout'
);

export const clearError = createAction(
    '[Auth] Clear Error'
);