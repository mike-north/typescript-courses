const babelOptions = {
  presets: ['babel-preset-gatsby', '@babel/preset-typescript'],
};

const babelJest = require('babel-jest');
 
const createTransformer = babelJest.createTransformer || babelJest.default.createTransformer;

module.exports = createTransformer(babelOptions);
