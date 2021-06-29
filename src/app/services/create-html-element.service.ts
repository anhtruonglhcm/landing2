import { Injectable } from '@angular/core';
import {
  SECTION_RESIZE_BOTTOM_INSERT,
  SECTION_SELECTED_INSERT,
} from '../constant/section.constant';
import {
  ELEMENT_RESIZE_BOTTOM,
  ELEMENT_RESIZE_LEFT,
  ELEMENT_RESIZE_RIGHT,
  ELEMENT_RESIZE_TOP,
} from '../constant/sub-elements.constant';

@Injectable({
  providedIn: 'root',
})
export class CreateHtmlElementService {
  private _sectionResizeBottom: HTMLElement;
  private _sectionSelectedInsert: HTMLElement;
  private _eleResizeLeft: HTMLElement;
  private _eleResizeRight: HTMLElement;
  private _eleResizeTop: HTMLElement;
  private _eleResizeBottom: HTMLElement;
  constructor() {}

  private _htmlToElement(html: string): HTMLElement {
    let element = document.createElement('div');
    element.innerHTML = html;
    return element.firstElementChild as HTMLElement;
  }

  getSectionResizeBottom(): HTMLElement {
    this._sectionResizeBottom = this._htmlToElement(
      SECTION_RESIZE_BOTTOM_INSERT
    );
    return this._sectionResizeBottom;
  }

  getSectionSelectedInsert(): HTMLElement {
    if (!this._sectionSelectedInsert) {
      this._sectionSelectedInsert = this._htmlToElement(
        SECTION_SELECTED_INSERT
      );
    }
    return this._sectionSelectedInsert;
  }

  getEleResizeLeft(): HTMLElement {
    if (!this._eleResizeLeft) {
      this._eleResizeLeft = this._htmlToElement(ELEMENT_RESIZE_LEFT);
    }
    return this._eleResizeLeft;
  }

  getEleResizeRight(): HTMLElement {
    if (!this._eleResizeRight) {
      this._eleResizeRight = this._htmlToElement(ELEMENT_RESIZE_RIGHT);
    }
    return this._eleResizeRight;
  }

  getEleResizeTop(): HTMLElement {
    if (!this._eleResizeTop) {
      this._eleResizeTop = this._htmlToElement(ELEMENT_RESIZE_TOP);
    }
    return this._eleResizeTop;
  }

  getEleResizeBottom(): HTMLElement {
    if (!this._eleResizeBottom) {
      this._eleResizeBottom = this._htmlToElement(ELEMENT_RESIZE_BOTTOM);
    }
    return this._eleResizeBottom;
  }
}
