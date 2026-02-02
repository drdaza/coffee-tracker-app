export interface FieldConfig<TForm, TDto> {
  key: keyof TForm;
  dtoKey?: keyof TDto;
  transform?: (value: TForm[keyof TForm]) => unknown;
}

export const buildDto = <TForm, TDto>(
  formData: TForm,
  original: TForm | null,
  fields: FieldConfig<TForm, TDto>[]
): TDto | null => {
  const dto: Record<string, unknown> = {};
  let hasChanges = !original;

  for (const { key, dtoKey, transform } of fields) {
    const value = formData[key];

    if (!original || value !== original[key]) {
      const outputKey = (dtoKey || key) as string;
      dto[outputKey] = transform ? transform(value) : value;
      hasChanges = true;
    }
  }

  return hasChanges ? (dto as TDto) : null;
};
