import { Injectable } from '@angular/core';
import { Dataset } from '../interfaces/api.interfaces';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Observable, zip, of } from 'rxjs';
import { FieldDescriptor, FieldOption, FormDescriptor } from '../interfaces/form.interfaces';

@Injectable()
export class SchemaService {
  private static readonly NON_VALIDATED_SCHEMA_CONSTRAINTS = ['unique', 'enum'];

  private static readonly LOCATION_FIELDS = ['datum', 'lat', 'long', 'lon', 'latitude', 'longitude', 'accuracy', 'location description'];

  private static schemaFieldTypeToFormFieldType(field: any): string {
    if (field.type === 'string') {
      if ('constraints' in field && 'enum' in field.constraints) {
        if (field.constraints.enum.length === 1) {
          return 'hidden';
        } else {
          return 'select';
        }
      } else {
        return 'text';
      }
    } else {
      return field.type;
    }
  }

  private static constraintsToValidators(constraints: object): ValidatorFn[] {
    return Object.keys(constraints).filter((constraintName: string) =>
      SchemaService.NON_VALIDATED_SCHEMA_CONSTRAINTS.indexOf(constraintName) === -1).filter(
      (constraintName: string) => !(constraintName === 'required' && !constraints[constraintName])).map((constraintName: string) => {
      switch (constraintName) {
        case 'required':
          return Validators.required;
        case 'minimum':
          return Validators.min(constraints[constraintName]);
        case 'maximum':
          return Validators.max(constraints[constraintName]);
        default:
          // for minLength, maxLength and pattern the schema constraint name is the same as the validator name
          return Validators[constraintName](constraints[constraintName]);
      }
    });
  }

  private static getFormDescriptorFromDataPackage(dataPackage: any, resourceIndex: number): FormDescriptor {
    const schema: any = dataPackage.resources[resourceIndex].schema;
    const fields = schema.fields;

    const fd: FormDescriptor = {
      dateFields: [],
      locationFields: [],
      requiredFields: [],
      optionalFields: [],
      hiddenFields: []
    };

    for (let i = 0, len = fields.length; i < len; i++) {
      const field: any = fields[i];

      const fieldOptions = schema.fields[i].options;

      if (SchemaService.isHiddenField(field)) {
        fd.hiddenFields!.push(SchemaService.createFieldDescriptorFromSchemaField(field));
      } else if (SchemaService.isDateField(field)) {
        fd.dateFields!.push(SchemaService.createFieldDescriptorFromSchemaField(field));
      } else if (SchemaService.isLocationField(field)) {
        fd.locationFields!.push(SchemaService.createFieldDescriptorFromSchemaField(field, fieldOptions));
      } else if (SchemaService.isRequiredField(field)) {
        fd.requiredFields!.push(SchemaService.createFieldDescriptorFromSchemaField(field, fieldOptions));
      } else {
        fd.optionalFields!.push(SchemaService.createFieldDescriptorFromSchemaField(field, fieldOptions));
      }
    }

    // TODO, currently hard coding this value, need to account for all forms here or reimplement a way to look this up.
    fd.keyField = 'Census ID';

    return fd;
  }

  private static createFieldDescriptorFromSchemaField(field: any, fieldOptions?: object): FieldDescriptor {
    const type: string = SchemaService.schemaFieldTypeToFormFieldType(field);

    return {
      key: field.name,
      label: field.title ? field.title : field.name,
      description: field.description,
      format: field.format,
      type: type,
      options: type === 'select' ? SchemaService.createOptions(field, fieldOptions) : undefined,
      defaultValue: type === 'hidden' ? field.constraints.enum[0] : null
    };
  }

  private static createOptions(field: any, fieldOptions?: object): FieldOption[] {
    const options: FieldOption[] = [];

    if (!fieldOptions || !fieldOptions.hasOwnProperty('enum') || !fieldOptions['enum'].hasOwnProperty('titles')) {
      return field.constraints.enum.map(value => ({text: value, value: value}));
    } else {
      const enums: any[] = field.constraints.enum;
      const titles: string[] = fieldOptions['enum']['titles'];

      for (let i = 0, enumsLen = enums.length, titlesLen = titles.length; i < enumsLen; i++) {
        options.push({
          text: i < titlesLen ? titles[i] : enums[i],
          value: enums[i]
        });
      }
    }

    return options;
  }

  private static isDateField(field: any): boolean {
    if (typeof field === 'object') {
      return field.name.toLowerCase().indexOf('date') > -1;
    } else {
      return false;
    }
  }

  private static isLocationField(field: any): boolean {
    if (typeof field === 'object') {
      return SchemaService.LOCATION_FIELDS.indexOf(field.name.toLowerCase()) > -1;
    } else {
      return false;
    }
  }

  private static isRequiredField(field: any): boolean {
    if (typeof field === 'object') {
      return !!field.required;
    } else {
      return false;
    }
  }

  private static isHiddenField(field: any): boolean {
    if (typeof field === 'object') {
      return 'constraints' in field && 'enum' in field.constraints && field.constraints.enum.length === 1;
    } else {
      return false;
    }
  }

  constructor(private formBuilder: FormBuilder) {
  }

  public getFormDescriptorFromDataset(dataset: Dataset, resourceIndex: number = 0): Observable<FormDescriptor> {
    return of(SchemaService.getFormDescriptorFromDataPackage(dataset.data_package, resourceIndex));
  }

  public getFormGroupFromDataset(dataset: Dataset, resourceIndex: number = 0): Observable<FormGroup> {
    const group = {};
    dataset.data_package.resources[resourceIndex].schema.fields.forEach((field: any) => {
      const validators: ValidatorFn[] = field.constraints ? SchemaService.constraintsToValidators(field.constraints) : [];
      group[field.name] = ['', validators];
    });
    return of(this.formBuilder.group(group));
  }

  public getFormDescriptorAndGroupFromDataset(dataset: Dataset, resourceIndex: number = 0):
    Observable<[FormDescriptor, FormGroup]> {
    return zip(this.getFormDescriptorFromDataset(dataset, resourceIndex),
      this.getFormGroupFromDataset(dataset, resourceIndex));
  }
}
