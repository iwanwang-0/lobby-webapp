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
            <div class="empty-content"></div>
          </td>
        </tr>
      </template>
      <template
        v-for="(row, idx) in list"
      >
        <tr>
          <td v-for="head in cols">
            <template v-if="head.prop === 'operation' && $scopedSlots.operation">
              <slot name="operation" :row="row"></slot>
            </template>
            <template v-if="head.isEdit && $scopedSlots.operation">
              <template v-if="voteType === 'VeCRV'">
                <!-- <div class="edit-wrapper">
                  <input class="edit-input" type="number" min="0" :value="row['head.prop']" />
                  <span class="suffix">%</span>
                </div> -->
              </template>

              <template v-if="voteType === 'VlCVX'">
                <div class="edit-wrapper">
                  <span class="edit-sub" @click="onSub($event, row, head.prop)">-</span>
                  <input
                    class="edit-input vlcvx"
                    type="text"
                    v-model="row[head.prop]"
                    @input=" onInput($event, row, head.prop)"
                  />
                  <span class="edit-plus" @click="onPlus($event, row, head.prop)">+</span>
                  <span
                   class="percent-input vlcvx" type="text" disabled="true">
                   {{ row.percent }}
                   </span>
                  <span class="suffix">%</span>
                </div>
              </template>
            </template>
            <template v-else>
              {{ row[head.prop]  }}
            </template>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</b-overlay>

</template>

<script>
import CuButton from '@/components/CuButton.vue';

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
    voteType: {
      type: String,
    },
  },

  data() {
    return {
      active: '',
    };
  },

  created() {

  },

  methods: {
    onInput(e, row, prop) {
      const val = e.target.value;
      row[prop] = val.replace(/[^\d]/g, '');
      this.changeList();
    },
    onSub(e, row, prop) {
      if (!Number.isNaN(Number.parseInt(row[prop], 10)) && row[prop] >= 1) {
        row[prop] -= 1;
      } else {
        row[prop] = 0;
      }
      this.changeList();
    },

    onPlus(e, row, prop) {
      const val = Number.parseInt(row[prop], 10);
      if (!Number.isNaN(val)) {
        row[prop] = val + 1;
      } else {
        row[prop] = 0;
      }
      this.changeList();
    },

    changeList() {
      const total = this.list.reduce((sum, item) => sum + (parseInt(item.newWeight, 10) || 0), 0);

      this.list.forEach((item) => {
        if (!total) {
          item.percent = 0;
        } else {
          item.percent = (((parseInt(item.newWeight, 10) || 0) / total) * 100).toFixed(2);
        }
      });

      this.$emit('change', this.list);
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

  .edit-input.vlcvx {
    width: 100px;
    text-align: center;
  }

  .edit-sub,
  .edit-plus {
    flex-shrink: 0;
    display: inline-flex;
    // align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: #1B191F;
    font-size: 24px;
    text-align: center;
    border: 1px solid #4C4C4C;
    user-select: none;
  }

  .percent-input {
    margin-left: 12px;
    width: 80px;
    line-height: 40px;
    background: #1B191F;
    border: 1px solid #4C4C4C;
    text-align: center;
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
