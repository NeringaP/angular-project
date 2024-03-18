import { createAction, props } from "@ngrx/store";

export const loginStart = createAction(
    '[Auth] Login Start',
    props<{credentials: {email: string, password: string}}>()
);

export const login = createAction(
    '[Auth] Login',
    props<{user: {email: string, id: string, token: string, expirationDate: Date}}>()
);

export const loginFail = createAction(
    '[Auth] Login Fail',
    props<{message: string}>()
);

export const logout = createAction(
    '[Auth] Logout'
);