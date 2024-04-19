import { FieldDescriptor } from "./field-descriptor";

export interface FormDescriptor {
  dateFields?: FieldDescriptor[];
  locationFields?: FieldDescriptor[];
  requiredFields?: FieldDescriptor[];
  optionalFields?: FieldDescriptor[];
  hiddenFields?: FieldDescriptor[];
  keyField?: string;
}
