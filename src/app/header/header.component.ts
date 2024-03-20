import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";
import { Subscription, map } from "rxjs";
import * as fromApp from "../store/app.reducer";
import { Store } from "@ngrx/store";
import * as fromAuthActions from "../auth/store/auth.actions";
import * as fromRecipesActions from "../recipes/store/recipes.actions";

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
    private dataStorageService: DataStorageService, 
    private authService: AuthService,
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
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(fromRecipesActions.fetchRecipes())
  }

  onLogout() {
    this.store.dispatch(fromAuthActions.logout())
  }
}