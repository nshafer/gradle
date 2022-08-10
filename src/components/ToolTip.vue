<script setup lang="ts">
import { computed } from "vue";
import Popper from "vue3-popper";

const props = defineProps<{
    wide?: boolean,
}>();

const classes = computed(() => {
    return {
        wide: props.wide,
    }
});

</script>

<template>
    <Popper v-bind="$attrs" :arrow="true" :class="classes">
        <slot />
        <template #content="props">
            <slot name="content" v-bind="props" />
        </template>
    </Popper>
</template>

<style scoped>
    :root {
        --popper-theme-background-color: var(--tooltip-bg);
        --popper-theme-background-color-hover: var(--tooltip-bg);
        --popper-theme-text-color: var(--tooltip-fg);
        --popper-theme-border-width: 1px;
        --popper-theme-border-style: solid;
        --popper-theme-border-color: var(--tooltip-border);
        --popper-theme-border-radius: 5px;
        --popper-theme-padding: 1rem;
        --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
    }

  :deep(.popper) {
    background: var(--tooltip-bg);
    padding: 1rem;
    border: 1px solid var(--tooltip-border);
    border-radius: 5px;
    color: var(--tooltip-fg);
    max-width: 15em;
    white-space: normal;
  }

  .wide :deep(.popper) {
      max-width: 25em;
  }

  :deep(.popper #arrow::before) {
    background: var(--tooltip-bg);
  }

  :deep(.popper:hover),
  :deep(.popper:hover > #arrow::before) {
    background: var(--tooltip-bg);
  }

  :deep(p) {
      margin-bottom: .5em;
  }

  :deep(p):last-of-type {
      margin-bottom: 0;
  }
</style>
