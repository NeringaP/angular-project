import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import { login, logout } from "./auth.actions";
import { state } from "@angular/animations";

export interface State {
    user: User;
}

const initialState: State = {
    user: null
}

export const authReducer = createReducer(
    initialState,
    on(login, (state, action) => {
        const user = new User(
            action.user.email,
            action.user.id,
            action.user.token,
            action.user.expirationDate
        );
        return {
            ...state,
            user: user
        };
    }),
    on(logout, (state, action) => ({
        ...state,
        user: null
    }))
)