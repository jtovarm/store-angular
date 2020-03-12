import { AfterViewInit, Component, OnInit, Renderer } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto';
import { GLOBAL } from '../services/global';
import swal from 'sweetalert2';

@Component({
  selector: 'productos-list',
  templateUrl: '../views/productos-list.html',
  providers: [ProductoService]
})

export class ProductosListComponent implements AfterViewInit, OnInit {
  dtOptions: DataTables.Settings = {};
  public url: string;
  public titulo: string;
  public productos: Producto[];
  public confirmado;
  public term: string;
  public have_products = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productoService: ProductoService,
    private renderer: Renderer
  ){
    this.titulo = 'Products';
    this.url = GLOBAL.url + '/get-products-dt/';
  }

  ngOnInit(): void {
    this.getDatatableOptions();
    this.getProductos();
    this.confirmado = null;
  }

  ngAfterViewInit(): void {
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute('view-person-id')) {
        this._router.navigate(['/producto/' + event.target.getAttribute('view-person-id')]);
      }
      if (event.target.hasAttribute('edit-person-id')) {
        this._router.navigate(['/editar-producto/' + event.target.getAttribute('edit-person-id')]);
      }
      if (event.target.hasAttribute('delete-product-id')) {
        this.borrarConfirm(event.target.getAttribute('delete-product-id'));
      }
    });
  }

  getDatatableOptions() {
    this.dtOptions = {
      processing: true,
      serverSide: true,
      lengthChange: false,
      autoWidth: true,
      ajax: {
        url: this.url,
        type: 'POST'
      },
      columns: [{
          title: 'ID',
          data: 'id'
        }, {
          title: 'Name',
          data: 'name'
        }, {
          title: 'Description',
          data: 'description'
        }, {
          title: 'Price',
          data: 'price'
        }, {
          title: 'Fecha Alta',
          data: 'date_up'
        }, {
          title: 'Edit',
          orderable: false,
          render: function (data: any, type: any, full: any) {
            return '<button class="btn btn-warning" edit-person-id="' + full.id + '">Edit</button>' + ' ' +
                   '<button class="btn btn-danger btn-large" delete-product-id="' + full.id + '">Delete</button>';
        }
      }]
    };
  }

  getProductos(){
    this._productoService.getProductos().subscribe(
      result => {
        this.productos = result.products_list;
      },
      error => {
      }
    );
  }

  borrarConfirm(id){
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success butons-modal',
        cancelButton: 'btn btn-danger butons-modal'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this._productoService.deleteProducto(id).subscribe(
          result => {
            this.getProductos();
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          },
          error => {
            swalWithBootstrapButtons.fire(
              'Error',
              'Your product is safe :)',
              'error'
            )
          }
        )
      }
    })
    // this.confirmado = id;
  }

  cancelarConfirm(){
    this.confirmado = null;
  }

  onDeleteProducto(id){
    this._productoService.deleteProducto(id).subscribe(
      result => {
          this.getProductos();
      },
      error => {
      }
    );
  }

  searchProfiles(event) {
    this.term = event;
    if (this.term) {
      this._productoService.searchProducto(this.term).subscribe(
        result => {
          if (result.products_list.length > 0) {
            this.have_products = true;
            this.productos = result.products_list;
          } else {
            this.have_products = false;
          }
        }
      );
    } else {
      this.have_products = true;
      this.getProductos();
    }
  }
}
