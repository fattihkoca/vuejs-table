<template>
    <div v-if="data" class="v-table-form" :class="{'v-table-form-loading': loading}">
        <header v-if="data.header && (data.header.title || data.header.subtitle)" class="v-table-form-header">
            <h1 class="v-table-form-title" v-text="data.header.title"></h1>
            <h2 class="v-table-form-subtitle" v-text="data.header.subtitle"></h2>
        </header>

        <form class="v-table-form-items">
            <div v-for="(item, i) in data.form" class="v-table-form-row" :class="{'v-table-form-labelled': item.title}"
                 :key="i">
                <div v-if="item.title" class="v-table-form-col">
                    <span class="v-table-form-title" v-text="item.title"></span>
                    <span v-if="item.required" class="v-table-form-required"></span>
                </div>
                <div class="v-table-form-col">
                    <div v-if="item.tips" class="v-table-form-tips">
                        <span v-if="item.tips.title" class="v-table-form-tip-title" v-text="item.tips.title"></span>
                        <span v-if="item.tips.detail" class="v-table-form-tip-detail" v-text="item.tips.detail"></span>
                    </div>

                    <div class="v-table-form-elements"
                         :class="{'v-table-form-multiple-elements': Object.keys(item.elements).length > 1}">
                        <div v-for="(el, ei) in item.elements" class="v-table-form-element" :key="ei">
                            <input v-if="isCustomInput(el.type)" v-model="form[el.name]" :placeholder="el.placeholder"
                                   :maxlength="el.limit" :type="el.type" :disabled="el.disabled">

                            <textarea v-if="el.type === 'textarea'" v-model="form[el.name]"
                                      :placeholder="el.placeholder" :maxlength="el.limit"
                                      :disabled="el.disabled"></textarea>

                            <select v-if="el.type === 'select'" v-model="form[el.name]" :disabled="el.disabled">
                                <option v-if="el.placeholder" v-text="el.placeholder"
                                        disabled value=""></option>
                                <option v-for="(optVal, optKey) in el.options" :value="optKey" v-text="optVal"
                                        :key="optKey"></option>
                            </select>

                            <label v-if="el.type === 'checkbox'"
                                   :class="{'v-checkbox-labelled': el.label}" class="v-checkbox"
                                   @click="form[el.name] = !form[el.name]">
                                <input type="checkbox" v-model="form[el.name]" :disabled="el.disabled">
                                <span class="v-checkbox-mark"></span>
                                <span v-if="el.label" class="v-checkbox-label" v-text="el.label"></span>
                            </label>

                            <label v-if="el.type === 'radio'"
                                   :class="{'v-radio-labelled': el.label}" class="v-radio"
                                   @click="selectRadio(el)">
                                <input type="radio" v-model="form[el.name]" :value="el.value"
                                       :disabled="el.disabled">
                                <span class="v-radio-mark"></span>
                                <span v-if="el.label" class="v-radio-label" v-text="el.label"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="data.form" class="v-table-form-row"
                 :class="{'v-table-form-labelled': data.form.slice(-1)[0] && data.form.slice(-1)[0].hasOwnProperty('title')}">
                <div v-if="data.form.slice(-1)[0] && data.form.slice(-1)[0].hasOwnProperty('title')"
                     class="v-table-form-col"></div>
                <div class="v-table-form-col">
                    <div v-if="!completed" class="v-table-form-actions">
                        <button v-if="data.request" @click="sendHandler" class="v-table-form-button v-table-form-send">
                            <i v-if="sendLoading" class="v-table-form-button-loading">
                                <v-table-loading></v-table-loading>
                            </i>
                            <span v-text="data.request.label"></span>
                        </button>
                    </div>

                    <div v-if="Object.keys(response).length" class="v-table-form-response">
                        <div v-if="response.success" class="v-table-form-success" v-text="response.message"></div>
                        <div v-else class="v-table-form-failed" v-text="response.message"></div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import vTableLoading from "./vTableLoading";

    export default {
        name: 'v-table-form',
        props: ['data'],
        data() {
            return {
                form: {},
                loading: false,
                sendLoading: false,
                completed: false,
                response: {},
                customInputs: ['text', 'password', 'number', 'date', 'email', 'tel', 'url', 'week', 'month']
            }
        },
        methods: {
            parseValues() {
                if (!this.data.form) {
                    return;
                }

                let form = {};
                this.data.form.forEach(i => {
                    if (i.elements) {
                        i.elements.forEach(el => {
                            if (el.name) {
                                if (el.type === 'checkbox') {
                                    form[el.name] = el.checked;
                                } else if (el.type === 'radio') {
                                    if (el.checked) {
                                        form[el.name] = el.value;
                                    }
                                }  else if (el.type === 'select') {
                                    form[el.name] = el.selected ? el.selected : "";
                                } else {
                                    form[el.name] = el.value;
                                }
                            }
                        });
                    }
                });

                this.form = form;
            },
            isCustomInput(type) {
                return this.customInputs.indexOf(type) !== -1;
            },
            selectRadio(el) {
                this.$set(this.form, el.name, el.value);
            },
            sendHandler() {
                if(this.loading) {
                    return;
                }

                this.loading = true;
                this.sendLoading = true;

                Vue.ajax({
                    url: this.data.request.url,
                    method: this.data.request.method || 'get',
                    data: {
                        request: this.form
                    },
                    complete: () => {
                        this.loading = this.sendLoading = false;
                    }
                }).then(response => {
                    this.response = response.data;
                    this.$emit('success', this.response.data);

                    if(this.response.success) {
                        this.completed = true;

                        setTimeout(() => {
                            this.completed = false;
                        }, 2000);
                    }
                });
            },
        },
        mounted() {
            this.parseValues();
            this.response = {};
            this.loading = this.sendLoading = false;
        },
        activated() {
            this.parseValues();
        },
        components: {
            vTableLoading
        }
    };
</script>