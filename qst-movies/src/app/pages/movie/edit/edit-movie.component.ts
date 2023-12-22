import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import FormMovieComponent from '../components/form/form-movie.component';
import MovieCommand from '@/classes/movie-command';
import MovieService from '@/services/movie/movie.service';
import Movie from '@/interfaces/movie.interface';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [
    FormMovieComponent
  ],
  templateUrl: './edit-movie.component.html',
  styleUrl: './edit-movie.component.css'
})
export default class EditMovieComponent {
  movie?: Movie;

  private movieService: MovieService = inject(MovieService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {
    const movieId = Number(this.activatedRoute.snapshot.params['id']);
    const movie = this.movieService.getMovie(movieId);

    if (!movie) {
      this.router.navigate(['movie/list']);
    } else {
      this.movie = movie;
    }
  }

  onFormSubmit(movieCommand: MovieCommand) {
    this.movieService.udpateMovie(movieCommand);
    this.router.navigate(['movie/list']);
  }
}