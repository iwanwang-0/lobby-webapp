<template>
  <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text"> Vote history </span>
      <div class="header-right">
        <CuSelect
          class="type-select"
          type="simple"
          :options="typeOptions"
          :value="voteType"
          @change="onVoteTypeChange"
        >
        </CuSelect>

        <RoundSelect :options="roundOptions" @change="selectChange" v-model="round" />
      </div>
    </div>

    <div class="content">
      <TableList :cols="cols" :list="listFiltered" :loading="loading" :is-expand="false">
      </TableList>
    </div>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import TableList from "@/components/TableList";
import RoundSelect from "@/components/RoundSelect";
import toFixed from "@/filters/toFixed";

import { getCvxVotes } from "@/api/snapshot";
import { getCrvHistory } from "@/api/thegraph";
import { fetchVoteHistory } from "@/api/common";
import { WEEK_SECONDS, CRV_START_SECONDS, CVX_START_SECONDS } from "@/constants/time";
import CuSelect from "@/components/CuSelect";

export default {
  components: {
    TableList,
    RoundSelect,
    CuSelect,
  },

  props: {},

  data() {
    return {
      round: "all",
      list: [],

      market: "All",

      submitting: false,
      loading: false,

      typeOptions: [
        {
          label: "VeCRV",
          value: "VeCRV",
        },
        {
          label: "VlCVX",
          value: "VlCVX",
        },
      ],
      voteType: "VeCRV",
    };
  },

  computed: {
    currentAddress() {
      return this.$route.params.tokenOwner;
    },
    ...mapState(["user", "guageNameMap"]),
    ...mapGetters(["cvxRoundOptions", "crvRoundOptions"]),
    roundOptions() {
      console.log(this.crvRoundOptions, this.cvxRoundOptions);
      if (this.voteType === "VeCRV") {
        return [
          {
            value: "all",
            label: "All",
          },
          ...this.crvRoundOptions,
        ];
      }
      return [
        {
          value: "all",
          label: "All",
        },
        ...this.cvxRoundOptions,
      ];
    },
    ...mapState(["proposal"]),
    cols() {
      return [
        {
          title: "Round",
          prop: "round",
        },
        {
          title: "Pool",
          prop: "pool",
        },
        {
          title: "Score",
          prop: "score",
          render(text) {
            return Number(text).toFixed(2);
          },
        },
        {
          title: "Is Delegated",
          prop: "is_delegate",
        },
        {
          title: "Time",
          prop: "created",
          render(text) {
            return moment(text * 1000).format("yyyy-MM-DD HH:mm");
          },
        },
      ];
    },
    listFiltered() {
      if (this.round === "all") return this.list;
      if (this.voteType !== "VeCRV") {
        const cvxStartRound = Math.floor(CVX_START_SECONDS / WEEK_SECONDS) - 1;
        return this.list.filter((vote) => vote.round * 2 - 1 === this.round - cvxStartRound);
      }
      if (this.voteType === "VeCRV") {
        const crvStartRound = Math.floor(CRV_START_SECONDS / WEEK_SECONDS) - 1;

        return this.list.filter((vote) => vote.round === this.round - crvStartRound);
      }
      return this.list;
    },
  },

  watch: {
    roundOptions: {
      handler() {
        this.round = this.roundOptions[0].value;
      },
      immediate: true,
    },

    round() {
      console.log(this.round);
      // this.list = [];
      if (this.list.length === 0) this.getVotes();
    },
    voteType() {
      this.list = [];
      this.getVotes();
    },
    currentAddress() {
      this.list = [];
      this.getVotes();
    },
  },

  created() {
    this.getVotes();
  },

  methods: {
    selectChange() {
      // this.getReward();
    },

    onVoteTypeChange(value) {
      this.voteType = value;
    },

    // async getVotes() {
    // if (this.voteType === "VeCRV") {
    //   this.getCrvHistory();
    // } else {
    //   this.getCvxVotes();
    // }
    // },

    async getCrvHistory() {
      this.loading = true;
      const data = await getCrvHistory({
        round: this.round,
        user: this.$route.params.tokenOwner || this.user.address,
      });

      this.loading = false;

      const list = [];
      const crvStartRound = Math.floor(CRV_START_SECONDS / WEEK_SECONDS) - 1;

      if (data) {
        data.forEach((item) => {
          list.push({
            round: this.round - crvStartRound,
            pool: this.guageNameMap[item.gauge]?.name || item.gauge,
            quantity: toFixed(((item.veCRV / 10 ** 18) * item.weight) / 10000, 2),
            weight: item.weight,
            time: item.time,
          });
        });
      }

      this.list = list;
    },

    async getCvxVotes() {
      this.loading = true;

      const res = await getCvxVotes({
        // voter: '0xb9Da169Dc7145B3C04FfD26D428b188A35963F5A',
        voter: this.$route.params.tokenOwner || this.user.address,
        start: this.round * WEEK_SECONDS,
        end: this.round * WEEK_SECONDS + WEEK_SECONDS * 2,
      });
      this.loading = false;

      const list = [];

      if (res?.data?.votes) {
        res.data.votes.forEach((item) => {
          const { choice, proposal } = item;

          const choiceItemKey = Object.keys(choice);

          const sumPower = choiceItemKey.reduce((sum, keyItem) => sum + choice[keyItem], 0);

          const cvxStartRound = Math.floor(CVX_START_SECONDS / WEEK_SECONDS) - 1;

          choiceItemKey.forEach((keyItem) => {
            list.push({
              round: Math.ceil((this.round - cvxStartRound) / 2),
              pool: proposal.choices[keyItem - 1],
              quantity: (item.vp * choice[keyItem]) / sumPower,
              time: item.created,
            });
          });
        });
      }
      this.list = list;
    },
    async getVotes() {
      const token = this.voteType === "VeCRV" ? "vecrv" : "vlcvx";
      try {
        const res = await fetchVoteHistory({
          token,
          voter: this.$route.params.tokenOwner || this.user.address,
        });
        this.list = res.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.type-select {
  margin-right: 24px;
}
.top-section {
  border-top: 1px solid $border-color;
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  display: grid;
  grid-template-rows: 130px auto;
  .header {
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    padding-right: 10px;
    .header-text {
      background: linear-gradient(218deg, #ff460e 0%, #eca13f 44%, #00dd59 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-right {
      display: flex;
      align-items: center;

      .link-btn {
        margin-right: 30px;
        width: 130px;
        height: 50px;
      }
    }
  }
  .content {
    font-family: "ChillPixels Maximal";
    & .row1 {
      font-size: 18px;
      display: flex;
      align-items: center;
      padding-left: 9px;
      height: 28px;
      color: #ccc;
      & > div {
        margin-right: 40px;
      }
      em {
        color: #1dd186;
        font-style: normal;
      }
      & .claim-btn {
        font-size: 18px;
      }
    }
    & .row2 {
      font-size: 14px;
      display: grid;
      grid-template-columns: 230px 230px 230px 230px;
      row-gap: 20px;
      background: rgba(27, 25, 31, 0.45);
      border: 1px dashed #787878;
      padding: 8px;
      margin: 18px 0;
      width: 912px;
      & .label {
        color: #666666;
      }

      & .content {
        color: #cccccc;
      }
    }
    // display: grid;
    // grid-template-columns: 670px 530px;
    // height: 317px;
  }
}
</style>
