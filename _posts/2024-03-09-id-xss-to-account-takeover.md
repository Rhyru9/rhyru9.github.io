---
layout: post
title: "Self-XSS Mengungkap Domain S3 Bucket - 12K+ Sesi Chat Terekspos"
date: 2024-03-09
tags: [Web, XSS, High, S3]
excerpt: "Self-XSS pada chat dukungan AI membuat saya menguji document.domain, yang ternyata mengungkap bucket S3. Temuan ini mengekspos 12.000+ percakapan pelanggan yang tersimpan di bucket publik."
lang: id
translation_key: xss-to-account-takeover
translation_url: /blog/2024/03/09/xss-to-account-takeover/
permalink: /id/blog/2024/03/09/xss-to-account-takeover/
translations:
  en:
    title: "Self-XSS Reveals S3 Bucket Domain - 12K+ Chat Sessions Exposed"
    excerpt: "A self-XSS in an AI support chat led me to test document.domain, which unexpectedly revealed an S3 bucket. This discovery exposed 12.000+ customer conversations stored in a publicly accessible bucket."
  id:
    title: "Self-XSS Mengungkap Domain S3 Bucket - 12K+ Sesi Chat Terekspos"
    excerpt: "Self-XSS pada chat dukungan AI membuat saya menguji document.domain, yang ternyata mengungkap bucket S3. Temuan ini mengekspos 12.000+ percakapan pelanggan yang tersimpan di bucket publik."
---

Self-XSS pada chat dukungan AI membuat saya menguji `document.domain`, yang ternyata mengungkap domain bucket S3. Temuan ini mengekspos 12.000+ percakapan pelanggan yang tersimpan di bucket yang dapat diakses publik.

---

## Discovery: Self-XSS Membuka Jalan

Saya sedang menguji fitur support chat pada aplikasi target untuk mencari isu validasi input. Payload XSS dasar berhasil dieksekusi:

```html
<script>alert(1)</script>
```

Pada awalnya ini tampak seperti self-XSS biasa karena hanya berdampak pada sesi saya sendiri. Biasanya severity temuan seperti ini rendah.

Saya kemudian ingin memahami konteks eksekusinya, jadi saya menguji:

```html
<script>alert(document.domain)</script>
```

Hasilnya tidak sesuai ekspektasi. Kode tidak berjalan pada domain aplikasi utama, tetapi pada domain S3 yang digunakan untuk merender konten chat.

<div align="center">
    <img src="https://i.pinimg.com/736x/da/ef/e4/daefe4a61442bcbd656e3f13adfae32e.jpg"
         alt="S3 Domain Revealed"
         style="width: 300px; height: auto;">
</div>

Ini mengubah konteks temuan. Self-XSS tersebut ternyata memberi petunjuk bahwa konten chat diproses dan ditampilkan dari konteks yang berbeda.

---

## Investigasi: Hidden Iframe

Saat memeriksa source halaman, saya menemukan iframe tersembunyi yang memuat file HTML dari bucket S3:

```html
<iframe id="chat-frame"
        src="https://prod-xxxx.customer-chats.s3.amazonaws.com/sessions/chat-abc123.html"
        style="width:100%; height:500px; border:none;">
</iframe>
```

Arsitekturnya menjadi jelas:

1. User mengirim pesan.
2. Backend menyimpan pesan sebagai file HTML di S3.
3. Frontend memuat URL S3 di dalam iframe.
4. Konten chat dirender dari bucket.
5. Payload XSS berjalan di dalam iframe, sehingga `document.domain` menampilkan domain S3.

---

## Pengujian Bucket S3

Setelah mendapatkan URL bucket, saya menguji apakah bucket tersebut terlindungi dengan benar:

```bash
curl https://prod-xxxx.customer-chats.s3.amazonaws.com/
```

Hasilnya bucket listing terbuka. Ini berarti file sesi chat dapat ditemukan dan diakses langsung.

```xml
<ListBucketResult>
    <Name>customer-chats</Name>
    <Contents>
        <Key>sessions/chat-2024-01-15-abc123.html</Key>
    </Contents>
</ListBucketResult>
```

Saya kemudian menguji beberapa objek secara manual dan menemukan bahwa file chat dapat dibuka tanpa autentikasi. Dampaknya bukan lagi sekadar self-XSS, tetapi paparan data percakapan pengguna.

---

## Dampak

Bucket tersebut berisi ribuan file sesi chat. Banyak percakapan berisi data yang tidak seharusnya publik, seperti alamat email, nomor order, detail dukungan, dan konteks percakapan pelanggan.

Contoh data yang terekspos:

```html
<p>Hi, my email is john.doe@company.com and I need help with order #12345</p>
```

Dampak utama:

- Akses publik ke arsip percakapan pelanggan.
- Potensi kebocoran PII.
- Risiko scraping massal dari bucket listing.
- XSS tetap relevan sebagai indikator arsitektur yang salah.

---

## Root Cause

Ada dua masalah yang saling berkaitan:

1. Konten user disimpan dan dirender sebagai HTML tanpa sanitasi yang cukup.
2. Bucket S3 yang menyimpan sesi chat mengizinkan listing dan akses publik ke objek.

Jika salah satu lapisan dikonfigurasi dengan benar, dampaknya akan jauh lebih kecil. Sanitasi akan mencegah eksekusi script, sedangkan policy bucket yang benar akan mencegah akses langsung ke arsip chat.

---

## Rekomendasi

- Nonaktifkan public bucket listing.
- Batasi akses objek S3 menggunakan signed URL atau proxy backend.
- Simpan konten chat sebagai data, bukan HTML mentah.
- Sanitasi seluruh input user sebelum dirender.
- Terapkan Content Security Policy yang ketat pada iframe.
- Audit bucket storage yang berisi data percakapan atau file user-generated.

---

## Takeaway

Self-XSS tidak selalu berhenti sebagai temuan low severity. Dalam kasus ini, payload sederhana membuka petunjuk tentang arsitektur penyimpanan chat dan akhirnya mengarah ke paparan data berskala besar. Saat payload berjalan di konteks yang tidak terduga, selalu cek mengapa konteks itu berbeda.
