import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy{
  recipes: Recipe[];
  private recipesChagedSub: Subscription;
  recipes$: Observable<{recipes: Recipe[]}>;

  constructor(
              private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.recipes$ = this.store.select('recipes');
    // this.recipes = this.recipeService.getRecipes();
    // this.recipesChagedSub = this.recipeService.recipesChanged
    // .subscribe(
    //   (recipes: Recipe[]) => {
    //     this.recipes = recipes;
    //   });
  }

  ngOnDestroy(): void {
    this.recipesChagedSub.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
