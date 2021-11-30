<template>
  <div>
    <c-box         
      w="100vw"
      mx="auto"
      bg="#59aade">
      <c-box
        max-width="1120px"
        mx="auto"
        py="8">
        <c-heading as="h1" size="lg" color="white" textAlign="center">
          Game Dashboard
        </c-heading>
      </c-box>
    </c-box>
    <c-box         
      w="100vw"
      max-width="1120px"
      mx="auto"
      class="content">
      <Sessions v-if="user"/>
      <c-box v-if="!user" py="10">
        <c-text text-align="center">
          Login with a Google account to manage your GaleForce game sessions.
        </c-text>
      </c-box>
  </c-box>
  </div>
</template><script>
import { mapGetters } from 'vuex'

export default {
  computed: { 
    ...mapGetters(['user']),
  }
}
</script>
<style>
</style>