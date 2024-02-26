import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Ingredient } from "src/app/shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-shopping-list-edit',
    templateUrl: './shopping-list-edit.component.html',
    styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy{
    @ViewChild('f', {static: false}) shoppingListForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItemIndex: number;
    editedItem: Ingredient;

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit() {
        this.subscription = this.shoppingListService.startingEditing
            .subscribe((index: number) => {
                this.editMode = true;
                this.editedItemIndex = index;
                this.editedItem = this.shoppingListService.getIngredient(index);
                this.shoppingListForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                });
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    
    onSubmit() {
        const value = this.shoppingListForm.value;
        const newIngredient = new Ingredient(value.name, value.amount);
        if(this.editMode) {
            this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
        } else {
            this.shoppingListService.addIngredient(newIngredient);
        }
        this.onClear();
    }

    onClear() {
        this.editMode = false;
        this.editedItemIndex = null;
        this.shoppingListForm.reset();
    }

    onDelete() {
        this.shoppingListService.deleteIngredient(this.editedItemIndex);
        this.onClear();
    }   
    
}