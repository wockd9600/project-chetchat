@<template>
    <div class="search-bar__box blur-box-color">
        <input
            type="text"
            ref="text-input"
            class="search-bar__input w-100 fs-18"
            :value="setValue"
            :placeholder="placeholder"
            @input="setHeaderActive"
        />
    </div>
    <div class="d-flex mt-3 blur-color">{{ information }}</div>
</template>

<script>
import { isEmptyString } from '@/utils/validate';

export default {
    name: 'TextInput',
    props: {
        value: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        information: {
            type: String,
            default: '',
        },
    },
    computed: {
        routeIndex() {
            const depth1 = this.$route.path.split('/')[1];
            const depth2 = this.$route.path.split('/')[2];
            const depth3 = this.$route.path.split('/')[3];

            if (depth1 === 'my-setting') {
                if (depth2 === 'name') return 0;
            } else if (depth1 === 'profile-edit') {
                if (depth2 === 'nickname') return 1;
                else if (depth2 === 'status-message') return 2;
            } else if (depth1 === 'profile') {
                if (depth3 === 'edit-name') return 3;
            }

            return 3;
        },
    },
    mounted() {
        this.$refs['text-input'].focus();
    },
    data() {
        return {
            setValue: this.value,
            isActive: false,
            stringLengthRules: [20, 15, 30, 15],
        };
    },
    watch: {
        value(newVal) {
            this.setValue = newVal;
        },
    },
    methods: {
        isValidValue() {
            if (this.setValue.length > this.stringLengthRules[this.routeIndex]) return false;
            return true;
        },
        setHeaderActive(event) {
            this.setValue = event.target.value;

            if (!this.isValidValue()) {
                this.setValue = event.target.value.slice(0, this.stringLengthRules[this.routeIndex]);
            }

            if (this.value === this.setValue) this.isActive = false;
            else this.isActive = 'black';

            if (isEmptyString(this.setValue)) this.isActive = false;
            if (this.routeIndex === 3 && this.setValue.length === 0) this.isActive = 'black';

            this.$store.commit('setActionElementActive', this.isActive);

            if (!this.isActive) return;
            if (this.isActive) this.$store.commit('setActionElementValue', this.setValue);
        },
    },
    beforeUnmount() {
        this.$store.commit('setActionElementActive', false);
    },
};
</script>

<style scoped>
.search-bar__box {
    padding: 0;
    border-bottom: 1px solid #b6b6b6;
    background-color: #fff;
}
</style>