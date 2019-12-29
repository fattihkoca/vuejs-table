<template>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" :stroke="color" :stroke-width="thick" r="35"
                stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(222 50 50)">
            <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50"
                              keyTimes="0;1" :dur="duration + 's'" begin="0s"
                              repeatCount="indefinite"></animateTransform>
        </circle>
    </svg>
</template>

<script>
    export default {
        name: "v-table-loading",
        props: {
            color: {
                type: String,
                default: "white"
            },
            thick: {
                type: Number,
                default: 10
            },
            duration: {
                type: Number,
                default: 1
            },
        },
    };
</script>
