export let ANY_IONIC_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export let ISO_IONIC_DATETIME_FORMAT = 'YYYY-MM-DDTZHH:mm:ssZ';

export let RECORD_COMPLETE = '#ebffef';
export let RECORD_INCOMPLETE = '#ebf6ff';
export let RECORD_UPLOADED = '#ebf0df';

export let APP_NAME = 'KoalaApp';

export function isDatasetCensus(dsName: string) {
    return dsName.toLowerCase().indexOf('census') > -1;
}

export let PROJECTNAME = 'Koala Pilot Project';
export let DATASETNAME_CENSUS = 'Koala Scat Census';
export let DATASETNAME_OBSERVATION = 'Koala Opportunistic Observation';
export let DATASETNAME_TREESIGHTING = 'Trees Surveyed';
