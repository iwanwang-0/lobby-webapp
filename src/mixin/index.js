import Vue from 'vue';

const context = require.context('./', false, /\.js$/);

const excludes = [
  './index.js',
];

context.keys().forEach((key) => {
  if (excludes.includes(key)) return;
  Vue.mixin(context(key).default);
});
