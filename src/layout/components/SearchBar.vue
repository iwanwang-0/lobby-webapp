<template>
  <div class="search-bar">
    <b-input-group>
      <b-form-input v-model="address"></b-form-input>
    </b-input-group>
    <div v-if="address.length" class="search-result">
      <div class="address" v-if="isAddress" @click="click(address)">{{ address }}</div>
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
  },
};
</script>

<style>
.search-bar {
  position: relative;
  .search-result {
    width: 100%;
    position: absolute;
    display: flex;
    overflow: auto;
    align-items: center;
    top: 48px;
    padding: 24px;
    padding-left: 12px;
    background-color: #fff;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    .address {
      cursor: pointer;
    }
  }
}
</style>
