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
import { takeUntil } from 'rxjs/operators';
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
    // this.initResize();
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
  @HostListener('focusout', ['$event']) onMouseUp(event: MouseEvent) {
    console.log('focusout');
  }
  @HostListener('click', ['$event']) onClickSection(event) {
    if (this._dragable) {
      this._getSectionResizeBottom();
      this.renderer2.appendChild(
        this.el.nativeElement,
        this._sectionResizeBottom
      );
      const sectionId: number = Number(this.el.nativeElement.dataset.id);
      // this.builderEditorComponent.setSelectSelected(sectionId);
      this.builderEditorComponent.setSectionSelect(this.el.nativeElement);
      this.initResize();
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
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event) {
    // let clickAddSectionSub: Subscription;
    // console.log(event.target);
    if (!this.el.nativeElement.contains(event.target)) {
      //   console.log(this.el.nativeElement);
      //   this._getSectionResizeBottom();
      //   // this._getSectionSelectedInsert();
      //   this.renderer2.appendChild(
      //     this.el.nativeElement,
      //     this._sectionResizeBottom
      //   );
      //   // this.renderer2.appendChild(this.el.nativeElement, sectionSelectedInsert);
      //   this.builderEditorComponent.setSelectSelected(this.sectionSelected.id);
      //   this.initResize();
      //   const buttonAddSection = this.el.nativeElement.querySelectorAll(
      //     '.ladi-button-add-section'
      //   );
      //   clickAddSectionSub = fromEvent<MouseEvent>(
      //     buttonAddSection,
      //     'click'
      //   ).subscribe((event: MouseEvent) => {
      //     event.stopImmediatePropagation();
      //     event.preventDefault();
      //     event.stopPropagation();
      //     this.builderEditorComponent.addNewSection();
      //   });
      // } else {
      // this.commonService.sectionSelectedSubject.next(null);
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
    const resizeElement = this.el.nativeElement.querySelectorAll(
      '.ladi-resize-display'
    );
    const clickElement$ = fromEvent<MouseEvent>(resizeElement, 'click');
    const dragStart$ = fromEvent<MouseEvent>(resizeElement, 'mousedown');
    const dragEnd$ = fromEvent<MouseEvent>(this.document, 'mouseup');
    const drag$ = fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
      takeUntil(dragEnd$)
    );
    let initialY: number,
      currentY =
        Number(this.el.nativeElement.style.height.replace('px', '')) || 0;
    let dragSub: Subscription;
    let clickSub: Subscription;
    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      initialY = event.clientY - currentY;
      dragSub = drag$.subscribe((event: MouseEvent) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        currentY = event.clientY - initialY;
        this.builderEditorComponent.setHeightSection(currentY);
      });
    });
    clickSub = clickElement$.subscribe((event: MouseEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      console.log(event);
    });
    const dragEndSub = dragEnd$.subscribe(() => {
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
