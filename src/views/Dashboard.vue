<script setup>
import { ProductService } from '@/service/ProductService';
import { useUserStore } from '@/views/stores/index.store';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    ProductService.getProducts().then((data) => (products.value = data));
});

const context = useUserStore();
const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const isEdit = ref(false);
const data = ref(null);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const page = ref(1);

function formatCurrency(value) {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
}

function openNew() {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
    isEdit.value = false;
}

function hideDialog() {
    productDialog.value = false;
    submitted.value = false;
    isEdit.value = false;
    context.isEdit = false; // Set isEdit to false in the store
}

const saveProduct = async () => {
    submitted.value = true;

    try {
        const savedData = await context.saveData(product.value); // ✅ tangkap hasil dari store

        if (savedData) {
            console.log('Data berhasil disimpan:', savedData);

            // Misal kamu mau update form lagi, atau push data ke array lain, bebas:
            // data.value.push(savedData); // atau
            // product.value = savedData;

            productDialog.value = false;
        } else {
            console.warn('Data tidak berhasil disimpan atau dibatalkan');
        }
    } catch (error) {
        console.error('Error calling saveData from store:', error);
    }
};

function editProduct(prod) {
    product.value = { ...prod, address: prod.address.street };
    productDialog.value = true;
    isEdit.value = true;
    context.isEdit = true; // Set isEdit to true in the store
}

function confirmDeleteProduct(prod) {
    product.value = prod;
    console.log('product.value:', prod);
    deleteProductDialog.value = true;
}

function deleteProduct() {
    // products.value = products.value.filter((val) => val.id !== product.value.id);
    try {
        context.deleteData(product.value.id); // Panggil fungsi deleteData dari store
    } catch (error) {
        console.error('Error deleting product:', error);
    }
    deleteProductDialog.value = false;
}

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

// Base URL bisa disesuaikan di sini, jika perlu
const api = createApiInstance('https://jsonplaceholder.typicode.com'); // Atau gunakan base URL default

onMounted(async () => {
    await context.getList();
});
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="context.dataTable"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            >
                <template #header>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <h4 class="m-0">Manage Products</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="email" header="Email" sortable style="min-width: 12rem"></Column>
                <Column field="username" header="Username" sortable style="min-width: 16rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>
                <Column header="Address">
                    <template #body="slotProps">
                        <p>{{ slotProps.data.address.street }}</p>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" :header="isEdit ? 'Edit User' : 'Add User'" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="email" class="block mb-3 font-bold">Email</label>
                    <InputText id="email" v-model.trim="product.email" required="true" autofocus :invalid="submitted && !product.email" fluid />
                    <small v-if="submitted && !product.email" class="text-red-500">Email is required.</small>
                </div>
                <div>
                    <label for="username" class="block mb-3 font-bold">Username</label>
                    <InputText id="username" v-model.trim="product.username" required="true" autofocus :invalid="submitted && !product.username" fluid />
                    <small v-if="submitted && !product.username" class="text-red-500">Username is required.</small>
                </div>
                <div>
                    <label for="name" class="block mb-3 font-bold">Name</label>
                    <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
                </div>

                <div>
                    <label for="address" class="block mb-3 font-bold">Address</label>
                    <InputText id="address" v-model.trim="product.address" required="true" autofocus :invalid="submitted && !product.address" fluid />
                    <small v-if="submitted && !product.address" class="text-red-500">Address is required.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"
                    >Are you sure you want to delete <b>{{ product.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct(product.id)" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
