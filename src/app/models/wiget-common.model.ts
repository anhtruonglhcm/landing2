import { MenuChildAddNew } from '../constant/left-menu.constant';
import { IStyleCommon } from './style-common.model';
import { IStyleCustom } from './style-custom.model';

export interface IWigetCommon {
  id?: number;
  idSection: number;
  elementType?: MenuChildAddNew;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  name?: string;
  style?: Partial<IStyleCommon>;
  customStyle?: Partial<IStyleCustom>;
}
