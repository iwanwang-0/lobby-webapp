/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { mapValues } from 'lodash';

// 异步枚举获取配置
const enumsConfig = {
  stations: {
    url: '/station/list',
    init: true,
    method: 'GET',

    responseIntercepter: (data) => data.map((item) => ({
      label: item.name,
      value: item.id,
      original: item,
    })),
  },
};

const asyncEnums = mapValues(enumsConfig, () => []);

export {
  asyncEnums as default,
  enumsConfig,
};
