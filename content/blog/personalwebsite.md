---
title: Personal Website
date: 2025-05-14
tags: [projects, programming, webdev, personal website]
description: The website you're reading right now
link: https://github.com/ColourlessSpearmint/colourlessspearmint.github.io
link_name: GitHub Repo
link_icon: github
---

My personal website is my home on the web.

{{< iframe src="/index.html" alt="homepage" >}}

I made this site because I want to have an online presence, but I didn't want to use social media or a premade blogging platform (e.g. [Blogger](https://www.blogger.com) or [Tumblr](https://www.tumblr.com/)).

I decided that it would be more interesting to start from scratch, so I designed, built, and published a site of my own.

## Build

### Hugo

This site is built using [Hugo](https://gohugo.io/), a [static site generator](https://en.wikipedia.org/wiki/Static_site_generator) that renders [Markdown](https://en.wikipedia.org/wiki/Markdown) text (like this blog post) to [HTML](https://en.wikipedia.org/wiki/HTML) templates. Hugo also handles things like [asset minification](https://gohugo.io/functions/resources/minify/) and [Sass transpiling](https://gohugo.io/hugo-pipes/transpile-sass-to-css/).

Before I [switched to Hugo](/blog/hugoswitch), this site used [build.py](https://github.com/ColourlessSpearmint/colourlessspearmint.github.io/blob/b194fe064cbbc43dc714fbde7b27d47dfcad262f/build.py), a custom SSG I wrote in [Python](https://en.wikipedia.org/wiki/Python_(programming_language)). Build.py was a mostly functional solution, but it was slow, complex, and nowhere near as powerful as Hugo.

Before build.py, this site didn't have *any* build step, and I wrote every line of HTML, CSS, and JS by hand. This approach was extremely tedious, so I only wrote 12 blog posts like this.

### GitHub Pages

![A screenshot of the GitHub Actions tab, showing a successful job titled 'Deploy Hugo site to Pages'. The job took 28 seconds. The job has a build step and a deploy step. The job produced a 13.4 megabyte artifact titled 'github-pages'.](~/gh_pages_workflow.webp)

This site is hosted on [GitHub Pages](https://pages.github.com/), a free service provided by GitHub that hosts static sites. It's why the site url includes ".github.io". The full GitHub Action I used to render the site and deploy to GitHub Pages is available [here](https://github.com/ColourlessSpearmint/colourlessspearmint.github.io/blob/main/.github/workflows/hugo.yaml). GitHub Pages is convenient for me because I'm already using GitHub for source control. [Neocities](https://neocities.org/) would probably have been my second choice if I couldn't use GitHub Pages.

## Styling

This site is styled with [Sass](https://en.wikipedia.org/wiki/Sass_(style_sheet_language)), a CSS preprocessor that adds useful features to CSS, like [mixins](https://sass-lang.com/documentation/at-rules/mixin/), [variables](https://sass-lang.com/documentation/variables/), and [build-time imports](https://sass-lang.com/documentation/at-rules/import/).

This site's Sass is transpiled using [LibSass](https://sass-lang.com/libsass/). LibSass is an old, deprecated transpiler that was [last updated in 2023](https://github.com/sass/libsass/releases/tag/3.6.6). I use LibSass because I couldn't figure out how to set Hugo up with [Dart Sass](https://sass-lang.com/dart-sass/) (the modern and recommended transpiler), as it kept causing timeout errors that were inconsistent and very difficult to debug. I eventually just gave up and switched to the lightning-fast and consistent LibSass. This unfortunately means that I can't use any of the new Dart Sass features like [@use](https://sass-lang.com/documentation/at-rules/use/), so I use [@import](https://sass-lang.com/documentation/at-rules/import/) instead.

### Responsive Design

This site looks different depending on the size and dimensions of the screen used to view it. For example, the header is a floating capsule on desktop, but takes up the whole width of the screen on mobile. Likewise, hover effects and mouse interactivity are disabled if you don't have a cursor (like on mobile).

### Colour Palette

This site uses a dark theme with a spearmint teal accent colour.

- **Primary**: <span style="color: #ffffff; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">#ffffff</span>: White
- **Backdrop**: <span style="color: #121212; text-shadow: -1px -1px 0 #3c3c3c, 1px -1px 0 #3c3c3c, -1px 1px 0 #3c3c3c, 1px 1px 0 #3c3c3c;">#121212</span>: Black
- **Accent**: <span style="color: #8fdfd4;">#8fdfd4</span>: Spearmint Teal

### Typography

I self-host this site's fonts using [variable](https://fonts.google.com/knowledge/using_variable_fonts_on_the_web) [woff2](https://github.com/google/woff2) files. Variable fonts significantly cut down on the file size, allowing the site to load faster. I sourced the fonts from the [Variable Font Helper](https://variable-font-helper.web.app/) app, which sources them from [Google Fonts](https://fonts.google.com/).

- **Primary Font**: I use [Nunito](https://fonts.google.com/specimen/Nunito) as the primary font, for its sleek [neo-grotesque](https://fonts.google.com/knowledge/glossary/grotesque_neo_grotesque) design and its support for both [Latin](https://en.wikipedia.org/wiki/Latin_script) and [Cyrillic](https://en.wikipedia.org/wiki/Cyrillic_script) glyphs.
- **Secondary Font**: I use [Sen](https://fonts.google.com/specimen/Sen) as the font for headings. There are many subtle differences between Sen and Nunito, but the most noticeable is the lack of rounded strokes. Sen looks sharper and more angular than Nunito.
- **Monospace Font**: I use [Fira Code](https://fonts.google.com/specimen/Fira+Code) for all [monospace](https://fonts.google.com/knowledge/glossary/monospaced) text, like code blocks, ASCII art, or inline code spans.
- **Display Font**: I use [Kenia](https://fonts.google.com/specimen/Kenia) for the "404" numerals on [this site's 404 page](/404).

### Special Effects

- **Blur**: I love [glassmorphic](https://css.glass/) blur effects, but due to performance concerns, I've only used it in the header and footer. If some mathematician figures out how to cheaply perform a [gaussian blur](https://en.wikipedia.org/wiki/Gaussian_blur) over a large sample space, I want to be the first to know so I can add a subtle blur to the main panel without tanking performance.
- **Tilt Cards**: The cards on the [home page](/) respond to the mouse by tilting in 3D. I used the [vanilla-tilt.js](https://micku7zu.github.io/vanilla-tilt.js/) library for this.
- **404 Page Rings**: [The 404 page](/404) features a rotating grid of concentric rings of dots that also reacts to your mouse. I was inspired by [GitHub's 404 page](https://github.com/404) that cheekily says "this is not the web page you're looking for". GitHub's 404 page is always a delight. I hoped to emulate that with my own 404 page.

## Lighthouse

As of August 31, 2025, the site earns a perfect 100 on [Google Lighthouse](https://developer.chrome.com/docs/lighthouse).

[![A Lighthouse analytic page showing 100 performance, 100 accessibility, 100 best practices, 100 SEO](~/lighthouse-2025-08-31.webp)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fcolourlessspearmint.github.io%2F)

According to [official Lighthouse documentation](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): "A perfect score of 100 is extremely challenging to achieve and not expected".

My site's performance is largely due to it being lightweight and carefully optimized.

*All* of my site's content is present in the HTML. Unlike some sites that use [JSX](https://react.dev/learn/writing-markup-with-jsx) and [client-side rendering](https://developer.mozilla.org/en-US/docs/Glossary/CSR) to dynamically [hydrate](https://en.wikipedia.org/wiki/Hydration_(web_development)) their pages using JavaScript, my site uses Hugo to render all content at build time. This uses much less processing power on your device and makes the page load much faster.

Each page only loads the resources that it needs. This was a pain to set up with Hugo, but the result is that each page layout has a list of resources that it uses, and Hugo automatically generates a layout-specific asset for the page that only includes the necessary styles or scripts. This minimizes the data that needs to be downloaded, uses less cellular data, and allows the page to load faster.

## Privacy

This site does not use cookies, trackers, analytics, or any external telemetry tools. This is partially because I care about your privacy, but mostly because I don't care about your personal information. Your data remains yours because I don't want it.

## Accessibility

This site is designed to be accessible to as many users as possible. I've done my best to follow best practices regarding meta tags, semantic markup, keyboard navigation, and alt text.

## Authoring

Each post (including the words you're reading right now) is written in Markdown. I occasionally use custom [Hugo shortcodes](https://gohugo.io/content-management/shortcodes/) for things like iFrames.

I use the [Zed editor](~/switchingtozed) all of my coding and most of my writing, but I write the longer and more heavily-researched posts in Obsidian.

I use [Hugo's live server](https://gohugo.io/commands/hugo_server/) to instantly (I've never seen it take longer than 100 milliseconds for a refresh) render the site locally so I can see what it looks like before publishing.

## Conclusion

My personal website is one of my favorite projects I've ever made. I've worked on it for longer than any other project, and I'm still adding new features and learning new things.

I'm proud of my little corner on the web, and I hope you enjoy it as much as I do. Thanks for reading.

~Ethan
