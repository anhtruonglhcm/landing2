import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISection } from './models/section.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public sectionArray: ISection[];
  private _innerWidth: number = 0;
  @ViewChild('builderBorderLeft', { static: true })
  builderBorderLeft: ElementRef;
  @ViewChild('builderBorderRight', { static: true })
  builderBorderRight: ElementRef;
  constructor(@Inject(Renderer2) private renderer2: Renderer2) {}
  ngOnInit(): void {
    this._innerWidth = window.innerWidth;
    this.renderer2.setStyle(
      this.builderBorderLeft.nativeElement,
      'left',
      (this._innerWidth - 960) / 2 + 'px'
    );
    this.renderer2.setStyle(
      this.builderBorderRight.nativeElement,
      'right',
      (this._innerWidth - 960) / 2 - 7 + 'px'
    );
    console.log(window.innerHeight);
  }
  addElement() {
    // let ele = this.ladiheading.nativeElement;
    // this.renderer2.appendChild(this.container.nativeElement, ele);
  }
}
