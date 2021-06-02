import { Injectable } from '@angular/core';
import {
  SECTION_RESIZE_BOTTOM_INSERT,
  SECTION_SELECTED_INSERT,
} from '../constant/section.constant';

@Injectable({
  providedIn: 'root',
})
export class CreateHtmlElementService {
  private _sectionResizeBottom: HTMLElement;
  private _sectionSelectedInsert: HTMLElement;
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
}
