import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { fromEvent, interval, Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ISection } from 'src/app/models/section.model';
import { MenuChildAddNew } from 'src/app/constant/left-menu.constant';
import {
  BUTTON_DEFAULT,
  HEADLINE_DEFAULT,
} from 'src/app/constant/element.constant';
import { IWigetButton } from 'src/app/models/wiget-button.model';
import { debounceTime, last, take, takeLast, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

interface ISnap {
  left?: number;
  right?: number;
  center?: number;
}

@Component({
  selector: 'app-builder-editor',
  templateUrl: './builder-editor.component.html',
  styleUrls: ['./builder-editor.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderEditorComponent implements OnInit, OnDestroy {
  @ViewChild('quickEditor', { static: true }) quickEditor: ElementRef;
  @ViewChild('builderSnapLeft', { static: true }) builderSnapLeft: ElementRef;
  @ViewChild('builderSnapTop', { static: true }) builderSnapTop: ElementRef;
  public sectionArray: ISection[] = [];
  public hasSelectedElement: boolean;
  public quickEditorTop = 0;
  public quickEditorLeft = 0;
  public isDrag = true;
  public elementSelected: HTMLElement;
  public sectionSelected: HTMLElement;
  public snapLeft: number[] = [];
  public snapLeftElement: number[][] = [];
  public snapTop: number[] = [];
  public snapTopElement: number[][] = [];

  public elementIndex = 0;
  public sectionIndex = 0;
  // public TypeElement = TypeElement;
  public MenuChildAddNew = MenuChildAddNew;
  private _selectSelectedId: number | null;
  private _count: number;
  private _selectSelectedIndex: number | null;
  private _subjectOnDestroy: Subject<any> = new Subject();
  private _innerWidth: number;
  private _scrollTop: number;
  @ViewChild('sectionResize') sectionResize: ElementRef;
  constructor(
    private commonService: CommonService,
    private renderer2: Renderer2,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: any
  ) {}
  // @HostListener('document:scroll', ['$event']) handleScroll(event) {
  //   this._scrollTop = window.scrollY;
  // }
  ngOnInit(): void {
    this._count = 10;
    this._innerWidth = window.innerWidth;
    this._scrollTop = 0;
    this.hasSelectedElement = false;
    this.snapLeft.push((this._innerWidth - 960) / 2);
    this.snapLeft.push((this._innerWidth - 960) / 2 + 960);
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this._subjectOnDestroy), debounceTime(100))
      .subscribe(() => {
        this._scrollTop = window.scrollY;
      });
    // for (let i = 0; i < 50; i++) {
    //   this.snapLeft.push(i * 100);
    //   this.snapTop.push(i * 50);
    // }
  }
  ngOnDestroy(): void {
    this._subjectOnDestroy.next();
    this._subjectOnDestroy.complete();
  }
  addNewSection() {
    this.sectionArray.push({
      id: this._count,
      idSection: `SECTION${this._count}`,
      height: 360,
      element: [],
    });
    this._count++;
    this.snapTop.push(360 * this.sectionArray.length);
  }

  setPositionElement(currentX: number, currentY: number) {
    // this.sectionArray[this.sectionIndex].element[this.elementIndex].left =
    //   currentX;
    this.setSnapLeft(currentX, [
      ...this.snapLeft,
      ...[].concat(...this.snapLeftElement),
    ]);
    this.setSnapTop(currentY, [
      ...this.snapTop,
      ...[].concat(...this.snapTopElement),
    ]);
  }

  setSelectSelected(id: number | null) {
    // if (this._selectSelectedId === id) return;
    // this._selectSelectedId = id;
    // this._selectSelectedIndex = this.sectionArray.findIndex(
    //   (section) => section.id === id
    // );
  }
  setIsDrag(isDrag: boolean) {
    this.isDrag = isDrag;
  }
  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc handle when drag element start
   */
  startDragElement() {
    let snapTop =
      this.snapTopElement[this.sectionIndex * 10 + this.elementIndex];
    snapTop ? (snapTop.length = 0) : (snapTop = []);
    let snapLeft =
      this.snapLeftElement[this.sectionIndex * 10 + this.elementIndex];
    snapLeft ? (snapLeft.length = 0) : (snapLeft = []);
    console.log(this.snapTopElement);
  }
  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc handle when drag element stop
   */
  stopDragElement() {
    const element =
      this.sectionArray[this.sectionIndex].element[this.elementIndex];
    const index = this.sectionIndex * 10 + this.elementIndex;
    this.snapTopElement[index] = [element.top, element.top + element.height];
    this.snapLeftElement[index] = [element.left, element.left + element.width];
    console.log(this.snapLeftElement);
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc set Position for quick editor
   */
  setPositionQuickEditor(top: number, left: number) {
    let height = 0;
    let i = 0;
    for (; i < this._selectSelectedIndex; i++) {
      height += this.sectionArray[i].height;
    }
    const elementToTop =
      this.sectionArray[this.sectionIndex].element[this.elementIndex].top;
    this.quickEditorTop =
      elementToTop < 100
        ? top +
          height +
          this.sectionArray[this.sectionIndex].element[this.elementIndex]
            .height +
          60
        : top + height;
    this.quickEditorLeft = left > this._innerWidth / 2 ? left - 300 : left;
  }
  setIndex(elementIndex: number, sectionIndex: number) {
    this.elementIndex = elementIndex;
    this.sectionIndex = sectionIndex;
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc set snap hidden
   */
  hiddenSnap() {
    this.renderer2.addClass(this.builderSnapTop.nativeElement, 'ladi-hidden');
    this.renderer2.addClass(this.builderSnapLeft.nativeElement, 'ladi-hidden');
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc check to show snap follow ngang
   */
  setSnapTop(top: number, arr: number[]) {
    const elementHeight =
      this.sectionArray[this.sectionIndex].element[this.elementIndex].height;
    const bottomElementTop = top + elementHeight;
    const isShow = arr.some(
      (value) =>
        Math.abs(value - top) <= 5 || Math.abs(value - bottomElementTop) <= 5
    );
    if (isShow) {
      this.renderer2.removeClass(
        this.builderSnapTop.nativeElement,
        'ladi-hidden'
      );
      for (const value of arr) {
        if (Math.abs(value - top) <= 5) {
          this.sectionArray[this.sectionIndex].element[this.elementIndex].top =
            value;
          this.renderer2.setStyle(
            this.builderSnapTop.nativeElement,
            'top',
            value - this._scrollTop + 'px'
          );
          return;
        }

        if (Math.abs(value - bottomElementTop) <= 5) {
          this.sectionArray[this.sectionIndex].element[this.elementIndex].top =
            value - elementHeight;
          this.renderer2.setStyle(
            this.builderSnapTop.nativeElement,
            'top',
            value - this._scrollTop + 'px'
          );
          return;
        }
      }
    } else {
      this.sectionArray[this.sectionIndex].element[this.elementIndex].top = top;
      this.renderer2.addClass(this.builderSnapTop.nativeElement, 'ladi-hidden');
    }
  }
  setSnapLeft(left: number, arr: number[]) {
    const elemenWidth =
      this.sectionArray[this.sectionIndex].element[this.elementIndex].width;
    const rightElementLeft = left + elemenWidth;
    const isShow = arr.some(
      (value) =>
        Math.abs(value - left) <= 5 || Math.abs(value - rightElementLeft) <= 5
    );
    if (isShow) {
      this.renderer2.removeClass(
        this.builderSnapLeft.nativeElement,
        'ladi-hidden'
      );
      for (const value of arr) {
        if (Math.abs(value - left) <= 5) {
          this.sectionArray[this.sectionIndex].element[this.elementIndex].left =
            value;
          this.renderer2.setStyle(
            this.builderSnapLeft.nativeElement,
            'left',
            value + 'px'
          );
          console.log(value + '+' + left);
        }
        if (Math.abs(value - rightElementLeft) <= 5) {
          this.sectionArray[this.sectionIndex].element[this.elementIndex].left =
            value - elemenWidth;
          this.renderer2.setStyle(
            this.builderSnapLeft.nativeElement,
            'left',
            value + 'px'
          );
        }
      }
    } else {
      this.sectionArray[this.sectionIndex].element[this.elementIndex].left =
        left;
      this.renderer2.addClass(
        this.builderSnapLeft.nativeElement,
        'ladi-hidden'
      );
    }
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc delete element resize, size
   */

  setElementSelected(ele: HTMLElement) {
    if (this.elementSelected) {
      const ladiResize = this.elementSelected.querySelectorAll('.ladi-resize');
      const ladiSize = this.elementSelected.querySelectorAll('.ladi-size');
      ladiResize.forEach((e) => e.remove());
      ladiSize.forEach((e) => e.remove());
    }
    if (this.sectionSelected) {
      const ladiResize = this.sectionSelected.querySelectorAll('.ladi-resize');
      ladiResize.forEach((e) => e.remove());
      this.setSelectSelected = null;
    }
    this.elementSelected = ele;
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc set Section clicked
   */

  setSectionSelect(el: HTMLElement) {
    this.sectionSelected = el;
  }
  setHeightSection(height: number) {
    this.sectionArray[this._selectSelectedIndex].height = height;
  }
  setIndexSelect(index) {
    this._selectSelectedIndex = index;
  }

  setHasSelected(isSelected: boolean) {
    this.hasSelectedElement = isSelected;
  }

  addElement(elementType: MenuChildAddNew) {
    console.log(elementType);
    if (this.sectionArray.length === 0) {
      this.addNewSection();
    }
    switch (elementType) {
      case MenuChildAddNew.BUTTON: {
        this.sectionArray[this._selectSelectedIndex | 0].element.push({
          id: this._count,
          idSection: this._selectSelectedIndex | 0,
          height: BUTTON_DEFAULT.HEIGHT,
          width: BUTTON_DEFAULT.WIDTH,
          top:
            (this.sectionArray[this._selectSelectedIndex | 0].height -
              BUTTON_DEFAULT.HEIGHT) /
            2,
          left: (this._innerWidth - BUTTON_DEFAULT.WIDTH) / 2,
          elementType: MenuChildAddNew.BUTTON,
          innerHtml: BUTTON_DEFAULT.INNER_HTML,
        });
        this._count++;
        this.setPositionQuickEditor(
          (this.sectionArray[this._selectSelectedIndex | 0].height -
            BUTTON_DEFAULT.HEIGHT) /
            2 -
            50,
          (this._innerWidth - BUTTON_DEFAULT.WIDTH) / 2
        );
        break;
      }

      case MenuChildAddNew.TITLE: {
        this.sectionArray[this._selectSelectedIndex | 0].element.push({
          id: this._count,
          idSection: this._selectSelectedIndex | 0,
          width: HEADLINE_DEFAULT.WIDTH,
          height: HEADLINE_DEFAULT.HEIGHT,
          top:
            (this.sectionArray[this._selectSelectedIndex | 0].height -
              HEADLINE_DEFAULT.HEIGHT) /
            2,
          left: (this._innerWidth - HEADLINE_DEFAULT.WIDTH) / 2,
          elementType: MenuChildAddNew.TITLE,
          innerHtml: HEADLINE_DEFAULT.INNER_HTML,
        });
        this.setPositionQuickEditor(
          (this.sectionArray[this._selectSelectedIndex | 0].height -
            HEADLINE_DEFAULT.HEIGHT) /
            2 -
            50,
          (this._innerWidth - HEADLINE_DEFAULT.WIDTH) / 2
        );
        this._count++;
        break;
      }
    }
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc handle when blur element (contenteditable)
   */
  blur(event, indexElement: number, indexSection: number) {
    (
      this.sectionArray[indexSection].element[indexElement] as IWigetButton
    ).innerHtml = event.target.innerText;
    console.log(this.sectionArray);
  }
}

// kk
// [innerHTML]="itemElement.innerHtml"
// (blur)="blur($event, indexElement, indexSection)"
