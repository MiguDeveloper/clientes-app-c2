import {Component, OnInit} from '@angular/core';
import {Factura} from './models/factura';
import {ClienteService} from '../../services/cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {FacturaService} from '../../services/facturas/factura.service';
import {Producto} from './models/producto';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ItemFactura} from './models/item-factura';
import swall from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva factura';
  factura: Factura = new Factura();

  // Variables autocomplete
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  // END variables autocomplete

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private facturaService: FacturaService,
              private router: Router) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getClienteById(clienteId).subscribe(cliente => {
        this.factura.cliente = cliente;
      });
    });

    // Autocomplete
    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );

    // END autocomplete
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductoByNombre(filterValue); //.filter(option => option.toLowerCase().includes(filterValue));
  }

  // El signo ? indica que puede ser nulo
  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0){
      this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (item.producto.id === id) {
        item.cantidad = cantidad;
      }
      return item;
    });

  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (item.producto.id === id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (item.producto.id === id) {
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item:ItemFactura) => id != item.producto.id)
  }

  create(): void{
    console.log(this.factura);
    this.facturaService.create(this.factura).subscribe(factura => {
      swall.fire(this.titulo, `Factura ${this.factura.descripcion} creada con exito!`, 'success');
      this.router.navigate(['/facturas', factura.id]);
    });
  }

}
