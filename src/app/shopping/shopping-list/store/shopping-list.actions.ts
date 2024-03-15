import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const addIngredient = createAction(
    '[Shopping-list] Add Ingredient',
    props<{ingredient: Ingredient}>()
);

export const addIngredients = createAction(
    '[Shopping-list] Add Ingredients',
    props<{ingredients: Ingredient[]}>()
);

export const updateIngredient = createAction(
    '[Shopping-list] Update Ingredient',
    props<{ingredient: Ingredient}>()
);

export const deleteIngredient = createAction(
    '[Shopping-list] Delete Ingredient'
);

export const startEdit = createAction(
    '[Shopping-list] Start Edit',
    props<{index: number}>()
);

export const stopEdit = createAction(
    '[Shopping-list] Stop Edit'
);