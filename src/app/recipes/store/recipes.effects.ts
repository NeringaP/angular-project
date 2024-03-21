import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";

import * as fromRecipesActions from "./recipes.actions";
import { Recipe } from "../recipe.model";
import * as fromApp from "src/app/store/app.reducer";


@Injectable()
export class RecipesEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient, 
        private store: Store<fromApp.AppState>
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

    storeRecipes = createEffect(() =>
                this.actions$.pipe(
                    ofType(fromRecipesActions.storeRecipes),
                    withLatestFrom(this.store.select('recipes')),
                    switchMap(([actionData, recipesState]) => 
                        this.http.put(
                            'https://angular-recipe-book-f8bcc-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
                            recipesState.recipes
                        )
                    )
                ), {dispatch: false}
    );

}