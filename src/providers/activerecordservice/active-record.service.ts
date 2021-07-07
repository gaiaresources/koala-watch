import { ILatLng } from "@ionic-native/google-maps";

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
  latestCoords: ILatLng;
  isNewRecord: boolean;

  constructor() {
    this.goingToMap = false;
    this.isNewRecord = false;
  }

  setActiveFormNavigationRecord(inActiveRec: FormNavigationRecord) {
    this.activeFormNav = inActiveRec;
  }

  getActiveFormNavigationRecord(): FormNavigationRecord {
    return this.activeFormNav;
  }

  setGoingToMap(inVal: boolean) {
    this.goingToMap = inVal;
  }

  getGoingToMap(): boolean {
    return this.goingToMap;
  }

  getLatestCoords(): ILatLng {
    return this.latestCoords;
  }

  setLatestCoords(inVal: ILatLng) {
    this.latestCoords = inVal;
  }

}
