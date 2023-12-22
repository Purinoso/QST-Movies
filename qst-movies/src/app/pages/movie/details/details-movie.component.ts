import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import Movie from '@/interfaces/movie.interface';
import MovieService from '@/services/movie/movie.service';
import WatchlistService from '@/services/watchlist/watchlist.service';

@Component({
  selector: 'app-details-movie',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './details-movie.component.html',
  styleUrl: './details-movie.component.css'
})
export default class DetailsMovieComponent {
  movie!: Movie;
  isOnWatchlist: boolean = false;

  private movieService: MovieService = inject(MovieService);
  private watchlistService: WatchlistService = inject(WatchlistService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  constructor() {
    const movieId = Number(this.activatedRoute.snapshot.params['id']);
    const movie = this.movieService.getMovie(movieId);

    if (!movie) {
      this.router.navigate(['movie/list']);
      return;
    } else {
      this.movie = movie;
      this.isOnWatchlist = this.watchlistService.getWatchlistItem(movieId) !== undefined;
      
      if (!this.movie.imageUrl) this.movieService.loadImage(this.movie.id)!.subscribe();
    }
  }

  // Getter para 'sanitizar' el URL para el iFrame de YouTube embebido.
  get embedTrailerLink(): SafeResourceUrl {
    const embedTrailerLink = 'https://www.youtube.com/embed/' + this.movie.trailerLink.split('?v=')[1];
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedTrailerLink);
  }

  handleWatchlistClicked() {
    this.isOnWatchlist
    ? this.watchlistService.removeFromWatchlist(this.movie.id)
    : this.watchlistService.addToWatchlist(this.movie.id);

    this.isOnWatchlist = !this.isOnWatchlist;
  }

  handleEditClicked() {
    this.router.navigate(['movie/edit', this.movie.id]);
  }

  handleDeleteClicked() {
    this.movieService.deleteMovie(this.movie.id);
  }
}