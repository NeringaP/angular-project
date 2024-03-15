import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const addIngredient = createAction(
    '[Shopping-list] Add Ingredient',
    props<{ingredient: Ingredient}>()
);

export const addIngredients = createAction(
    '[Shopping-list] Add Ingredients',
    props<{ingredients: Ingredient[]}>()
)