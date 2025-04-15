export const useUserStore = defineStore('user', {
    state: () => ({
        isEdit: false,
        dataTable: null
    }),

    actions: {
        getStoredData() {
            try {
                const serializedData = localStorage.getItem('listData');
                return serializedData ? JSON.parse(serializedData) : []; // Pastikan kalau tidak ada data, kembalikan array kosong
            } catch (error) {
                console.error('Error getting data from storage:', error);
                return []; // Kembalikan array kosong jika terjadi error
            }
        },

        saveToStorage(data) {
            try {
                const serializedData = JSON.stringify(data);
                localStorage.setItem('listData', serializedData);
            } catch (error) {
                console.error('Error saving data to storage:', error);
            }
        },

        async saveData(data) {
            const api = createApiInstance('https://jsonplaceholder.typicode.com');
            try {
                if (this.isEdit && data.id > 10) {
                    showMessage({ message: 'ID lebih dari 10, tidak dapat diedit!', color: 'error' });
                    return null;
                }

                const url = this.isEdit ? `/users/${data.id}` : '/users';
                const method = this.isEdit ? 'PUT' : 'POST';

                const payload = {
                    email: data.email,
                    username: data.username,
                    name: data.name,
                    address: {
                        street: data.address
                    }
                };

                if (this.isEdit) {
                    payload.id = data.id;
                }

                const response = await api(url, { method, body: payload });

                const existingData = this.getStoredData();
                let updatedData = [];

                if (this.isEdit) {
                    updatedData = existingData.map((item) => (item.id === response.id ? response : item));
                } else {
                    updatedData = Array.isArray(existingData) ? [...existingData, response] : [response];
                }

                this.saveToStorage(updatedData);
                this.dataTable = updatedData;

                // showMessage({ message: 'Data berhasil disimpan!', color: 'success' });

                return response; // ✅ lempar hasil response ke pemanggil
            } catch (error) {
                console.error('Error saving data:', error);
                showMessage({ message: 'Terjadi kesalahan saat menyimpan data!', color: 'error' });
                return null; // return null kalau error
            }
        },

        async getList() {
            const api = createApiInstance('https://jsonplaceholder.typicode.com');

            const res = await api('/users', { method: 'GET' });

            if (res) {
                this.dataTable = res;
                this.saveToStorage(res);
            } else {
                showMessage({ message: 'Gagal mendapatkan data!', color: 'error' });
            }
        },

        async deleteData(id) {
            const api = createApiInstance('https://jsonplaceholder.typicode.com');
            try {
                const response = await api(`/users/${id}`, { method: 'DELETE' });

                if (response) {
                    const existingData = this.getStoredData();
                    const updatedData = existingData.filter((item) => item.id !== id);
                    this.saveToStorage(updatedData);
                    this.dataTable = updatedData;
                    // showMessage({ message: 'Data berhasil dihapus!', color: 'success' });
                } else {
                    showMessage({ message: 'Gagal menghapus data!', color: 'error' });
                }
            } catch (error) {
                console.error('Error deleting data:', error);
                showMessage({ message: 'Terjadi kesalahan saat menghapus data!', color: 'error' });
            }
        }
    }
});
