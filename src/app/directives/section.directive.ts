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
import { fromEvent, of, Subject, Subscription } from 'rxjs';
import {
  concatMap,
  first,
  last,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { CommonService } from '../services/common.service';
import { BuilderEditorComponent } from '../component/builder-editor/builder-editor.component';
import { CreateHtmlElementService } from '../services/create-html-element.service';
import { THROTTLE_TIME } from '../constant/config.constant';

@Directive({
  selector: '[appSection]',
})
export class SectionDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  // public selectionSelected: ISection;
  private _sectionResizeBottom: HTMLElement;
  private _sectionSelectedInsert: HTMLElement;
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
  //   console.log('up section');
  //   this._clearSub();
  // }
  @HostListener('click', ['$event']) onClickSection(event) {
    this._clearSub();
    if (this._dragable) {
      this._getSectionResizeBottom();
      this.renderer2.appendChild(
        this.el.nativeElement,
        this._sectionResizeBottom
      );
      this.builderEditorComponent.setSectionSelect(this.el.nativeElement);
      this.initResize();

      const buttonAddSection = this.el.nativeElement.querySelectorAll(
        '.ladi-button-add-section'
      );
      const resizeElement = this.el.nativeElement.querySelectorAll(
        '.ladi-resize-display'
      );
      const clickResizeSection: Subscription = fromEvent<MouseEvent>(
        resizeElement,
        'click'
      ).subscribe((event: MouseEvent) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
      });
      const clickAddSectionSub: Subscription = fromEvent<MouseEvent>(
        buttonAddSection,
        'click'
      ).subscribe((event: MouseEvent) => {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.builderEditorComponent.addNewSection();
      });
      this.subscriptions.push.apply(this.subscriptions, [
        clickResizeSection,
        clickAddSectionSub,
      ]);
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event) {
    if (!this.el.nativeElement.contains(event.target)) {
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
    const mouseUpElement$ = fromEvent<MouseEvent>(
      this.el.nativeElement,
      'mouseup'
    );
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
    let dragEndSub: Subscription;
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      initialY = event.clientY - currentY;
      dragSub = drag$
        .pipe(
          throttleTime(THROTTLE_TIME),
          concatMap((value, index) =>
            index === 0
              ? of(value).pipe(
                  tap(() => {
                    dragEndSub = dragEnd$.pipe(first()).subscribe(() => {
                      console.log('end resize section');
                      initialY = currentY;
                    });
                  })
                )
              : of(value)
          )
        )
        .subscribe((event: MouseEvent) => {
          event.stopPropagation();
          event.stopImmediatePropagation();
          currentY = event.clientY - initialY;
          this.builderEditorComponent.setHeightSection(currentY);
        });
    });
    const clickSub = clickElement$.subscribe((event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
    });
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
      clickSub,
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
