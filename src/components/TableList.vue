<template>
<b-overlay :show="loading" :opacity="0.4" bg-color="#000">
  <table class="table-list">
    <thead class="table-head">
      <tr>
        <th v-for="head in cols">{{ head.title }}</th>
      </tr>
    </thead>
    <tbody class="table-body">
      <template v-if="!loading && (!list || !list.length)">
        <tr>
          <td :colspan="cols.length" >
            <div class="empty-content" >
              <img style="height: 145px;" src="~@/assets/img/no-data@2x.png" alt="">
              <div class="empty-text">No data here...</div>
            </div>
          </td>
        </tr>
      </template>
      <template v-if="loading">
        <tr>
          <td :colspan="cols.length" >
            <div class="empty-content" ></div>
          </td>
        </tr>
      </template>
      <tr v-for="row in list">
        <td v-for="head in cols">

          <template v-if="head.prop === 'operation' && $scopedSlots.operation">
            <slot name="operation" :row="row" ></slot>
          </template>
          <template v-else>
            {{ row[head.prop]  }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</b-overlay>

</template>

<script>
export default {
  props: {
    cols: {
      type: Array,
    },
    list: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
.table-list {
  width: 100%;
}

.table-head {
  border-bottom: 1px solid $border-color;

  & th {
    height: 90px;
    font-size: 24px;
    color: #1DD186;
    padding: 8px;

    & + th {
      border-left: 1px dashed $border-color;
    }
  }
}

.table-body {
  & tr + tr {
    border-top: 1px dashed $border-color;
  }

  & td {
    padding: 8px;
    font-size: 18px;
    height: 60px;

    &:first-child {
      color: #1DD186;
    }
  }

  .empty-content {
    text-align: center;
    // font-size: 0;
    margin: 128px;
  }

  .empty-text {
    margin-top: 16px;
    color: #CCCCCC;
    margin-left: 24px;
  }
}
</style>
