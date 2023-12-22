import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import SnackBarMessageService from './services/snack-bar-message/snack-bar-message.service';
import InfoSnackBarComponent from './components/info-snack-bar/info-snack-bar.component';
import MovieService from './services/movie/movie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export default class AppComponent implements OnInit {
  private snackBarMessageService: SnackBarMessageService = inject(SnackBarMessageService);
  private snackBarService: MatSnackBar = inject(MatSnackBar);
  private movieService: MovieService = inject(MovieService);

  title = 'qst-movies';
  private readonly infoSnackBarDuration = 10

  ngOnInit(): void {
    this.movieService.getMoviesSubject().subscribe();

    this.snackBarMessageService.getSnackBarMessageSubject().subscribe(message => {
      this.snackBarService.openFromComponent(InfoSnackBarComponent, {
        data: message,
        duration: this.infoSnackBarDuration * 1000
      })
    });
  }
}