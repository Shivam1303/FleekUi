const path = require('path');

module.exports = {
  entry: './src/index.ts', // Entry point for the bundle
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled files
    filename: 'index.js', // Name of the output bundle
    libraryTarget: 'umd', // Universal Module Definition for compatibility
    globalObject: 'this', // Ensures the library works in both Node.js and browser environments
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Matches .ts and .tsx files
        exclude: /node_modules/, // Exclude node_modules from transpilation
        use: {
          loader: 'ts-loader', // Use ts-loader to compile TypeScript files
        },
      },
      {
        test: /\.css$/, // Matches .css files
        use: ['style-loader', 'css-loader'], // Loaders to handle CSS files
      },
    ],
  },
  externals: {
    react: 'react', // Exclude React from the bundle
    'react-dom': 'react-dom', // Exclude ReactDOM from the bundle
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // File extensions to resolve
  },
  mode: 'production', // Set mode to production for optimizations
};
