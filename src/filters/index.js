import Vue from 'vue';

const context = require.context('./', false, /\.js$/);

const excludes = [
  './index.js',
];

context.keys().forEach((key) => {
  if (excludes.includes(key)) return;
  const name = key.replace(/(^.\/|.js$)/g, '');
  Vue.filter(name, context(key).default);
});
