import {Injectable} from '@angular/core';
import {Cliente} from '../components/clientes/cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import swall from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getClientes(): Observable<Cliente[]> {
    // Lo podemos hacer casteando la respuesta
    // return this.httpClient.get<Cliente[]>(this.urlEndPoint);
    // return of(CLIENTES);

    // Otra opcion es usar el operador MAP
    return this.httpClient.get(this.urlEndPoint).pipe(
      map(response => response as Cliente[])
    );
  }

  getClienteById(id): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(err => {
        this.router.navigate(['/clientes']);
        console.log(err.error.mensaje);
        return throwError(err);
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.httpClient.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(err => {
        if (err.status == 400) {
          return throwError(err);
        }
        swall.fire(
          'Error al crear cliente',
          err.error.mensaje,
          'error'
        )
        console.log(err.error.mensaje);
        return throwError(err);
      })
    );
  }

}
