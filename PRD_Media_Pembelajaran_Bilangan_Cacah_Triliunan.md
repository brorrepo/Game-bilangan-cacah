# Product Requirement Document (PRD)
## Media Pembelajaran Interaktif: "Battle Nilai Tempat: Miliar & Triliun Showdown" (Game Battle 2 Pemain - Kelas 5 SD)

---

## 1. Informasi Dokumen & Metadata

| Parameter | Keterangan |
| :--- | :--- |
| **Nama Produk** | **"Battle Nilai Tempat: Miliar & Triliun Showdown"** |
| **Target Pengguna** | Siswa Kelas 5 SD (2 Pemain Battle) & Guru Matematika SD |
| **Kurikulum Acuan** | Kurikulum Merdeka - Matematika Kelas 5 (Fase C - Elemen Bilangan) |
| **Bentuk Media** | Game Web Interaktif 2-Pemain (*Local Real-Time Battle*) |
| **Versi PRD** | v2.0.0 (Custom Battle Mechanics) |
| **Penulis** | Antigravity AI & Tim Pengembang Media Pembelajaran |

---

## 2. Ringkasan Eksekutif & Visi Produk

### 2.1 Konsep Utama (2-Player Local Battle Arena)
Berbeda dengan modul latihan statis, aplikasi ini dirancang sebagai **Game Adu Cepat (Real-Time Battle)** yang dapat dimainkan oleh **2 orang siswa sekaligus di 1 layar** (Chromebook, Laptop, atau Tablet Touchscreen).

### 2.2 Mekanisme Permainan (*Battle Gameplay Mechanics*)
1. **Layar Terbagi Dua (Split-Screen)**:
   - **Sisi Kiri**: Arena Pemain 1 (Warna Biru / Cyan).
   - **Sisi Kanan**: Arena Pemain 2 (Warna Merah / Pink).
2. **Soal Bilangan Acak Kelompok (Miliar, Juta, Ribu, Satuan)**:
   - Di setiap ronde, masing-masing pemain mendapatkan soal angka acak bernilai Miliar/Triliun (contoh: `$485.230.619.000$`).
   - Terdapat 3 kotak target nilai tempat (misal: *Ratus Miliar*, *Puluh Ribu*, *Satuan*).
3. **Arena Angka di Tengah (Shared Center Drag Pool)**:
   - Kepingan/tokoh angka pilihan diletakkan di **tengah-tengah layar** (di antara Pemain 1 dan Pemain 2).
   - Kedua pemain **berebut menyeret (*drag & drop*)** kepingan angka tersebut dari tengah ke kotak nilai tempat yang sesuai di sisinya masing-masing.
4. **Penentuan Pemenang**:
   - Pemain yang paling cepat dan tepat dalam menempatkan digit angka ke kotak nilai tempat mendapatkan poin $+100$ dan bonus *Streak/Combo*.
   - Pemain dengan total poin tertinggi setelah 5 ronde dinobatkan sebagai **"Master Nilai Tempat"**!

---

## 3. Tata Letak Layar & Interaksi (UI/UX Layout)

```
+-------------------------------------------------------------------------------------------------+
|  [🚀] BATTLE NILAI TEMPAT         [ RONDE 1/5 ]     [⏱️ 45s]        [🔊 Audio]  [🔄 Ulangi]     |
+-------------------------------------------------------------------------------------------------+
|  PEMAIN 1 (SISI KIRI)             |        ARENA ANGKAN TENGAH       |  PEMAIN 2 (SISI KANAN)      |
|  🎮 Budi             Poin: 350    |       (BEREBUT DISERET!)         |  🕹️ Ani             Poin: 400 |
|                                   |                                  |                             |
|  🎯 SOAL P1:                      |   👇 SERET ANGKA KE SISIMU 👇    |  🎯 SOAL P2:                |
|  [ 4 8 5 . 2 3 0 . 6 1 9 . 0 0 0 ]|                                  |  [ 7 1 2 . 9 0 4 . 1 5 0 . 0 0 0 ]|
|  "Geser angka ke nilai tempat!"   |   +------+  +------+  +------+   |  "Geser angka ke nilai tempat!"|
|                                   |   |  4   |  |  8   |  |  2   |   |                             |
|  +--------------+---------------+ |   +------+  +------+  +------+   |  +--------------+----------+ |
|  | RATUS MILIAR | PULUH RIBU    | |   +------+  +------+  +------+   |  | RATUS TRILIUN| RATUS RIBU| |
|  | [   4   ]    | [    1   ]    | |   |  9   |  |  0   |  |  5   |   |  | [   7   ]    | [   1  ]  | |
|  +--------------+---------------+ |   +------+  +------+  +------+   |  +--------------+----------+ |
|  | SATUAN       |                 |                                  |  | PULUH JUTA   |          | |
|  | [   ?   ]    |                 |   [ Kepingan melayang di tengah ]|  | [   ?   ]    |          | |
|  +--------------+                 |                                  |  +--------------+          | |
+-------------------------------------------------------------------------------------------------+
```

---

## 4. Spesifikasi FiturTeknis & Suara (Sound & Engine)

1. **Dual Drag Engine (HTML5 Drag & Pointer Events)**:
   - Mendukung input mouse biasa maupun **Multitouch Touchscreen** (Tablet/iPad) sehingga 2 anak dapat menyentuh dan menyeret angka secara bersamaan tanpa bentrok event handler.
2. **Audio Synth Responsif (Web Audio API)**:
   - Suara nada tinggi gembira (*chime*) saat angka diletakkan di kotak yang benar.
   - Efek getar dan *error buzz* saat salah memasukkan angka.
   - Fanfare musik selebrasi saat pengumuman pemenang di akhir battle.
3. **Sistem Poin & Combo Streak**:
   - Jawaban benar: $+100$ poin.
   - Jawaban benar berturut-turut (*Combo Streak*): Bonus $+50$ poin ekstra per combo.
   - Jawaban salah: $-20$ poin (mencegah tebak acak).
4. **Mode Pilihan**:
   - **Mode Miliar & Juta** (Standar Kelas 5 SD).
   - **Mode Triliun** (Tantangan Master).

---

## 5. Struktur Berkas Kode Aplikasi

Seluruh kode aplikasi telah dibangun modular dan dapat dijalankan di browser apa pun tanpa memerlukan server/build step (*zero-dependency*):

- **[index.html](file:///c:/Users/USER/Documents/004%20Media%20pembelajaran/index.html)**: Struktur antarmuka arena battle 2 pemain, modal start, dan modal selebrasi.
- **[styles.css](file:///c:/Users/USER/Documents/004%20Media%20pembelajaran/styles.css)**: Styling modern glassmorphism, warna visual kelompok digit, dan animasi partikel.
- **[script.js](file:///c:/Users/USER/Documents/004%20Media%20pembelajaran/script.js)**: Logika game battle, generator soal acak 3-tabel, Web Audio synth, dan multitouch drag engine.
