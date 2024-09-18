const store = {
    state: () => ({
        toast: null,
        toastMessage: '',
        isToasting: false,
    }),
    mutations: {
        setToast(state, toast) {
            state.toast = toast
        },
        setToastMessage(state, message) {
            state.toastMessage = message;
        },
        showToast(state) {
            if (state.isToasting) return;

            state.isToasting = true;
            state.toast.show();

            setTimeout(() => state.isToasting = false, 2000);
        },
    },
    actions: {
    }
}

export default store     