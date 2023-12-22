import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';

import Movie from '@/interfaces/movie.interface';
import MovieService from '@/services/movie/movie.service';

@Component({
  selector: 'app-card-movie',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  templateUrl: './card-movie.component.html',
  styleUrl: './card-movie.component.css'
})
export default class CardMovieComponent implements OnInit {
  private movieService: MovieService = inject(MovieService);

  @Input() movie!: Movie;
  @Input() isOnWatchlist!: boolean;
  @Output() detailsClicked = new EventEmitter<number>();
  @Output() watchlistClicked = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<number>();
  @Output() deleteClicked = new EventEmitter<number>();
  
  ngOnInit(): void {
    if (!this.movie.imageUrl) this.movieService.loadImage(this.movie.id)!.subscribe();
  }
}