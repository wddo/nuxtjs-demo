export const state = () => ({
  agrees: false
});

export const getters = {
  agrees(state) {
    return state.agrees;
  }
};

export const mutations = {
  agrees(state, checked) {
    state.agrees = checked;
  }
};
