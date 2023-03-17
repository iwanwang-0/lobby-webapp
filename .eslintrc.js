module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/require-v-for-key': 'off',
    'consistent-return': 'off'
  },

  globals: {
    wx: true,
    window: true,
    document: true,
    __g_store__: true,
    __g_router__: true,
    __g_config__: true,
    __g_storage__: true,
  },
};
