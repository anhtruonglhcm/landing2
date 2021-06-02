import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appElementDragging]'
})
export class ElementDraggingDirective {

  constructor() { }
  @HostListener('click',['$event']) onClick(event){
    console.log('element')
  }
}
