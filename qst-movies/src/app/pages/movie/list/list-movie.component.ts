import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import MovieService from '@/services/movie/movie.service';
import Movie from '@/interfaces/movie.interface';
import CardMovieComponent from './components/card/card-movie.component';
import WatchlistService from '@/services/watchlist/watchlist.service';

@Component({
  selector: 'app-list-movie',
  standalone: true,
  imports: [
    CardMovieComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './list-movie.component.html',
  styleUrl: './list-movie.component.css'
})
export default class ListMovieComponent {
  movies: Movie[] = [];
  moviesOnWatchlist: Record<number, boolean> = {};
  sortModeSelector = new FormControl('');
  
  private router: Router = inject(Router);
  private movieService: MovieService = inject(MovieService);
  private watchlistService: WatchlistService = inject(WatchlistService);

  constructor() {
    this.movieService.getMoviesSubject().subscribe(movies => {
      this.movies = movies;
    });

    this.watchlistService.getWatchlistSubject().subscribe(watchlist => {
      watchlist.map(watchlistItem => {
        this.moviesOnWatchlist[watchlistItem.movieId] = true;
      })
    });
  }

  handleDetailsClicked(movieId: number) {
    this.router.navigate(['movie/details', movieId]);
  }

  handleWatchlistClicked(movieId: number) {
    if (this.moviesOnWatchlist[movieId]) {
      this.watchlistService.removeFromWatchlist(movieId);
      this.moviesOnWatchlist[movieId] = false;
    } else {
      this.watchlistService.addToWatchlist(movieId);
    }
  }

  handleEditClicked(movieId: number) {
    this.router.navigate(['movie/edit', movieId]);
  }

  handleDeleteClicked(movieId: number) {
    this.movieService.deleteMovie(movieId);
  }

  handleSortModeSelectedChanged() {
    switch (this.sortModeSelector.value) {
      case 'title':
          this.movies.sort((a: Movie, b: Movie) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
          
            if (titleA < titleB) {
              return -1;
            } else if (titleA > titleB) {
              return 1;
            } else {
              return 0;
            }
          });
        break;
        
        case 'releaseDate':
          this.movies.sort((a: Movie, b: Movie) => {
            const dateA = new Date(a.releaseDate);
            const dateB = new Date(b.releaseDate);
            
            return dateA.getTime() - dateB.getTime();
          });
        break;

      default:
        break;
    }
  }
}