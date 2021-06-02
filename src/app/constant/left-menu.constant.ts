export enum MenuParrent {
  ADD_NEW = 1,
  SECTION,
  POPUP,
  LAYER,
  APP,
}

export enum MenuChildAddNew {
  IMAGE = 1,
  SHAPE,
  GALLERY,
  PEN_TOOL,
  BUTTON,
  VIDEO,
  BUTTON_GROUP,
  FORM,
  TITLE,
  SLIDE,
  PARAGRAPH,
  HTML,
  LIST,
  FRAME,
  SHAPE_LINE,
  SHAPE_RECTANGLE,
  COLLECTION,
}
export interface IMenuLeftChild {
  name: string;
  icon: string;
  datakey: MenuChildAddNew;
  elementType?: MenuChildAddNew;
}
export interface IMenuLeft {
  dataKey: MenuParrent;
  name: string;
  icon: string;
  isSelected: boolean;
  childMenu: IMenuLeftChild[];
}

export const MenuLeft: IMenuLeft[] = [
  {
    dataKey: MenuParrent.ADD_NEW,
    name: 'Thêm mới',
    icon: 'icon-c-add',
    isSelected: false,
    childMenu: [
      {
        name: 'Hình ảnh',
        datakey: MenuChildAddNew.IMAGE,
        icon: 'icon-img',
      },
      {
        name: 'Shape',
        datakey: MenuChildAddNew.SHAPE,
        icon: 'icon-shape-star',
      },
      {
        name: 'Galley',
        datakey: MenuChildAddNew.GALLERY,
        icon: 'icon-gallery',
      },
      {
        name: 'Nút bấm',
        datakey: MenuChildAddNew.BUTTON,
        icon: 'icon-button',
        elementType: MenuChildAddNew.BUTTON,
      },
      {
        name: 'video',
        datakey: MenuChildAddNew.VIDEO,
        icon: 'icon-video-player',
      },
      {
        name: 'Nhóm nút bấm',
        datakey: MenuChildAddNew.BUTTON_GROUP,
        icon: 'icon-button icon-button-group',
      },
      {
        name: 'Form',
        datakey: MenuChildAddNew.FORM,
        icon: 'icon-form',
      },
      {
        name: 'Tiêu đề',
        datakey: MenuChildAddNew.TITLE,
        icon: 'icon-text',
        elementType: MenuChildAddNew.TITLE,
      },
    ],
  },
  {
    name: 'Section',
    dataKey: MenuParrent.SECTION,
    icon: 'icon-section',
    isSelected: false,
    childMenu: [],
  },
  {
    name: 'Popup',
    dataKey: MenuParrent.POPUP,
    icon: 'icon-popup',
    isSelected: false,
    childMenu: [],
  },
  {
    name: 'Layer',
    dataKey: MenuParrent.LAYER,
    icon: 'icon-layer',
    isSelected: false,
    childMenu: [],
  },
  {
    name: 'Ứng dụng',
    dataKey: MenuParrent.APP,
    icon: 'icon-app-store',
    isSelected: false,
    childMenu: [],
  },
];
