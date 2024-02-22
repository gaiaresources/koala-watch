import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";

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
  activeFormNav!: FormNavigationRecord;
  goingToMap: boolean;
  latestCoords!: LatLng | null;
  isNewRecord: boolean;
  comingFromMap: boolean;

  constructor() {
    this.goingToMap = false;
    this.isNewRecord = false;
    this.comingFromMap = false;
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

  getLatestCoords(): LatLng | null {
    return this.latestCoords;
  }

  setLatestCoords(inVal: LatLng | null) {
    this.latestCoords = inVal;
  }

}
