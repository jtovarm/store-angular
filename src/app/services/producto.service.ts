import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable, Subscriber } from 'rxjs';

import { Producto } from '../models/producto';
import { GLOBAL } from './global';
import { Params } from '@angular/router';

@Injectable()

export class ProductoService{
  public url: string;

  constructor(
    public _http: Http
  ){
    this.url = GLOBAL.url;
  }

  getProductos() {
    return this._http.get(this.url + '/get-products/')
            .pipe(map(res => res.json()));
  }

  getProducto(id) {
    return this._http.get(this.url + '/product/' + id + '/')
            .pipe(map(res => res.json()));
  }

  addProducto(producto: Producto){
    const json = JSON.stringify(producto);
    const params = 'json=' + json;

    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    return this._http.post(this.url + '/add-product/', params, {headers: headers})
           .pipe(map(res => res.json()));
  }

  editProducto(id, producto: Producto){
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    return this._http.post(this.url + '/update-product/' + id + '/', params, {headers: headers})
            .pipe(map(res => res.json()));
  }

  deleteProducto(id){
    return this._http.get(this.url + '/delete-product/' + id + '/')
            .pipe(map(res => res.json()));
  }

  searchProducto(term){
    const json = JSON.stringify(term);
    const params = 'json=' + json;

    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    return this._http.post(this.url + '/search-product/', params, {headers: headers})
           .pipe(map(res => res.json()));
  }

  photo(formData) {
    return this._http.post(this.url + '/upload-file/', formData).pipe(map(res => res.json()));
  }

  photoUpdate(id, formData) {
    return this._http.post(this.url + '/update-file/' + id + '/', formData).pipe(map(res => res.json()));
  }
}
