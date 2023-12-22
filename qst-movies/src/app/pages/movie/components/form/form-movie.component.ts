import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { timeNotZeroValidator, maxDateExceededValidator } from './utils';
import Movie from '@/interfaces/movie.interface';
import Genre from '@/interfaces/genre.interface';
import MovieCommand from '@/classes/movie-command';
import GenreService from '@/services/genre/genre.service';
import MovieService from '@/services/movie/movie.service';
import SnackBarMessageService from '@/services/snack-bar-message/snack-bar-message.service';

@Component({
  selector: 'app-form-movie',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './form-movie.component.html',
  styleUrl: './form-movie.component.css'
})
export default class FormMovieComponent implements OnInit {
  maxDate: Date = new Date();
  genres: Genre[] = [];
  selectedImage: string | ArrayBuffer | null | undefined = null;
  selectedGenreIds: number[] = [];

  private genreService: GenreService = inject(GenreService);
  private movieService: MovieService = inject(MovieService);
  private snackBarMessageService: SnackBarMessageService = inject(SnackBarMessageService);

  @Input() movie?: Movie;
  @Output() formSubmit = new EventEmitter<MovieCommand>();
  
  movieForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.,-\/]+$/)
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.,-\/]+$/)
    ]),
    rating: new FormControl<number>(1, [
      Validators.required
    ]),
    duration: new FormGroup({
      hours: new FormControl<number>(1, [
        Validators.required,
        Validators.max(23),
        Validators.min(0)
      ]),
      minutes: new FormControl<number>(30, [
        Validators.required,
        Validators.max(59),
        Validators.min(0)
      ])
    }, [
      timeNotZeroValidator
    ]),
    releaseDate: new FormControl<Date>(this.maxDate, [
      Validators.required,
      maxDateExceededValidator(this.maxDate)
    ]),
    trailerLink: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+(&\S*)?$/)
    ]),
    image: new FormControl()
  })

  constructor() {
    this.genreService.getGenresSubject().subscribe(genres => {
      this.genres = genres;
    });
  }

  ngOnInit(): void {
    if (this.movie) {
      const match = this.movie.duration.match(/(\d+)h\s*(\d+)min/);
      const hours = Number(match![1]);
      const minutes = Number(match![2]);
      
      this.movieForm.controls.title.setValue(this.movie.title);
      this.movieForm.controls.description.setValue(this.movie.description);
      this.movieForm.controls.rating.setValue(this.movie.rating);
      this.movieForm.controls.duration.controls.hours.setValue(hours);
      this.movieForm.controls.duration.controls.minutes.setValue(minutes);
      this.movieForm.controls.releaseDate.setValue(new Date(this.movie.releaseDate));
      this.movieForm.controls.trailerLink.setValue(this.movie.trailerLink);

      this.selectedGenreIds = this.movie.genres.map(genre => genre.id);
      if (!this.movie.imageUrl) this.movieService.loadImage(this.movie.id)!.subscribe();
    }
  }

  getErrorMessage(formControl: FormControl) {
    if (formControl.hasError('required')) return 'This field is required';

    if (formControl.hasError('pattern')) return 'Incorrect format. Please use letters, spaces, and select special characters.';

    if (formControl.hasError('min')) return `The value entered must be greater than ${formControl.errors!['min'].min}.`;
    if (formControl.hasError('max')) return `The value entered must be less than ${formControl.errors!['max'].max}.`;

    return;
  }

  handleSelectedImageChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png']; // Tipos MIME permitidos para imágenes

      if (allowedTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImage = e.target?.result;
        };
  
        reader.readAsDataURL(file);
        return;
      }
    }

    this.snackBarMessageService.showMessage('Unsupported image format. Please use JPG or PNG formats.');
    this.selectedImage = null;
  }

  handleGenreSelectionChange(event: MatSelectionListChange) {
    this.selectedGenreIds = event.source.selectedOptions.selected.map(option => option.value);

    if (this.selectedGenreIds.length > 0 && this.movieForm.hasError('noGenresSelected')) this.movieForm.setErrors(null);
  }

  handleSubmit() {
    if (this.selectedGenreIds.length === 0) {
      this.movieForm.setErrors({ noGenresSelected: true });
      return;
    }

    const image = this.selectedImage ?? this.movie?.imageUrl;
    const movieCommand = new MovieCommand(
      this.movie?.version,
      this.movieForm.controls.title.value!,
      this.movieForm.controls.description.value!,
      this.movieForm.controls.rating.value!,
      this.movieForm.controls.trailerLink.value!,
      this.selectedGenreIds,
      {
        hours: this.movieForm.controls.duration.controls.hours.value!,
        minutes: this.movieForm.controls.duration.controls.minutes.value!
      },
      this.movieForm.controls.releaseDate.value!,
      image?.toString(),
      this.movie?.id
    );
    console.log(movieCommand);
    this.formSubmit.emit(movieCommand);
  }
}