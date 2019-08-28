const state = /* () =>  */ {
  opts: {},
  btns: [],
  idx: 0
};

const getters = {
  options(state) {
    return state.opts;
  },
  buttons(state) {
    return state.btns;
  },
  selectedIndex(state) {
    return state.idx;
  }
};

const mutations = {
  SET_OPTIONS(state, payload) {
    state.opts = { ...payload };
  },
  SET_BUTTONS(state, payload) {
    state.btns = [...payload.buttonElements];
  },
  SET_INDEX(state, index) {
    state.idx = index;
  }
};

const actions = {
  setOptions({ commit }, payload) {
    commit("SET_OPTIONS", payload);
  },
  setButtons({ commit }, payload) {
    commit("SET_BUTTONS", payload);
  },
  setIndex({ commit }, index) {
    commit("SET_INDEX", index);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
