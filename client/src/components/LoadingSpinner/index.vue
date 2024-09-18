<template>
    <div :class="snipperContainer">
        <div class="spinner-grow text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    props: {
        // username: String
        positionX: {
            type: String,
            default: 'center',
        },
        positionY: {
            type: String,
            default: 'top',
        },
    },
    computed: {
        snipperContainer() {
            let classList = 'd-flex pt-3 pb-3 ';

            if (this.positionX === 'left') classList += 'justify-content-start ';
            else if (this.positionX === 'center') classList += 'justify-content-center ';
            else if (this.positionX === 'right') classList += 'justify-content-end ';

            if (this.positionY === 'top') classList += '';
            else if (this.positionY === 'center') classList += 'h-100 align-items-center';
            else if (this.positionY === 'bottom') classList += 'h-100 align-items-end';

            return classList;
        },
    },
};
</script>

<style>
</style>