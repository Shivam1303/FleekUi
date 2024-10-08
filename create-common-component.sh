#!/bin/bash

# Common component name passed as an argument
COMPONENT_NAME=$1

if [ -z "$COMPONENT_NAME" ]
then
  echo "Error: Please provide a common component name!"
  exit 1
fi

# Common package path
COMMON_PATH="packages/common"

# If common package does not exist, create it
if [ ! -d "$COMMON_PATH" ]
then
  echo "Creating a common package..."
  mkdir -p "$COMMON_PATH/src"

  # Initialize npm package
  cd "$COMMON_PATH" || exit
  npm init -y

  # Install React and TypeScript
  npm install react react-dom
  npm install --save-dev typescript @types/react @types/react-dom

  # Create a tsconfig.json file for the common package
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

  # Create a webpack config file for the common package
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

  # Initialize source directory and index.ts
  mkdir -p src
  echo "// Common components" > src/index.ts

  echo "Common package has been created in $COMMON_PATH"
fi

# Create a new common component
COMPONENT_FILE="$COMMON_PATH/src/$COMPONENT_NAME.tsx"

if [ -f "$COMPONENT_FILE" ]
then
  echo "Error: Common component $COMPONENT_NAME already exists!"
  exit 1
fi

cat <<EOT > "$COMPONENT_FILE"
import React from 'react';

interface ${COMPONENT_NAME}Props {
  label: string;
}

const $COMPONENT_NAME: React.FC<${COMPONENT_NAME}Props> = ({ label }) => {
  return <div>{label}</div>;
};

export default $COMPONENT_NAME;
EOT

# Update index.ts to export the new component
echo "export { default as $COMPONENT_NAME } from './$COMPONENT_NAME';" >> "$COMMON_PATH/src/index.ts"

echo "Common component $COMPONENT_NAME has been created in $COMMON_PATH"
