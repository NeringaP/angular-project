import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, take, tap, exhaustMap } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(
        private http: HttpClient, 
        private recipeService: RecipeService,
        private authService: AuthService
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
                }),
                tap(response => {
                    this.recipeService.setRecipes(response);
                })
            )
            
    }
}