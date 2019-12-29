<template>
    <label class="v-checkbox">
        <span v-if="label" v-text="label"></span>
        <input type="checkbox" :value="value" @change="onChange" :checked="isSelected" ref="item">
        <span class="v-checkbox-mark"></span>
    </label>
</template>

<script>
    export default {
        name: 'v-checkbox',
        props: ['value', 'values', 'label'],
        methods: {
            onChange() {
                this.$emit('input', this.$refs.item.checked);
            },
        },
        computed: {
            isSelected() {
                return this.values.indexOf(this.value) > -1;
            }
        }
    };
</script>