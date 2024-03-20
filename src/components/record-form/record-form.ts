import {Component, Input, OnDestroy} from '@angular/core';
import {Geolocation, Position} from '@capacitor/geolocation';
import {AlertController, NavController} from '@ionic/angular';
//import {AlertController, Events, NavController} from '@ionic/angular';

import * as moment from 'moment/moment';
import Subscription from 'rxjs'
import {filter} from 'rxjs/operators';

import {FieldDescriptor, FormDescriptor} from '../../biosys-core/interfaces/form.interfaces';
import {FormGroup, ValidationErrors} from '@angular/forms';
import {SchemaService} from '../../biosys-core/services/schema.service';
import {Dataset, User} from '../../biosys-core/interfaces/api.interfaces';
import {StorageService} from '../../shared/services/storage.service';
import {AuthService} from '../../biosys-core/services/auth.service';
import {formatUserFullName} from '../../biosys-core/utils/functions';
import {DATASET_NAME_TREESURVEY, UPDATE_BUTTON_NAME} from '../../shared/utils/consts';

import {ActiveRecordService} from '../../providers/activerecordservice/active-record.service';
import {LatLng} from "@capacitor/google-maps/dist/typings/definitions";


interface LocationPatchValues {
    Latitude?: string | number;
    Longitude?: string | number;
    Accuracy?: number;
    Altitude?: number;
}


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
export class RecordFormComponent implements OnDestroy {
    private static readonly GEOLOCATION_TIMEOUT = 5000;
    private static readonly GEOLOCATION_MAX_AGE = 1000;
    private static readonly SELECT_THEME = 'auto';

    public form: FormGroup;
    public formDescriptor: FormDescriptor;
    private datasetName: string | undefined;

    private _dateFieldKey: string;

    public lastLocation: Position;
    private locationSubscription: number;
    private delayedSetValues: object | null;
    public currentDate: number = Date.now();

    @Input()
    public initialiseDefaultValues = false;

    @Input()
    public set dataset(dataset: Dataset) {
        if (dataset) {
            this.datasetName = dataset.name;
            this.setupForm(dataset);
        }
    }

    @Input()
    public readonly: boolean;

    public UPDATE_BUTTON_NAME = UPDATE_BUTTON_NAME;

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
        if (this.form) {
            // use patch rather than set because the dataset may have changed and have new fields not set in the previously saved record
            this.form.patchValue(value);
        } else {
            this.delayedSetValues = !this.delayedSetValues ? value : Object.assign(this.delayedSetValues, value);
        }
    }

    public openModal() { // todo: change this to navigarte to new map page
      this.activeRecordService.setGoingToMap(true); // save if new record and prepare for map view entry

      let l: LatLng;

        if (this.form.value['Latitude'] && this.form.value['Longitude']) {
            l = {
                lat: this.form.value['Latitude'],
                lng: this.form.value['Longitude']
            };
        }

      //this.navCtrl.push('MapPinPage', l);
    }

    constructor(private schemaService: SchemaService,
        private storageService: StorageService,
        private authService: AuthService,
        private alertCtrl: AlertController,
        //private events: Events,
        public navCtrl: NavController,
        public activeRecordService: ActiveRecordService
        ) {
    }

    ngOnDestroy() {
        if (this.locationSubscription) {
          // TODO Does this still work?
          // this.geolocation.clearWatch(this.locationSubscription)
          navigator.geolocation.clearWatch(this.locationSubscription)
        }
    }

    private setupForm(dataset: Dataset) {
        this.schemaService.getFormDescriptorAndGroupFromDataset(dataset).subscribe((results: [FormDescriptor, FormGroup]) => {
            this.formDescriptor = results[0];
            this.form = results[1];

            if (this.delayedSetValues) {
                this.form.patchValue(this.delayedSetValues);
                this.delayedSetValues = null;
            }

            if (this.formDescriptor.dateFields) {
                // use whatever is the first date field as the representative date field
                this._dateFieldKey = this.formDescriptor.dateFields[0].key;
            }

            let performInitialLocationUpdate = this.initialiseDefaultValues;

            this.locationSubscription = navigator.geolocation.watchPosition(
                (position) => {
                    this.lastLocation = position;
                    if (performInitialLocationUpdate) {
                        this.updateLocationFields(true);
                        performInitialLocationUpdate = false;
                    }
                },
                (positionError) => {

                },
                {
                    enableHighAccuracy: true,
                    timeout: RecordFormComponent.GEOLOCATION_TIMEOUT,
                    maximumAge: RecordFormComponent.GEOLOCATION_MAX_AGE
                })
                //).pipe(filter(position => !!position['coords']) // filter out errors )

            // special case for species code field which must be hidden
            if (this.form.contains('SpeciesCode')) {
                this.hideField('SpeciesCode');
            }

            if (this.initialiseDefaultValues) {
                this.initialiseDefaults();
            }
        });
    }

    public updateLocationFields(initialUpdate = false) {
        if (!this.lastLocation) {
            // prevent showing this popup immediately upon showing form the first time
            if (!initialUpdate) {
                this.alertCtrl.create({
                    header: 'Location unavailable',
                    buttons: ['OK']
                }).then((alert) => alert.present() )
            }
            return;
        }

        const valuesToPatch: LocationPatchValues = {};

        if (this.form.contains('Latitude')) {
            valuesToPatch['Latitude'] = this.lastLocation.coords.latitude.toFixed(6);
        }

        if (this.form.contains('Longitude')) {
            valuesToPatch['Longitude'] = this.lastLocation.coords.longitude.toFixed(6);
        }

        if (this.form.contains('Accuracy')) {
            valuesToPatch['Accuracy'] = Math.round(this.lastLocation.coords.accuracy);
        }

        if (this.form.contains('Altitude')) {
            valuesToPatch['Altitude'] = Math.round(this.lastLocation.coords.altitude ?? -1);
        }

        this.form.patchValue(valuesToPatch);
    }

    public validate() {
        // need to show validation errors where appropriate for incomplete record
        if (this.form.invalid) {
            Object.keys(this.form.controls).forEach((fieldName: string) =>
                this.form.get(fieldName)?.markAsDirty());
        }
    }

    public getFieldError(fieldDescriptor: FieldDescriptor): string {
        if (!this.form.controls[fieldDescriptor.key].errors) {
            return '';
        }

        const errors: ValidationErrors = this.form.controls[fieldDescriptor.key].errors!;
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
            default: return `Unknown error result`;
        }
    }

    public getFieldDescriptor(fieldName: string): FieldDescriptor {
        let fields: FieldDescriptor[] =
            this.formDescriptor.requiredFields!.filter((fieldDescriptor: FieldDescriptor) => fieldDescriptor.key === fieldName);

        if (fields.length) {
            return fields[0];
        }

        fields = this.formDescriptor.optionalFields!
            .filter((fieldDescriptor: FieldDescriptor) => fieldDescriptor.key === fieldName);

        if (fields.length) {
            return fields[0];
        }

        fields = this.formDescriptor.hiddenFields!
            .filter((fieldDescriptor: FieldDescriptor) => fieldDescriptor.key === fieldName);

        if (fields.length) {
            return fields[0];
        }

        throw new Error(`Cannot find ${fieldName} field in form descriptor`);
    }

    public onItemSelected(event: any) {
        event.inst.select();
    }

    public getSelectOptions(fieldDescriptor: FieldDescriptor): object {
        return {
            headerText: fieldDescriptor.label,
            filter: true,
            buttons: ['clear', 'cancel'],
            theme: RecordFormComponent.SELECT_THEME
        };
    }

    public getNumpadOptions(fieldDescriptor: FieldDescriptor): object {
        return {
            headerText: fieldDescriptor.label,
            theme: RecordFormComponent.SELECT_THEME,
            buttons: ['cancel', 'clear', 'set'],
            max: 999999,
            scale: 0,
            thousandsSeparator: '',
            disabled: this.readonly
        };
    }

    public getNumpadCoordinateOptions(fieldDescriptor: FieldDescriptor): object {
        return {
            headerText: fieldDescriptor.label,
            theme: RecordFormComponent.SELECT_THEME,
            buttons: ['cancel', 'clear', 'set'],
            max: 360,
            min: -360,
            scale: 9,
            thousandsSeparator: '',
            disabled: this.readonly
        };
    }

    private initialiseDefaults() {
        if (this._dateFieldKey) {
            // moment().format() will return the current date/time in local timezone
            this.form.controls[this._dateFieldKey].setValue(moment.defaultFormat);
        }

        // note: must use form.controls[key].setValue(x) rather than form.value[key] = x or it won't set
        if (this.formDescriptor.hiddenFields) {
            this.formDescriptor.hiddenFields.map((field: FieldDescriptor) => {
                this.form.controls[field.key].setValue(field.defaultValue);
            });
        }

        // integer fields using numpad must have values of null (rather than empty string) to show the placeholder
        for (const fieldType of ['locationFields', 'requiredFields', 'optionalFields']) {
            // @ts-ignore - Iterating over fields of name location/required/optional
            this.formDescriptor[fieldType].filter((field: FieldDescriptor) => field.type === 'integer').map(
                (field: FieldDescriptor) => this.form.controls[field.key].setValue(null)
            );
        }

        let observerFieldName: string | null = null;
        if (this.form.contains('Observer Name')) {
            observerFieldName = 'Observer Name';
        } else if (this.form.contains('Census Observers')) {
            observerFieldName = 'Census Observers';
        } else if (this.form.contains('Census Observer')) {
            observerFieldName = 'Census Observer';
        }

        if (observerFieldName != null) {
            this.authService.getCurrentUser().subscribe((currentUser: User) => this.form.controls[observerFieldName!]
                .setValue(formatUserFullName(currentUser))
            );
        }
    }

    private hideField(fieldName: string) {
        const fieldCategories = Object.keys(this.formDescriptor);

        for (const category of fieldCategories) {
            // @ts-ignore - Iterating over each field of arrays
            const categoryFields = this.formDescriptor[category];
            const fieldIndex = categoryFields.map((fd: FieldDescriptor) => fd.key).indexOf(fieldName);

            if (fieldIndex > -1) {
                const fieldDescriptor = categoryFields[fieldIndex];
                fieldDescriptor.type = 'hidden';
                categoryFields.splice(fieldIndex, 1);
                this.formDescriptor.hiddenFields?.push(fieldDescriptor);
                return;
            }
        }
    }

    public isFieldReadOnly(fieldName: string) {
        return this.readonly ||
            fieldName === 'Census ID' ||
            fieldName === 'Observer Name' ||
            fieldName === 'Census Observers' ||
            (fieldName === 'SiteNo' && this.datasetName === DATASET_NAME_TREESURVEY);
    }

    public inputMaxLength(key: string) {
        if (key === 'SiteNo') {
            return 40;
        } else {
            return 1000;
        }
    }

    public ionChange(event: Event, key: string) {
        if (key !== 'SiteNo') {
            return;
        }
        let theSite = this.form.value['SiteNo'];
        if (theSite.length === 0) {
            return;
        }
        if (!/^[0-9a-zA-Z]*$/.test(theSite)) {
            do {
                theSite = theSite.substring(0, theSite.length - 1);
                this.form.controls['SiteNo'].setValue(theSite);
            } while (!/^[0-9a-zA-Z]*$/.test(theSite));
            return;
        }
    }
}
