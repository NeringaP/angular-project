import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as fromRecipesActions from "./recipes.actions";
import { map, switchMap, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipesEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient, 
    ) {}

    fetchRecipes = createEffect(() => 
        this.actions$.pipe(
            ofType(fromRecipesActions.fetchRecipes),
            switchMap(() => {
                return this.http.get<Recipe[]>(
                'https://angular-recipe-book-f8bcc-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
                )
            }),
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe, 
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            map(recipes => 
                fromRecipesActions.setRecipes({recipes: recipes})
            )
        )
    );

}