# Accessibility Guidelines

The document describes the guidelines for the frontend development with focus on accessibility. Most of its content bases on the [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/).

## 4 Principles: POUR
The Web Content Accessibility Guidelines (WCAG) are organized around four principles often called by the acronym POUR.

### Perceivable
Can users perceive the content? This helps us keep in mind that just because something is perceivable with one sense, such as sight, that doesn't mean that all users can perceive it.

### Operable
Can users use UI components and navigate the content? For example, something that requires a hover interaction cannot be operated by someone who can't use a mouse or touch screen.

### Understandable
Can users understand the content? Can users understand the interface and is it consistent enough to avoid confusion?

### Robust
Can the content be consumed by a wide variety of user agents (browsers)? Does it work with assistive technology?

## WCAG Checklist
Check out this simplified version of the official WCAG 2.0 specification in form of a checklist: [https://webaim.org/standards/wcag/checklist](https://webaim.org/standards/wcag/checklist)

## Accessibility Design Considerations
To develop accessible software, it is important to understand how people with disabilities perceive it. In contrast to the 2-dimensional information map most people can see, they experience the software in a linear way. This leads to some clear design constraints which are described below.


### Sensible ARIA usage
Despite ARIA was created exactly for the purpose of making the web more accessible, the 2 most used screen readers JAWS and NVDA still don't implement it consistently. 
However, (semantic) HTML is the most supported feature over all browsers.  

- Use semantic HTML wherever possible (e.g. h1, fieldset, form)
- Prefer semantic HTML over the usage of ARIA attributes
- Never redundantly use semantic HTML together with "role", e.g. `<form role="form"></form>`

https://www.accessibility-developer-guide.com/examples/sensible-aria-usage/

#### aria-hidden
Actually, none of the ARIA attributes should be used except the `aria-hidden` attribute (almost no exceptions). 

- Use `aria-hidden="true"` to hide any element from screen readers that is **not focusable** and does not contain any focusable element itself
- To show an element only to the screen readers and hide it visually, use the bootstrap CSS class `.sr-only`

In general: whenever you think about hiding something from any audience, better ask yourself whether this is really a good solution. Most of the time it is better to create a solution that works the same way for everybody, and which does not need any shaky ARIA.


### Headings
The headings outline is very important for people with disabilities. For them it serves as a table of contents and is being used to browse the page (using the `H` key).
- The structure of all headings on each page has to be consistent
- There are no missing levels (h1, h3, but no h2)
- To complete a document's outline, we may have to add visually hidden headings

https://www.accessibility-developer-guide.com/examples/headings/

### Tables
Traditional tables are fully accessible, but you still should try to keep them as simple as possible.
- Prefer tables (semantic HTML) over nested container structures using `div`
- You may  add semantics using the `role` attribute (e.g. `role="table"`, `role="row"`)

https://www.accessibility-developer-guide.com/examples/tables/

### Forms
Forms provide interactivity with websites. If coded properly, basic forms are natively accessible.

- the `label` must reference the belonging form control using the `for` attribute
- `fieldset`should be used to group controls
- to overcome the visual limitations of `fieldset` you can use the `role="group"` attribute on the particular element
- validation messages need a reference to the concerned form control
- non-interactive content (like titles) have to be attached to the concerned form control

https://www.accessibility-developer-guide.com/examples/forms/

## Dialogs

The dialogs that have forms inside should not be escapable. The dialogs for forting, filtering, previewing should be escapable.  
## Helper Tools

### Bookmarklets

Bookmarklets are small code pieces of JavaScript saved as a bookmark in the browser. 

#### HTML_Codesniffer
HTML_CodeSniffer is a client-side script that checks HTML source code and detects violations of a defined coding standard.

http://squizlabs.github.io/HTML_CodeSniffer/

### h123
This bookmarklet provides an efficient way to display the current webpage's heading outline.

https://hinderlingvolkart.github.io/h123

### Contents structured
This bookmarklet highlights a lot of typical semantic HTML elements.

https://www.accessibility-developer-guide.com/setup/browsers/bookmarklets/contents-structured/
