# CSS HTML Cross-Browser

This document should provide some guidance when some more sophisticated parts of the applications should be changed/refactored.

## Drag'n'Drop

### Global blocking of file drag'n'drop
The browser's default drag'n'drop behaviour for files (loading and showing the file) is blocked globally by default so the user cannot 
accidentally drop files and leave the page.

The implementation of the blocking algorithm is done in `file-drag-drop.service.ts`. If any of the drag'n'drop events `dragover`, `dragleave` 
or `drop` contain files, the default behaviour will be prevented.

### Drag'n'Drop Area
Only explicit drag'n'drop areas will receive the proper events. To create a drag'n'drop area, just apply the `file-drag-drop.directive.ts` to 
the desired element. Look at the `file-input.component.html` to get an example of how it's integrated.

The property `parentDragDropAreaId` enables you to define any parent element ID as the drag'n'drop area. E.g. in the `application-document.modal.ts`
the parent drag'n'drop area spans over the whole modal (`id="applicationDocumentDragDropArea"`, not just over the `file-input-component.html`. 

## Navigation Container

### Scrolling
To make the main content scroll on the page we don't explicitly set the `overflow-y: auto` on some element. We let the browser
do the scrolling with the `body` tag. Only like that browsers can optimize the scrolling behaviour for mobile devices, e.g. remove the
URL bar when scrolling down.


## Nested Buttons
Nested buttons are not supported by the Firefox (ESR) browser (nested button is not clickable). To overcome that issue we use the following pattern.

Instead of nesting the buttons like this:
```xhtml
<button>
    Parent Button
    <button>
        Nested Button
    </button>
</button>
```
... you have to position the nested button below the parent button and use absolute positioning:

```xhtml
<div class="position-relative">
    <button>Parent Button</button>
    <button class="nested-button">Nested Button</button>
</div>
```
```CSS
.nested-button {
    position: absolute;
    right: 0.5em;
    top: 0.5em;
}
```

## Sticky Positioning
Sticky positioning is not supported by the IE11 browser resulting in the property being ignored. But this can lead 
to unpredictable behaviour, because the CSS property `top` may require different values depending on whether `sticky`
is supported or not. To achieve this, you can use the following pattern using `@supports`:
```
.my-sticky-positioned-container {
  top: 54px;
  position: relative;
  @supports (position: sticky) {
    top: 154px;
    position: sticky;
  }
}
```

## Printing

### Full Width Columns
Use the class `.alv-print-container` to force columns (e.g. ".col-6") to have full width on print.

### Exclude from print
To explicitly exclude certain parts of the HTML from print use the Bootstrap CSS class `.d-print-none`.

### Global printing rules
The global printing rules are maintained and documented in [scss/common/print.scss](../alv-portal-ui/src/scss/common/print.scss).

