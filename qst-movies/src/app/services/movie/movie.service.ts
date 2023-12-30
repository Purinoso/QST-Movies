import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, ErrorObserver, Observable, catchError, map, of } from 'rxjs';

import SnackBarMessageService from '@/services/snack-bar-message/snack-bar-message.service';
import GenreService from '@/services/genre/genre.service';
import Movie from '@/interfaces/movie.interface';
import MovieCommand from '@/classes/movie-command';

@Injectable({
  providedIn: 'root'
})
export default class MovieService {
  private httpClient: HttpClient = inject(HttpClient);
  private snackBarMessageService: SnackBarMessageService = inject(SnackBarMessageService);
  private genreService: GenreService = inject(GenreService);

  private SERVER_URL = 'http://localhost:8080'
  private API_ENDPOINTS = {
    SAVE: `${this.SERVER_URL}/movie/save`,
    LIST: `${this.SERVER_URL}/movie/ajaxGetMovies`,
    image: (id: number) => `${this.SERVER_URL}/movie/getImage/${id}`,
    update: (id: number) => `${this.SERVER_URL}/movie/update/${id}`,
    delete: (id: number) => `${this.SERVER_URL}/movie/delete/${id}`
  }
  private movies: Movie[] = [];
  private moviesSubject: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);

  constructor() {
    const moviesJsonObservable: Observable<Movie[]> = this.httpClient.get<Movie[]>(this.API_ENDPOINTS.LIST);

    moviesJsonObservable.subscribe(
      this.createObserver(movies => {
        this.movies = movies;
        this.moviesSubject.next(movies);
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

  getMoviesSubject(): BehaviorSubject<Movie[]> {
    return this.moviesSubject;
  }

  getMovie(id: number): Movie | undefined {
    const targetMovie = this.movies.find(movie => movie.id === id);
    return targetMovie;
  }

  loadImage(movieId: number): Observable<void> | undefined {
    const movie = this.getMovie(movieId);
    if (!movie) return;

    return this.httpClient.get(this.API_ENDPOINTS.image(movie.id), {
      responseType: 'blob'
    }).pipe(
      map((blob: Blob) => {
        const imageUrl = URL.createObjectURL(blob);

        this.movies[this.movies.indexOf(movie)].imageUrl = imageUrl;
        this.moviesSubject.next(this.movies);
      }),
      catchError(error => {
        if (error.status === 404) {
          this.movies[this.movies.indexOf(movie)].imageUrl = null;
          this.moviesSubject.next(this.movies);

          return new Observable<void>();
        } else {
          this.snackBarMessageService.showMessage('An error has occurred while connecting to the database.');

          return new Observable<void>();
        }
      })
    );
  }

  addMovie(movieCommand: MovieCommand) {
    this.genreService.getGenresSubject().subscribe(genres => {
      const movieGenres = genres.filter(genre => movieCommand.genreIds.includes(genre.id));
      const movie: Movie = {
        id: movieCommand.id!,
        version: movieCommand.version!,
        title: movieCommand.title,
        description: movieCommand.description,
        rating: movieCommand.rating,
        duration: `${movieCommand.duration.split(":")[0]}h ${movieCommand.duration.split(":")[1]}min`,
        releaseDate: movieCommand.releaseDate,
        trailerLink: movieCommand.trailerLink,
        imageUrl: movieCommand.image && `data:${movieCommand.image?.format};base64,${movieCommand.image?.data}`,
        genres: movieGenres
      };

      this.movies.push(movie);
      this.moviesSubject.next(this.movies);
    });

    this.httpClient.post<Movie>(this.API_ENDPOINTS.SAVE, movieCommand).subscribe(this.createObserver());
  }

  udpateMovie(movieCommand: MovieCommand) {
    const targetMovieIndex = this.movies.findIndex(movie => movie.id === movieCommand.id);
    if (targetMovieIndex === -1) return;

    this.genreService.getGenresSubject().subscribe(genres => {
      const movieGenres = genres.filter(genre => movieCommand.genreIds.includes(genre.id));
      const movie: Movie = {
        id: movieCommand.id!,
        version: movieCommand.version!,
        title: movieCommand.title,
        description: movieCommand.description,
        rating: movieCommand.rating,
        duration: `${movieCommand.duration.split(":")[0]}h ${movieCommand.duration.split(":")[1]}min`,
        releaseDate: movieCommand.releaseDate,
        trailerLink: movieCommand.trailerLink,
        imageUrl: movieCommand.image ? `data:${movieCommand.image?.format};base64,${movieCommand.image?.data}` : this.movies[targetMovieIndex].imageUrl,
        genres: movieGenres
      }

      this.movies[targetMovieIndex] = movie;
      this.moviesSubject.next(this.movies);
    });

    this.httpClient.put<Movie>(this.API_ENDPOINTS.update(movieCommand.id!), movieCommand).subscribe(this.createObserver());
  }

  deleteMovie(id: number) {
    const targetMovieIndex = this.movies.findIndex(movie => movie.id === id);
    if (targetMovieIndex === -1) return;

    this.movies.splice(targetMovieIndex, 1);
    this.moviesSubject.next(this.movies);

    this.httpClient.delete(this.API_ENDPOINTS.delete(id)).subscribe();
  }
}