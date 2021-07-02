import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { from, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import {
  concatMap,
  filter,
  first,
  last,
  map,
  mergeMap,
  switchMap,
  take,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { BuilderEditorComponent } from '../component/builder-editor/builder-editor.component';
import { QuickEditorComponent } from '../component/quick-editor/quick-editor.component';
import { CommonService } from '../services/common.service';
import { CreateHtmlElementService } from '../services/create-html-element.service';
import { SectionDirective } from './section.directive';

@Directive({
  selector: '[appDragging]',
  providers: [QuickEditorComponent],
})
export class DraggingDirective implements OnInit, OnChanges, OnDestroy {
  @Input('isDrag') isDrag: boolean;
  private element: HTMLElement;
  private subscriptions: Subscription[] = [];
  private wresize: HTMLElement;
  private eresize: HTMLElement;
  private selected: HTMLElement;
  private _elementResize = ['ladi-e-resize', 'ladi-w-resize'];
  private _elementEditor: HTMLElement;
  private _elementHover: HTMLElement;
  private _elementSelected: HTMLElement;
  private _sectionIsSelected: HTMLElement;
  private _elementSectionSelected: HTMLElement;
  private _elementResizeLeft: HTMLElement;
  private _elementResizeRight: HTMLElement;
  private _elementResizeTop: HTMLElement;
  private _elementResizeBottom: HTMLElement;

  private _isDeleteResize = true;
  private _isResizeTop = false;
  private _ladiParentSubscription: Subscription;
  private _dataId: string;
  constructor(
    private elementRef: ElementRef,
    private render2: Renderer2,
    private builderEditorComponent: BuilderEditorComponent,
    private quickEditorComponent: QuickEditorComponent,
    private commonService: CommonService,
    private _createHtmlElementService: CreateHtmlElementService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.element = this.elementRef.nativeElement as HTMLElement;
    this._isResizeTop = true;
    this._createElement();
    this._createObserver();
  }
  ngOnChanges(changes: SimpleChanges): void {}
  @HostListener('click', ['$event']) onClickElement(event: MouseEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    this._setIndexElementAndSection();
    this._ladiParentSelected(Number(this.element.dataset.sectionId) | 0);
    let left = Number(this.element.style.left.replace('px', '')) || 0;
    let top = Number(this.element.style.top.replace('px', '')) || 0;
    let height = Number(this.element.style.height.replace('px', '')) || 40;
    this.builderEditorComponent.setHasSelected(true);
    this.builderEditorComponent.setElementSelected(this.element);
    this.builderEditorComponent.setPositionQuickEditor(top - 50, left);
    if (this.isDrag) {
      this.initDrag();
    }
    if (this._ladiParentSubscription) {
      this._ladiParentSubscription.unsubscribe();
    }
    this.render2.appendChild(this.element, this._elementResizeLeft);
    this.render2.appendChild(this.element, this._elementResizeRight);
    if (this._isResizeTop) {
      this.render2.appendChild(this.element, this._elementResizeTop);
      this.render2.appendChild(this.element, this._elementResizeBottom);
    }
    this.render2.appendChild(this.element, this.selected);
    if (this._elementSelected) {
      this.render2.appendChild(this.element, this._elementSelected);
    }
    if (this._isResizeTop) {
      this._elementResize = [
        'ladi-e-resize',
        'ladi-w-resize',
        'ladi-n-resize',
        'ladi-s-resize',
      ];
    }
    const dragStartMerge$ = this._elementResize.map((ele) =>
      fromEvent<MouseEvent>(
        document.querySelectorAll(`.${ele}`),
        'mousedown'
      ).pipe(map((eventMouseDown) => ({ ele, eventMouseDown })))
    );
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );
    let dragSub: Subscription;
    const dragStartSub$ = merge(...dragStartMerge$).subscribe(
      ({ ele, eventMouseDown }) => {
        eventMouseDown.stopPropagation();
        let original_width = Number(this.element.style.width.replace('px', ''));
        let original_height = Number(
          this.element.style.height.replace('px', '')
        );
        let original_x = this.element.getBoundingClientRect().left;
        let original_y = this.element.getBoundingClientRect().top;
        let original_mouse_x = eventMouseDown.pageX;
        let original_mouse_y = eventMouseDown.pageY;
        dragSub = drag$
          .pipe(
            concatMap((value, index) =>
              index === 0
                ? of(value).pipe(
                    tap(() => {
                      this.builderEditorComponent.setHasSelected(false);
                      this._isDeleteResize = false;
                      this.commonService.isClickSection.next(false);
                    })
                  )
                : of(value)
            )
          )
          .subscribe((event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (ele === 'ladi-e-resize') {
              const newWidth =
                event.pageX - this.element.getBoundingClientRect().left;
              this.render2.setStyle(this.element, 'width', newWidth + 'px');
            }
            if (ele === 'ladi-w-resize') {
              const width = original_width - (event.pageX - original_mouse_x);
              const left = original_x + (event.pageX - original_mouse_x);
              this.render2.setStyle(this.element, 'width', width + 'px');
              this.render2.setStyle(this.element, 'left', left + 'px');
            }
            if (ele === 'ladi-s-resize') {
              const newHeight =
                event.pageY - this.element.getBoundingClientRect().top;
              this.render2.setStyle(this.element, 'height', newHeight + 'px');
            }
            if (ele === 'ladi-n-resize') {
              const height = original_height - (event.pageY - original_mouse_y);
              const top = original_y + (event.pageY - original_mouse_y);
              this.render2.setStyle(this.element, 'height', height + 'px');
              this.render2.setStyle(this.element, 'top', top + 'px');
            }
          });
      }
    );

    dragEnd$.pipe().subscribe((event: MouseEvent) => {
      event.stopPropagation();
      this.builderEditorComponent.setHasSelected(true);
      setTimeout(() => {
        this.commonService.isClickSection.next(true);
        this._isDeleteResize = true;
      }, 200);
      if (dragSub) {
        dragSub.unsubscribe();
      }
      if (dragStartSub$) {
        dragStartSub$.unsubscribe();
      }
    });
  }

  @HostListener('dblclick', ['$event']) onDbClick(event: MouseEvent) {
    this._elementEditor = this.element.querySelectorAll(
      '.ladi-headline'
    )[0] as HTMLElement;
    this.render2.setAttribute(this._elementEditor, 'contenteditable', 'true');
    this.builderEditorComponent.setIsDrag(false);
    this._clearSub();
  }
  @HostListener('blur', ['$event']) onBlur(event: MouseEvent) {
    console.log('blur');
  }
  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    // event.stopPropagation();
  }

  @HostListener('mouseenter', ['$event']) onMouseenter(event: MouseEvent) {
    if (!this._dataId) {
      this._dataId = this.element.dataset.id;
    }
    if (!this._elementHover) {
      let elementHover = this.render2.createElement('div');
      this.render2.addClass(elementHover, 'ladi-hover');
      this.render2.setAttribute(elementHover, 'data-id', this._dataId);
      this._elementHover = elementHover;
    }
    this.render2.appendChild(this.element, this._elementHover);
  }
  @HostListener('mouseleave', ['$event']) onMouseleave(event: MouseEvent) {
    console.log('leave');
    if (this._elementHover) {
      this.render2.removeChild(this.element, this._elementHover);
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (!this._elementSelected) {
        this._elementSelected = this.element.querySelectorAll(
          '.ladi-selected'
        )[0] as HTMLElement;
      }
      if (this._elementSelected) {
        this.render2.removeChild(this.element, this._elementSelected);
      }

      // this._clearSub();
      if (
        this.element.contains(this._elementResizeLeft) &&
        this._isDeleteResize
      ) {
        this.render2.removeChild(this.element, this._elementResizeLeft);
        this.render2.removeChild(this.element, this._elementResizeRight);
        this.render2.removeChild(this.element, this.selected);
        if (this._isResizeTop) {
          this.render2.removeChild(this.element, this._elementResizeTop);
          this.render2.removeChild(this.element, this._elementResizeBottom);
        }
      }
      if (this._elementEditor) {
        this.render2.removeAttribute(this._elementEditor, 'contenteditable');
        this.builderEditorComponent.setIsDrag(true);
      }
      if (this._elementSectionSelected) {
        this.render2.removeChild(this._sectionIsSelected, this.selected);
      }
      this.builderEditorComponent.setHasSelected(false);
    }
  }
  initDrag(): void {
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const dragStart$ = fromEvent<MouseEvent>(this.element, 'mousedown').pipe(
      takeUntil(dragEnd$)
    );
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );
    let initialX: number,
      initialY: number,
      currentX = Number(this.element.style.left.replace('px', '')) || 0,
      currentY = Number(this.element.style.top.replace('px', '')) || 0;
    let dragSub: Subscription;
    const mouseDrag$: Observable<{ currentY: number; currentX: number }> =
      dragStart$.pipe(
        switchMap((mouseDownEvent) => {
          initialX = mouseDownEvent.clientX - currentX;
          initialY = mouseDownEvent.clientY - currentY;
          this._setIndexElementAndSection();
          return drag$.pipe(
            switchMap((value, index) =>
              index === 0
                ? of(value).pipe(
                    tap(() => {
                      this.element.classList.add('free-dragging');
                      this.quickEditorComponent.setShowColor(false);
                      this.builderEditorComponent.setHasSelected(false);
                      this.builderEditorComponent.handleStartDragElement();
                    })
                  )
                : of(value)
            ),
            map((mouseMoveEvent) => {
              mouseMoveEvent.preventDefault();
              return {
                currentX: mouseMoveEvent.clientX - initialX,
                currentY: mouseMoveEvent.clientY - initialY,
              };
            }),
            tap((u) =>
              this.builderEditorComponent.setPositionElement(
                u.currentX,
                u.currentY
              )
            )
          );
        })
      );
    const dragStartSub = mouseDrag$.subscribe();
    const dragEndSub = dragEnd$.pipe().subscribe(() => {
      initialX = currentX;
      initialY = currentY;
      this.element.classList.remove('free-dragging');
      this.builderEditorComponent.setHasSelected(true);
      this.builderEditorComponent.hiddenSnap();
      this.builderEditorComponent.stopDragElement();
      if (dragEndSub) {
        dragEndSub.unsubscribe();
      }
    });

    // 6
    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
    ]);
  }
  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 05-06-2021
   * @modify date 05-06-2021
   * @desc set index for element and section were selected
   */
  private _setIndexElementAndSection() {
    const elementIndex = Number(this.element.dataset.elementindex);
    const sectionIndex = Number(this.element.dataset.sectionindex);
    this.builderEditorComponent.setIndex(elementIndex, sectionIndex);
  }

  private _ladiParentSelected(sectionIndex: number) {
    this._sectionIsSelected = this.element.parentElement;
    if (!this._elementSectionSelected) {
      let el = this.render2.createElement('div');
      this.render2.addClass(el, 'ladi-parent-selected');
      this._elementSectionSelected = el;
    }
    this.render2.appendChild(
      this._sectionIsSelected,
      this._elementSectionSelected
    );
  }

  private _createElement() {
    this._elementResizeLeft =
      this._elementResizeLeft ||
      this._createHtmlElementService.getEleResizeLeft();
    this._elementResizeRight =
      this._elementResizeRight ||
      this._createHtmlElementService.getEleResizeRight();
    if (this._isResizeTop) {
      this._elementResizeTop =
        this._elementResizeTop ||
        this._createHtmlElementService.getEleResizeTop();
      this._elementResizeBottom =
        this._elementResizeBottom ||
        this._createHtmlElementService.getEleResizeBottom();
    }
    this.selected = this.render2.createElement('div');
    this.selected.classList.add('ladi-selected', 'ladi-size');
  }

  private _createObserver() {
    var observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.initDrag();
          } else {
            this._clearSub();
          }
        });
      },
      { rootMargin: '0px 0px 0px 0px' }
    );
    observer.observe(this.element);
  }
  /**
   * @author TruongLV
   * @email anhtruonglavm2@mail.com
   * @create date 2021-05-27 16:55:04
   * @modify date 2021-05-27 16:55:04
   * @desc Delete element for resize before add other element
   */

  ngOnDestroy(): void {
    this._clearSub();
  }
  private _clearSub() {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
}
