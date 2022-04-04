<script setup lang="ts">
import { computed } from "vue";
import Popper from "vue3-popper";

const props = defineProps<{
    wide?: string,
}>();

const classes = computed(() => {
    return {
        wide: props.wide == "true",
    }
});

</script>

<template>
    <Popper v-bind="$attrs" arrow="true" :class="classes">
        <slot />
        <template #content="props">
            <slot name="content" v-bind="props" />
        </template>
    </Popper>
</template>

<style scoped>
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
