import { ElementRef, HostListener } from '@angular/core';
import { Directive } from '@angular/core';
import { LeftMenuComponent } from '../component/left-menu/left-menu.component';

@Directive({
  selector: '[appChildMenuLeft]',
})
export class ChildMenuLeftDirective {
  constructor(
    private elementRef: ElementRef,
    private leftMenuComponent: LeftMenuComponent
  ) {}
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    event.stopPropagation();
    if (
      (this.elementRef.nativeElement as HTMLElement).className.includes(
        'selected'
      ) &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.leftMenuComponent.hideChildMenu();
    }
  }
}
