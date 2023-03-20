<template>
  <table class="table-list">
    <thead class="table-head">
      <tr>
        <th v-for="head in cols">{{ head.title }}</th>
      </tr>
    </thead>
    <tbody class="table-body">
      <tr v-for="row in list">
        <td v-for="head in cols">{{ row[head.prop] }}</td>
      </tr>
    </tbody>
  </table>
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


}
</style>
