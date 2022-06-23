# Generic list renderer

It's almost working now. Some polishing is needed.

If you want to use it just implement form fields (see ItemFormFields.js)

The list itself takes props:
- `dataModel` - data access model which provides some basic REST operation
- `formFields` - a component that contains fields for modal edit/create dialogs
- `itemRenderers` - optional. This is an object that contains two methods `main(item)` and `description(item)`. `main` is responsible for drawing header (JSX tags are discouraged). `description` outputs additional information about a list item. 