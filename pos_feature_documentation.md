# 📦 Aplikasi POS - Dokumentasi Fitur

## ✅ Fitur Utama

### 1. Manajemen Pengguna
- Role dan Permission (menggunakan Spatie Laravel Permission)
- Approval Workflow untuk aksi penting
- Audit Trail / Log Aktifitas

### 2. Multi Store & Gudang
- Mendukung banyak toko dan gudang
- Stok per toko terpisah

### 3. Produk & Inventori
- Produk dengan berbagai satuan (PCS, PACK, dll)
- Harga modal dan harga jual per satuan
- Harga jual berbeda berdasarkan:
  - Jenis member: Biasa, Member, Grosir
  - Satuan
  - Toko

#### Contoh Harga Produk ABC:
| Kemasan | Harga Jual | Harga Member | Harga Member Grosir |
|---------|------------|--------------|----------------------|
| PCS     | 1100       | 1050         | 1000                 |
| Pack    | 11000      | 10500        | 10000                |

### 4. Transaksi Penjualan (POS)
- Interface user-friendly
- Scan barcode, shortcut keyboard
- Pilih customer (umum, member, grosir)
- Cetak struk (thermal printer)
- Pembayaran tunai, transfer, QRIS, split payment

### 5. Pembelian & Restok
- Input pembelian ke supplier
- Mendukung perubahan harga modal
- Return ke supplier

### 6. Manajemen Stok
- Lihat stok real-time per gudang
- Mutasi stok antar gudang
- Penyesuaian (Stock Opname)

### 7. Manajemen Member
- Data member retail & grosir
- Kartu member (QR atau ID)
- Riwayat transaksi member

### 8. Laporan
- Penjualan harian, bulanan
- Laporan stok, stok minimum
- Laba kotor dan margin
- Export Excel/PDF

## 🏷️ Fitur Diskon

### Jenis Diskon:
- Diskon per item (nominal atau persen)
- Diskon total transaksi
- Diskon otomatis berdasarkan member
- Buy X Get Y (opsional)

### Pengaturan Diskon:
- Diskon berdasarkan produk
- Diskon berdasarkan jenis member
- Diskon berlaku di tanggal tertentu
- Diskon hanya untuk toko tertentu

### Struktur Tabel Diskon:
```sql
discounts
- id
- name
- type (percentage, nominal, buy_x_get_y)
- value
- start_date
- end_date
- member_type (nullable)
- product_id (nullable)
- store_id (nullable)
```

### Implementasi POS:
- Saat produk dimasukkan, sistem cek diskon otomatis
- Harga asli, diskon, dan harga akhir ditampilkan
- Struk mencantumkan diskon per item atau total

## 🔌 Teknologi Pendukung
- Laravel 10+ (Backend)
- Vue 3 + Quasar atau Vuetify (Frontend)
- Pinia/Store
- Axios API layer
- Barcode Scanner Support
- Thermal Printer (QZ Tray atau print.css)
- Offline Mode (IndexedDB)

## 🗂️ Struktur Direktori Backend (Laravel)
```
App/
├── Models/
├── Http/Controllers/
├── Services/
├── Policies/
├── Enums/
```

## 🧱 Struktur Frontend (Vue)
```
src/
├── pages/
├── components/
├── stores/
├── router/
├── services/
├── utils/
```

## 🗓️ Saran Sprint Development
1. Auth & Role
2. Produk & Inventori
3. POS Page
4. Pembelian
5. Member & Harga Varian
6. Laporan
7. Diskon & Testing

