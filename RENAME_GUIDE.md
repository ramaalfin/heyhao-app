# 🔄 Project Renaming & Troubleshooting Guide

Dokumen ini menjelaskan langkah-langkah yang diperlukan jika Anda mengubah nama proyek React Native dan cara mengatasi masalah build iOS yang muncul setelahnya.

## 🛠 Langkah-Langkah Mengubah Nama Proyek

Jika Anda menggunakan template dan ingin mengubah nama proyek menjadi yang lain (contoh: `heyhao-app`), jangan hanya mengubah `package.json`. Gunakan alat bantu seperti `react-native-rename`:

```bash
# Ganti "Nama-Proyek" dengan nama baru Anda
# Ganti "com.bundle.id" dengan bundle identifier Anda
npx -y react-native-rename "Nama-Proyek" -b com.bundle.id --skipGitStatusCheck
```

## ⚠️ Masalah Umum: "Unable to open base configuration reference file" (iOS)

Setelah mengubah nama proyek, Anda mungkin akan menemui error seperti ini saat menjalankan `npm run ios`:

> `error Unable to open base configuration reference file ... Pods-heyhaoapp.debug.xcconfig`
> `error Unable to load contents of file list: ...`

### ❓ Mengapa ini terjadi?
Meskipun Anda sudah menjalankan `npm install`, langkah tersebut hanya mengelola dependensi **JavaScript**. Di sisi iOS, terdapat **CocoaPods** yang mengelola library native. Saat nama proyek berubah, target di Xcode juga berubah, sehingga konfigurasi CocoaPods yang lama menjadi tidak valid (jalur file/path tidak ditemukan).

### ✅ Solusi: Re-install Pods
Anda **wajib** melakukan instalasi ulang pod agar CocoaPods dapat membuat file konfigurasi baru yang sesuai dengan nama proyek yang baru.

Jalankan perintah berikut di terminal:

```bash
cd ios
pod install
cd ..
```

Setelah itu, Anda bisa menjalankan aplikasi kembali:
```bash
npm run ios
```

---

## 💡 Ringkasan
- **npm install**: Mengelola library JavaScript (`node_modules`).
- **pod install**: Mengelola library Native iOS dan menghubungkannya ke Xcode.
- **Ganti Nama Proyek**: Selalu ikuti dengan `pod install` agar link native tetap sinkron.
