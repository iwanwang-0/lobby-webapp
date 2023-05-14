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
        v-for="(row, rIdx) in list"
      >
        <tr>
          <td v-for="(head, hIdx) in cols">

            <template v-if="hIdx === 0">
              <img
                v-if="crvFavPoolMap[row.pool]"
                class="favorite-icon"
                src="~@/assets/img/favorite-active@2x.png"
                alt=""
                @click="handleFav(row, false)"
              >
              <img
                v-else
                class="favorite-icon"
                src="~@/assets/img/favorite@2x.png"
                alt=""
                @click="handleFav(row, true)"
              >
              {{ rIdx + 1 }}
            </template>
            <template v-if="head.prop === 'operation' && $scopedSlots.operation">
              <slot name="operation" :row="row"></slot>
            </template>


            <template v-if="head.isEdit">
              <template>
                <div class="edit-wrapper">
                  <input
                    class="edit-input"
                    type="text" min="0"
                    v-model="valueMap[row.pool]"
                    placeholder="0"
                    @input=" onInput($event, row, head.prop)"
                   />
                  <span class="suffix">%</span>
                </div>
              </template>
            </template>
            <template v-else-if="typeof head.render === 'function'">
              {{ head.render(row[head.prop], row) }}
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
import { mapState } from 'vuex';
import CuButton from '@/components/CuButton.vue';

export default {
  components: {
    CuButton,
  },
  props: {
    crvFavPoolMap: {
      type: Object,
    },
    list: {
      type: Array,
    },
    valueMap: {
      type: Object,
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

      cols: [
        {
          title: 'Sort',
          prop: 'sort',
          width: '80px',
        },
        {
          title: 'Pool',
          prop: 'pool',
          width: '160px',
        },
        // {
        //   title: 'Apr',
        //   prop: 'apr',
        //   render(text) {
        //     return `${text}%`;
        //   }
        // },
        {
          title: 'Weight',
          prop: 'weight',
          render(text) {
            return `${text / 100}%`;
          }
        },
        {
          title: 'New Weight',
          prop: 'newWeight',
          isEdit: true,
          width: 350,
          // opBtn: 'Best Option',
          opClick: () => {
            console.log(this);
          },
        },
        {
          title: 'Operation',
          prop: 'operation',
          width: 160,
        },
      ],
    };
  },
  computed: {
    ...mapState(['cvxChoices', 'proposal', 'crvChoices', 'marketOption']),
  },

  created() {

  },

  methods: {
    handleFav(row, flag) {
      this.$store.commit('SET_CRV_FAV', {
        pool: row.pool,
        flag,
      })
    },
    onInput(e, row) {
      if (!this.valueMap[row.pool]) {
        this.$set(this.valueMap, row.pool, 0);
      }

      const val = e.target.value;
      let result = val;
      if (!/^[1-9]\d*(\.\d+)?$/.test(val)) {
        result = val.replace(/[^\d.]/g, '');
      }
      if (parseFloat(result) > 100) {
        result = '100';
      }
      this.valueMap[row.pool] = result;
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
  & .favorite-icon {
    width: 16px;
    cursor: pointer;
  }
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
