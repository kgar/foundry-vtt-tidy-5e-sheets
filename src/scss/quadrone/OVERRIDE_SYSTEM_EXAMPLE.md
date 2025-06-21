# CSS Variable Override System

This document explains how the new CSS variable override system works for spellcasting colors and can be extended to other variables.

## How It Works

The override system uses CSS custom property fallbacks to create a hierarchy of inheritance:

1. **Base variables** (defined in `variables-quadrone.scss`): These are the default fallback values
2. **Override variables**: These are undefined by default but can be set at any level to override the base values
3. **Mode classes**: These use the override variables with fallbacks to base variables

## Structure

```css
/* Base variable (fallback) */
--t5e-color-spellcasting-pact: var(--t5e-color-palette-pink-55);

/* Mode class that looks for override first, then fallback */
.mode-pact {
  --t5e-mode-color: var(--t5e-color-spellcasting-pact-override, var(--t5e-color-spellcasting-pact));
}
```

## Usage Examples

### 1. Global Override (affects all sheets)
```css
.tidy5e-sheet.quadrone {
  --t5e-color-spellcasting-pact-override: blue;
}
```

### 2. Sheet-level Override (affects entire sheet)
```html
<form class="tidy5e-sheet" style="--t5e-color-spellcasting-pact-override: red;">
```

### 3. Tab-level Override (affects specific tab)
```css
.tidy-tab.spellbook {
  --t5e-color-spellcasting-pact-override: green;
}
```

### 4. Dynamic Override (JavaScript)
```javascript
// Set override on form element
document.querySelector('.tidy5e-sheet').style.setProperty('--t5e-color-spellcasting-pact-override', 'purple');

// Set override on specific tab
document.querySelector('.tidy-tab.spellbook').style.setProperty('--t5e-color-spellcasting-pact-override', 'orange');
```

## Available Override Variables

- `--t5e-color-spellcasting-prepared-override`
- `--t5e-color-spellcasting-atwill-override`
- `--t5e-color-spellcasting-always-override`
- `--t5e-color-spellcasting-pact-override`
- `--t5e-color-spellcasting-innate-override`
- `--t5e-color-spellcasting-ritual-override`

## Extending the System

To add override capability to other variables:

1. **Define the base variable**:
   ```css
   --t5e-color-my-feature: var(--t5e-color-palette-blue-57);
   ```

2. **Update usage to support overrides**:
   ```css
   .my-feature-class {
     --t5e-feature-color: var(--t5e-color-my-feature-override, var(--t5e-color-my-feature));
   }
   ```

3. **Document the override variable**: Add it to the list above

## Cascade Priority

The cascade priority (highest to lowest):
1. Inline styles (`style="--var: value"`)
2. Tab-level classes (`.tidy-tab.spellbook`)
3. Form-level classes (`.tidy5e-sheet`)
4. Global overrides
5. Base variables (default fallbacks)

This system ensures maximum flexibility while maintaining a clear, predictable inheritance pattern. 