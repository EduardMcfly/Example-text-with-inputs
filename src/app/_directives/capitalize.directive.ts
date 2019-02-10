import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "input[capitalize-app]"
})
export class CapitalizeDirective {
  constructor(eNative: ElementRef) {
    eNative.nativeElement.onkeyup = e => {
      const value = e.target.value.toUpperCase();
      e.target.value = value;
    };
  }
}
