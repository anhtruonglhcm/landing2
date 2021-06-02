import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appQuickEditor]',
})
export class QuickEditorDirective {
  constructor(private el: ElementRef, private renderer2: Renderer2) {}
  setPosition(top: number, left: number) {
    debugger;
    this.renderer2.setStyle(this.el.nativeElement, 'top', top);
    this.renderer2.setStyle(this.el.nativeElement, 'left', left);
  }
}
