import { reactive } from 'vue';

const defaultValue = '#message';

export const stateMessage = reactive({ visible: false, visibleDialog: false, variant: 'flat', color: 'error', message: '', args: [], columns: { [defaultValue]: [] }, isAvailable: {} });

export function clearMessageErr(param) {
    if (!param) {
        for (const v in stateMessage.visible) {
            stateMessage.visible[v] = false;
        }
    } else {
        if (param == defaultValue) {
            stateMessage.visible[param] = false;
        }
        stateMessage.visible[param + defaultValue] = false;
    }
}

export function showMessage({ color = 'error', variant = 'flat', message = '', args = [], refMessage = defaultValue } = {}) {
    stateMessage.visible = true;
    stateMessage.color = color;
    stateMessage.variant = variant;
    stateMessage.message = message;
    stateMessage.args = args;
}
