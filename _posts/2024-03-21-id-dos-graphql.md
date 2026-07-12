---
layout: post
title: "Dari Subdomain Enum ke GraphQL DoS: Perjalanan Bug Hunter"
date: 2024-03-21
tags: [Api, DOS, High]
excerpt: "Perjalanan dari enumerasi subdomain sederhana sampai menemukan kerentanan denial-of-service GraphQL kritis melalui recon, tooling khusus, fuzzing sistematis, dan query complexity exploit."
lang: id
translation_key: dos-graphql
translation_url: /blog/2024/03/21/DOS-graphql/
permalink: /id/blog/2024/03/21/dos-graphql/
translations:
  en:
    title: "From Subdomain Enum to GraphQL DoS: A Bug Hunter's Journey"
    excerpt: "A journey from basic subdomain enumeration to discovering a critical GraphQL denial-of-service vulnerability. What started as routine reconnaissance with subfinder and httpx evolved into custom tool development, systematic fuzzing, and ultimately finding a server-crushing query complexity exploit that earned a bounty."
  id:
    title: "Dari Subdomain Enum ke GraphQL DoS: Perjalanan Bug Hunter"
    excerpt: "Perjalanan dari enumerasi subdomain sederhana sampai menemukan kerentanan denial-of-service GraphQL kritis melalui recon, tooling khusus, fuzzing sistematis, dan query complexity exploit."
---

Perjalanan ini dimulai dari enumerasi subdomain biasa, lalu berkembang menjadi penemuan kerentanan GraphQL DoS kritis melalui fuzzing sistematis dan tooling khusus.

## TL;DR

Saya menemukan kerentanan denial-of-service pada endpoint GraphQL. Alurnya dimulai dari subdomain discovery, probing HTTP, identifikasi endpoint GraphQL, lalu pengujian query complexity sampai menemukan pola request yang dapat membebani server secara signifikan.

**Severity:** High  
**Impact:** Denial of Service melalui GraphQL query complexity  
**Bounty:** $$$

---

## Initial Reconnaissance

### Step 1: Subdomain Enumeration

Saya memulai dengan pendekatan klasik menggunakan Subfinder:

```bash
subfinder -d domain.test -o domains.txt
```

Hasilnya cukup banyak subdomain untuk diproses lebih lanjut.

---

## HTTP Probing & Analysis

### Step 2: Analisis HTTP dengan httpx

Saya kemudian mencari host yang aktif dan menarik:

```bash
httpx -l domains.txt -favicon -fr -sc -tech-detect -bp
```

Flag yang digunakan:

- `-favicon`: mengambil favicon hash.
- `-fr`: mengikuti redirect.
- `-sc`: menampilkan status code.
- `-tech-detect`: mendeteksi teknologi.
- `-bp`: mengambil cuplikan body response.

Beberapa endpoint `404` justru menarik karena sering menunjukkan route tersembunyi, API yang tidak terdokumentasi, atau endpoint development yang tertinggal.

<div align="center">
    <img src="https://images7.memedroid.com/images/UPLOADED577/61b6add70a737.jpeg"
         alt="404"
         loading="lazy" decoding="async"
         style="width: 200px; height: auto;">
</div>

---

## Custom GraphQL Discovery Tool

Tool standar belum cukup efisien untuk mendeteksi endpoint GraphQL di banyak domain. Karena itu saya membuat script sederhana untuk:

- Menguji path umum seperti `/graphql`, `/api/graphql`, dan `/v1/graphql`.
- Mengirim introspection query ringan.
- Mengecek response error khas GraphQL.
- Mencatat host yang merespons dengan pola GraphQL.

Contoh request dasar:

```json
{
  "query": "{ __typename }"
}
```

Jika response menunjukkan struktur GraphQL, host masuk ke daftar target lanjutan.

---

## Fuzzing Query Complexity

Setelah menemukan endpoint GraphQL yang valid, saya menguji apakah server menerapkan limit terhadap:

- Query depth.
- Query breadth.
- Alias berulang.
- Nested object.
- Cost analysis.
- Rate limit.

Salah satu pola pengujian adalah menggunakan alias dalam jumlah besar:

```graphql
query {
  a1: viewer { id }
  a2: viewer { id }
  a3: viewer { id }
}
```

Jika resolver tetap memproses setiap alias tanpa cost limit, beban server dapat meningkat cepat walaupun request terlihat sederhana.

---

## Temuan Utama

Endpoint target menerima query kompleks tanpa pembatasan yang memadai. Dengan memperbesar jumlah alias dan nested field secara bertahap, response time meningkat drastis dan server mulai tidak stabil.

Indikator yang terlihat:

- Latency naik signifikan.
- CPU usage meningkat di sisi server.
- Beberapa request valid menyebabkan timeout.
- Tidak ada limit query depth atau query cost yang efektif.

---

## Dampak

Penyerang dapat mengirim request GraphQL yang valid tetapi sangat mahal untuk diproses. Karena payload tetap berada dalam format GraphQL normal, serangan seperti ini sering lolos dari filter sederhana yang hanya mencari payload eksploitasi klasik.

Dampaknya:

- Denial of Service pada endpoint GraphQL.
- Degradasi performa untuk user lain.
- Potensi peningkatan biaya infrastruktur.
- Risiko bypass terhadap proteksi yang hanya berbasis status code atau signature.

---

## Rekomendasi

- Terapkan query depth limit.
- Gunakan query cost analysis.
- Batasi jumlah alias dan nested field.
- Tambahkan rate limit berbasis user/IP/token.
- Nonaktifkan introspection di production jika tidak diperlukan.
- Pantau slow query dan request GraphQL yang tidak proporsional.

---

## Takeaway

Recon sederhana bisa berkembang menjadi temuan berdampak tinggi ketika setiap anomali ditindaklanjuti. Endpoint GraphQL perlu diperlakukan sebagai surface khusus karena request yang valid sekalipun dapat menjadi mahal jika tidak ada kontrol kompleksitas.
