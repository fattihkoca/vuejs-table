<template>
    <div v-if="c" class="v-table">
        <div :class="{'v-table-loading': loading, 'v-table-reloading': reloading}">
            <!-- Table actions -->
            <div class="v-table-controls">
                <div class="v-table-controls-wrapper">
                    <div class="v-table-controls-col">
                        <div v-if="size(d) && c.checkable && c.checkable_all"
                             class="v-table-control v-table-checkbox v-table-all-checkbox">
                            <label class="v-checkbox" :title="l.select_all">
                                <input type="checkbox" v-model="selectAll">
                                <span class="v-checkbox-mark"></span>
                            </label>
                        </div>

                        <div v-if="c.reload" class="v-table-control">
                            <v-table-button name="reload" :label="l.reload" @clicked="reload">
                                <v-reload-icon></v-reload-icon>
                            </v-table-button>
                        </div>

                        <div v-if="c.delete && size(selected)" class="v-table-control">
                            <v-table-button name="delete" :label="l.delete" @clicked="remove">
                                <v-delete-icon></v-delete-icon>
                            </v-table-button>
                        </div>

                        <div v-if="c.create" class="v-table-control">
                            <v-table-button name="create" :label="l.create" @clicked="create">
                                <v-create-icon></v-create-icon>
                            </v-table-button>
                        </div>
                    </div>
                    <div class="v-table-controls-col">
                        <div v-if="c.filter" class="v-table-control" :class="{'v-table-control-active': filterActive}">
                            <v-table-button name="filter" :label="l.filter" @clicked="filter">
                                <v-filter-icon></v-filter-icon>
                            </v-table-button>
                        </div>

                        <div v-if="c.search" class="v-table-control">
                            <div class="v-table-search" @click.prevent.stop="focusSearch">
                                <input v-model="form.search" value type="search"
                                       :placeholder="l.search"
                                       @keyup.enter="search"
                                       @click.stop
                                       ref="searchInput">
                                <v-table-button name="search" :label="l.search" @clicked="search">
                                    <v-search-icon></v-search-icon>
                                </v-table-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table container -->
            <div v-if="size(d)" class="v-table-field">
                <!-- Table head -->
                <div v-if="size(c.head)" class="v-table-row-group">
                    <!-- Table head row -->
                    <div class="v-table-row v-table-head">
                        <div class="v-table-cell v-table-checkbox"></div>

                        <div class="v-table-cell"
                             :class="{
                                'v-table-sort-handle': c.sortable,
                                'v-table-sort': ((!form.sort[0] && hi === 0) || form.sort[0] === head.key),
                                'v-table-sort-asc': form.sort[1] === 'asc',
                                'v-table-sort-desc': form.sort[1] === 'desc'
                             }"
                             v-for="(head, hi) in c.head" :key="hi">
                            <div class="v-table-head-label" @click="sort(head, $event)">
                                <span v-text="head.label" :title="l.order_by + ' ' + head.label"></span>
                                <i v-if="c.sortable" class="v-table-sort-icon"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Table body -->
                <div class="v-table-row-group">
                    <!-- Table body row -->
                    <div v-for="(row, ri) in d"
                         @click="detail(row, ri)"
                         class="v-table-row"
                         :class="{
                            'v-table-row-modified': currentRowIndex === ri,
                            'v-table-row-bounced': bouncedIndex === ri,
                            'v-table-row-deleted': removedRows.indexOf(ri) !== -1
                         }"
                         :key="ri">

                        <div v-if="c.checkable" class="v-table-cell v-table-checkbox" @click.stop>
                            <v-checkbox :value="row.key" :values="selected" @input="checkRow(row.key, $event)"></v-checkbox>
                        </div>

                        <!-- Table body row cell -->
                        <div v-if="row.cells" v-for="(cell, ci) in row.cells" :key="ci" class="v-table-cell"
                             :class="{
                                ['v-table-cell-'+ cell.type]: cell.type,
                                ['v-table-cell-status-'+ cell.status]: cell.status
                             }"
                             :data-size="cell.list ? size(cell.list) : null">

                            <div class="v-table-cell-wrapper">
                                <span v-if="ri === 0 && row.buttons && size(row.buttons)" class="v-table-item">
                                    <a v-for="(button, bi) in row.buttons" :key="bi"
                                       class="v-table-row-button"
                                       :class="['v-table-row-button-'+ bi]"
                                       @click.prevent.stop="action(bi, button, $event)"
                                       :title="button.label"></a>
                                </span>

                                <figure v-if="cell.image" :class="{['v-table-img-' + cell.imageSize]: cell.imageSize}"
                                        class="v-table-img v-table-item">
                                    <img v-if="cell.image" :src="cell.image" :alt="cell.image_alt">
                                </figure>

                                <i v-if="cell.status" class="v-table-status v-table-item"
                                   :class="{['v-table-status-' + cell.status]: cell.status}"></i>

                                <ul v-if="cell.tags" class="v-table-tags v-table-item">
                                    <li v-for="(tag, ti) in cell.tags" class="v-table-tag" :class="{
                                      'v-table-text-bold': cell.font && cell.font.indexOf('b') !== -1,
                                      'v-table-text-italic': cell.font && cell.font.indexOf('i') !== -1,
                                      'v-table-text-underline': cell.font && cell.font.indexOf('u') !== -1,
                                      ['v-table-text-' + cell.size]: cell.size,
                                      }" v-text="tag" :key="ti"></li>
                                </ul>

                                <ul v-if="cell.list" class="v-table-list v-table-item"
                                    :ref="'list-' + ri +'-'+ ci">
                                    <li v-for="(list, li) in cell.list" class="table-cell-list-item"
                                        :class="{'v-table-list-fancy' : list.image !== undefined}" :key="li">
                                            <span class="v-table-list-image">
                                              <img v-if="list.image" :src="list.image" :alt="list.label">
                                            </span>
                                        <span class="v-table-list-label" v-text="list.label"></span>
                                    </li>
                                </ul>

                                <v-rating v-if="cell.hasOwnProperty('rating')" :value="cell.rating" class="v-table-item"></v-rating>

                                <v-progress v-if="cell.progress" :value="cell.progress"
                                            class="v-table-item"></v-progress>

                                <span v-if="cell.text" v-text="cell.text" class="v-table-text v-table-item"
                                      :class="{
                                      'v-table-text-bold': cell.font && cell.font.indexOf('b') !== -1,
                                      'v-table-text-italic': cell.font && cell.font.indexOf('i') !== -1,
                                      'v-table-text-underline': cell.font && cell.font.indexOf('u') !== -1,
                                      ['v-table-text-' + cell.size]: cell.size,
                                      }"></span>

                                <span v-if="cell.html" v-html="cell.html" class="v-table-html v-table-item"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!size(d)" class="v-table-no-content">
                <span class="v-table-text" v-text="l.no_content"></span>
            </div>
        </div>

        <overlay :opened="detailsOpened" :visible="detailsVisible" @closed="detailsClosed"
                 :animate="c.overlay_animate">
            <v-table-form v-if="formVisible" :data="formData" @success="afterFormSuccess"></v-table-form>
        </overlay>
    </div>
</template>

<script>
    import $ from "./../utils/lib";
    import {Overlay} from 'vuejs-overlay';
    import vTableButton from "./vTableButton";
    import vCheckbox from "./vCheckbox";
    import vProgress from "./vProgress";
    import vRating from "./vRating";
    import vReloadIcon from "./vReloadIcon";
    import vSearchIcon from "./vSearchIcon";
    import vCreateIcon from "./vCreateIcon";
    import vDeleteIcon from "./vDeleteIcon";
    import vFilterIcon from "./vFilterIcon";
    import vTableForm from "./vTableForm";

    export default {
        name: "v-table",
        props: {
            conf: {
                type: Object
            },
            data: {
                type: Object | Array
            },
            lang: {
                type: Object
            },
            callback: {
                type: Function
            },
        },
        data() {
            return {
                c: {},
                defConf: {
                    buttons: false,
                    reload: true,
                    filter: false,
                    search: true,
                    head: {},
                    create: false,
                    delete: false,
                    sortable: true,
                    checkable: true,
                    checkable_all: true,
                    overlay_animate: null,
                },
                d: {},
                form: {
                    filter: {},
                    search: null,
                    sort: [false, "asc"],
                },
                l: {},
                defLang: {
                    filter: 'Filter',
                    order_by: 'Order by',
                    select_all: 'Select all',
                    reload: 'Reload',
                    search: 'Search',
                    create: 'Create',
                    delete: 'Delete',
                    delete_confirm: 'Are you sure you want to delete it?',
                    no_content: 'There is no content.',
                },
                selected: [],
                reloading: false,
                loading: false,
                filterActive: false,

                // Body row
                currentRowIndex: null,
                bouncedIndex: null,
                removedRows: [],

                detailsOpened: false,
                detailsVisible: false,
                formVisible: false,
                formData: {},
                formType: null,
                activeKey: null
            };
        },
        computed: {
            selectAll: {
                get() {
                    return $.size(this.data) && $.size(this.selected) === $.size(this.data);
                },
                set(v) {
                    let selected = [];
                    if (v) {
                        this.data.forEach(d => {
                            selected.push(d.key);
                        });
                    }
                    this.selected = selected;
                }
            }
        },
        watch: {
            data(v) {
                this.d = v;
            }
        },
        methods: {
            size(o) {
                return $.size(o);
            },
            checkRow(k, v) {
                if (v) {
                    this.selected.push(k);
                } else {
                    let index = this.selected.indexOf(k);
                    if (index > -1) {
                        this.selected.splice(index, 1);
                    }
                }
            },
            request() {
                if (!this.c.request.url) {
                    return;
                }

                this.loading = true;

                Vue.ajax({
                    url: this.c.request.url,
                    method: this.c.request.method || 'get',
                    data: {
                        request: this.form
                    },
                    complete: () => {
                        this.loading = this.reloading = false;
                    }
                }).then(response => {
                    this.d = response.data;
                });
            },
            sendRequest() {
                setTimeout(this.request, 0);
            },
            reload() {
                this.reloading = true;
                this.sendRequest();
            },
            sort(head) {
                if (head.key === this.form.sort[0]) {
                    let sort = this.form.sort[1] === 'asc' ? 'desc' : 'asc';
                    this.form.sort = [head.key, sort];
                } else {
                    this.form.sort = [head.key, 'asc'];
                }

                this.sendRequest();
            },
            search() {
                this.sendRequest();
                this.focusSearch();
            },
            filter() {

            },
            detailsClosed() {
                this.detailsOpened = this.detailsVisible = this.formVisible = false;
                this.formData = {};
                this.activeKey = null;
            },
            create() {
                if(this.c.create.model !== 'form') {
                    window.location.href = this.c.create.url;
                    return;
                }

                this.formData = {};
                this.loading = true;
                this.detailsOpened = true;

                Vue.ajax({
                    url: this.c.create.url,
                    method: this.c.create.method || 'get',
                    complete: () => {
                        this.loading = false;
                        this.detailsVisible = true;
                    }
                }).then(response => {
                    this.formData = response.data;
                    this.formVisible = true;
                    this.formType = 'create';
                });
            },
            detail(row) {
                if(!this.c.detail) {
                    return;
                }

                if(this.c.detail.model !== 'form') {
                    window.location.href = this.c.detail.url;
                    return;
                }

                this.formData = {};
                this.loading = true;
                this.detailsOpened = true;
                this.activeKey = row.key;

                Vue.ajax({
                    url: this.c.detail.url,
                    method: this.c.detail.method || 'get',
                    complete: () => {
                        this.loading = false;
                        this.detailsVisible = true;
                    }
                }).then(response => {
                    this.formData = response.data;
                    this.formVisible = true;
                    this.formType = 'detail';
                });
            },
            remove() {
                let confirm = window.confirm(this.l.delete_confirm);

                if (confirm) {
                    Vue.ajax({
                        url: this.c.delete.url,
                        method: this.c.delete.method || 'get',
                        data: {
                            request: this.selected
                        }
                    });

                    if (this.selectAll) {
                        this.d = {};
                    } else {
                        this.selected.forEach(i => {
                            let index = this.array_lookup(this.d, 'key', i);
                            this.$delete(this.d, index);
                        });
                    }

                    this.selectAll = false;
                    this.selected = [];
                }
            },
            afterFormSuccess(d) {
                if(this.formType === 'create') {
                    this.d.push(d);

                    setTimeout(this.detailsClosed, 1000);
                } else if(this.formType === 'detail') {
                    let index = this.array_lookup(this.d, 'key', this.activeKey);
                    this.$set(this.d, index, d);
                }
            },
            focusSearch() {
                this.$refs.searchInput.focus();
            },
            setDefaultSort() {
                if (!this.c || !this.c.head) {
                    return;
                }

                for (let i in this.c.head) {
                    if (!this.c.head.hasOwnProperty(i)) {
                        continue;
                    }

                    let head = this.c.head[i];

                    if (head.key && head.sort) {
                        this.form.sort = [head.key, head.sort];
                    }
                }

                if (!this.form.sort[0] && this.c.head[0] && this.c.head[0].key) {
                    this.form.sort[0] = this.c.head[0].key;
                }
            },
            array_lookup(array, index, search) {
                let notMatched = -1,
                    match_items = function (h, n) {
                        if (h === undefined || h == null) {
                            return false;
                        }
                        let haystack = typeof h !== "object" ? [h] : h;
                        return haystack.indexOf(n) !== notMatched;
                    },
                    result = notMatched;

                for (let i in array) {
                    if (search === undefined) {
                        if (match_items(array[i], index)) {
                            result = i;
                            break;
                        }
                    } else {
                        if (match_items(array[i][index], search)) {
                            result = i;
                            break;
                        }
                    }
                }

                return result;
            }
        },
        mounted() {
            if (this.c) {
                this.setDefaultSort();
            }
        },
        created() {
            this.c = Object.assign(this.defConf, this.conf);
            this.l = Object.assign(this.defLang, this.lang);
            this.d = this.data;
        },
        destroyed() {

        },
        components: {
            overlay: Overlay,
            vTableButton: vTableButton,
            vCheckbox: vCheckbox,
            vProgress: vProgress,
            vRating: vRating,
            vReloadIcon: vReloadIcon,
            vSearchIcon: vSearchIcon,
            vCreateIcon: vCreateIcon,
            vDeleteIcon: vDeleteIcon,
            vFilterIcon: vFilterIcon,
            vTableForm: vTableForm,
        }
    };
</script>

<style lang="scss">
    @import "./style/vTable";
</style>