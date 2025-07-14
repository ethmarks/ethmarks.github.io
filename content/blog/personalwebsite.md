---
title: Personal Website
date: 2025-05-14
tags: [projects, programming, webdev, personalwebsite]
description: The website you're reading right now
link: https://github.com/ColourlessSpearmint/colourlessspearmint.github.io
link_name: GitHub Repo
link_icon: github
---

My personal website is my home on the web.

{{< iframe src="/index.html" alt="homepage" >}}

I made this site because I want to have an online presence, but I don't want to use social media (e.g. [Instagram](https://www.instagram.com/), [Twitter](https://twitter.com/)), nor do I want to use someone else's premade blogging platform (e.g. [Blogger](https://www.blogger.com), [Tumblr](https://www.tumblr.com/), [Wordpress](https://wordpress.com/)).

My solution was to code a site of my own.

## Tech

This site is completely static and was programmed from scratch in pure vanilla [HTML](https://en.wikipedia.org/wiki/HTML), [CSS](https://en.wikipedia.org/wiki/CSS), and [JavaScript](https://en.wikipedia.org/wiki/JavaScript).

### GitHub Pages

This site is hosted on [GitHub Pages](https://pages.github.com/). I chose GitHub Pages because it's free, seems reputable, and I was already going to use GitHub for source control.

![My Github Pages deployment workflow](/media/ghpages.webp)

### Build

This site is built using [Hugo](https://gohugo.io/), an [SSG](https://en.wikipedia.org/wiki/Static_site_generator) written in [Go](https://en.wikipedia.org/wiki/Go_(programming_language)).

Before [switching to Hugo](/blog/hugoswitch), this site used a custom SSG I wrote with 500+ lines of [Python](https://en.wikipedia.org/wiki/Python_(programming_language)) code, archived [here](https://github.com/ColourlessSpearmint/colourlessspearmint.github.io/blob/b194fe064cbbc43dc714fbde7b27d47dfcad262f/build.py).

## Style Guide

I had a moderately specific vision for what I wanted my website to look like, and I think I accomplished that well with my site's CSS styles. The primary stylesheet, [common.css](https://github.com/ColourlessSpearmint/colourlessspearmint.github.io/blob/main/common.css), contains 1215 lines of code. [The auxilary stylesheets](https://github.com/ColourlessSpearmint/colourlessspearmint.github.io/blob/main/static/) add another 2040 lines. I utilized [nestled CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) to create reusable and readable styles.

### Color Palette

This site uses a dark theme with a spearmint teal accent colour.

- **Primary**: <span style="color: #ffffff; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">#ffffff</span>: White
- **Backdrop**: <span style="color: #121212; text-shadow: -1px -1px 0 #3c3c3c, 1px -1px 0 #3c3c3c, -1px 1px 0 #3c3c3c, 1px 1px 0 #3c3c3c;">#121212</span>: Black
- **Accent**: <span style="color: #8fdfd4;">#8fdfd4</span>: Spearmint Teal

### Typography

- **Primary Font**: I perused the *entire* [Google Fonts](https://fonts.google.com/) catalogue to find a [neo-grotesque](https://fonts.google.com/knowledge/glossary/grotesque_neo_grotesque) font that I liked the look of and that supported both [Latin](https://en.wikipedia.org/wiki/Latin_script) and [Cyrillic](https://en.wikipedia.org/wiki/Cyrillic_script) glyphs. I finally settled on [Nunito](https://fonts.google.com/specimen/Nunito), and it's the default font that most text on the site uses.
- **Secondary Font**: For the headings, I used [Sen](https://fonts.google.com/specimen/Sen). There are many subtle differences between Sen and Nunito, but the most noticable is the lack of rounded strokes. Sen looks sharper and more angular than Nunito.

### Special Effects

- **Blur**: I love [glassmorphic](https://css.glass/) blur effects, but due to performance concerns, I've only used it in the header and footer. If some mathematician figures out how to cheaply perform a [gaussian blur](https://en.wikipedia.org/wiki/Gaussian_blur) over a large sample space, I want to be the first to know so I can add a subtle blur to the main panel without tanking performance.
- **Tilt**: If you hover over the cards on my home page, they'll respond to the mouse by tilting in 3D. I used [vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/) for this.

## Lighthouse

As of July 14, 2025, the site earns a perfect 100 on [Google Lighthouse](https://developer.chrome.com/docs/lighthouse).

[![A Lighthouse analytic page showing 99 performance, 100 accessibility, 100 best practices, 100 SEO](/media/lighthouse-2025-07-14.webp)](https://pagespeed.web.dev/analysis/https-colourlessspearmint-github-io/hhcjywik6m?form_factor=desktop)

To quote the [official Lighthouse documentation](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): "A perfect score of 100 is extremely challenging to achieve and not expected".

My site's exceptional performance is largely a consequence of my aversion to web frameworks. [Frameworks like React tend to be very heavy and slow](https://nuejs.org/blog/large-scale-apps/), so by using hand-written JavaScript and CSS, fewer bytes need to be transferred to load the page. I also use [WebP](https://en.wikipedia.org/wiki/WebP) and [WebM-AV1](https://en.wikipedia.org/wiki/AV1), the objectively best and most efficient formats for images and videos.

## Privacy

This site does not use cookies, trackers, analytics, or any external telemetry tools. This is partially because I care about your privacy, but mostly because I don't care about your personal information and collecting it sounds complicated. Your data remains yours because I don't want it and can't be bothered to harvest it.

## Accessibility

This site is designed to be accessible to as many users as possible. I've done my best to follow best practices regarding meta tags, semantic markup, keyboard navigation, and alt text. Also, before each [git push](https://git-scm.com/docs/git-push) I test every single page in Firefox's [Responsive Design Mode](https://firefox-source-docs.mozilla.org/devtools-user/responsive_design_mode/) to ensure that the site remains functional on different devices and screens.

## Conclusion

My personal website is one of my favorite projects I've ever made. It's aesthetically pleasing, serves a purpose, was fun to make, and forced me to learn new programming concepts.

I'm proud of my little corner on the web, and I hope you enjoy it as much as I do. Thanks for reading.

~Ethan
