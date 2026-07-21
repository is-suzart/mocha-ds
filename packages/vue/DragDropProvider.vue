<template>
  <slot />
</template>

<script setup lang="ts">
interface Props {
  apiKey?: string;
}

withDefaults(defineProps<Props>(), {
  apiKey: '',
});
</script>
