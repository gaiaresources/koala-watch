import { Injectable }       from '@angular/core';

import { DropdownQuestion } from './question-dropdown';
import { QuestionBase }     from './question-base';
import { TextboxQuestion }  from './question-textbox';

@Injectable()
export class QuestionService {

    // TODO: get from a remote source of question metadata
    // TODO: make asynchronous
    getQuestions() {

        let questions: QuestionBase<any>[] = [

            new TextboxQuestion({
                key: 'index',
                label: 'Index',
                value: '',
                required: false,
                order: 1
            }),

            new TextboxQuestion({
                key: 'type',
                label: 'Type',
                value: '',
                required: false,
                order: 2
            }),

            new TextboxQuestion({
                key: 'speciesCode',
                label: 'Species Code',
                value: '',
                required: false,
                order: 3
            }),

            new TextboxQuestion({
                key: 'commonName',
                label: 'Common Name',
                value: '',
                required: false,
                order: 4
            }),

            new TextboxQuestion({
                key: 'scientificName',
                label: 'Scientific Name',
                value: '',
                required: false,
                order: 5
            }),

            new TextboxQuestion({
                key: 'firstDate',
                label: 'First Date',
                value: '',
                required: false,
                order: 6
            }),

            new TextboxQuestion({
                key: 'lastDate',
                label: 'Last Date',
                value: '',
                required: false,
                order: 7
            }),

            new TextboxQuestion({
                key: 'count',
                label: 'Count',
                value: '',
                required: false,
                order: 8
            }),

            new TextboxQuestion({
                key: 'estimateCode',
                label: 'Estimate Code',
                value: '',
                required: false,
                order: 9
            }),

            new TextboxQuestion({
                key: 'sexCode',
                label: 'Sex Code',
                value: '',
                required: false,
                order: 10
            }),

            new TextboxQuestion({
                key: 'breedingType',
                label: 'Breeding Type',
                value: '',
                required: false,
                order: 11
            }),

            new TextboxQuestion({
                key: 'sourceCode',
                label: 'Source Code',
                value: '',
                required: false,
                order: 12
            }),

            new TextboxQuestion({
                key: 'datum',
                label: 'Datum',
                value: '',
                required: false,
                order: 13
            }),

            new TextboxQuestion({
                key: 'gps',
                label: 'GPS',
                value: '',
                required: false,
                order: 14
            }),

            new TextboxQuestion({
                key: 'zone',
                label: 'Zone',
                value: '',
                required: false,
                order: 15
            }),

            new TextboxQuestion({
                key: 'easting',
                label: 'Easting',
                value: '',
                required: false,
                order: 16
            }),

            new TextboxQuestion({
                key: 'northing',
                label: 'Northing',
                value: '',
                required: false,
                order: 17
            }),

            new TextboxQuestion({
                key: 'latitude',
                label: 'Latitude',
                value: '',
                required: false,
                order: 18
            }),

            new TextboxQuestion({
                key: 'longitude',
                label: 'Longitude',
                value: '',
                required: false,
                order: 19
            }),

            new TextboxQuestion({
                key: 'latitudeDegrees',
                label: 'Latitude Degrees',
                value: '',
                required: false,
                order: 20
            }),

            new TextboxQuestion({
                key: 'latitudeMinutes',
                label: 'Latitude Minutes',
                value: '',
                required: false,
                order: 21
            }),

            new TextboxQuestion({
                key: 'latitudeSeconds',
                label: 'Latitude Seconds',
                value: '',
                required: false,
                order: 22
            }),

            new TextboxQuestion({
                key: 'longitudeDegrees',
                label: 'Longitude Degrees',
                value: '',
                required: false,
                order: 23
            }),

            new TextboxQuestion({
                key: 'longitudeMinutes',
                label: 'Longitude Minutes',
                value: '',
                required: false,
                order: 24
            }),

            new TextboxQuestion({
                key: 'longitudeSeconds',
                label: 'Longitude Seconds',
                value: '',
                required: false,
                order: 25
            }),

            new TextboxQuestion({
                key: 'accuracy',
                label: 'Accuracy',
                value: '',
                required: false,
                order: 26
            }),

            new TextboxQuestion({
                key: 'locationDescription',
                label: 'Location Description',
                value: '',
                required: false,
                order: 27
            }),

            new TextboxQuestion({
                key: 'altitude',
                label: 'Altitude',
                value: '',
                required: false,
                order: 28
            }),

            new TextboxQuestion({
                key: 'geologyCode',
                label: 'Geology Code',
                value: '',
                required: false,
                order: 29
            }),

            new TextboxQuestion({
                key: 'vegetationCode',
                label: 'Vegetation Code',
                value: '',
                required: false,
                order: 30
            }),

            new TextboxQuestion({
                key: 'slope',
                label: 'Slope',
                value: '',
                required: false,
                order: 31
            }),

            new TextboxQuestion({
                key: 'aspect',
                label: 'Aspect',
                value: '',
                required: false,
                order: 32
            }),

            new TextboxQuestion({
                key: 'locationNotes',
                label: 'Location Notes',
                value: '',
                required: false,
                order: 33
            }),

            new TextboxQuestion({
                key: 'observerName',
                label: 'Observer Name',
                value: '',
                required: false,
                order: 34
            }),

            new TextboxQuestion({
                key: 'specimenLocation',
                label: 'Specimen Location',
                value: '',
                required: false,
                order: 35
            }),

            new TextboxQuestion({
                key: 'externalKey',
                label: 'External Key',
                value: '',
                required: false,
                order: 36
            }),

            new TextboxQuestion({
                key: 'notes',
                label: 'Notes',
                value: '',
                required: false,
                order: 37
            }),

            new TextboxQuestion({
                key: 'observationType',
                label: 'Observation Type',
                value: '',
                required: false,
                order: 38
            }),

            new TextboxQuestion({
                key: 'microhabitatType',
                label: 'Microhabitat Type',
                value: '',
                required: false,
                order: 39
            })

    ];

    return questions.sort((a, b) => a.order - b.order);
  }
}
