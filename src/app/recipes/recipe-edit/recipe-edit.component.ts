import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit{
  id: number;
  recipe: Recipe;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.router.navigate(['../'], {relativeTo: this.route});
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
      const newRecipeId = this.recipeService.getRecipes().length - 1;
      this.router.navigate(['../', newRecipeId], {relativeTo: this.route});
    }
    
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }


  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode) {
      this.store.select('recipes')
      .pipe(
        map(recipeState => recipeState.recipes[this.id])
      ).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if(recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          }
        }
      })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

}