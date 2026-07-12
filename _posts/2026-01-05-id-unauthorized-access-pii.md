---
layout: post
title: "Akses Tidak Sah ke PII melalui User Search pada Website BDF"
date: 2026-01-05
tags: [responsible-disclosure, broken-access-control, javlo-cms]
excerpt: "Menemukan kerentanan broken access control kritis pada fitur pencarian pengguna yang mengekspos informasi sensitif tanpa autentikasi. Kerentanan ditemukan melalui analisis source code CMS open source."
lang: id
translation_key: unauthorized-access-pii
translation_url: /blog/2026/01/05/Unauthorized-Access-PII/
permalink: /id/blog/2026/01/05/unauthorized-access-pii/
translations:
  en:
    title: "Unauthorized Access to PII via User Search on BDF Website"
    excerpt: "Discovered a critical broken access control vulnerability in bdf.belgium.be that exposed sensitive user information including emails and phone numbers of military personnel without authentication. The vulnerability was found through source code analysis of the open-source Javlo CMS."
  id:
    title: "Akses Tidak Sah ke PII melalui User Search pada Website BDF"
    excerpt: "Menemukan kerentanan broken access control kritis pada fitur pencarian pengguna yang mengekspos informasi sensitif tanpa autentikasi. Kerentanan ditemukan melalui analisis source code CMS open source."
---

Kerentanan broken access control kritis pada fungsi user search memungkinkan akses tanpa autentikasi ke data personel yang sensitif. Melalui analisis source code CMS open source yang digunakan aplikasi, saya menemukan endpoint AJAX yang tidak melakukan pengecekan autentikasi sebelum mengembalikan data user.

## Ringkasan

Fitur pencarian user mengizinkan visitor tanpa login untuk mengambil informasi user. Endpoint AJAX terkait mengembalikan data seperti email, nomor telepon, dan detail organisasi tanpa kontrol akses yang memadai.

## Proses Discovery

### Initial Reconnaissance

Saya memulai dengan endpoint fuzzing:

```bash
ffuf -u https://target.example/FUZZ -w common-endpoints.txt
```

Saya menemukan pola endpoint AJAX:

```text
/ajax/en?webaction=*
```

Pengujian awal hanya memberi hasil terbatas, sehingga saya perlu memahami arsitektur aplikasi terlebih dahulu.

### Identifikasi Aplikasi

Dari halaman login dan perilaku aplikasi, saya melihat beberapa indikator:

- Penggunaan session berbasis `JSESSIONID`.
- Pola routing khas aplikasi Java.
- Header response yang konsisten.

Aplikasi kemudian teridentifikasi menggunakan CMS Java open source.

### Analisis Source Code

Saya mencari repository CMS tersebut dan menganalisis fungsi user search. Fokus utama adalah mencari handler untuk parameter `webaction` dan method yang menangani `ajaxsearch`.

Contoh pencarian:

```bash
grep -r "user-search" src/
grep -r "ajaxsearch" src/
```

Saya menemukan file yang menangani pencarian user dan melihat bahwa data user dikembalikan tanpa pengecekan autentikasi yang cukup.

### Code Review

Bagian rentan memiliki pola seperti ini:

```java
public synchronized static String performAjaxsearch(RequestService rs, ContentContext ctx,
    MessageRepository messageRepository, I18nAccess i18nAccess) throws Exception {

    String text = rs.getParameter("text", "").trim().toLowerCase();
    String country = rs.getParameter("country", "").trim();
    String domain = rs.getParameter("domain", "").trim();

    List<UserInfo> users = UserFactory.getUserInfoList(ctx);
    // returns user data without authentication check
}
```

Masalah utamanya bukan pada query pencarian, tetapi pada absennya authorization gate sebelum fungsi mengembalikan data.

---

## Eksploitasi

Endpoint dapat dipanggil langsung dari browser atau HTTP client tanpa session yang valid. Dengan parameter yang tepat, response berisi data user yang seharusnya hanya tersedia untuk user terautentikasi atau admin.

Contoh pola request:

```http
GET /ajax/en?webaction=user-search.ajaxsearch&text=a HTTP/1.1
Host: target.example
```

Jika response mengandung daftar user, berarti endpoint memproses request tanpa validasi akses yang benar.

---

## Dampak

Kerentanan ini berdampak pada confidentiality:

- Informasi personal dapat diakses tanpa autentikasi.
- Data organisasi internal dapat dipetakan.
- Endpoint dapat di-scrape secara otomatis.
- Informasi yang bocor dapat digunakan untuk social engineering atau serangan lanjutan.

Karena data yang terekspos berisi informasi sensitif, severity temuan ini tinggi.

---

## Root Cause

Root cause utama adalah missing authorization check pada handler AJAX. Fungsi pencarian user dapat dipanggil dari konteks publik, tetapi tidak memverifikasi apakah caller memiliki hak akses untuk melihat data user.

Kontrol yang seharusnya ada:

- Validasi login.
- Validasi role atau permission.
- Pembatasan field yang dikembalikan.
- Rate limit dan audit logging.

---

## Rekomendasi

- Tambahkan pengecekan autentikasi sebelum memproses endpoint user search.
- Batasi endpoint hanya untuk role yang membutuhkan akses.
- Jangan mengembalikan PII kecuali benar-benar diperlukan.
- Terapkan response minimization.
- Tambahkan rate limit untuk endpoint pencarian.
- Audit seluruh handler AJAX lain yang dapat dipanggil publik.

---

## Takeaway

Open source code review sangat efektif untuk menemukan bug access control. Ketika aplikasi menggunakan CMS atau framework yang source code-nya tersedia, memahami alur handler dan permission check sering lebih cepat daripada fuzzing buta.
