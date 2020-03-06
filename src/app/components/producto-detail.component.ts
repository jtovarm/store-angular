import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'producto-detail',
  templateUrl: '../views/producto-detail.html',
  providers: [ProductoService]
})

export class ProductoDetailComponent{
  public titulo: string;
  public producto: Producto;

  constructor(
    private _productoService: ProductoService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.titulo = 'Editar producto';
  }

  ngOnInit() {
    this.getProducto();
  }

  getProducto() {

    this._route.params.forEach((params: Params) => {
      const id = params['id'];

      this._productoService.getProducto(id).subscribe(
        result => {
          this.producto = result;
        }, error => {
        }
      );
    });
  }
}
