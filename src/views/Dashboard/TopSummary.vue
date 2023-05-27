<template>
   <b-container class="top-section" fluid="lg">
      <div class="content">
        <div class="round-cell">
          <div class="round-content">
            <div class="value">{{roundLabel}}</div>
            <div class="label">Round Number</div>
          </div>
          <CuSelect
            class="select"
            type="simple"
            :options="roundOptions"
            :value="round"
            @change="onChange"
          >
          </CuSelect>
        </div>
        <div>
          <div class="value">${{price | toFixed(4)}}</div>
          <div class="label">$/veCRV</div>
        </div>
        <div>
          <div class="value">{{deadline}}</div>
          <div class="label">Deadline</div>
        </div>
        <div>
          <div class="value">${{formatTotal}}</div>
          <div class="label">Total</div>
        </div>
      </div>
    </b-container>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import CuSelect from '@/components/CuSelect.vue';
import numbro from 'numbro';

export default {
  components: {
    CuSelect,
  },
  props: {
    round: {
      type: Number,
    },
    total: {
      type: Number,
    },
    price: {
      type: Number,
    },
    voteType: {
      type: String,
    }
  },
  data() {
    return {
      WEEK_SECONDS: 7 * 24 * 60 * 60,
      // round: 1,
    };
  },
  computed: {
    ...mapGetters(['cvxRoundOptions', 'crvRoundOptions']),
    roundOptions() {
      if (this.voteType === 'VeCRV') {
        return this.crvRoundOptions;
      }
      return this.cvxRoundOptions;
    },
    roundLabel() {
      return this.roundOptions.find((item) => item.value === this.round)?.label || '-';
    },
    deadline() {
      return moment((this.round * this.WEEK_SECONDS + this.WEEK_SECONDS) * 1000).format('yyyy/MM/DD');
    },

    formatTotal() {
      return numbro(this.total).format({
        average: true,
        totalLength: 3,
      });
    },
  },
  watch: {
    roundOptions: {
      handler() {
        if (this.roundOptions?.[0]) {
          const round = this.roundOptions?.[0].value;
          this.$emit('round-change', round);
        }
      },
      immediate: true,
    },
  },

  methods: {
    onChange(round) {
      console.log(round);
      this.$emit('round-change', round);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";
  .top-section {
    border-left: 1px solid $border-color;
    border-right: 1px solid $border-color;
  }
  .content {
    // border-bottom: 1px dashed $border-color;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-bottom: 1px solid $border-color;
    height: 130px;

    & > div {
      border-left: 1px dashed $border-color;
      padding-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    & .round-cell {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    & .select {
      width: 100px;
      text-align: right;
      & ::v-deep .selected {
        padding: 0;
        justify-content: flex-end;
        margin-right: 12px;
      }
      & ::v-deep .value {
        display: none;
      }

      & ::v-deep .options {
        width: 160px;
        right: 0;
      }
    }

    & .round-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    & > div:first-child {
      border-left: 0
    }

    & .value {
      font-size: 48px;
      font-weight: normal;
      font-family: ChillPixels Maximal;
      display: inline-block;
      color: #64D98A;
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    & .label {
      font-size: 18px;
      font-weight: normal;
      color: #CCCCCC;
    }
  }

</style>
