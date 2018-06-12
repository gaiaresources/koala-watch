import { Component, Input } from '@angular/core';

import * as moment from 'moment/moment';

import { FieldDescriptor, ObservationFormDescriptor } from '../../biosys-core/interfaces/form.interfaces';
import { filter } from 'rxjs/operators';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { SchemaService } from '../../biosys-core/services/schema.service';
import { Geolocation } from '@ionic-native/geolocation';
import { Dataset } from '../../biosys-core/interfaces/api.interfaces';

/**
 * Generated class for the RecordFormComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'record-form',
    templateUrl: 'record-form.html',
    providers: [SchemaService]
})
export class RecordFormComponent {
    public form: FormGroup;
    public formDescriptor: ObservationFormDescriptor;

    private _dateFieldKey: string;

    @Input()
    public initializeDefaultValues: boolean = false;

    @Input()
    public set dataset(dataset: Dataset) {
        if (dataset) {
            this.setupForm(dataset);
        }
    }

    public get invalid(): boolean {
        return !!this.form && this.form.invalid;
    }

    public get valid(): boolean {
        return !!this.form && this.form.valid;
    }

    public get dateFieldKey(): string {
        return this._dateFieldKey;
    }

    public get value(): object {
        return this.form.value;
    }

    public set value(value: object) {
        this.form.setValue(value);

        // need to show validation errors where appropriate for incomplete record
        if (this.form.invalid) {
            Object.keys(this.form.controls).forEach((fieldName: string) =>
                this.form.get(fieldName).markAsDirty());
        }    }

    constructor(private schemaService: SchemaService, private geolocation: Geolocation) {}

    private setupForm(dataset: Dataset) {
        this.schemaService.getFormDescriptorAndGroupFromDataset(dataset).subscribe(results => {
            this.formDescriptor = results[0] as ObservationFormDescriptor;
            this.form = results[1];

            if (this.formDescriptor.dateFields) {
                // use whatever is the first date field as the representative date field
                this._dateFieldKey = this.formDescriptor.dateFields[0].key;
            }

            // if this is a new record, patch in default form values where appropriate
            this.geolocation.watchPosition().pipe(
                filter(position => !!position['coords']) // filter out errors
            ).subscribe(position => {
                const valuesToPatch = {}

                if (this.form.contains('Latitude')) {
                    valuesToPatch['Latitude'] = position.coords.latitude;
                }

                if (this.form.contains('Longitude')) {
                    valuesToPatch['Longitude'] = position.coords.longitude;
                }

                if (this.form.contains('Accuracy')) {
                    valuesToPatch['Accuracy'] = position.coords.accuracy;
                }

                this.form.patchValue(valuesToPatch);
            });

            if (this._dateFieldKey) {
                // moment().format() will return the current date/time in local timezone
                this.form.controls[this._dateFieldKey].setValue(moment().format());
            }

            this.formDescriptor.hiddenFields.map((field: FieldDescriptor) =>
                this.form.controls[field.key].setValue(field.defaultValue)
            );
        });
    }

    public getFieldError(fieldDescriptor: FieldDescriptor): string {
        if (!this.form.controls[fieldDescriptor.key].errors) {
            return '';
        }

        const errors: ValidationErrors = this.form.controls[fieldDescriptor.key].errors;
        const errorKey = Object.keys(errors)[0];
        const error = errors[errorKey];

        switch (errorKey) {
            case 'required':
                return 'This field is required';
            case 'min':
                return `Minimum value: ${error['min']}`;
            case 'max':
                return `Maximum value: ${error['max']}`;
            case 'minLength':
                return `Minimum length: ${error['minLength']}`;
            case 'maxLength':
                return `Maximum length: ${error['maxLength']}`;
            case 'pattern':
                return `Must match pattern: ${error['pattern']}`;
        }
    }
}
