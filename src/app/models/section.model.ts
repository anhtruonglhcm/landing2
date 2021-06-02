import { ElementLadi } from './element.model';

export interface ISection {
  id?: number;
  idSection: string;
  height?: number;
  element?: ElementLadi[];
}

export interface ISectionSubject {
  id: string;
  height: number;
}

export interface ISectitonSelectedId {
  id: string;
}
