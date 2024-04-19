import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormDescriptor } from "../../models/form-descriptor";
import { FieldOption } from "../../models/field-option";
import { FieldDescriptor } from "../../models/field-descriptor";
import { Dataset } from "../../models/dataset";

@Injectable({
  providedIn: 'root'
})
export class FormGeneratorService {

  private NON_VALIDATED_SCHEMA_CONSTRAINTS: string[] = ['unique', 'enum'];
  private LOCATION_FIELDS = ['datum', 'lat', 'long', 'lon', 'latitude', 'longitude', 'accuracy', 'location description'];

  private isValidatedConstraint(name: string, constraints: any) {
    if (name === "required" && !constraints[name]) return false;
    return !this.NON_VALIDATED_SCHEMA_CONSTRAINTS.includes(name);
  }

  private getConstraints(constraints: any) {
    if (!constraints) return [];
    return Object.keys(constraints)
      .filter(name => this.isValidatedConstraint(name, constraints))
      .map(name => this.getConstraint(name, constraints[name]));
  }

  private getConstraint(name: string, constraint: any) {
    switch (name) {
      case 'required':
        return Validators.required;
      case 'minimum':
        return Validators.min(constraint);
      case 'maximum':
        return Validators.max(constraint);
      default:
        // for minLength, maxLength and pattern the schema constraint name is the same as the validator name
        return (Validators as any)[name](constraint);
    }
  }

  private getFieldType(field: any): string {
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

  private isDateField(field: any): boolean {
    if (typeof field === 'object') {
      return field.name.toLowerCase().indexOf('date') > -1;
    } else {
      return false;
    }
  }

  private isLocationField(field: any): boolean {
    if (typeof field === 'object') {
      return this.LOCATION_FIELDS.includes(field.name.toLowerCase());
    } else {
      return false;
    }
  }

  private isRequiredField(field: any): boolean {
    if (typeof field === 'object') {
      return !!field.required || (field.constraints && field.constraints.required);
    } else {
      return false;
    }
  }

  private isHiddenField(field: any): boolean {
    if (typeof field === 'object') {
      return 'constraints' in field && 'enum' in field.constraints && field.constraints.enum.length === 1;
    } else {
      return false;
    }
  }

  private getOptions(field: any): FieldOption[] {
    const enums: string[] = field.constraints.enum;

    const opts = field.options;
    if (!opts?.enum?.titles) {
      return enums.map(value => ({text: value, value: value}));
    }

    const titles: string[] = opts.enum.titles;
    const options: FieldOption[] = [];
    for (let i = 0, enumsLen = enums.length, titlesLen = titles.length; i < enumsLen; i++) {
      options.push({
        text: i < titlesLen ? titles[i] : enums[i],
        value: enums[i]
      });
    }
    return options;
  }

  private getFieldDefaultValue(field: any): any | null {
    if (!this.isHiddenField(field)) return null;
    return field.constraints.enum[0];
  }

  private getFieldDescriptor(field: any): FieldDescriptor {
    const type: string = this.getFieldType(field);

    return {
      key: field.name,
      label: field.title ? field.title : field.name,
      description: field.description,
      format: field.format,
      type: type,
      options: type === 'select' ? this.getOptions(field) : undefined,
      defaultValue: this.getFieldDefaultValue(field),
    };
  }

  private getFields(dataset: Dataset, resource: number) {
    return dataset.data_package.resources[resource].schema.fields;
  }

  getFormGroup(formBuilder: FormBuilder, values: any, dataset: any, resource: number = 0): FormGroup {
    const group: any = {};
    this.getFields(dataset, resource).forEach((field: any) => {
      let defaultValue = this.getFieldDefaultValue(field) || '';
      if (values.hasOwnProperty(field.name)) {
        defaultValue = values[field.name];
      }
      group[field.name] = [defaultValue, this.getConstraints(field.constraints)];
    })
    return formBuilder.group(group);
  }

  getFormFields(dataset: Dataset, resource: number = 0): FormDescriptor {
    const dateFields: FieldDescriptor[] = [];
    const locationFields: FieldDescriptor[] = [];
    const requiredFields: FieldDescriptor[] = [];
    const optionalFields: FieldDescriptor[] = [];
    const hiddenFields: FieldDescriptor[] = [];

    this.getFields(dataset, resource).forEach((field: any) => {
      const descriptor = this.getFieldDescriptor(field);
      if (this.isHiddenField(field)) {
        hiddenFields.push(descriptor);
      } else if (this.isDateField(field)) {
        dateFields.push(descriptor);
      } else if (this.isLocationField(field)) {
        locationFields.push(descriptor);
      } else if (this.isRequiredField(field)) {
        requiredFields.push(descriptor);
      } else {
        optionalFields.push(descriptor);
      }
    });

    return {dateFields, locationFields, requiredFields, optionalFields, hiddenFields};
  }

}
