import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { SchemaService } from '../../biosys-core/services/schema.service';

@Component({
    selector: 'page-observation',
    templateUrl: 'observation.html',
    providers: [ SchemaService ]
})

export class ObservationPage {

    dataset = {
      name: 'Gary',
      id: 11,
      data_package: {
        'name': 'koala-opportunistic-observations',
        'title': 'Koala Opportunistic',
        'profile': 'tabular-data-package',
        'resources': [
          {
            'name': 'koala-opportunistic-biosys-master',
            'path': 'tmpXt6PQe.upload',
            'format': 'csv',
            'schema': {
              'fields': [
                {
                  'name': 'Index',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Type',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Species Code',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Common Name',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Scientific Name',
                  'type': 'string',
                  'biosys': {
                    'type': 'speciesName'
                  },
                  'format': 'default',
                  'constraints': {
                    'required': true
                  }
                },
                {
                  'name': 'First Date',
                  'type': 'datetime',
                  'biosys': {
                    'type': 'observationDate'
                  },
                  'format': 'any'
                },
                {
                  'name': 'Last Date',
                  'type': 'datetime',
                  'format': 'any'
                },
                {
                  'name': 'Count',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Estimate Code',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Sex Code',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Breeding Type',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Source Code',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Datum',
                  'type': 'string',
                  'biosys': {
                    'type': 'datum'
                  },
                  'format': 'default'
                },
                {
                  'name': 'GPS',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Zone',
                  'type': 'integer',
                  'biosys': {
                    'type': 'zone'
                  },
                  'format': 'default'
                },
                {
                  'name': 'Easting',
                  'type': 'number',
                  'biosys': {
                    'type': 'easting'
                  },
                  'format': 'default'
                },
                {
                  'name': 'Northing',
                  'type': 'number',
                  'biosys': {
                    'type': 'northing'
                  },
                  'format': 'default'
                },
                {
                  'name': 'Latitude',
                  'type': 'number',
                  'biosys': {
                    'type': 'latitude'
                  },
                  'format': 'default'
                },
                {
                  'name': 'Longitude',
                  'type': 'number',
                  'biosys': {
                    'type': 'longitude'
                  },
                  'format': 'default'
                },
                {
                  'name': 'Latitude Degrees',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Latitude Minutes',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Latitude Seconds',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Longitude Degrees',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Longitude Minutes',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Longitude Seconds',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Accuracy',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Location Description',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Altitude',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Geology Code',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Vegetation Code',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Slope',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Aspect',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Location Notes',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Observer Name',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Specimen Rego',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Specimen Location',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'External Key',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Notes',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Observation Type',
                  'type': 'string',
                  'format': 'default'
                },
                {
                  'name': 'Microhabitat Type',
                  'type': 'string',
                  'format': 'default'
                }
              ],
              'missingValues': [
                ''
              ]
            },
            'profile': 'tabular-data-resource',
            'encoding': 'utf-8',
            'mediatype': 'text/csv'
          }
        ]
      }
    };
    form: FormGroup;
    formDescriptor: object;
    payLoad = '';

    constructor(public navCtrl: NavController, private schemaService: SchemaService) {
        this.schemaService.getFormDescriptorAndGroupFromDataPackage(this.dataset).subscribe((results) => {
            this.formDescriptor = results[0];
            this.form = results[1];
        });
    }

    ngOnInit() {
    }

    onSubmit() {
    }

}
