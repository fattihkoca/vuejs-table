import vTable from "./components/vTable.vue";

const install = Vue => {
    Vue.component("vTable", vTable);
};

export default {
    install
};

export {vTable};