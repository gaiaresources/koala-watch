import { Injectable }       from '@angular/core';

import { DropdownQuestion } from './question-dropdown';
import { QuestionBase }     from './question-base';
import { TextboxQuestion }  from './question-textbox';
import {DatetimeQuestion} from "./question-datetime";

@Injectable()
export class QuestionService {

    // TODO: get from a remote source of question metadata
    // TODO: make asynchronous
    getQuestions() {

        let questions: QuestionBase<any>[] = [

            new TextboxQuestion({
                key: 'index',
                label: 'Index',
                value: '999',
                type: 'text',
                required: false,
                order: 1
            }),

            new TextboxQuestion({
                key: 'type',
                label: 'Type',
                type: 'text',
                value: '',
                required: false,
                order: 2
            }),

            new TextboxQuestion({
                key: 'speciesCode',
                label: 'Species Code',
                type: 'text',
                value: '',
                required: false,
                order: 3
            }),

            new TextboxQuestion({
                key: 'commonName',
                label: 'Common Name',
                type: 'text',
                value: '',
                required: false,
                order: 4
            }),

            new TextboxQuestion({
                key: 'scientificName',
                label: 'Scientific Name',
                type: 'text',
                value: '',
                required: false,
                order: 5
            }),

            new DatetimeQuestion({
                key: 'firstDate',
                label: 'First Date',
                type: 'datetime',
                value: '',
                required: false,
                order: 6
            }),

            new DatetimeQuestion({
                key: 'lastDate',
                label: 'Last Date',
                type: 'datetime',
                value: '',
                required: false,
                order: 7
            }),

            new TextboxQuestion({
                key: 'count',
                label: 'Count',
                type: 'number',
                value: '',
                required: false,
                order: 8
            }),

            new TextboxQuestion({
                key: 'estimateCode',
                label: 'Estimate Code',
                type: 'text',
                value: '',
                required: false,
                order: 9
            }),

            new TextboxQuestion({
                key: 'sexCode',
                label: 'Sex Code',
                type: 'text',
                value: '',
                required: false,
                order: 10
            }),

            new TextboxQuestion({
                key: 'breedingType',
                label: 'Breeding Type',
                type: 'text',
                value: '',
                required: false,
                order: 11
            }),

            new TextboxQuestion({
                key: 'sourceCode',
                label: 'Source Code',
                type: 'text',
                value: '',
                required: false,
                order: 12
            }),

            new TextboxQuestion({
                key: 'datum',
                label: 'Datum',
                type: 'text',
                value: '',
                required: false,
                order: 13
            }),

            new TextboxQuestion({
                key: 'gps',
                label: 'GPS',
                type: 'text',
                value: '',
                required: false,
                order: 14
            }),

            new TextboxQuestion({
                key: 'zone',
                label: 'Zone',
                type: 'text',
                value: '',
                required: false,
                order: 15
            }),

            new TextboxQuestion({
                key: 'easting',
                label: 'Easting',
                type: 'number',
                value: '',
                required: false,
                order: 16
            }),

            new TextboxQuestion({
                key: 'northing',
                label: 'Northing',
                type: 'number',
                value: '',
                required: false,
                order: 17
            }),

            new TextboxQuestion({
                key: 'latitude',
                label: 'Latitude',
                type: 'number',
                value: '',
                required: false,
                order: 18
            }),

            new TextboxQuestion({
                key: 'longitude',
                label: 'Longitude',
                type: 'number',
                value: '',
                required: false,
                order: 19
            }),

            new TextboxQuestion({
                key: 'latitudeDegrees',
                label: 'Latitude Degrees',
                type: 'number',
                value: '',
                required: false,
                order: 20
            }),

            new TextboxQuestion({
                key: 'latitudeMinutes',
                label: 'Latitude Minutes',
                type: 'number',
                value: '',
                required: false,
                order: 21
            }),

            new TextboxQuestion({
                key: 'latitudeSeconds',
                label: 'Latitude Seconds',
                type: 'number',
                value: '',
                required: false,
                order: 22
            }),

            new TextboxQuestion({
                key: 'longitudeDegrees',
                label: 'Longitude Degrees',
                type: 'number',
                value: '',
                required: false,
                order: 23
            }),

            new TextboxQuestion({
                key: 'longitudeMinutes',
                label: 'Longitude Minutes',
                type: 'number',
                value: '',
                required: false,
                order: 24
            }),

            new TextboxQuestion({
                key: 'longitudeSeconds',
                label: 'Longitude Seconds',
                type: 'number',
                value: '',
                required: false,
                order: 25
            }),

            new TextboxQuestion({
                key: 'accuracy',
                label: 'Accuracy',
                type: 'number',
                value: '',
                required: false,
                order: 26
            }),

            new TextboxQuestion({
                key: 'locationDescription',
                label: 'Location Description',
                type: 'text',
                value: '',
                required: false,
                order: 27
            }),

            new TextboxQuestion({
                key: 'altitude',
                label: 'Altitude',
                type: 'number',
                value: '',
                required: false,
                order: 28
            }),

            new TextboxQuestion({
                key: 'geologyCode',
                label: 'Geology Code',
                type: 'text',
                value: '',
                required: false,
                order: 29
            }),

            new TextboxQuestion({
                key: 'vegetationCode',
                label: 'Vegetation Code',
                type: 'text',
                value: '',
                required: false,
                order: 30
            }),

            new TextboxQuestion({
                key: 'slope',
                label: 'Slope',
                type: 'text',
                value: '',
                required: false,
                order: 31
            }),

            new TextboxQuestion({
                key: 'aspect',
                label: 'Aspect',
                type: 'text',
                value: '',
                required: false,
                order: 32
            }),

            new TextboxQuestion({
                key: 'locationNotes',
                label: 'Location Notes',
                type: 'text',
                value: '',
                required: false,
                order: 33
            }),

            new TextboxQuestion({
                key: 'observerName',
                label: 'Observer Name',
                type: 'text',
                value: '',
                required: false,
                order: 34
            }),

            new TextboxQuestion({
                key: 'specimenLocation',
                label: 'Specimen Location',
                type: 'text',
                value: '',
                required: false,
                order: 35
            }),

            new TextboxQuestion({
                key: 'externalKey',
                label: 'External Key',
                type: 'text',
                value: '',
                required: false,
                order: 36
            }),

            new TextboxQuestion({
                key: 'notes',
                label: 'Notes',
                type: 'text',
                value: '',
                required: false,
                order: 37
            }),

            new TextboxQuestion({
                key: 'observationType',
                label: 'Observation Type',
                type: 'text',
                value: '',
                required: false,
                order: 38
            }),

            new TextboxQuestion({
                key: 'microhabitatType',
                label: 'Microhabitat Type',
                type: 'text',
                value: '',
                required: false,
                order: 39
            }),

            new DropdownQuestion({
                key: 'brave',
            label: 'Bravery Rating',
            options: [
              {key: 'solid',  value: 'Solid'},
              {key: 'great',  value: 'Great'},
              {key: 'good',   value: 'Good'},
              {key: 'unproven', value: 'Unproven'}
            ],
            order: 40
          }),

        ];

    return questions.sort((a, b) => a.order - b.order);
  }
}
