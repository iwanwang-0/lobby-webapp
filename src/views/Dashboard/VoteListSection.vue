<template>
   <b-container class="top-section" fluid="lg">
    <div class="header">
      <span class="header-text">
        List
      </span>
      <div class="header-right">

        <!-- <CuSelect
          type="simple"
          class="cu-select"
          :options="marketOption"
          v-model="market"
        /> -->

      </div>
    </div>

    <div class="content">
      <TableList
        :cols="cols"
        :list="voteList"
        :loading="loading"
        :is-expand="true"
        @expand="onExpand"
        @sort="onSort"
      >
        <template v-slot:operation="{ row }">
          <!-- {{ row }} -->
          <CuButton
            variant="link"
            :disabled="submitting"
            @click.stop="onVote"
          >
            Vote
          </CuButton>
        </template>

        <template v-slot:expandPanel="{ row }">
          <div>
            <div class="row1"  v-if="user.address">
            <div>
              Your vote weight:
              <em>
                <b-spinner v-if="row.loading" variant="secondary" small label="Small Spinner"></b-spinner>
                <span v-else>{{  row.yourWeight  }}%</span>
              </em>
            </div>
            <div>
              Your reward :
              <em>
                <!-- 123,235 veCRV -->
                <b-spinner v-if="row.loading"  variant="secondary" small label="Small Spinner"></b-spinner>
                <span  v-else>$ {{  row.yourReward  }}</span>
              </em>
            </div>
            <div>
              <CuButton
                v-if="row.yourReward"
                variant="link"
                class="claim-btn"
                :disabled="submitting"
                @click="$router.push('/reward')"
                size="min"
              >
                Claim
              </CuButton>
            </div>
          </div>
          <div class="row2">
            <div class="expand-item">
              <div class="label">Max reward per veCRV</div>
              <div class="content">$ {{row.maxRewardPerScore | toFixed(4)}}</div>
            </div>
            <!-- <div class="expand-item">
              <div class="label">Remaining claimable rewards</div>
              <div class="content">-</div>
            </div> -->
            <div>
              <div class="label">Rewards detail</div>
              <div class="content">
                {{ row.rewardsDetail.map(item => {
                  return `${item.amount} ${item.symbol}`
                }).join(', ') }}
              </div>
            </div>
            <div></div>
            <div></div>

            <div class="expand-item">
              <div class="label">Start at</div>
              <div class="content">
                {{ row.week.hex * (WEEK_SECONDS) * 1000 | formatTime('MMMM D, yyyy h:mm a') }}
              </div>
            </div>
            <div class="expand-item">
              <div class="label">End at</div>
              <div class="content">
                <!-- March 30, 2023 8:00 am -->
                {{ (row.week.hex * (WEEK_SECONDS) + (WEEK_SECONDS))  * 1000 | formatTime('MMMM D, yyyy h:mm a') }}
              </div>
            </div>
            <!-- <div class="expand-item">
              <div class="label">First week of claim</div>
              <div class="content">
                -
              </div>
            </div> -->
            <!-- <div class="expand-item">
              <div class="label">Last week of claim</div>
              <div class="content">
                -
                February 16, 2023 8:00 am
              </div>
            </div> -->
            <div class="expand-item">
              <div class="label">Contracts</div>
              <div class="content">
                <a :href="`https://etherscan.io/address/${row.gaugeAddr}`">
                  {{row.gaugeAddr | ellipsis}}
                </a>
              </div>
            </div>
          </div>
        </div>
        </template>
      </TableList>
    </div>
    <div class="footer">
      <CuPagination
        :key="voteType"
        :page="page"
        :pageSize="pageSize"
        :total="total"
        @change="onPageChange"
      ></CuPagination>
    </div>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { BigNumber, utils } from 'ethers';
import TableList from '@/components/TableList';
import CuButton from '@/components/CuButton';
import CuPagination from '@/components/CuPagination';
import CuSelect from '@/components/CuSelect';

import { getCrvRewardTree } from '@/api/common';
import sendTransaction from '@/common/sendTransaction';
import config from '@/config';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { fetchBribeList, fetchUserScore } from '@/api/dashbord';
import toFixed from '@/filters/toFixed';
import {
  getERC20Contract, MultiMerkleStashContract, MultiMerkleStashInterface, provider, VotiumVeCRVContract, VotiumVeCRVInterface,
} from '@/eth/ethereum';

export default {
  props: {
    voteType: {
      type: String,
    },
    round: {
      type: Number,
    },
    market: {
      type: String,
    },
  },
  components: {
    TableList,
    CuButton,
    CuSelect,
    CuPagination,
  },

  data() {
    return {
      WEEK_SECONDS: 7 * 24 * 60 * 60,
      forwardAddress: '',
      cols: [
        {
          title: 'Sort',
          prop: 'sort',
          width: '120px',
        },
        {
          title: 'Pool',
          prop: 'pool',
          width: '280px',
          render(text, record) {
            return `${text} <br/> <span style="font-size: 12px">${record.platform || '-'}</span>`;
          },
        },
        // {
        //   title: 'Apr',
        //   prop: 'apr',
        //   width: '120px',
        //   sorter: true,
        //   render(text) {
        //     return `${text}%`;
        //   },
        // },
        {
          title: this.voteType === 'VeCRV' ? '$/veCRV' : '$/vlCVX',
          prop: 'price',
          // width: '180px',
          align: 'right',
          sorter: true,
        },
        {
          title: 'Rewards',
          prop: 'rewards',
          // width: '180px',
          align: 'right',
          sorter: true,
          render(text) {
            return `$ ${text}`;
          },
        },

        {
          title: 'Vote number',
          prop: 'voteNumber',
          align: 'right',
          sorter: true,
        },

        // {
        //   title: 'Operation',
        //   prop: 'operation',
        //   width: '160px',
        // },
      ],
      list: [],

      // voteList: [],

      pageSize: 10,
      page: 1,
      total: 0,

      submitting: false,
      loading: false,

      rewardTree: null,

      sort: {
        order: '',
        prop: '',
      },
    };
  },

  computed: {
    ...mapState(['user', 'marketOption', 'tokenMap', 'totalRound']),
    ...mapState(['cvxChoices', 'crvChoices', 'proposal']),

    voteList() {
      return this.list.slice()
        .sort((a, b) => {
          if (this.sort.order === 'asc') {
            return a[this.sort.prop] - b[this.sort.prop];
          } if (this.sort.order === 'desc') {
            return b[this.sort.prop] - a[this.sort.prop];
          }
          return 0;
        })
        .slice(this.pageSize * (this.page - 1), this.pageSize * this.page);
    },

    // total() {
    //   if (this.voteType === 'VeCRV') {
    //     return this.crvChoices.length;
    //   } else {
    //     return this.cvxChoices.length;
    //   }
    // },
  },
  watch: {
    voteType() {
      this.page = 1;
      this.list = [];
      this.getList();
    },
    market() {
      this.page = 1;
      this.list = [];
      this.getList();
    },
  },
  created() {
    this.getList();
  },

  methods: {
    async getList() {
      this.loading = true;
      const roundTime = this.round * this.WEEK_SECONDS;
      const hourRoundTime = moment().startOf('hour').subtract(this.totalRound - this.round, 'hour').unix();

      const res = await fetchBribeList({
        witch: this.voteType === 'VeCRV' ? 'crv' : 'cvx',
        platform: this.market.toLowerCase(),
        round: this.voteType === 'VlCVX' && config.debug ? hourRoundTime : roundTime,

      });

      this.loading = false;
      if (res.success) {
        this.total = res.data.length;
        this.list = res.data.map((item, idx) => {

          const totalScore = +item.totalScore.hex;

          const amountU = item.bribes.reduce((sum, bribe) => {
            return sum + BigNumber.from(bribe.tokenAmount.hex || 0) / (10 ** bribe.tokenDecimals)  * bribe.tokenPrice
          }, 0);
          const maxRewardPerScore = item.bribes.reduce((sum, bribe) => {
            return sum + BigNumber.from(bribe.maxRewardPerScore.hex || 0) / (10 ** bribe.tokenDecimals)  * bribe.tokenPrice
          }, 0);

          const rewardsDetail = [];

          item.bribes.forEach((bribe) => {
            const token = this.tokenMap[bribe.tokenAddr.toLowerCase()];
            const symbol = token?.symbol ?? '-';
            rewardsDetail.push({
              amount: toFixed(bribe.tokenAmount.hex / 10 ** bribe.tokenDecimals, 4),
              symbol,
            });
          }, 0);

          return {
            sort: idx + 1,
            ...item,
            loading: false,
            yourWeight: '',
            yourReward: '',
            pool: item.name.shortName,
            maxRewardPerScore,
            // tokenSymbol: symbol,
            rewardsDetail,
            rewards: toFixed(amountU, 4),
            voteNumber: toFixed(BigNumber.from(item.totalScore.hex || 0) / 10 ** 18, 4),
            price: totalScore > 0 ? toFixed(amountU / (totalScore / 10 ** 18), 4) : 0,
          };
        });
      } else {
        this.list = [];
      }
    },

    onVote() {
      // this.$router.push('/vote-edit');
      if (this.voteType === 'VeCRV') {
        this.$router.push(`/vote/VeCRV/${this.market}`);
      } else {
        this.$router.push(`/vote/VlCVX/${this.market}`);
      }
      // const lint = `https://snapshot.org/#/iwan.eth/proposal/${this.proposal.id}`
      // window.open(lint);
    },
    selectChange() {
      this.getReward();
    },
    onPageChange(page) {
      this.page = page;
    },

    onSort(sort) {
      this.sort = sort;
    },

    async onExpand(row) {
      const record = row;
      if (record.loaded !== true && record.loading !== true && this.user.address) {
        record.loading = true;
        const res = await fetchUserScore({
          round: record.week.hex * this.WEEK_SECONDS,
          gauge: record.gaugeAddr,
          witch: this.voteType === 'VeCRV' ? 'crv' : 'cvx',
          user: this.user.address,
        });

        if (res.success) {
          const { score } = res.data;
          record.yourWeight = toFixed(score.hex / record.totalScore.hex, 2);
          record.yourReward = toFixed(score.hex / record.totalScore.hex * record.rewards, 4);
        }

        record.loading = false;
        record.loaded = true;
      }
    },

    getProof(tAddr, round) {
      const content = this.rewardTree[tAddr];
      const tree = StandardMerkleTree.load(content);
      // eslint-disable-next-line no-restricted-syntax
      for (const [i, v] of tree.entries()) {
        if (v[0] === round && v[1].toLowerCase() === this.user.address.toLowerCase()) {
          const proof = tree.getProof(i);
          console.log(proof);
          return proof;
          // return tree.getProof(i);
        }
      }
      return '';
    },

    async onClaim({ amount, tAddr, round }) {
      // const { tokenId } = this.$route.query;
      // const { amount } = this;
      // if (amount < this.min) {
      //   this.showError(`The minimum claim is ${this.min} DOGE`);
      //   return;
      // }
      this.submitting = true;
      try {
        const proof = await this.getProof(tAddr, round);

        const txHash = await sendTransaction({
          to: config.MultiMerkleStash,
          gas: 640000,
          data: MultiMerkleStashInterface.encodeFunctionData('claim', [
            tAddr,
            round,
            this.user.address,
            amount,
            proof,
          ]),
        });

        this.showPending('Pending', {
          tx: txHash,
        });

        const buyTx = await provider.waitForTransaction(txHash);

        if (buyTx.status === 1) {
          this.showSuccess('Succeeded', {
            tx: txHash,
          });
          this.getReward();
          // this.$store.dispatch('getPosition');
          // this.$store.dispatch('getWithdrawable');
          // this.$store.dispatch('getBalances');
        } else {
          this.showError('Failed', {
            tx: txHash,
          });
        }
      } catch (error) {
        console.error(error);
      }
      this.submitting = false;
    },
    async getTokenInfo(tokenAddress) {
      try {
        const erc20Contract = getERC20Contract(tokenAddress);

        const [symbol, decimals] = await Promise.all([
          erc20Contract.symbol(),
          erc20Contract.decimals(),
        ]);
        if (symbol) {
          return {
            symbol,
            decimals,
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    },

    openForward() {
      this.$refs['my-modal'].show();
    },

    async getReward() {
      this.loading = true;
      this.list = [];
      const tempList = [];
      const tree = await getCrvRewardTree();
      this.rewardTree = Object.freeze(tree);
      if (tree) {
        Object.keys(tree).forEach((tAddr) => {
          const tokenDetail = tree[tAddr];
          tokenDetail.values.forEach((item) => {
            const { treeIndex, value: [round, uAddr, amount] } = item;
            if (parseInt(round, 10) === this.round && uAddr.toLowerCase() === this.user.address) {
              tempList.push({
                treeIndex,
                round,
                uAddr,
                tAddr,
                amount,
              });
            }
          });
        });
        // console.log(tree);
        // console.log(this.list);
        const infoList = await Promise.all(tempList.map((item) => this.getTokenInfo(item.tAddr)));

        for (let i = 0; i < tempList.length; i++) {
          tempList[i].symbol = infoList[i].symbol;
          tempList[i].decimals = infoList[i].decimals;
          tempList[i].rewards = tempList[i].amount / 10 ** infoList[i].decimals;
        }

        this.list = tempList;
      }

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/vars.scss";

.top-section {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  display: grid;
  grid-template-rows: 130px auto 100px;
  // grid-template-rows: 130px auto 100px;
  .header {
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "ChillPixels Maximal";
    font-size: 48px;
    padding-left: 10px;
    .header-text {
      background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
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

  .footer {
    border-top: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
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
        color: #1DD186;
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
        color: #CCCCCC;
      }
    }

  }
}

</style>
