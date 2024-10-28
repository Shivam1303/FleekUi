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

# Initialize a new npm package for the component
cd "$COMPONENT_PATH" || exit
npm init -y

# Add dependencies for React and TypeScript
npm install react react-dom
npm install --save-dev typescript @types/react @types/react-dom

# Add common components as a dependency
npm install @fleek/common

# Create TypeScript configuration for the component
cat <<EOT > tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["dist"]
}
EOT

# Create Webpack configuration for the component
cat <<EOT > webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  mode: 'production',
};
EOT

# Create basic React component files
cat <<EOT > src/$COMPONENT_NAME.tsx
import React from 'react';
import { Button } from '@fleek/common'; // Changed from @my-scope/common

interface ${COMPONENT_NAME}Props {
  label: string;
}

const $COMPONENT_NAME: React.FC<${COMPONENT_NAME}Props> = ({ label }) => {
  return (
    <div>
      <Button label="Common Button" />
      {label}
    </div>
  );
};

export default $COMPONENT_NAME;
EOT

# Create an index file for exporting the component
cat <<EOT > src/index.ts
import '../../styles.css';
export { default as $COMPONENT_NAME } from './$COMPONENT_NAME';
EOT

# Update the package.json with the component's main entry point and scope
jq '.main = "dist/index.js" | .name = "@fleek/'"$COMPONENT_NAME"'" package.json > tmp.json && mv tmp.json package.json

echo "Component $COMPONENT_NAME has been created in $COMPONENT_PATH"
