import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription, map } from "rxjs";

import * as fromApp from "../store/app.reducer";
import * as fromAuthActions from "../auth/store/auth.actions";
import * as fromRecipesActions from "../recipes/store/recipes.actions";
import { Recipe } from "../recipes/recipe.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  recipes: Recipe[];
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}
 
  ngOnInit() {
    this.userSub = this.store
    .select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(user => {
        this.isAuthenticated = !user ? false : true; //or just !!user
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.store.dispatch(fromRecipesActions.storeRecipes());
  }

  onFetchData() {
    this.store.dispatch(fromRecipesActions.fetchRecipes())
  }

  onLogout() {
    this.store.dispatch(fromAuthActions.logout())
  }
}