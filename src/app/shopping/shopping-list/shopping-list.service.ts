import { Subject } from "rxjs";
import { Ingredient } from "src/app/shared/ingredient.model";

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startingEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Peach', 3),
        new Ingredient('Avocado', 5)
    ];

    getIngredients(): Ingredient[] {
        return this.ingredients.slice();
    }

    getIngredient(index: number): Ingredient {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]){
        this.ingredients.push(...ingredients); //push method can add a list of objects, but not an array, so '...' converts array to list
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
        console.log('Index ' + index);
        if(index !== undefined && index !== -1 && index !== null) {
            this.ingredients.splice(index, 1);
        }
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}