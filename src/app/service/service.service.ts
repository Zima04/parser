import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, tap} from 'rxjs';


@Injectable({providedIn: 'root'})
export class PaymentsService {

  constructor(private http: HttpClient) {
  }


  // public test() {
  //   var url = "http://www.whateverorigin.org/get?url=" + encodeURIComponent("https://www.lokalebanen.nl/vacatures/beroepsgroepen/chauffeur-vacatures-nederland/") + "&callback=?";
  //   const headers = new HttpHeaders();
  //   headers
  //     .set('Content-Type', 'application/json')
  //   return this.http.get(url,
  //     {
  //       headers
  //     }
  //   ).pipe(
  //     tap((response) => {
  //       debugger;
  //       console.log(response);
  //     })
  //   )
  // }

  public getList() {
    return this.http.get('https://www.lokalebanen.nl/vacatures/beroepsgroepen/chauffeur-vacatures-nederland/',
      {
        observe: 'response',
        responseType: 'text'
      }).pipe(
      map((res) => {
        return res.body;
      })
    )
  }

  public getItem(link: any) {
    return this.http.get(link,
      {
        observe: 'response',
        responseType: 'text'
      }).pipe(
      map((res) => {
        return res.body;
      })
    )
  }
}
