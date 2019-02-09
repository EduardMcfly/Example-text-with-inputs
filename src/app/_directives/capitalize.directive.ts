import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'input[capitalize]',
  // When the user updates the input
  host: {
    /* "(input)": "ref.nativeElement.value=$event.target.value.toUpperCase()" */
  }
})
export class CapitalizeDirective {
  constructor(e: ElementRef) {
    e.nativeElement.onkeyup = e => {
      const value = e.target.value.toUpperCase();
      e.target.value = value;
    };
  }
}
