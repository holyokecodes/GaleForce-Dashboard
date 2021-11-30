export const state = () => ({
    user: null
})

export const getters = {
    user: state => state.user,
}

export const mutations = {
    updateUser (state, user) {
        state.user = user
    }
}