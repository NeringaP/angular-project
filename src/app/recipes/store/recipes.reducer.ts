import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import { addRecipe, deleteRecipe, fetchRecipes, setRecipes, updateRecipe } from "./recipes.actions";

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
    })),
    on(addRecipe, (state, action) => ({
        ...state,
        recipes: [...state.recipes, action.recipe]
    })),
    on(updateRecipe, (state, action) => {
        const recipe = state.recipes[action.index];
        const updatedRecipe = {
            ...recipe,
            ...action.newRecipe
        };
        const updatedRecipes = [...state.recipes];
        updatedRecipes[action.index] = updatedRecipe;
        return {
        ...state,
        recipes: updatedRecipes
        }
    }),
    on(deleteRecipe, (state, action) => ({
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
            return index !== action.index;
        })
    }))

);