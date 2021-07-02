import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { CommonService } from '../services/common.service';
import { BuilderEditorComponent } from '../component/builder-editor/builder-editor.component';
import { CreateHtmlElementService } from '../services/create-html-element.service';

@Directive({
  selector: '[appSection]',
})
export class SectionDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  // public selectionSelected: ISection;
  private _sectionResizeBottom: HTMLElement;
  private _sectionSelectedInsert: HTMLElement;
  private _clickAddSectionSub: Subscription;
  private _clickResizeSection: Subscription;
  private _mouseUpSub: Subscription;
  private _dragable: boolean;
  private _subjectUnsub = new Subject();
  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: any,
    private commonService: CommonService,
    private builderEditorComponent: BuilderEditorComponent,
    private createHtmlElementService: CreateHtmlElementService,
    private renderer2: Renderer2
  ) {}
  ngOnInit(): void {
    this._dragable = true;
    this.commonService.isClickSection
      .asObservable()
      .pipe(takeUntil(this._subjectUnsub))
      .subscribe((isClick: boolean) => {
        this._dragable = isClick;
      });
  }

  ngOnDestroy(): void {
    this._clearSub();
    this._subjectUnsub.next();
    this._subjectUnsub.complete();
  }

  setDragable(isDrag: boolean) {
    this._dragable = isDrag;
  }
  @HostListener('focusout', ['$event']) onMousep(event: MouseEvent) {
    console.log('focusout');
  }
  // @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
  //   console.log(event);
  //   this._clearSub();
  // }
  @HostListener('click', ['$event']) onClickSection(event) {
    if (this._dragable) {
      this._getSectionResizeBottom();
      this.renderer2.appendChild(
        this.el.nativeElement,
        this._sectionResizeBottom
      );
      this.builderEditorComponent.setSectionSelect(this.el.nativeElement);
      if (!this.subscriptions.length) {
        this.initResize();
      }

      const buttonAddSection = this.el.nativeElement.querySelectorAll(
        '.ladi-button-add-section'
      );
      const resizeElement = this.el.nativeElement.querySelectorAll(
        '.ladi-resize-display'
      );
      this._clickResizeSection = fromEvent<MouseEvent>(
        resizeElement,
        'click'
      ).subscribe((event: MouseEvent) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      });
      this._clickAddSectionSub = fromEvent<MouseEvent>(
        buttonAddSection,
        'click'
      ).subscribe((event: MouseEvent) => {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.builderEditorComponent.addNewSection();
      });
      // this._mouseUpSub = fromEvent<MouseEvent>(
      //   buttonAddSection,
      //   'mouseup'
      // ).subscribe((event: MouseEvent) => {
      //   'mouse up button';
      //   event.stopImmediatePropagation();
      //   event.stopPropagation();
      // });
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this._clickAddSectionSub) {
        this._clickAddSectionSub.unsubscribe();
      }
      if (this._sectionResizeBottom) {
        this.renderer2.removeChild(
          this.el.nativeElement,
          this._sectionResizeBottom
        );
      }
      this._clearSub();
    }
  }
  initResize(): void {
    const sectionId: string = this.el.nativeElement.dataset.id;
    const resizeElement = this.el.nativeElement.querySelectorAll(
      '.ladi-resize-display'
    );
    const clickElement$ = fromEvent<MouseEvent>(resizeElement, 'click');
    const dragStart$ = fromEvent<MouseEvent>(resizeElement, 'mousedown');
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const mouseUp$ = fromEvent<MouseEvent>(resizeElement, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );
    let initialY: number,
      currentY =
        Number(this.el.nativeElement.style.height.replace('px', '')) || 0;
    let dragSub: Subscription;
    let clickSub: Subscription;
    let mouseUpSub: Subscription;
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      initialY = event.clientY - currentY;
      dragSub = drag$.pipe(throttleTime(15)).subscribe((event: MouseEvent) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        currentY = event.clientY - initialY;
        this.builderEditorComponent.handSectionResize(currentY, sectionId);
      });
    });
    clickSub = clickElement$.subscribe((event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
    });
    const dragEndSub = dragEnd$.subscribe((event: MouseEvent) => {
      console.log(sectionId);
      // const lastY = event.clientY - initialY;
      // this.builderEditorComponent.handleStopResizeSection(lastY, sectionId);
      initialY = currentY;
      if (dragSub) {
        dragSub.unsubscribe();
      }
      if (clickSub) {
        clickSub.unsubscribe();
      }
    });

    // 6
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
    ]);
  }

  private _clearSub() {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
    this.subscriptions.length = 0;
  }

  private _getSectionResizeBottom(): void {
    if (!this._sectionResizeBottom) {
      this._sectionResizeBottom =
        this.createHtmlElementService.getSectionResizeBottom();
    }
  }

  private _getSectionSelectedInsert(): void {
    if (!this._getSectionSelectedInsert) {
      this._sectionSelectedInsert =
        this.createHtmlElementService.getSectionSelectedInsert();
    }
  }
}
