<template>
  {{ version }}
</template>

<script>
export default {
  name: 'Version',
  computed: {
    version() {
      return ICE_VERSION;
    }
  }
}
</script>
