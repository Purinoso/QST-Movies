import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, ErrorObserver, Observable } from 'rxjs';

import SnackBarMessageService from '@/services/snack-bar-message/snack-bar-message.service';
import Movie from '@/interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export default class MovieService {
  private httpClient: HttpClient = inject(HttpClient);
  private snackBarMessageService: SnackBarMessageService = inject(SnackBarMessageService);
  
  private API_ENDPOINTS = {
    CREATE: 'http://localhost:8080/movie/save',
    READ: 'http://localhost:8080/movie/ajaxGetMovies',
    update: (id: number) => `http://localhost:8080/movie/update/${id}`,
    delete: (id: number) => `http://localhost:8080/movie/delete/${id}`
  }
  private movies: Movie[] = [];
  private moviesSubject: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);

  constructor() {
    const moviesJsonObservable: Observable<Movie[]> = this.httpClient.get<Movie[]>(this.API_ENDPOINTS.READ);
    
    moviesJsonObservable.subscribe(
      this.getObserver(movies => {
        this.movies = movies;
      })
    );
    
    this.moviesSubject.next(this.movies);
  }

  private getObserver<T>(next?: (value: T) => any) {
    const observer: ErrorObserver<T> = {
      next: next,
      error: () => this.snackBarMessageService.showMessage('Ha ocurrido un error al conectarse a la base de datos')
    };

    return observer;
  }

  getMoviesSubject(): BehaviorSubject<Movie[]> {
    return this.moviesSubject;
  }

  getMovie(id: number): Movie | null {
    const targetMovie = this.movies.find(movie => movie.id === id);
    return targetMovie ?? null;
  }

  addMovie(movie: Movie) {
    this.movies.push(movie);
    this.moviesSubject.next(this.movies);

    this.httpClient.post<Movie>(this.API_ENDPOINTS.CREATE, movie).subscribe(this.getObserver());
  }

  udpateMovie(movieToUpdate: Movie) {
    const targetMovieIndex = this.movies.findIndex(movie => movie.id === movieToUpdate.id);
    if (targetMovieIndex === -1) {
      return;
    }

    this.movies[targetMovieIndex] = movieToUpdate;
    this.moviesSubject.next(this.movies);

    this.httpClient.put<Movie>(this.API_ENDPOINTS.update(movieToUpdate.id), movieToUpdate).subscribe(this.getObserver());
  }

  deleteMovie(id: number) {
    const targetMovieIndex = this.movies.findIndex(movie => movie.id === id);
    if (targetMovieIndex === -1) {
      return;
    }

    this.movies.splice(targetMovieIndex, 1);
    this.moviesSubject.next(this.movies);

    this.httpClient.delete(this.API_ENDPOINTS.delete(id)).subscribe(this.getObserver());
  }
}