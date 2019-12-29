<template>
    <div class="v-progress">
        <div class="v-progress-bar">
            <div class="v-progress-value" :style="{'width': `${v}%`}"></div>
        </div>
        <div class="v-progress-label" v-text="`${v}%`"></div>
    </div>
</template>

<script>
    export default {
        name: 'v-progress',
        data() {
            return {
                v: 0
            }
        },
        props: {
            value: {
                type: Number,
                default: 0
            }
        },
        watch: {
            value() {
                this.upd();
            }
        },
        methods: {
            upd() {
                setTimeout(() => {
                    this.v = this.value;
                }, 0);
            }
        },
        created() {
            this.upd();
        }
    };
</script>