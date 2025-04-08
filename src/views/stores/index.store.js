export const useUserStore = defineStore({
    id: 'user.store',
    state: () => ({
        isEdit: false,
        dataTable: null
    }),
    actions: {
        async saveData(data) {
            try {
                // Pengecekan jika product.id lebih dari 10, tampilkan alert dan hentikan eksekusi
                if (this.isEdit && data.id > 10) {
                    // showMessage('warn', 'ID lebih dari 10, tidak dapat diedit!');
                    showMessage({ message: 'ID lebih dari 10, tidak dapat diedit!', color: 'error' });
                    return; // Hentikan eksekusi fungsi jika ID lebih dari 10
                }

                const url = this.isEdit ? `/users/${data.id}` : '/users'; // Tentukan URL berdasarkan apakah kita melakukan edit atau tidak

                // Kirim POST request untuk menambah produk baru atau PUT request untuk update
                const newProductResponse = await api(url, {
                    method: this.isEdit ? 'PUT' : 'POST',
                    body: {
                        ...(this.isEdit && { id: data.id }), // Hanya kirimkan ID jika isEdit = true (PUT)
                        email: data.email,
                        username: data.username,
                        name: data.name,
                        address: {
                            street: data.address
                        }
                    }
                });

                console.log('Product response:', newProductResponse);

                // Ambil data yang ada di localStorage, pastikan itu adalah array
                const existingData = getStoredData(); // Mengambil data dari localStorage
                console.log('existingData:', existingData); // Cek apa yang ada di localStorage

                // Jika melakukan edit (PUT), cari data yang memiliki id yang sama dan perbarui, jika POST, tambahkan data baru
                let updatedData;
                if (this.isEdit) {
                    // Update data berdasarkan id
                    updatedData = existingData.map((item) => (item.id === newProductResponse.id ? newProductResponse : item));
                } else {
                    // Jika POST, tambahkan data baru
                    updatedData = Array.isArray(existingData) ? [...existingData, newProductResponse] : [newProductResponse];
                }

                console.log('updatedData:', updatedData); // Cek data setelah penambahan atau update

                // Simpan data yang sudah diperbarui ke localStorage
                saveToStorage(updatedData);

                // Verifikasi penyimpanan data ke localStorage
                const afterSaveData = getStoredData();
                console.log('Data after save:', afterSaveData); // Cek data setelah disimpan

                // Mengupdate data dengan hasil fetch
                // data.value = afterSaveData;
            } catch (error) {
                console.error('Error adding/updating product:', error);
            }
        }
    }
});
