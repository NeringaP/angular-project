import { createAction, props } from "@ngrx/store";

export const login = createAction(
    '[Auth] Login',
    props<{user: {email: string, id: string, token: string, expiresIn: string}}>()
);

export const logout = createAction(
    '[Auth] Logout'
);