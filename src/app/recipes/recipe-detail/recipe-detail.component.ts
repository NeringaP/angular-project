import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addIngredients } from 'src/app/shopping/shopping-list/store/shopping-list.actions';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as fromShoppingList from "src/app/shopping/shopping-list/store/shopping-list.reducer";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit{
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService, 
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<fromShoppingList.AppState>
  ) {}

ngOnInit() {
  this.route.params
  .subscribe(
    (params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
    }
  )
}

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(addIngredients({ingredients: this.recipe.ingredients}))
  }

  onDelete() {
    if(confirm("Are you sure you want to delete?") == true) {
      this.recipeService.deleteRecipe(this.id);
      this.router.navigate(['/recipes']);
    } 
  }
}
