import {Component} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {ProductoService} from '../services/producto.service';
import {Producto} from '../models/producto';
import { GLOBAL } from '../services/global';
import swal from 'sweetalert2';

@Component({
  selector: 'producto-add',
  templateUrl: '../views/producto-add.html',
  providers: [ProductoService]
})

export class ProductoAddComponent {
  public titulo: string;
  public producto: Producto;
  public filesToUpload;
  public resultUpload;
  public formData = new FormData();

  constructor(
    private _productoService: ProductoService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.titulo = 'Add product';
    this.producto = new Producto(0, '', '', 0, new Date(), '');
  }

  ngOnInit() {

  }

  onSubmit() {
    this.saveProduct();
  }

  saveProduct() {
    this._productoService.addProducto(this.producto).subscribe(
      result => {
        if (this.filesToUpload && this.filesToUpload.length >= 1) {
          this._productoService.photo(this.formData).subscribe(res => {
            this._router.navigate(['/productos']);
          }, err => {
            swal.fire(
              'Error!',
              'Your file could not be uploaded.',
              'error'
            );
            this._router.navigate(['/productos']);
          });
        }
        const swalWithBootstrapButtons = swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success butons-modal'
          },
          buttonsStyling: false
        });
        swalWithBootstrapButtons.fire(
          'Add product!',
          'Your product has been added.',
          'success'
        );
        this._router.navigate(['/productos']);
      },
      error => {
        swal.fire(
          'Error!',
          'Your product could not be added.',
          'error'
        );
        this._router.navigate(['/productos']);
      }
    );
  }

  fileChange(evt): void {
    this.filesToUpload = <Array<File>>evt.target.files;
    if (this.filesToUpload.length > 0) {
        let file;
        this.formData = new FormData();
        for (let i = 0; i < this.filesToUpload.length; i++) {
            file = this.filesToUpload[i];
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
