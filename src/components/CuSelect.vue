<template>
  <div
    class="select"
    :class="{
      'simple': type === 'simple'
    }"
    v-click-outside="onClickOutside"
  >
    <div class="selected" @click="isOpen = !isOpen" >
      <template v-if="$scopedSlots.selected">
        <slot name="selected" :option="selectedOption" ></slot>
      </template>
      <template v-if="!$scopedSlots.selected">
        <div class="value">{{ selectedText }}</div>
      </template>

      <div v-if="type === 'simple'" class="arrow" :class="{'is-open': isOpen}">
        <img src="~@/assets/img//arrow-down@2x.png" alt="">
      </div>
      <div v-if="type === 'default'" class="arrow">
        {{ isOpen ? '▲' : '▼' }}
      </div>
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
          {{ option.label }}
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

    type: {
      type: String,
      default: 'default', // simple
    },

    // renderOption: {
    //   type: Function,
    // },

    // renderSelected: {
    //   type: Function,
    // },
  },
  data() {
    return {
      isOpen: false,
      selectedOption: null,
    };
  },
  created() {
  },
  computed: {
    selectedText() {
      if (this.value) {
        const target = this.options.find((item) => item.value === this.value);
        // if (this.renderOption) {
        //   return this.renderOption(target);
        // }
        return target?.label;
      }

      // if (this.renderOption) {
      //   return this.renderOption(this.selectOption);
      // }
      return this.selectedOption?.label;
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
  font-size: 16px;
  border: 1px solid #4C4C4C;
}
.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  height: 100%;
}

.simple {
  &.select {
    position: relative;
    min-width: 200px;
    width: auto;
    font-size: 24px;
    border: none;
  }

  & .arrow {
      margin-left: 20px;
    }
}

.arrow {
  & img {
    width: 24px;
  }

  &.is-open {
    & img {
      transform: rotate(180deg);
    }
  }
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
