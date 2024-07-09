import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormDescriptor} from "../../models/form-descriptor";
import {FieldOption} from "../../models/field-option";
import {FieldDescriptor} from "../../models/field-descriptor";
import {Dataset} from "../../models/dataset";
import * as dayjs from "dayjs";
import {ComputedFieldService} from "../computed-field/computed-field.service";
import {User} from "../../models/user";
import {ClientRecord} from "../../models/client-record";

@Injectable({
  providedIn: 'root'
})
export class FormGeneratorService {

  private NON_VALIDATED_SCHEMA_CONSTRAINTS: string[] = ['unique', 'enum'];
  private LOCATION_FIELDS = ['datum', 'lat', 'long', 'lon', 'latitude', 'longitude', 'accuracy', 'location description'];

  constructor(private computedFieldService: ComputedFieldService) {

  }

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

  private isComputedField(field: any): boolean {
    return 'computed' in field;
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
      if ('hidden' in field) return true;
      return 'constraints' in field && 'enum' in field.constraints && field.constraints.enum.length === 1;
    } else {
      return false;
    }
  }

  private getOptions(field: any): FieldOption[] {
    const enums: string[] = field.constraints.enum;
    const prefix: FieldOption[] = field.constraints?.required ? [] : [{text: "", value: ""}];

    const opts = field.options;
    if (!opts?.enum?.titles) {
      return prefix.concat(enums.map(value => ({text: value, value: value})));
    }

    const titles: string[] = opts.enum.titles;
    const options: FieldOption[] = prefix;
    for (let i = 0, enumsLen = enums.length, titlesLen = titles.length; i < enumsLen; i++) {
      options.push({
        text: i < titlesLen ? titles[i] : enums[i],
        value: enums[i]
      });
    }
    return options;
  }

  private getFieldDefaultValue(field: any, value: any, user: User | null): any | null {
    if (this.isComputedField(field)) {
      return value === null ? this.computedFieldService.getComputedValue(field, value, user) : value;
    }
    if (this.isDateField(field)) return dayjs().format();
    if (!this.isHiddenField(field)) return null;
    if (field.hidden) return value;
    return field.constraints.enum[0];
  }

  private getFieldDescriptor(field: any, value: any, user: User | null): FieldDescriptor {
    const type: string = this.getFieldType(field);

    return {
      key: field.name,
      label: field.title ? field.title : field.name,
      description: field.description,
      format: field.format,
      type: type,
      options: type === 'select' ? this.getOptions(field) : undefined,
      defaultValue: this.getFieldDefaultValue(field, value, user),
      disabled: field.disabled ?? false,
    };
  }

  private getFields(dataset: Dataset, resource: number) {
    return dataset.data_package.resources[resource].schema.fields;
  }

  getFormGroup(formBuilder: FormBuilder, values: any, dataset: any, user: User | null = null, resource: number = 0): FormGroup {
    const group: any = {};
    this.getFields(dataset, resource).forEach((field: any, index: any) => {
      let defaultValue = this.getFieldDefaultValue(field, values[field.name] ?? null, user) || '';
      if (values.hasOwnProperty(field.name)) {
        defaultValue = values[field.name];
      }
      group[field.name] = [{value: defaultValue, disabled: !!field.disabled}, this.getConstraints(field.constraints)];
    })
    return formBuilder.group(group);
  }

  getFormFields(dataset: Dataset, form: FormGroup, record: ClientRecord | null, user: User | null = null, resource: number = 0): FormDescriptor {
    const dateFields: FieldDescriptor[] = [];
    const locationFields: FieldDescriptor[] = [];
    const requiredFields: FieldDescriptor[] = [];
    const optionalFields: FieldDescriptor[] = [];
    const hiddenFields: FieldDescriptor[] = [];

    this.getFields(dataset, resource).forEach((field: any) => {
      const control = form.get(field.name);
      const descriptor = this.getFieldDescriptor(field, control?.value, user);
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

  getFormDisabledValues(dataset: Dataset, form: FormGroup, resource: number = 0): any {
    const defaults: any = {};
    this.getFields(dataset, resource).forEach((field: any) => {
      if (field.disabled) {
        defaults[field.name] = form.get(field.name)?.value;
      }
    });
    return defaults;
  }

}
