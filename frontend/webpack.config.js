const path = require('path');

module.exports = {
  entry: './src/App.jsx', // Adjust the entry point based on your project
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream:require.resolve("stream-browserify")
    },
  },
};
