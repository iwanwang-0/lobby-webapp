<template>
  <div id="search-bar">
    <img class="search-icon" style="width: 18px" src="~@/assets/img/search-line.svg" alt="" />
    <b-input-group>
      <b-form-input @keydown.native="keyDown" @focus="Focus" @blur="Blur" v-model="address">
      </b-form-input>
    </b-input-group>
    <div v-if="address.length && showResult" class="search-result">
      <div class="address" v-if="isAddress" @mousedown="click(address)">{{ address }}</div>
      <div v-if="!isAddress">no match</div>
    </div>
  </div>
</template>

<script>
import { utils } from "ethers";

export default {
  data() {
    return {
      address: "",
      showResult: false,
    };
  },
  computed: {
    isAddress() {
      return utils.isAddress(this.address);
    },
  },
  methods: {
    click(address) {
      this.$router.push(`/profile/${address}`);
      this.address = "";
    },
    Focus() {
      this.showResult = true;
    },
    Blur() {
      this.showResult = false;
    },
    keyDown(event) {
      console.log(event);
      if (event.which === 13) {
        if (this.isAddress) {
          this.click(this.address);
          this.showResult = false;
        }
      }
    },
  },
};
</script>

<style>
#search-bar {
  position: relative;
  .search-icon {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 100;
  }
  .search-result {
    width: 100%;
    position: absolute;
    display: flex;
    overflow: auto;
    align-items: center;
    top: 48px;
    padding: 24px;
    padding-left: 12px;
    background-color: rgba(0, 0, 0);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #fff;
    border: 1px #80edc0 solid;
    border-radius: 16px;
    .address {
      font-size: 12px;
      cursor: pointer;
    }
  }
  /* img {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 100;
  } */
  .form-control {
    padding-left: 30px;
    width: 180px;
    border-radius: 16px;
    border-color: #80edc0;
    color: #fff !important;
    background-color: rgba(0, 0, 0) !important;
    transition: width linear 0.1s;
    &:focus {
      width: 392px !important;
    }
  }
}
</style>
