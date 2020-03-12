import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto';
import { GLOBAL } from '../services/global';
import swal from 'sweetalert2';

@Component({
  selector: 'producto-edit',
  templateUrl: '../views/producto-add.html',
  providers: [ProductoService]
})

export class ProductoEditComponent{
  public titulo: string;
  public producto: Producto;
  public filesToUpload;
  public resultUpload;
  public is_edit;
  public haveImage: string;
  public formData = new FormData();
  public loading = false;

  constructor(
    private _productoService: ProductoService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.titulo = 'Edit product';
    this.producto = new Producto(1, '', '', 1, new Date(), '');
    this.is_edit = true;
  }

  ngOnInit() {
    this.getProducto();
  }

  onSubmit() {
    this.loading = true;
    this.updateProducto();
  }

  alertSuccess(id) {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success butons-modal'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire(
      'Updated!',
      'Your product has been updated.',
      'success'
    );
    // this._router.navigate(['/producto', id]);
    this._router.navigate(['/productos']);
  }

  alertError() {
    swal.fire(
      'Error!',
      'Your product could not be updated.',
      'error'
    );
    this._router.navigate(['/productos']);
  }

  updateProducto(){
    this._route.params.forEach((params: Params) => {
      const id = params['id'];
      this._productoService.editProducto(id, this.producto).subscribe(
        result => {
          if (this.filesToUpload && this.filesToUpload.length >= 1) {
            this._productoService.photoUpdate(id, this.formData).subscribe(res => {
              this.loading = false;
              this.alertSuccess(id);
            });
          } else {
            this.loading = false;
            this.alertSuccess(id);
        },
        error => {
          this.loading = false;
          this.alertError();
        }
      );
    });
  }

  getProducto() {
    this._route.params.forEach((params: Params) => {
      const id = params['id'];
      this._productoService.getProducto(id).subscribe(
        result => {
          this.producto = result;
          this.haveImage = result.image;
        }, error => {
        }
      );
    });
  }

  fileChange(evt): void {
    this.filesToUpload = <Array<File>>evt.target.files;
    if (this.filesToUpload.length > 0) {
        let file;
        this.formData = new FormData();
        for (let i = 0; i < this.filesToUpload.length; i++) {
            file = this.filesToUpload[i];
            this.haveImage = file.name;
            this.formData.append('file', file, file.name);
        }
    }
    const reader = new FileReader();

    reader.onload = function(e) {
      $('#image-preview').attr('src', e.target.result);
    };

    reader.readAsDataURL(this.filesToUpload[0]);
  }
}
