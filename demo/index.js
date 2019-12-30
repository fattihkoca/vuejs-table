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
            ],
            filters: {
                request: {
                    url: '/request/filter-response.json',
                    method: 'get',
                    label: 'Filter'
                },
                header: {
                    title: 'Filter',
                    subtitle: 'With this form, you can filter to the table rows.'
                },
                form: [
                    {
                        title: 'Filter One',
                        elements: [
                            {
                                type: 'radio',
                                name: 'one',
                                value: 'one-first',
                                label: 'Opt 1'
                            },
                            {
                                type: 'radio',
                                name: 'one',
                                value: 'one-second',
                                label: 'Opt 2'
                            }
                        ]
                    },
                    {
                        title: 'Filter Two',
                        elements: [
                            {
                                type: 'checkbox',
                                name: 'two',
                                value: 'one',
                                label: 'Opt 3'
                            },
                            {
                                type: 'checkbox',
                                name: 'three',
                                value: 'one',
                                label: 'Opt 4'
                            }
                        ]
                    }
                ]
            },
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