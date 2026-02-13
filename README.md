# Jekyll Portfolio

Academic Pages-inspired professional portfolio. Clean, serif typography, sidebar layout.

## Quick Start

```bash
# Install dependencies
bundle install

# Run locally
bundle exec jekyll serve

# Open http://localhost:4000
```

## Customize

### 1. Edit `_config.yml`
```yaml
title: "Your Name"
author: "Your Name"
email: "you@example.com"
github_username: yourusername
linkedin_username: yourusername
twitter_username: yourusername
bio: "Your role · Your title<br>Location"
```

### 2. Add your photo
Replace the dummy avatar by adding your photo to `assets/images/profile.jpg`
and setting in `_config.yml`:
```yaml
profile_image: "/assets/images/profile.jpg"
```

### 3. Edit content pages
- **About** → `index.md`
- **Blog posts** → `_posts/YYYY-MM-DD-title.md`
- **Achievements** → `_data/achievements.yml`
- **CV** → `_data/cv.yml`

### 4. Blog post format
```markdown
---
layout: post
title: "Your Post Title"
date: 2025-01-01
read_time: 5
tags: [tag1, tag2]
excerpt: "One-line summary shown in listing."
---

Your content here...
```

## Deployment (GitHub Pages)

1. Push to a repo named `yourusername.github.io`
2. Go to Settings → Pages → Source: main branch
3. Your site is live at `https://yourusername.github.io`

## Structure

```
├── _config.yml          # Site settings
├── _layouts/
│   ├── default.html     # Base layout (sidebar + nav)
│   ├── post.html        # Blog post layout
│   └── page.html        # Generic page
├── _includes/
│   └── icons/           # SVG icon includes
├── _posts/              # Blog posts (YYYY-MM-DD-title.md)
├── _data/
│   ├── achievements.yml # Awards, publications, talks
│   └── cv.yml           # Education, experience, skills
├── assets/
│   ├── css/main.css
│   └── js/main.js
├── index.md             # About/home page
├── blog.md              # Blog listing page
├── achievements.md      # Achievements page
├── cv.md                # CV page
└── search.json          # Search index (auto-generated)
```

## Features

- ✅ Responsive design with mobile menu
- ✅ Clean serif typography (EB Garamond)
- ✅ Blog with search functionality
- ✅ CV and achievements pages
- ✅ Social media links
- ✅ SEO optimized
- ✅ RSS feed
- ✅ Fast and lightweight

## Troubleshooting

**Issue**: Pages not showing up
- Make sure file names in `_posts/` follow format: `YYYY-MM-DD-title.md`
- Check that YAML front matter is correct

**Issue**: Sidebar not showing
- Check browser width (sidebar hides on mobile)
- Check CSS is loading properly

**Issue**: Search not working
- Make sure `search.json` is being generated
- Check browser console for errors

## License

MIT License - feel free to use for your own portfolio!
