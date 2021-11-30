<template>
    <div>
        <c-button v-if="!user" @click="login()" variant-color="brand.purple">Login</c-button>
        <c-button v-if="user" @click="logout()">Logout</c-button>
    </div>
</template>
<script>
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { mapGetters } from 'vuex';

export default {
  methods: {
    login() {
        const provider = new GoogleAuthProvider()
        const auth = getAuth()
        signInWithPopup(auth, provider)
        .then((result) => {
            const user = {
                uid: result.user.uid
            }
            this.$store.commit('updateUser', user)
        })
    },
    logout() {
        const auth = getAuth()
        auth.signOut().then(() => {
            this.$store.commit('updateUser', null)
        })
    }
  },
  computed: { 
    ...mapGetters(['user']),
  }
};
</script>