import {Component, input} from '@angular/core';
import {Product} from '../../../models/product';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-product-item',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {

  product = input.required<Product>()

}
