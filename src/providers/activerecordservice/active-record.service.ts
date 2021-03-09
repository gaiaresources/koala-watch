export interface FormNavigationRecord {
  page: string;
  params: {
    datasetName: string;
    recordClientId: string;
    parentId?: string;
    readonly: boolean;
  };
}

export class ActiveRecordService {
  // used to navigate back to the active form
  activeFormNav: FormNavigationRecord;
  goingToMap: boolean;

  constructor() {
    this.goingToMap = false;
  }

  setActiveFormNavigationRecord(inActiveRec: FormNavigationRecord) {
    this.activeFormNav = inActiveRec;
  }

  getActiveFormNavigationRecord() {
    return this.activeFormNav;
  }

  setGoingToMap(inVal: boolean) {
    this.goingToMap = inVal;
  }

  getGoingToMap() {
    return this.goingToMap;
  }

}
