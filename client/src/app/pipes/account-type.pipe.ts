import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'accountType'
})
export class AccountTypePipe implements PipeTransform {
    transform(value: string): string {
        if (value === "ADMIN") {
            return "Administrateur";
        }
        else if (value === "MANAGER") {
            return "Gestionnaire";
        }
        else if (value === "USER") {
            return "Usager";
        }
        return "";
    }
}

@Pipe({
    name: 'state'
})
export class StatePipe implements PipeTransform {
    transform(value: string): string {
        if (value === "IN_PROGRESS") {
            return "En cours";
        }
        else if (value === "COMPLETED") {
            return "Complété";
        }
        else if (value === "ARCHIVED") {
            return "Archivé";
        }
        else if (value === "CANCELED") {
            return "Annulé";
        }
        return "";
    }
}