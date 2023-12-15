import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import MovieService from '@/services/movie/movie.service';
import Movie from '@/interfaces/movie.interface';
import CardMovieComponent from './components/card/card-movie.component';

@Component({
  selector: 'app-list-movie',
  standalone: true,
  imports: [
    CommonModule,
    CardMovieComponent
  ],
  templateUrl: './list-movie.component.html',
  styleUrl: './list-movie.component.css'
})
export default class ListMovieComponent {
  private router: Router = inject(Router);
  private movieService: MovieService = inject(MovieService);
  movies: Movie[] = [];

  constructor() {
    this.movieService.getMoviesSubject().subscribe(movies => {
      this.movies = movies;
    });
  }

  handleDetailsClicked(movieId: number) {
    this.router.navigate(['movie/details', movieId]);
  }

  handleWatchListClicked(movieId: number) {
    // TO DO: watchListService
  }

  handleEditClicked(movieId: number) {
    this.router.navigate(['movie/edit', movieId]);
  }

  handleDeleteClicked(movieId: number) {
    this.movieService.deleteMovie(movieId);
  }
}