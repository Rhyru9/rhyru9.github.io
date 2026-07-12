# Rhyru9 — Portfolio

Personal security research portfolio built with Jekyll. Bilingual (EN/ID), responsive, with a clean terminal-inspired design.

## Quick Start

```bash
bundle install
bundle exec jekyll serve
# Open http://localhost:4000
```

## Structure

```
├── _config.yml              # Site settings & author info
├── _data/
│   ├── i18n.yml             # Bilingual translation strings
│   ├── achievements.yml     # Awards, recognitions, bug bounty profiles
│   └── cv.yml               # Education, certifications, experience, skills
├── _layouts/
│   ├── default.html         # Base layout
│   └── post.html            # Blog post layout
├── _includes/
│   ├── head.html
│   ├── topbar.html          # Desktop navigation + logo
│   ├── mobile-nav.html      # Mobile drawer menu
│   ├── footer.html
│   ├── icons/               # Inline SVG icons
│   └── pages/
│       ├── home.html        # Homepage
│       ├── blog.html        # Blog listing
│       ├── achievements.html
│       ├── cv.html
│       └── contact.html
├── _posts/                  # Blog posts (EN + ID versions)
├── _sass/                   # SCSS partials (base, components, layout, utils)
├── assets/
│   ├── css/
│   ├── documents/           # PDFs (certificates, letters)
│   ├── images/
│   └── js/
│       ├── main.js
│       └── typewriter.js    # Logo typewriter animation
├── id/                      # Indonesian pages
│   ├── index.md
│   ├── blog.md
│   ├── achievements.md
│   ├── cv.md
│   └── contact.md
├── index.md                 # Homepage (EN)
├── blog.md                  # Blog listing (EN)
├── achievements.md          # Achievements page (EN)
├── cv.md                    # CV page (EN)
├── contact.md               # Contact page (EN)
├── search.json              # Client-side search index
├── .github/workflows/       # GitHub Pages deploy action
├── Gemfile
├── _config.yml
└── CNAME
```

## Customization

### Site settings (`_config.yml`)
```yaml
title: "Rhyru9"
author: "Rhyru9"
email: "contact@rhyru9.xyz"
url: "https://rhyru9.xyz"
github_username: rhyru9
linkedin_username: rhyru9
twitter_username: rhyru9
hackerone_username: rhyru9
```

### Blog post (bilingual)

Create two files — one for each language, linked by `translation_key`:

**EN** (`_posts/2026-01-01-my-post.md`):
```yaml
---
layout: post
title: "My Post Title"
date: 2026-01-01
tags: [tag1, tag2]
excerpt: "Short summary."
lang: en
translation_key: my-post
translation_url: /id/blog/2026/01/01/my-post/
translations:
  en:
    title: "My Post Title"
    excerpt: "Short summary."
  id:
    title: "Judul Post Saya"
    excerpt: "Ringkasan singkat."
---
```

**ID** (`_posts/2026-01-01-id-my-post.md`):
```yaml
---
layout: post
title: "Judul Post Saya"
date: 2026-01-01
tags: [tag1, tag2]
excerpt: "Ringkasan singkat."
lang: id
translation_key: my-post
translation_url: /blog/2026/01/01/my-post/
permalink: /id/blog/2026/01/01/my-post/
translations:
  en:
    title: "My Post Title"
    excerpt: "Short summary."
  id:
    title: "Judul Post Saya"
    excerpt: "Ringkasan singkat."
---
```

### Achievements (`_data/achievements.yml`)

```yaml
awards:
  - title: "Award Title"
    date: "2026"
    venue: "Organization"
    description: "English description."
    description_id: "Deskripsi bahasa Indonesia."   # optional
    tags: [tag1, tag2]
    url: "https://example.com"
```

### i18n (`_data/i18n.yml`)

All UI text lives here — `en` and `id` top-level keys with mirrored structure. Templates pull from `site.data.i18n[page.lang]`.

## Features

- Bilingual EN/ID with language switcher
- Responsive — mobile drawer menu
- Typewriter logo animation
- Client-side search (JSON index)
- Achievement highlights with translated descriptions
- Grid dot background
- CV with i18n-aware skill categories
- RSS feed, SEO tags, sitemap

## Deployment (GitHub Pages)

1. Push to `yourusername.github.io`
2. Go to Settings → Pages → Source: `main` branch (GitHub Actions)
3. Site is live at `https://yourusername.github.io`

## License

MIT
