---
index: True
title: Personal Website
date: 2025-05-14
tags: [projects]
slug: personalwebsite
description: The website you're reading right now
link: https://github.com/ColourlessSpearmint/colourlessspearmint.github.io
link_name: GitHub Repo
link_icon: github
---

My personal website is my home on the web.

<figure>
    <iframe src="../../index.html" scrolling="no" style="pointer-events: none;"></iframe>
</figure>

I made this site because I want to have an online presence, but I don't want to use social media (e.g. [Instagram](https://www.instagram.com/), [Twitter](https://twitter.com/)), nor do I want to use someone else's premade blogging platform (e.g. [Blogger](https://www.blogger.com), [Tumblr](https://www.tumblr.com/), [Wordpress](https://wordpress.com/)).

My solution was to code an entire site from scratch.

## Tech

This site is completely static and is written entirely in pure vanilla HTML, CSS, and JavaScript. It uses a few unavoidable premade libraries and services, but it's completely free from major frameworks (e.g. [React](https://react.dev/), [Vue.js](https://vuejs.org/), [Angular](https://angular.io/)).

### External Libraries

- [vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/): Used to make the cards on the home page.
- [quicklink](https://github.com/GoogleChromeLabs/quicklink): Used to improve loading times.
- [Juxtapose.js](https://github.com/NUKnightLab/juxtapose): Used to make before/after comparisons ([Example](/projects/colourlesstransformer)).

### GitHub Pages

This site is hosted on [GitHub Pages](https://pages.github.com/). I chose GitHub Pages because it's free, seems reputable, and I was already going to use GitHub for source control.

![A screenshot of my Github Pages dashboard](../../images/ghpages.webp)

My Github Pages deployment workflow

### Build

Each blog post is stored as a [Markdown](https://en.wikipedia.org/wiki/Markdown) document, and is built into HTML by my custom [static site generator](https://en.wikipedia.org/wiki/Static_site_generator). My SSG searches the blog_src directory for markdown files, reads the file contents, and applies it a template to create HTML files. It also dynamically updates other files (like the [All tag](https://colourlessspearmint.github.io/blog/all) page) with links to each blog post.

### Web Components

I've utilized [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for things like the header, footer, and buttons.

This allows me to just quickly drop in an `<ethan-header>` element, and the header will beinstantiated in [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM).

## Style Guide

I had a moderately specific vision for what I wanted my website to look like, and I think I accomplished that well with [500+ lines of CSS](https://github.com/ColourlessSpearmint/colourlessspearmint.github.io/blob/main/common.css).

### Color Palette

- **Primary**: <span style="color: #ffffff; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">#ffffff</span>: White
- **Backdrop**: <span style="color: #121212; text-shadow: -1px -1px 0 #3c3c3c, 1px -1px 0 #3c3c3c, -1px 1px 0 #3c3c3c, 1px 1px 0 #3c3c3c;">#121212</span>: Black
- **Accent**: <span style="color: #8fdfd4;">#8fdfd4</span>: Spearmint Teal

### Typography

- **Body Font**: I perused the *entire* [Google Fonts](https://fonts.google.com/) catalogue to find a sleek [neo-grotesque](https://fonts.google.com/knowledge/glossary/grotesque_neo_grotesque) font that supported [Latin](https://en.wikipedia.org/wiki/Latin_script) and [Cyrillic](https://en.wikipedia.org/wiki/Cyrillic_script). I finally settled on [Nunito](https://fonts.google.com/specimen/Nunito). (Заслужаваше си, защото вече мога да имам български текст!)
- **Header Font**: I chose [Sen](https://fonts.google.com/specimen/Sen) for the headers because it looks stylish, clean, and I like the look of the lowercase t.

### Animations

- **Page Load**: Every time a page is loaded, the content smoothly fades in from transparency. This is accomplished giving, `<body>` the following animation: `animation: fadeIn 0.3s ease-in forwards`.
- **Home Page**: I made heavy use of animations on my [Home page](https://colourlessspearmint.github.io/). The intro image, header, and subheader all slide in from different directions. Each word in the title text clicks in place with a staggered falling effect. The navigation cards gently fade and rise. I'm very happy with how it turned out.

### Effects

- **Blur**: I love [glassmorphic](https://css.glass/) blur effects, but due to performance concerns, I've only used it in the header and footer. If some mathematician figures out how to efficiently take a gaussian blur over a large sample space, I want to be the first to know so I can add a subtle blur to the `<article>` styles without tanking performance.
- **Shadows**: Some Interactive elements (e.g. buttons) have subtle drop shadows.
- **Borders**: Many elements (buttons, images, articles) have this border `border: 1px solid rgba(255, 255, 255, 0.1)`; it's 1 pixel thick, 10% opaque, and pure white.
- **Rounded Corners**: Many elements have slightly rounded corners. The radius is defined with `border-radius: clamp(8px, 3vw, 12px)`.

## Lighthouse

As of [May 14, 2025](https://pagespeed.web.dev/analysis/https-colourlessspearmint-github-io/x6c865vinn?form_factor=desktop), the site earns an average [Lighthouse](https://developer.chrome.com/docs/lighthouse) score of 96.4.

![A Lighthouse analytic page showing 95 performance, 100 accessibility, 100 best practices, 91 SEO](../../images/lighthouse.webp)

The missing points in performance are due to the animations on the home screen that cause [Cumulative Layout Shift](https://web.dev/articles/cls). I could fix it by removing the animations, but I'm hesitant to sacrifice their aesthetic value for a small nominal performance gain.

The missing points in SEO are because I don't have `<meta>` description tags on every page. I'm actively working on fixing this.

## Privacy

This site does not use cookies, trackers, analytics, or any external telemetry tools. This is partially because I care about your privacy, but mostly because I don't care about your personal information and harvesting it sounds complicated. Your data remains yours because I don't want it and can't figure out how to get it.

## Accessibility

This site is designed to be accessible to as many users as possible. Before each [git push](https://git-scm.com/docs/git-push), I test every single page in Firefox's [Responsive Design Mode](https://firefox-source-docs.mozilla.org/devtools-user/responsive_design_mode/) to ensure that the site remains functional on a variety of devices. I've done my best to follow best practices regarding meta tags, semantic markup, keyboard navigation, and alt text.

## Conclusion

My personal website is one of my favorite projects I've ever made. It's aesthetically pleasing, serves a purpose, was fun to make, and forced me to learn new programming concepts.

I'm proud of my little corner on the web, and I hope you enjoy it as much as I do. Thanks for reading.

~Ethan
