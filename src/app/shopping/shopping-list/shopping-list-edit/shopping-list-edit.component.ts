import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Ingredient } from "src/app/shared/ingredient.model";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { addIngredient, deleteIngredient, stopEdit, updateIngredient } from "../store/shopping-list.actions";
import * as fromApp from "../../../store/app.reducer";

@Component({
    selector: 'app-shopping-list-edit',
    templateUrl: './shopping-list-edit.component.html',
    styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy{
    @ViewChild('f', {static: false}) shoppingListForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItem: Ingredient;

    constructor(
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        this.subscription = this.store.select('shoppingList').subscribe((stateData) => {
            if(stateData.editedIngredientIndex > -1) {
                this.editMode = true;
                this.editedItem = stateData.editedIngredient;
                this.shoppingListForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                });
            } else {
                this.editMode = false;
            } 
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(stopEdit());
    }
    
    onSubmit() {
        const value = this.shoppingListForm.value;
        const newIngredient = new Ingredient(value.name, value.amount);
        if(this.editMode) {
            this.store.dispatch(updateIngredient({ingredient: newIngredient}))
        } else {
            this.store.dispatch(addIngredient({ingredient: newIngredient}));
        }
        this.onClear();
    }

    onClear() {
        this.editMode = false;
        this.shoppingListForm.reset();
        this.store.dispatch(stopEdit());
    }

    onDelete() {
        this.store.dispatch(deleteIngredient())
        this.onClear();
    }   
    
}