import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import FormMovieComponent from '../components/form/form-movie.component';
import MovieService from '@/services/movie/movie.service';
import MovieCommand from '@/classes/movie-command';

@Component({
  selector: 'app-create-movie',
  standalone: true,
  imports: [
    FormMovieComponent
  ],
  templateUrl: './create-movie.component.html',
  styleUrl: './create-movie.component.css'
})
export default class CreateMovieComponent {
  private movieService: MovieService = inject(MovieService);
  private router: Router = inject(Router);
  private nextMovieId: number | undefined;

  constructor() {
    this.movieService.getMoviesSubject().subscribe(movies => {
      this.nextMovieId = movies[movies.length - 1]?.id + 1 ?? 1;
    });
  }

  onFormSubmit(movieCommand: MovieCommand) {
    movieCommand.id = this.nextMovieId;
    this.movieService.addMovie(movieCommand);

    this.router.navigate(['movie/list']);
  }
}
