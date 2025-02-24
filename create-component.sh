#!/bin/bash

# Component name passed as argument
COMPONENT_NAME=$1

if [ -z "$COMPONENT_NAME" ]
then
  echo "Error: Please provide a component name!"
  exit 1
fi

# Create a new package directory inside the packages folder
COMPONENT_PATH="packages/$COMPONENT_NAME"

if [ -d "$COMPONENT_PATH" ]
then
  echo "Error: Component $COMPONENT_NAME already exists!"
  exit 1
fi

mkdir -p "$COMPONENT_PATH/src"

# Initialize package.json with correct configuration
cat <<EOT > "$COMPONENT_PATH/package.json"
{
  "name": "@sliderzz/fleek-$COMPONENT_NAME",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    "import": "./dist/index.js",
    "require": "./dist/index.js",
    "types": "./dist/index.d.ts"
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "typescript": "^5.7.3"
  }
}
EOT

# Create TypeScript configuration
cat <<EOT > "$COMPONENT_PATH/tsconfig.json"
{
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationDir": "dist",
    "module": "ESNext",
    "moduleResolution": "Node",
    "target": "ES6",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOT

# Create component file
cat <<EOT > "$COMPONENT_PATH/src/$COMPONENT_NAME.tsx"
import React from 'react';

interface ${COMPONENT_NAME}Props {
  // Add your props here
}

const $COMPONENT_NAME: React.FC<${COMPONENT_NAME}Props> = (props) => {
  return (
    <div>
      {/* Add your component content here */}
    </div>
  );
};

export default $COMPONENT_NAME;
EOT

# Create index file
cat <<EOT > "$COMPONENT_PATH/src/index.ts"
export { default as $COMPONENT_NAME } from './$COMPONENT_NAME';
EOT

# Create README.md
cat <<EOT > "$COMPONENT_PATH/README.md"
# $COMPONENT_NAME Component

## Installation

\`\`\`bash
npm install @sliderzz/fleek-$COMPONENT_NAME
\`\`\`

## Usage

\`\`\`tsx
import { $COMPONENT_NAME } from '@sliderzz/fleek-$COMPONENT_NAME';

const YourComponent = () => {
  return (
    <$COMPONENT_NAME />
  );
};
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
|      |      |         |             |

## Examples

Add usage examples here.
EOT

echo "Component $COMPONENT_NAME has been created in $COMPONENT_PATH"
