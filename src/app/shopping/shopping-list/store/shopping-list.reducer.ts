import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";
import { addIngredient, addIngredients } from "./shopping-list.actions";

const initialState = {
    ingredients: [
        new Ingredient('Peach', 3),
        new Ingredient('Avocado', 5)
    ]
};

export const shoppingListReducer = createReducer(
    initialState,
    on(addIngredient, (state, action) => ({
        ...state,
        ingredients: [...state.ingredients, action.ingredient]
    })),
    on(addIngredients, (state, action) => ({
        ...state,
        ingredients: [...state.ingredients, ...action.ingredients]
    })),
);