<template>
<b-overlay :show="loading" :opacity="0.4" bg-color="#000">
  <table class="table-list">
    <thead class="table-head">
      <tr>
        <th
          v-for="head in cols"
          :width="head.width"
        >
          {{ head.title }}
          <b-button
            style="margin-left: 8px"
            variant="outline-primary"
            v-if="head.opBtn"
            @click="head.opClick"
          >
            {{ head.opBtn }}
          </b-button>
        </th>
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
      <template v-for="(row, idx) in list">
        <tr
          :class="{'expanded-row1': active === idx}"
          @click="expand(idx)"
        >
          <td v-for="head in cols">
            <template v-if="head.prop === 'operation' && $scopedSlots.operation">
              <slot name="operation" :row="row"></slot>
            </template>
            <template v-if="head.isEdit && $scopedSlots.operation">
              <div class="edit-wrapper">
                <input class="edit-input" type="text" v-model="row['head.prop']" />
                <span class="suffix">%</span>
              </div>
            </template>
            <template v-else>
              {{ row[head.prop]  }}
            </template>
          </td>
        </tr>
        <tr class="expanded-row2" v-if="active === idx">
          <td>
          </td>
          <td :colspan="cols.length - 1">
            <slot name="expandPanel" :row="row"></slot>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</b-overlay>

</template>

<script>
import CuButton from './CuButton.vue';

export default {
  components: {
    CuButton,
  },
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
    isExpand: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      active: '',
    };
  },

  methods: {
    expand(idx) {
      if (!this.isExpand) return;
      if (idx === this.active) {
        this.active = '';
      } else {
        this.active = idx;
      }
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
  .edit-wrapper {
    display: inline-flex;
    width: 300px;
  }
  .edit-input {
    background: #1B191F;
    border: 1px solid #4C4C4C;
    height: 40px;
    color: #ccc;
    outline: none;
    padding-left: 8px;
  }
  .suffix {
      display: inline-block;
      text-align: center;
      line-height: 36px;
      width: 40px;
      height: 40px;
      background: #4C4C4C;
      flex-shrink: 0;
    }

  & .expanded-row1 {
    background: #363537;
  }

  & .expanded-row2 {
    background: #363537;
    border-top: none;
      & td {
        padding: 0;
        &:first-child {
          color: #ccc;
        }
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
