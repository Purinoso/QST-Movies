import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import Movie from '@/interfaces/movie.interface';

@Component({
  selector: 'form-movie',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './form-movie.component.html',
  styleUrl: './form-movie.component.css'
})
export default class FormMovieComponent {
  // @Input() movie?: Movie;
  // @Output() formSubmit = new EventEmitter<Movie>();

  // movieForm = new FormGroup({
  //   name: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.,-\/]+$/)
  //   ]),
  //   department: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.,-\/]+$/)
  //   ]),
  //   jobTitle: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.,-\/]+$/)
  //   ])
  // })

  // getErrorMessage(formControl: FormControl) {
  //   return formControl.hasError('required') ? 'Este campo es requerido.' : 'Solo se admiten letras, espacios y algunos caracteres especiales.';
  // }

  // ngOnInit() {
  //   if (this.movie) {
  //     this.movieForm.controls.name.setValue(this.movie.name);
  //     this.movieForm.controls.department.setValue(this.movie.department);
  //     this.movieForm.controls.jobTitle.setValue(this.movie.jobTitle);
  //   }
  // }

  // handleSubmit() {
  //   const submittedMovie: Movie = {
  //     id: this.movie?.id,
  //     name: this.movieForm.controls.name.value!,
  //     jobTitle: this.movieForm.controls.jobTitle.value!,
  //     department: this.movieForm.controls.department.value!
  //   }

  //   this.formSubmit.emit(submittedMovie);
  // }
}