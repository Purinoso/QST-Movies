import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, ErrorObserver, Observable } from 'rxjs';

import SnackBarMessageService from '@/services/snack-bar-message/snack-bar-message.service';
import Genre from '@/interfaces/genre.interface';

@Injectable({
  providedIn: 'root'
})
export default class GenreService {
  private httpClient: HttpClient = inject(HttpClient);
  private snackBarMessageService: SnackBarMessageService = inject(SnackBarMessageService);

  private SERVER_URL = 'http://localhost:8080/genre/ajaxGetGenres';
  private genresSubject: BehaviorSubject<Genre[]> = new BehaviorSubject<Genre[]>([]);

  constructor() {
    const genresJsonObservable: Observable<Genre[]> = this.httpClient.get<Genre[]>(this.SERVER_URL);

    genresJsonObservable.subscribe(
      this.createObserver(genres => {
        this.genresSubject.next(genres);
      })
    );
  }

  private createObserver<T>(next?: (value: T) => any) {
    const observer: ErrorObserver<T> = {
      next: next,
      error: () => this.snackBarMessageService.showMessage('An error has occurred while connecting to the database.')
    };

    return observer;
  }

  getGenresSubject(): BehaviorSubject<Genre[]> {
    return this.genresSubject;
  }
}