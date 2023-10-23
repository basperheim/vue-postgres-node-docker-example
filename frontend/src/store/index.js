import { createStore } from "vuex";
import constants from "./constants";

const store = createStore({
  state: {
    exampleBoolean: true,
  },
  mutations: {
    // Example global boolean using Vuex
    toggleExampleBoolean(state) {
      state.globalBoolean = !state.exampleBoolean;
    },
  },
  modules: {
    constants,
  },
});

export default store;
