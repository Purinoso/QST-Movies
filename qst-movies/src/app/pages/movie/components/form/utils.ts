import { ValidationErrors, AbstractControl } from "@angular/forms";

export function timeNotZeroValidator(timeGroup: AbstractControl): ValidationErrors | null {
    const hours = timeGroup.get('hours')?.value;
    const minutes = timeGroup.get('minutes')?.value;

    if (hours === 0 && minutes === 0) {
        return { timeNotZero: true };
    }

    return null;
}

export function maxDateExceededValidator(maxDate: Date) {
    return (datePicker: AbstractControl): ValidationErrors | null => {
        const selectedDate: Date = datePicker.value;
        
        if (selectedDate && selectedDate > maxDate) {
            return { maxDateExceeded: true };
        }
        return null;
    }
}