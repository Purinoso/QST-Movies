import { Routes } from '@angular/router';

import CreateMovieComponent from '@/pages/movie/create/create-movie.component';
import DetailsMovieComponent from '@/pages/movie/details/details-movie.component';
import EditMovieComponent from '@/pages/movie/edit/edit-movie.component';
import ListMovieComponent from '@/pages/movie/list/list-movie.component';

export const routes: Routes = [
    { path: 'movie/list', title: 'Movie list', component: ListMovieComponent },
    { path: 'movie/create', title: 'Create movie', component: CreateMovieComponent },
    { path: 'movie/edit/:id', title: 'Edit movie', component: EditMovieComponent },
    { path: 'movie/details/:id', title: 'Movie details', component: DetailsMovieComponent },
    { path: '', redirectTo: 'movie/list', pathMatch: 'full' },
    { path: '**', redirectTo: 'movie/list' },
];