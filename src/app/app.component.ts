import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ISection } from './models/section.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public sectionArray: ISection[];
  @ViewChild('container', { static: true }) container: ElementRef;
  @ViewChild('ladiheading', { static: true }) ladiheading: ElementRef;
  constructor(private renderer2: Renderer2) {}
  ngOnInit(): void {}
  addElement() {
    let ele = this.ladiheading.nativeElement;
    this.renderer2.appendChild(this.container.nativeElement, ele);
  }
}
