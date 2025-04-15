<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Homepage',
        items: [{ label: 'Homepage', icon: 'pi pi-fw pi-user', to: '/homepage' }]
    },
    {
        label: 'Master Data',
        items: [{ label: 'Users', icon: 'pi pi-fw pi-user', to: '/users' }]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
