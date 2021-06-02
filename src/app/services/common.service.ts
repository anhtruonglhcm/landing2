import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { ISectionSubject } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public sectionSubject: ReplaySubject<ISectionSubject> =
    new ReplaySubject<ISectionSubject>(1);
  public sectionSelectedSubject: ReplaySubject<ISectionSubject | null> =
    new ReplaySubject<ISectionSubject | null>(1);
  public isClickSection: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  constructor() {}
}
