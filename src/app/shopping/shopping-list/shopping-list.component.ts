import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  // private ingredientsChangedSub: Subscription;
  ingredients$: Observable<{ingredients: Ingredient[]}>

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
  ) {}
  
  ngOnInit(): void {
    // this.ingredients = this.shoppingListService.getIngredients();
    this.ingredients$ = this.store.select('shoppingList');
    // this.ingredientsChangedSub = this.shoppingList$
    // .subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // )
  }

  ngOnDestroy(): void {
    // this.ingredientsChangedSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingListService.startingEditing.next(index);
  }
  
}
