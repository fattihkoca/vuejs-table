import {Overlay} from 'vuejs-overlay';
import Ajax from 'vuejs-ajax';
import {vTable} from './../src';

Vue.use(Ajax);

new Vue({
    el: '#demo',
    data: {
        vTableConf: {
            request: {
                url: '/request/rows.json',
                method: 'get',
            },
            create: {
                url: '/request/create.json',
                method: 'get',
                model: 'form',
            },
            detail: {
                url: '/request/detail.json',
                method: 'get',
                model: 'form',
            },
            delete: {
                url: '/request/delete.json',
                method: 'get',
            },
            head: [
                {
                    key: 'first',
                    label: 'First Column',
                    sort: 'desc',
                },
                {
                    key: 'second',
                    label: 'Second Column'
                },
                {
                    key: 'third',
                    label: 'Third Column'
                },
            ]
        },
        vTableData: {}
    },
    components: {
        Overlay,
        vTable
    },
    methods: {
        request() {
            Vue.ajax.get('/request/rows.json').then(response => {
                this.vTableData = response.data;
            });
        }
    },
    mounted() {
        this.request();
    },
});