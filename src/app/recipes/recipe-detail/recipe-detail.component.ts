import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addIngredients } from 'src/app/shopping/shopping-list/store/shopping-list.actions';
import * as fromApp from "../../store/app.reducer";
import { map, switchMap } from 'rxjs';

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
    private store: Store<fromApp.AppState>
  ) {}

ngOnInit() {
  this.route.params
    .pipe(
      map(params => 
        +params['id']
      ),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }), 
      map(recipesState => 
        // recipesState.recipes.find((recipe, index) => 
        //  index === this.id)
        recipesState.recipes[this.id]
      )
    )
    .subscribe(recipe => 
      this.recipe = recipe
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
