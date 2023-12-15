import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

import Movie from '@/interfaces/movie.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-movie',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './card-movie.component.html',
  styleUrl: './card-movie.component.css'
})
export default class CardMovieComponent {
  @Input() movie!: Movie;
  @Output() detailsClicked = new EventEmitter<number>();
  @Output() watchListClicked = new EventEmitter<number>();
  @Output() editClicked = new EventEmitter<number>();
  @Output() deleteClicked = new EventEmitter<number>();
}