<template>
  <div class="select" v-click-outside="onClickOutside">
   <span class="label"> Round:</span>
    <div class="selected" @click="isOpen = !isOpen" >
      <div class="value">{{ value }}</div>
      <img class="arrow"
        :style="`width: 18px; transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0)'}`"
        src="~@/assets/img/arrow-down@2x.png" alt="">
    </div>
    <div class="options" v-show="isOpen">
      <div class="option"
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)">
          {{ renderOption ? renderOption(option) : option.label }}
      </div>
    </div>
  </div>
</template>
<script>

export default {
  directives: {
    // ClickOutside,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: [String, Number],
    },

    renderOption: {
      type: Function,
    },

    renderSelected: {
      type: Function,
    },
  },
  data() {
    return {
      isOpen: false,
      selectedOption: null,
    };
  },
  created() {
    this.selectedOption = this.value
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
      this.$emit('change', option.value);
      this.$emit('input', option.value);
      this.isOpen = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.select {
  position: relative;
  width: 200px;
  font-size: 24px;
  display: inline-flex;
  align-items: center;
}
.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 8px 24px;
  cursor: pointer;
  color: #1DD186;
}
.label {
  margin-right: 4px;
}
.value {
  margin-right: 20px;
}

.options {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #363537;
  border: 1px solid #4C4C4C;
}

.option {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  height: 44px;
  cursor: pointer;
  &:hover {
    background: #4C4C4C;

  }
}
</style>
