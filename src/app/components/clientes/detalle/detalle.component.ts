import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../../../services/cliente.service';
import swall from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';
import {ModalService} from '../../../services/detalle/modal.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  // @Input(): Decoramos el atributo para traerlo desde otro componente
  @Input() cliente: Cliente;
  titulo: string = 'Detalle de cliente';
  private fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
              private modalService: ModalService,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swall.fire(
        'Error seleccionar imagen',
        'El archivo debe ser de tipo imagen',
        'error'
      );
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swall.fire(
        'Error al cargar',
        'Debe seleccionar una foto',
        'error'
      );
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round(event.loaded / event.total * 100);
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          // Avisamos al servicio que estamos subiendo una imagen
          this.modalService.notificarUpload.emit(this.cliente);
          swall.fire(
            'La foto correcta',
            response.mensaje,
            'success'
          );
        }
      });
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
