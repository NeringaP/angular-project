import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";
import { addIngredient, addIngredients, deleteIngredient, startEdit, stopEdit, updateIngredient } from "./shopping-list.actions";

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Peach', 3),
        new Ingredient('Avocado', 5)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
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
    on(updateIngredient, (state, action) => {
        const ingredient = state.ingredients[state.editedIngredientIndex];
        const updatedIngredient = {
            ...ingredient,
            ...action.ingredient
        };
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
        return {
            ...state,
            ingredients: updatedIngredients,
            editedIngredient: null,
            editedIngredientIndex: -1
        };
    }),
    on(deleteIngredient, (state) => ({
            ...state,
            ingredients: state.ingredients.filter((ingredient, index) => {
               return index !== state.editedIngredientIndex;
            }),
            editedIngredient: null,
            editedIngredientIndex: -1
    })),
    on(startEdit, (state, action) => ({
        ...state,
        editedIngredientIndex: action.index,
        editedIngredient: {...state.ingredients[action.index]}
    })),
    on(stopEdit, (state) => ({
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
    })),
);