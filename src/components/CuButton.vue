<template>
  <b-button
    variant="text"
    v-bind="$attrs"
    v-on="$listeners"
    :disabled="disabled || loading"
    class="cu-button"
  >
    <slot></slot>

    <i class="icon-button-arrow"></i>
    <!-- <img style="width: 18px;" src="~@/assets/img/right-arrow@2x.png" alt=""> -->
  </b-button>
</template>
<script>

export default {
  directives: {
    // ClickOutside,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
      selectedOption: null,
    };
  },
  created() {
    console.log(this);
  },
  computed: {
    selectedText() {
      if (this.renderOption) {
        return this.renderOption(this.selectOption);
      }
      return this.selectedOption && this.selectedOption.label;
    },
  },
  methods: {
    onClickOutside() {
      this.isOpen = false;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.$emit('change', option);
      this.$emit('input', option);
      this.isOpen = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.cu-button {
  color: #64D98A;
  &:hover {
    color: #64D98A;
    background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:disabled {
    color: #eee;
    // background: linear-gradient(218deg, #FF460E 0%, #ECA13F 44%, #00DD59 100%);
    -webkit-background-clip: none;
    -webkit-text-fill-color: #eee;
  }

  .icon-button-arrow {
    margin-left: 8px;
  }
}
</style>
