import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-color-editor',
  templateUrl: './color-editor.component.html',
  styleUrls: ['./color-editor.component.scss'],
})
export class ColorEditorComponent implements OnInit {
  @Output() closeEditor = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  closeColorEditor(event: MouseEvent) {
    event.stopPropagation();
    this.closeEditor.emit();
  }
}
