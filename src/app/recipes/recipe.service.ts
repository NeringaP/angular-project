import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping/shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
    // private recipes: Recipe[] = [
    //     new Recipe(
    //       'Apple pie',
    //       'A tasty heartwarming pie.',
    //       '../../assets/images/applePie.jpg',
    //       [
    //         new Ingredient('Apple', 5),
    //         new Ingredient('Flour', 1),
    //         new Ingredient('Sugar', 1),
    //         new Ingredient('Butter', 1),
    //         new Ingredient('Milk', 1)
    //       ]
    //     ),
    //     new Recipe(
    //       'Pumkin pie',
    //       'A smooth and spicy pie.',
    //       '../../assets/images/pumpkinPie.webp',
    //       [
    //         new Ingredient('Pumpkin', 1),
    //         new Ingredient('Flour', 1),
    //         new Ingredient('Sugar', 1),
    //         new Ingredient('Oil', 1),
    //         new Ingredient('Spices', 6)
    //       ]
    //     ),
    //     new Recipe(
    //       'Cherry pie',
    //       'This classic cherry pie will be your favorite!',
    //       '../../assets/images/cherryPie.jpeg',
    //       [
    //         new Ingredient('Cherries ', 20),
    //         new Ingredient('Flour', 1),
    //         new Ingredient('Sugar', 1),
    //         new Ingredient('Butter ', 1),
    //         new Ingredient('Lemon', 1),
    //         new Ingredient('Vanilla', 1),
    //         new Ingredient('Salt', 1)
    //       ]
    //     ),
    //     new Recipe(
    //       'Lemon meringue pie',
    //       'This is the perfect lemon meringue pie!',
    //       '../../assets/images/lemonMeringuePie.jpeg',
    //       [
    //         new Ingredient('Egg ', 5),
    //         new Ingredient('Cornstarch', 1),
    //         new Ingredient('Sugar', 1),
    //         new Ingredient('Butter ', 1),
    //         new Ingredient('Lemon', 1),
    //         new Ingredient('Cream', 1),
    //         new Ingredient('Salt', 1)
    //       ]
    //     ),
    // ];

    constructor(private shoppingListService: ShoppingListService) {}

    getRecipes(): Recipe[] {
        return this.recipes.slice(); //slice to get a COPY of the recipes array
    }

    getRecipe(index: number): Recipe {
      return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
            this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.informOnChanges();
    }

    updateRecipe(index: number, newRecipe: Recipe) {
      this.recipes[index] = newRecipe;
      this.informOnChanges();
    }

    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.informOnChanges();
    }

    informOnChanges() {
      this.recipesChanged.next(this.getRecipes());
    }

    setRecipes(recipes: Recipe[]) {
      this.recipes = recipes;
      this.informOnChanges();
    }
}