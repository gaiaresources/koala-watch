import { InjectionToken } from "@angular/core";

export const DATASET_NAME_CENSUS = 'Koala Scat Census';
export const DATASET_NAME_OBSERVATION = 'Koala Opportunistic Observation';
export const DATASET_NAME_TREESURVEY = 'Trees Surveyed';

export const APP_NAME = new InjectionToken<string>('The app name');
export const PROJECT_NAME = new InjectionToken<string>('The internal name used for the project');
