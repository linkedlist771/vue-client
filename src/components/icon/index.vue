<template>
  <div class="icon" :style="style" :class="iconClass">
    <svg class="icon icon_content" aria-hidden="true" :style="style">
      <use class="icon_content" :xlink:href="`#${icon}`"></use>
    </svg>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  style: {
    type: Object,
    default: () => {},
  },
  iconClass: {
    type: String,
    default: '',
  },
});
const { icon, style, iconClass } = toRefs(props);
</script>

<style scoped lang="css">
.icon {
  width: 2em;
  height: 2em;
  vertical-align: center;
  fill: currentColor;
  overflow: hidden;
}
.icon_content {
  fill: currentColor;
}
</style>
