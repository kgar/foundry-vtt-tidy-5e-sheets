export const TabConfigurationSchema = new foundry.data.fields.SchemaField(
  {
    selected: new foundry.data.fields.ArrayField(
      new foundry.data.fields.StringField({
        required: true,
        nullable: false,
        blank: false,
      }),
      { initial: [] }
    ),
    visibilityLevels: new foundry.data.fields.TypedObjectField(
      new foundry.data.fields.NumberField({
        required: true,
        nullable: true,
      }),
      { initial: {} }
    ),
  },
  { initial: {} },
  { name: 'Tab Configuration' }
);
