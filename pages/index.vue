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
      <c-grid v-if="!user" w="100%" h="200" gap="6" p="10" template-columns="repeat(3, 1fr)" template-rows="repeat(2, 1fr)">
        <c-grid-item col-span="3" h="10">
          <c-text text-align="center" mb="2">
            Login with a Google account.
          </c-text>
        </c-grid-item>
        <c-grid-item col-span="2" >
          <c-text mb="2">
            The GaleForce dashboard allows you to create sessions that players can join. To play with a group, create a session and share the 6 digit code with all the players.
          </c-text>
          <c-text mb="2">
            GaleForce missions are organized into stages: 
            <ul>
              <li><em>Training stages</em> help players learn coding concepts and the capabilities of the robots.</li>
              <li><em>Preparation stages</em> happen before the storm.</li>
              <li><em>Response stages</em> after the storm hits.</li>
            </ul>
            The dashboard allows you to select the active stage of the game for each team.
          </c-text>
          <c-text mb="2">
            The dashboard allows you to see which missions have been completed and reset mission completion status if needed. Other configuration options include mute all players, select instructional or motivational videos to play, and more.
          </c-text>
          </c-grid-item>
        <c-grid-item>
          <video autoplay="" loop="" playsinline="" muted=""><source src="https://galeforcegame.com/wp-content/uploads/2021/11/galeforce.m4v"></video>
        </c-grid-item>
      </c-grid>
      
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
li {
  margin-left: 20px;
}
</style>