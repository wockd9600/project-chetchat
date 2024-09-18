<template>
    <span class="fw-bold text-truncate" style="max-width: 60vw" :style="{ fontSize: fontSize, color: color, opacity: opacity }">{{ title }}</span>
</template>

<script>
export default {
    name: 'HeaderTitle',
    props: {
        // username: String
        option: {
            type: Object,
            default: () => {
                return {
                    title: 'error',
                    fontSize: '1rem',
                    color: '#000',
                };
            },
        },
    },
    computed: {
        title() {
            return this.option.title;
        },
        fontSize() {
            return this.option.fontSize;
        },
        color() {
            return this.option.color || '#000';
        },
        opacity() {
            return this.option.opacity || '90%';
        },
    },
};
</script>

<style>
</style>