<template>
    <button class="v-table-button"
            :class="{['v-table-button-' + name]: name}"
            @click.prevent.stop="click"
            :aria-label="label"
            :title="label">
        <span class="v-table-button-icon block">
            <slot></slot>
        </span>
    </button>
</template>

<script>
    export default {
        name: 'v-table-button',
        props: ['name', 'label'],
        methods: {
            click(e) {
                this.$emit('clicked', {
                    event: e,
                    name: this.name,
                });
            }
        },
    };
</script>