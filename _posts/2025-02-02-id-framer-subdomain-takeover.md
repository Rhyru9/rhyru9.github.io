---
layout: post
title: "Framer Subdomain Takeover: Panduan Lengkap"
date: 2025-02-02
tags: [bug-bounty, recon, security, vulnerability]
excerpt: "Pelajari cara mengidentifikasi dan menguji takeover subdomain Framer yang belum diklaim, seperti *.framer.website, untuk mendemonstrasikan kerentanan keamanan."
lang: id
translation_key: framer-subdomain-takeover
translation_url: /blog/2025/02/02/Framer-Subdomain-Takeover/
permalink: /id/blog/2025/02/02/framer-subdomain-takeover/
translations:
  en:
    title: "Framer Subdomain Takeover: A Complete Guide"
    excerpt: "Learn how to identify and perform a takeover of unclaimed Framer subdomains, such as *.framer.website, to demonstrate a security vulnerability."
  id:
    title: "Framer Subdomain Takeover: Panduan Lengkap"
    excerpt: "Pelajari cara mengidentifikasi dan menguji takeover subdomain Framer yang belum diklaim, seperti *.framer.website, untuk mendemonstrasikan kerentanan keamanan."
---

Subdomain takeover adalah kerentanan yang terjadi ketika attacker dapat mengklaim subdomain yang sudah tidak digunakan karena konfigurasi DNS yang keliru. Panduan ini menunjukkan cara mengidentifikasi dan menguji subdomain Framer secara bertanggung jawab.

## Seperti Apa Subdomain yang Rentan?

Subdomain yang di-host di Framer dapat menjadi target takeover, termasuk:

- `*.framer.website`
- `*.framer.ai`
- `*.framer.photos`
- `*.framer.media`
- `*.framer.wiki`

Custom domain juga perlu diperiksa jika menampilkan pesan **"Sign up for Framer to publish your own website"** atau title **"Page Not Found Framer"**. Biasanya domain seperti ini terkait dengan project Framer yang sudah tidak aktif atau ditinggalkan.

![Figure 1: Framer Page Not Found error page](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*JmtBCTBt8lV38A9rWWHGTg.png)

Dengan beberapa langkah sederhana, subdomain rentan dapat diklaim dan kontennya dapat dikontrol.

## Langkah Pengujian Subdomain Takeover

1. **Daftar akun Framer:** Kunjungi [login.framer.com](https://login.framer.com) dan buat akun.
2. **Buat page:** Setelah signup, masuk ke dashboard project Framer. Pilih fitur "Page". Anda bisa memakai page baru atau page yang sudah ada.
3. **Publish page:** Klik "Publish" di bagian kanan atas untuk membuka opsi publishing.
4. **Tambahkan custom domain:** Pilih "Add Domain", lalu masukkan domain rentan yang sudah diidentifikasi.
   - Untuk domain di bawah `framer.website`, subdomain biasanya dapat digunakan gratis.
   - Untuk custom domain, mungkin ada biaya penggunaan domain.

![Framer domain configuration interface](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*KAqEx-fQtIJIW5hIlt2f1w.png)

## References

- GitHub: [https://github.com/EdOverflow/can-i-take-over-xyz/issues/439](https://github.com/EdOverflow/can-i-take-over-xyz/issues/439)

---

**Catatan:** Lakukan subdomain takeover hanya pada domain yang Anda miliki atau yang secara eksplisit mengizinkan pengujian. Pengujian tanpa izin dapat melanggar hukum dan etika.
