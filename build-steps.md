# Creating a New Component

To create a new component, use the following command: `./create-component.sh MyNewComponent`.

To build the new component, run: `lerna run build`.

To publish only the new component, navigate to its directory and run: `cd packages/MyNewComponent` followed by `npm publish --access public`.

To publish all components, use: `npx lerna publish`

# Creating a Common Component

To create a new common component, use: `./create-common-component.sh Button`.

## Build and Publish Only Common Package

To build the common package, navigate to its directory and run: `cd packages/common` followed by `npx tsc`.

To publish the common package to npm, use: `npm publish --access public`.

## Build and Publish All Components

To build all components, run: `lerna run build`.

To publish all components, use: `npx lerna publish`.

