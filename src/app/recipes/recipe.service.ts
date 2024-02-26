import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping/shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService {
    
    private recipes: Recipe[] = [
        new Recipe(
          1,
          'Apple pie',
          'A tasty heartwarming pie.',
          '../../assets/images/applePie.jpg',
          [
            new Ingredient('Apple', 5),
            new Ingredient('Flour', 1),
            new Ingredient('Sugar', 1),
            new Ingredient('Butter', 1),
            new Ingredient('Milk', 1)
          ]
        ),
        new Recipe(
          2,
          'Pumkin pie',
          'A smooth and spicy pie.',
          '../../assets/images/pumpkinPie.webp',
          [
            new Ingredient('Pumpkin', 1),
            new Ingredient('Flour', 1),
            new Ingredient('Sugar', 1),
            new Ingredient('Oil', 1),
            new Ingredient('Spices', 6)
          ]
        ),
        new Recipe(
          3,
          'Cherry pie',
          'This classic cherry pie will be your favorite!',
          '../../assets/images/cherryPie.jpeg',
          [
            new Ingredient('Cherries ', 20),
            new Ingredient('Flour', 1),
            new Ingredient('Sugar', 1),
            new Ingredient('Butter ', 1),
            new Ingredient('Lemon', 1),
            new Ingredient('Vanilla', 1),
            new Ingredient('Salt', 1)
          ]
        ),
        new Recipe(
          4,
          'Lemon meringue pie',
          'This is the perfect lemon meringue pie!',
          '../../assets/images/lemonMeringuePie.jpeg',
          [
            new Ingredient('Egg ', 5),
            new Ingredient('Cornstarch', 1),
            new Ingredient('Sugar', 1),
            new Ingredient('Butter ', 1),
            new Ingredient('Lemon', 1),
            new Ingredient('Cream', 1),
            new Ingredient('Salt', 1)
          ]
        ),
    ];

    constructor(private shoppingListService: ShoppingListService) {}

    getRecipes(): Recipe[] {
        return this.recipes.slice(); //slice to get a COPY of the recipes array
    }

    getRecipe(id: number) {
      const recipe = this.recipes.find(
        (r) => {
          return r.id === id;
        }
      );
      return recipe;
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
            this.shoppingListService.addIngredients(ingredients);
    }
}