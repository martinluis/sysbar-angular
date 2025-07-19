import {Component, OnInit, output} from '@angular/core';
import {Product} from '../../models/product';
import {ProductItemComponent} from './product-item/product-item.component';
import {ProductService} from '../../services/product.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-search-products',
  imports: [
    ProductItemComponent,
    AsyncPipe
  ],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss'
})
export class SearchProductsComponent implements OnInit{

  onAddProduct = output<Product>()
  products$!: Observable<Product[]>;

  constructor(private productService: ProductService) {
  }


  /**
   *
   */
  ngOnInit(): void {
    this.products$ = this.productService.getAll();
    console.log( this.products$)
  }


  /**
   *
   * @param product
   */
  addProduct(product: Product){
    this.onAddProduct.emit(product)
  }

}
