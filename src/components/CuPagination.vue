<template>
  <div class="pagination">
    <ul>
      <li class="left-btn" @click="onPrev">
        <img src="~@/assets/img/page-arrow@2x.png" alt="">
      </li>
      <li
        v-for="item in pageList"
         :key="item"
         :class="{
          active: item === page
         }"
         @click="() => {
          if (item !== '...') {
            onChange(item)
          }
         }"
        >{{ item }}</li>
      <li class="right-btn" @click="onNext">
        <img src="~@/assets/img/page-arrow@2x.png" alt="">
      </li>
      {{ total }}
    </ul>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from '@vue/composition-api';
import generatePagination from '@/common/generatePagination';

export default defineComponent({

  props: {
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 10,
    },
  },

  setup(props, context) {
    let pageList = ref([]);

    const onPrev = () => {
      if (props.page > 1) {
        context.emit('change', props.page - 1);
      }
    };

    const onNext = () => {
      if (props.page < Math.ceil(props.total / props.pageSize)) {
        context.emit('change', props.page + 1);
      }
    };

    const onChange = (val) => {
      context.emit('change', val);
    };

    const generatePage = () => {
      pageList.value = generatePagination({
        showPageCount: 10,
        currentPage: props.page,
        pageCount: Math.ceil(props.total / props.pageSize) || 1,
      });
    }

    watch(() => props.total, generatePage);
    watch(() => props.page, generatePage);
    watch(() => props.pageSize, generatePage);
    generatePage();
    return {
      onPrev,
      onNext,
      onChange,
      pageList,
    };
  },
});
</script>

<style lang="scss" scoped>

.pagination {
  justify-content: end;
  ul {
    list-style: none;
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    padding: 0;
    // float: right;
    & .left-btn,
    & .right-btn {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      // border: 1px solid #CCCCCC;
      background: #1B191F;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      & img {
        width: 16px
      }
    }

    & .left-btn {
      margin-right: 20px;
    }
    & .right-btn {
      margin-left: 20px;
      & img {
        transform: rotate(180deg);
      }
    }
    & li {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      // margin-left: 12px;
      // margin-right: 12px;
      width: 40px;
      height: 40px;
      // border-radius: 3px;
      background: #1B191F;
      cursor: pointer;
      &.active {
        background: #1DD186;
        font-weight: bold;
        color: #000000;
      }
    }
  }
}
</style>
