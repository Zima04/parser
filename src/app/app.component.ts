import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PaymentsService} from './service/service.service';
import {BehaviorSubject, forkJoin, Observable, take} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public cards: any[] = [];

  constructor(private paymentsService: PaymentsService) {
  }

  public ngOnInit() {
    this.isLoading$.next(true);
    this.paymentsService.getList().pipe(take(1)).subscribe(
      (res) => {
        this.parseLinks(res)
      },
      (err) => {
        debugger;
      })
  }

  private fetchDetail(list: any[]): Array<Observable<any>> {
    let obs: Array<Observable<any>> = [];
    list.forEach((link: any) => obs.push(this.paymentsService.getItem(link).pipe(take(1))))
    return obs;
  }

  private getContactDetails(detail: any, index: number): void {
    const domParser = new DOMParser();
    const detailHtmlElement = domParser.parseFromString(detail, 'text/html');
    const contactDetailsDiv: any = detailHtmlElement.getElementsByClassName(`hero-contact-info`)[0].getElementsByTagName("a")[0];
    this.cards[index].contactDetails = contactDetailsDiv?.innerText
  }

  private getCompanyName(detail: any, index: number): void {
    const domParser = new DOMParser();
    const detailHtmlElement = domParser.parseFromString(detail, 'text/html');
    const companyNameDiv: any = detailHtmlElement.getElementsByClassName(`hero-contact-info`)[0].getElementsByTagName("strong")[0];
    this.cards[index].companyName = companyNameDiv?.innerText
  }

  private getVacancyEmail(detail: any, index: number): void {
    const domParser = new DOMParser();
    const detailHtmlElement = domParser.parseFromString(detail, 'text/html');
    const vacancy__groupDiv = detailHtmlElement.getElementsByClassName(`vacancy__group`)
    const links = [].slice.call(vacancy__groupDiv[vacancy__groupDiv.length - 1]?.getElementsByTagName("a"))
    this.cards[index].vacancyEmail = links.map((link: any) => link.href)
  }

  public parseLinks(res: any): void {
    this.cards = []
    const domParser = new DOMParser();
    const htmlElement = domParser.parseFromString(res, 'text/html');
    const vacancies = htmlElement.getElementsByClassName(`vacancy__link`);
    let vacanciesArray = [].slice.call(vacancies);

    vacanciesArray.forEach((vacancy: any) => {
      let card = {
        link: '',
        title: '',
        city: '',
        contactDetails: '',
        companyName: '',
        vacancyEmail: ''
      }
      card.link = vacancy?.href;

      let titleDiv = vacancy?.getElementsByClassName(`vacancy__title`)[0];
      card.title = titleDiv?.innerText;

      let cityDiv = vacancy?.getElementsByClassName(`vacancy__city`)[0];
      card.city = cityDiv?.innerText;
      this.cards.push(card);
    })

    forkJoin([...this.fetchDetail(this.cards.map((item) => item.link))]).pipe(take(1)).subscribe((contactDetails: any) => {
      contactDetails.forEach((contactDetailDiv: any, index: number) => {
        this.getContactDetails(contactDetailDiv, index)
        this.getCompanyName(contactDetailDiv, index)
        this.getVacancyEmail(contactDetailDiv, index)
      })
      this.isLoading$.next(false)
    });
  }
}
