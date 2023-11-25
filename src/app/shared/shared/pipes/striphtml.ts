import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'striphtml'
})

export class StripHtmlPipe implements PipeTransform {
    transform(value: string): any {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = value;
        return tmp.textContent || tmp.innerText || "";
    }
}