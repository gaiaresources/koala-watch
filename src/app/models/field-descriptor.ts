import { FieldOption } from "./field-option";

export interface FieldDescriptor {
  key: string;
  label: string;
  description?: string;
  type: string;
  format?: string;
  options?: FieldOption[];
  defaultValue?: string;
}
