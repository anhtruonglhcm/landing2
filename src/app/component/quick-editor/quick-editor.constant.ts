export interface IAlign {
  name: 'Căn trái' | 'Căn giữa' | 'Căn phải' | 'Căn đều 2 bên';
  command: 'justifyleft' | 'justifycenter' | 'justifyright' | 'justifyFull';
  icon:
    | 'icon-align-left-2'
    | 'icon-align-center'
    | 'icon-align-right-2'
    | 'icon-align-justify';
}

export const ALIGN_ITEM_COMMAND: IAlign[] = [
  {
    name: 'Căn trái',
    command: 'justifyleft',
    icon: 'icon-align-left-2',
  },
  {
    name: 'Căn giữa',
    command: 'justifycenter',
    icon: 'icon-align-center',
  },
  {
    name: 'Căn phải',
    command: 'justifyright',
    icon: 'icon-align-right-2',
  },
  {
    name: 'Căn đều 2 bên',
    command: 'justifyFull',
    icon: 'icon-align-justify',
  },
];
