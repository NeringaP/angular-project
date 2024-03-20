import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Observable, map, take } from "rxjs";
import { Store } from "@ngrx/store";

import { Recipe } from "./recipe.model";
import * as fromApp from "../store/app.reducer";
import * as fromRecipesActions from "./store/recipes.actions";


@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        this.store.dispatch(fromRecipesActions.fetchRecipes());
        return this.actions$.pipe(
            ofType(fromRecipesActions.setRecipes.type),
            take(1)
            )

        
    }

    
}