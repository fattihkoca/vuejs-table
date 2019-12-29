<template>
    <div class="v-rating">
        <div class="v-rating-wrapper">
            <v-rating-icons :icons="icons" :value="value" :filled="true" :size="size" :color="color" :filled_color="filled_color"></v-rating-icons>
            <v-rating-icons :icons="icons" :value="value" :size="size" :color="color" :filled_color="filled_color"></v-rating-icons>
        </div>
    </div>
</template>

<script>
    import vRatingIcons from "./vRatingIcons";

    export default {
        name: 'v-rating',
        props: {
            value: {
                type: String | Number,
                default: 0
            },
            size: {
                type: Number,
                default: 10
            },
            max: {
                type: Number,
                default: 5
            },
            color: {
                type: String,
                default: '#828b93'
            },
            filled_color: {
                type: String,
                default: '#ffc107'
            },
        },
        computed: {
            icons() {
                let icons = [];

                for (let i = 0; i < this.max; i++) {
                    icons.push(i);
                }

                return icons;
            }
        },
        components: {
            vRatingIcons
        }
    };
</script>