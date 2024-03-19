import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import { authenticateFail, authenticateSuccess, clearError, loginStart, logout, signupStart } from "./auth.actions";

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
}

export const authReducer = createReducer(
    initialState,
    on(authenticateSuccess, (state, action) => {
        const user = new User(
            action.user.email,
            action.user.id,
            action.user.token,
            action.user.expirationDate
        );
        return {
            ...state,
            user: user,
            authError: null,
            loading: false
        };
    }),
    on(logout, (state) => ({
        ...state,
        user: null
    })),
    on(loginStart, signupStart, (state) => ({
        ...state,
        authError: null,
        loading: true
    })),
    on(authenticateFail, (state, action) => ({
        ...state,
        user: null,
        authError: action.message,
        loading: false
    })),
    on(clearError, (state) => ({
        ...state,
        authError: null
    })),
)