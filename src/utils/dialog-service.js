import { reactive } from 'vue';

export const state = reactive({ openDialog: false, openSopDialog: false });

export function showSessionExp() {
    state.openDialog = true;
}

export function showSopDialog() {
    state.openSopDialog = true;
}
