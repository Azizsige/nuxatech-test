<script setup>
import { stateMessage } from '../utils/message-service';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const props = defineProps({ refMessage: { default: null, type: String }, style: { default: null, type: String } });

const route = useRoute();
const toast = useToast();

watch(
    () => stateMessage.visible,
    (val) => {
        console.log(val);

        if (val) {
            showSuccess();
            stateMessage.visible = false;
        }
    }
);

const showSuccess = () => {
    toast.add({ severity: stateMessage.color, summary: stateMessage.message, life: 3000 });
    stateMessage.visible = false;
};

const id = computed(() => {
    return !props.refMessage ? route.fullPath + '#message' : props.refMessage + '#message';
});
</script>

<template>
    <div class="flex justify-center card">
        <Toast position="top-center">
            <template #message>
                <div class="flex-col items-start d-flex" style="flex: 1">
                    <div class="my-3 text-lg font-medium text-surface-900 dark:text-surface-0">
                        {{ stateMessage.message }}
                    </div>
                    <div v-if="stateMessage.args.length > 0">
                        <div v-for="(arg, index) in stateMessage.args" :key="index">
                            <span class="font-medium">{{ arg.reason }}</span>
                            <!-- <p v-for="(value, key) in arg" :key="key">
                <span class="font-medium">{{ key }}:</span> {{ value }}
              </p> -->
                            <!-- <p v-for="(value, key) in arg" :key="key">
                <span class="font-medium">{{ key }}:</span> {{ value }}
              </p> -->
                        </div>
                    </div>
                </div>
            </template>
        </Toast>
    </div>
</template>
<style>
.p-toast {
    width: 20rem !important;
}
</style>
