import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  IMenuLeft,
  MenuChildAddNew,
  MenuLeft,
} from 'src/app/constant/left-menu.constant';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  public menuLeft: IMenuLeft[];
  @Output() addElement = new EventEmitter<MenuChildAddNew>();
  constructor() {}

  ngOnInit(): void {
    this.menuLeft = MenuLeft;
  }
  clickItem(index: number, event) {
    event.stopPropagation();
    const indexOpen = this.menuLeft.findIndex((e) => e.isSelected === true);
    if (indexOpen != -1 && indexOpen != index) {
      this.menuLeft[indexOpen].isSelected =
        !this.menuLeft[indexOpen].isSelected;
    }
    this.menuLeft[index].isSelected = !this.menuLeft[index].isSelected;
  }
  clickChild(elementType: MenuChildAddNew, index: number, event: MouseEvent) {
    event.stopPropagation();
    this.addElement.emit(elementType);
    this.clickItem(index, event);
  }

  hideChildMenu() {
    const indexOpen = this.menuLeft.findIndex((e) => e.isSelected === true);
    if (indexOpen != -1) {
      this.menuLeft[indexOpen].isSelected = false;
    }
  }
}
