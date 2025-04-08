<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/views/stores/index.store';

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
}

const saveProduct = async () => {
    submitted.value = true;

    console.log('isEdit:', isEdit.value);

    try {
        // // Pengecekan jika product.id lebih dari 10, tampilkan alert dan hentikan eksekusi
        // if (isEdit.value && product.value.id > 10) {
        //     // showMessage('warn', 'ID lebih dari 10, tidak dapat diedit!');
        //     showMessage({ message: 'ID lebih dari 10, tidak dapat diedit!', color: 'error' });
        //     return; // Hentikan eksekusi fungsi jika ID lebih dari 10
        // }

        // const url = isEdit.value ? `/users/${product.value.id}` : '/users'; // Tentukan URL berdasarkan apakah kita melakukan edit atau tidak

        // // Kirim POST request untuk menambah produk baru atau PUT request untuk update
        // const newProductResponse = await api(url, {
        //     method: isEdit.value ? 'PUT' : 'POST',
        //     body: {
        //         ...(isEdit.value && { id: product.value.id }), // Hanya kirimkan ID jika isEdit = true (PUT)
        //         email: product.value.email,
        //         username: product.value.username,
        //         name: product.value.name,
        //         address: {
        //             street: product.value.address
        //         }
        //     }
        // });

        // console.log('Product response:', newProductResponse);

        // // Ambil data yang ada di localStorage, pastikan itu adalah array
        // const existingData = getStoredData(); // Mengambil data dari localStorage
        // console.log('existingData:', existingData); // Cek apa yang ada di localStorage

        // // Jika melakukan edit (PUT), cari data yang memiliki id yang sama dan perbarui, jika POST, tambahkan data baru
        // let updatedData;
        // if (isEdit.value) {
        //     // Update data berdasarkan id
        //     updatedData = existingData.map((item) => (item.id === newProductResponse.id ? newProductResponse : item));
        // } else {
        //     // Jika POST, tambahkan data baru
        //     updatedData = Array.isArray(existingData) ? [...existingData, newProductResponse] : [newProductResponse];
        // }

        // console.log('updatedData:', updatedData); // Cek data setelah penambahan atau update

        // // Simpan data yang sudah diperbarui ke localStorage
        // saveToStorage(updatedData);

        // // Verifikasi penyimpanan data ke localStorage
        // const afterSaveData = getStoredData();
        // console.log('Data after save:', afterSaveData); // Cek data setelah disimpan

        await context.saveData(product.value); // Simpan data ke store

        productDialog.value = false;

        // Mengupdate data dengan hasil fetch
        data.value = afterSaveData;
    } catch (error) {
        console.error('Error adding/updating product:', error);
    }
};

function editProduct(prod) {
    product.value = { ...prod, address: prod.address.street };
    productDialog.value = true;
    isEdit.value = true;
}

function confirmDeleteProduct(prod) {
    product.value = prod;
    deleteProductDialog.value = true;
}

function deleteProduct() {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    try {
        api(`/users/${product.value.id}`, { method: 'DELETE' });
        // Menghapus data dari localStorage
        const existingData = getStoredData(); // Mengambil data dari localStorage
        const updatedData = existingData.filter((item) => item.id !== product.value.id);
        saveToStorage(updatedData); // Simpan data yang sudah diperbarui ke localStorage
        data.value = updatedData; // Mengupdate data dengan hasil fetch
    } catch (error) {
        console.error('Error deleting product:', error);
    }
    deleteProductDialog.value = false;
}

function findIndexById(id) {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function exportCSV() {
    dt.value.exportCSV();
}

function confirmDeleteSelected() {
    deleteProductsDialog.value = true;
}

function deleteSelectedProducts() {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}

function getStatusLabel(status) {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}

// Base URL bisa disesuaikan di sini, jika perlu
const api = createApiInstance('https://jsonplaceholder.typicode.com'); // Atau gunakan base URL default

// Fungsi untuk mengambil data dari localStorage dan deserialisasi JSON
const getStoredData = () => {
    try {
        const serializedData = localStorage.getItem('listData');
        return serializedData ? JSON.parse(serializedData) : []; // Pastikan kalau tidak ada data, kembalikan array kosong
    } catch (error) {
        console.error('Error getting data from storage:', error);
        return []; // Kembalikan array kosong jika terjadi error
    }
};

const saveToStorage = (data) => {
    try {
        // Serialisasi data ke JSON dan simpan ke localStorage
        const serializedData = JSON.stringify(data);
        localStorage.setItem('listData', serializedData);
    } catch (error) {
        console.error('Error saving data to storage:', error);
    }
};

const fetchUsers = async () => {
    const res = await api('/users', { method: 'GET' });
    // console.log('res:', res);

    // Menyimpan hasil fetch ke localStorage
    saveToStorage(res);
    data.value = res; // Mengupdate data dengan hasil fetch
};

onMounted(() => {
    // Memanggil fungsi fetchUsers saat komponen dimuat
    fetchUsers();

    console.log('Data dari localStorage:', data.value);
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
                :value="data"
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
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
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
