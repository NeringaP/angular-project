import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import { setRecipes } from "./recipes.actions";

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
}

export const recipesReducer = createReducer(
    initialState,
    on(setRecipes, (state, action) =>({
        ...state,
        recipes: [...action.recipes]
    }))
);