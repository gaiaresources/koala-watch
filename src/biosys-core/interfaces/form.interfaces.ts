export interface FormDescriptor {
    dateFields?: FieldDescriptor[];
    locationFields?: FieldDescriptor[];
    requiredFields?: FieldDescriptor[];
    optionalFields?: FieldDescriptor[];
    hiddenFields?: FieldDescriptor[];
    keyField?: string;
}

export interface FieldDescriptor {
    key: string;
    label: string;
    description?: string;
    type: string;
    format?: string;
    options?: FieldOption[];
    defaultValue?: string;
}

export interface FieldOption {
    text: string;
    value: string;
}
