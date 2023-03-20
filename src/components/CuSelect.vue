<template>
  <div class="select" v-click-outside="onClickOutside">
    <div class="selected" @click="isOpen = !isOpen" >
      <template v-if="$scopedSlots.selected">
        <slot name="selected" :option="selectedOption" ></slot>
      </template>
      <template v-else>
        <div class="value">{{ selectedOption && selectedOption.label }}</div>
      </template>

      <div class="arrow">{{ isOpen ? '▲' : '▼' }}</div>
    </div>
    <div class="options" v-show="isOpen">
      <div class="option"
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)">
        <template v-if="$scopedSlots.option">
          <slot name="option" :option="option" ></slot>
        </template>
        <template v-else>
          {{ renderOption ? renderOption(option) : option.label }} --
        </template>
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
  font-size: 16px;
}
.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #4C4C4C;
  cursor: pointer;
  height: 100%;
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
