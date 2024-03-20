import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, take, tap, exhaustMap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Store } from "@ngrx/store";
import * as fromRecipesActions from "../recipes/store/recipes.actions";
import * as fromApp from "../store/app.reducer"

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(
        private http: HttpClient, 
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>
    ) {}

    storeRecipes() {
        const recipes =this.recipeService.getRecipes();
        this.http
            .put(
                'https://angular-recipe-book-f8bcc-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
                recipes
            )
            .subscribe(responseData => {
                console.log(responseData);
            })

    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>(
                'https://angular-recipe-book-f8bcc-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
                    })
                })
                ,
                tap(response => {
                    // this.recipeService.setRecipes(response);
                    this.store.dispatch(fromRecipesActions.setRecipes({recipes: response}))
                })
            )
            
    }
}