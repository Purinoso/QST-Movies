import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import WatchlistItem from '@/interfaces/watchlist-item.interface';
import MovieService from '../movie/movie.service';
import SnackBarMessageService from '../snack-bar-message/snack-bar-message.service';

@Injectable({
  providedIn: 'root',
})
export default class WatchlistService {
  private WATCHLIST_KEY = 'watchlist';
  private watchlist: WatchlistItem[] = [];
  private watchlistSubject: BehaviorSubject<WatchlistItem[]> = new BehaviorSubject<WatchlistItem[]>([]);

  private movieService: MovieService = inject(MovieService);
  private snackBarMessageService: SnackBarMessageService = inject(SnackBarMessageService);

  constructor() {
    const watchlist: WatchlistItem[] = JSON.parse(localStorage.getItem(this.WATCHLIST_KEY) || '[]');
    this.watchlist = watchlist;
    this.watchlistSubject.next(this.watchlist);
  }

  private createWatchlistItem(movieId: number): WatchlistItem | undefined {
    const movie = this.movieService.getMovie(movieId);
    if (!movie) return;
    
    const watchlistItem: WatchlistItem = {
      movieId: movieId,
      watched: false
    };

    return watchlistItem;
  }

  getWatchlistSubject(): BehaviorSubject<WatchlistItem[]> {
    return this.watchlistSubject;
  }

  getWatchlistItem(movieId: number): WatchlistItem | undefined {
    return this.watchlist.find(watchlistItem => watchlistItem.movieId === movieId);
  }

  addToWatchlist(movieId: number) {
    if (this.getWatchlistItem(movieId)) {
      this.snackBarMessageService.showMessage('The movie is already in your Watchlist.');
      return
    }
    
    const watchlistItem = this.createWatchlistItem(movieId);
    if (!watchlistItem) {
      this.snackBarMessageService.showMessage('The movie could not be added to the Watchlist.');
      return
    }

    this.watchlist.push(watchlistItem);
    this.watchlistSubject.next(this.watchlist);
    localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(this.watchlist));
  }

  removeFromWatchlist(movieId: number) {
    const targetWatchlistItemIndex = this.watchlist.findIndex(watchlistItem => watchlistItem.movieId === movieId);
    if (targetWatchlistItemIndex === -1) return;

    this.watchlist.splice(targetWatchlistItemIndex, 1);
    this.watchlistSubject.next(this.watchlist);
    localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(this.watchlist));
  }

  isOnWatchlist(movieId: number): boolean {
    return this.getWatchlistItem(movieId) !== undefined;
  }
}