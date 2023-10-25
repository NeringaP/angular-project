import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  recipes: Recipe[] = [
    new Recipe(
      'Apple pie',
      'A tasty heartwarming pie',
      'https://i.pinimg.com/originals/05/ba/17/05ba178b4f2d2380d1290385fd772f2e.jpg'
    ),
    new Recipe(
      'Pumkin pie',
      'A smooth and spicy pie',
      'https://i0.wp.com/blessedbeyondcrazy.com/wp-content/uploads/2017/08/46933990_m.jpg?fit=565%2C848'
    ),
  ];
}
