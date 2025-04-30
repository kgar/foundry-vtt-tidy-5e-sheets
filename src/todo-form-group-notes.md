Notes on formGroup / formField.
First, formField is an alias to the handlebars helper formGroup.

formGroup's job is to
- verify a subclass of datafield has been provided
- form groupOptions and inputOptions
- call `field.toFormGroup(groupConfig, inputConfig);`




```js
/**
 * Create a standardized form field group.
 * @param {FormGroupConfig} config
 * @returns {HTMLDivElement}
 */
export function createFormGroup(config) {
  let {classes, hint, label, input, rootId, stacked, localize, units} = config;
  classes ||= [];
  if ( stacked ) classes.unshift("stacked");
  classes.unshift("form-group");

  // Assign identifiers to each input
  input = input instanceof HTMLCollection ? input : [input];
  let labelFor;
  if ( rootId ) {
    for ( const [i, el] of input.entries() ) {
      const id = [rootId, el.name, input.length > 1 ? i : ""].filterJoin("-");
      labelFor ||= id;
      el.setAttribute("id", id);
    }
  }

  // Create the group element
  const group = document.createElement("div");
  group.className = classes.join(" ");
  group.hidden = config.hidden ?? false;

  // Label element
  const lbl = document.createElement("label");
  lbl.innerText = localize ? game.i18n.localize(label) : label;
  if ( labelFor ) lbl.setAttribute("for", labelFor);
  if ( units ) lbl.insertAdjacentHTML("beforeend", ` <span class="units">(${game.i18n.localize(units)})</span>`);
  group.prepend(lbl);

  // Form fields and inputs
  const fields = document.createElement("div");
  fields.className = "form-fields";
  fields.append(...input);
  group.append(fields);

  // Hint element
  if ( hint ) {
    const h = document.createElement("p");
    h.className = "hint";
    h.innerText = localize ? game.i18n.localize(hint) : hint;
    group.append(h);
  }
  return group;
}

// data field
/**
 * Render this DataField as an HTML element.
 * @param {FormInputConfig} config        Form element configuration parameters
 * @throws {Error}                        An Error if this DataField subclass does not support input rendering
 * @returns {HTMLElement|HTMLCollection}  A rendered HTMLElement for the field
 */
toInput(config={}) {
  const inputConfig = {name: this.fieldPath, ...config};
  if ( inputConfig.input instanceof Function ) return config.input(this, inputConfig);
  return this._toInput(inputConfig);
}

// Handlebars

/**
 * Convert a DataField instance into an HTML input fragment.
 * @param {DataField} field             The DataField instance to convert to an input
 * @param {object} options              Helper options
 * @returns {Handlebars.SafeString}
 */
export function formGroup(field, options) {
  const {classes, label, hint, rootId, stacked, units, hidden, widget, ...inputConfig} = options.hash;
  const groupConfig = {label, hint, rootId, stacked, widget, localize: inputConfig.localize, units, hidden,
    classes: typeof classes === "string" ? classes.split(" ") : []};
  if ( !field ) {
    console.error("Non-existent data field provided to {{formGroup}} handlebars helper.");
    return Handlebars.SafeString("");
  }
  const group = field.toFormGroup(groupConfig, inputConfig);
  return new Handlebars.SafeString(group.outerHTML);
}

```

Special Traits usage
```hbs
{{ formField field name=name value=value choices=choices input=input disabled=@root.flags.disabled }}
```

Relevant typings:
```ts
type FormInputValue = unknown;

type CustomFormGroup = (
  field: DataField,
  groupConfig: FormGroupConfig,
  inputConfig: FormInputConfig
) => HTMLDivElement;

type CustomFormInput = (
  field: DataField,
  config: FormInputConfig
) => HTMLElement | HTMLCollection;

interface FormGroupConfig {
  label: string;
  units?: string;
  input: HTMLElement | HTMLCollection;
  hint?: string;
  rootId?: string;
  classes?: string[];
  stacked?: boolean;
  localize?: boolean;
  hidden?: boolean | "until-found";
  widget?: CustomFormGroup;
}

interface FormInputConfig {
  name: string;
  value?: FormInputValue;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  localize?: boolean;
  dataset?: Record<string, string>;
  aria?: Record<string, string>;
  placeholder?: string;
  classes?: string;
  input?: CustomFormInput;
}
```