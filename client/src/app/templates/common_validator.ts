import { AbstractControl } from '@angular/forms';

export function TestPositive(form: AbstractControl) {
    if (form.value !== null && typeof form.value === 'number') {
        if (form.value < 0) {
            return { negative: true };
        } else {
            return null;
        }
    } else {
        return { nan: true };
    }
}

export let PhoneRegex = '\\d?([.-\\s]?\\d){10}\.*';