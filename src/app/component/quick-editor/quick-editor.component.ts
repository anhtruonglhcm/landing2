import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ALIGN_ITEM_COMMAND, IAlign } from './quick-editor.constant';

@Component({
  selector: 'app-quick-editor',
  templateUrl: './quick-editor.component.html',
  styleUrls: ['./quick-editor.component.scss'],
})
export class QuickEditorComponent implements OnInit, OnChanges {
  @Input('quickEditorTop') quickEditorTop: number;
  @Input('quickEditorLeft') quickEditorLeft: number;
  public isShowColor = false;
  public isAlignItem = false;
  public AlignItemCommand = ALIGN_ITEM_COMMAND;
  constructor() {}

  ngOnInit(): void {}
  deleteElement(event: MouseEvent) {
    event.stopPropagation();
    console.log('deleted');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.quickEditorTop);
  }
  clickTextColor(event: MouseEvent) {
    event.stopPropagation();
    this.isShowColor = !this.isShowColor;
  }
  closeEditor() {
    this.isShowColor = false;
  }
  setShowColor(isShow: boolean = false) {
    this.isShowColor = isShow;
  }
  openAlign(event: MouseEvent) {
    console.log('openAlign');
    event.stopPropagation();
    this.isAlignItem = !this.isAlignItem;
  }
  alignItemLeft(item: IAlign, event: MouseEvent) {
    event.stopPropagation();
    console.log(item);
    document.execCommand(item.command);
  }
}
