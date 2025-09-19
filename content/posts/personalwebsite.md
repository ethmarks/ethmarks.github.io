---
title: Personal Website
date: 2025-05-14
tags: [projects, programming, webdev, personal website]
description: The website you're reading right now
link: https://github.com/ethmarks/ethmarks.github.io
link_name: GitHub Repo
link_icon: github
---

My personal website is my home on the web.

{{< iframe src="/index.html" alt="homepage" >}}

I made this site because I want to have an online presence, but I didn't want to use social media or a premade blogging platform (e.g. [Blogger](https://www.blogger.com) or [Tumblr](https://www.tumblr.com/)).

I decided that it would be more interesting to start from scratch, so I designed, built, and published a site of my own.

## Build

This site uses [Hugo](/posts/hugoswitch) to render my [Markdown](https://en.wikipedia.org/wiki/Markdown) content to my [HTML](https://en.wikipedia.org/wiki/HTML) templates. I also use Hugo for things like [asset minification](https://gohugo.io/functions/resources/minify/) and [Sass transpiling](https://gohugo.io/hugo-pipes/transpile-sass-to-css/). I love Hugo because it's feature-rich, extremely fast (it takes less than a tenth of a second for a full build), and does exactly what I want it to.

### History

In the beginning, this site didn't have *any* build step, and I wrote every line of HTML, CSS, and JavaScript by hand. This approach was extremely tedious, so I only wrote a few posts like this.

On June 6, 2025, I switched to [build.py](https://github.com/ethmarks/ethmarks.github.io/blob/b194fe064cbbc43dc714fbde7b27d47dfcad262f/build.py), a custom SSG I wrote in [Python](https://en.wikipedia.org/wiki/Python_(programming_language)). Build.py was an acceptable solution, but it was slow, complex, and was very limited in what it could do. I eventually solved this on July 10 by [switching to Hugo](/posts/hugoswitch).

## Hosting

![A screenshot of the GitHub Actions tab, showing a successful job titled 'Merge pull request #16 from ethmarks/load-asset-refactor #83'. The job took 36 seconds. The job has a build step and a deploy step. The job produced a 13.4 megabyte artifact titled 'github-pages'.](~/gh_pages_workflow_2025-09-18.webp)

To host the site on the World Wide Web, I use [GitHub Pages](https://pages.github.com/). This is why the site url includes ".github.io". Every time I push new code, GitHub automatically redeploys this site. The main reason I'm using GitHub Pages is convenient: I'm already using GitHub for source control, so it was easy to just add a [GitHub Action to deploy the site](https://github.com/ethmarks/ethmarks.github.io/blob/main/.github/workflows/hugo.yaml). My second choice would probably have been [Neocities](https://neocities.org/) for hosting.

## Styling

My site has a very specific aesthetic that I find quite pleasing. The aesthetic is the culmination of my [spearmint colour palette](#colour-palette), modern [typography](#typography), and careful use of [effects](#special-effects), all brought together with thousands of lines of [Sass](#sass) code.

### Sass

This site is styled with [Sass](https://en.wikipedia.org/wiki/Sass_(style_sheet_language)), a CSS preprocessor that adds useful features to CSS, like [mixins](https://sass-lang.com/documentation/at-rules/mixin/), [variables](https://sass-lang.com/documentation/variables/), and [build-time imports](https://sass-lang.com/documentation/at-rules/import/).

This site's Sass is transpiled using [LibSass](https://sass-lang.com/libsass/). LibSass is an old Sass transpiler that's been deprecated since 2020. The only reason I use LibSass is that I was having trouble setting Hugo up with [Dart Sass](https://sass-lang.com/dart-sass/) (the modern and recommended transpiler), because it kept causing timeout errors that were inconsistent and very difficult to debug. I eventually just gave up and switched to LibSass. This means that I can't use any of the new Dart Sass features like [@use](https://sass-lang.com/documentation/at-rules/use/), so I use [@import](https://sass-lang.com/documentation/at-rules/import/) instead.

Every page layout has its own Sass file that imports the modules that page needs. For example, here's the annotated Sass file for [my posts page](/posts/).

```scss
/* Import global styles used by every page */
/* This includes things like fonts, the header, and the backdrop */
@import 'global';

/* Import the post-link component */
@import 'components/post-link';

/* Import the post-tag component */
@import 'components/post-tags';

/* Import the random post button component */
@import 'components/random-post-btn';
```

These Sass files are then transpiled into normal CSS and imported into the page using some custom [partials](https://gohugo.io/functions/partials/include/) I wrote that take a file name as an input and automatically minifies and transpiles the asset, and then generates the HTML import for that file. For example, here's the code at the top of [the posts index page](/posts).

```go-html-template
{{ partial "css.html" "posts.scss" }}
{{ partial "js.html" "components/randompost.js" }}
```

And here's the HTML that the partial generates. Note that it transpiled the SCSS into CSS, minified both assets, and added `defer` to the script.

```html
<link rel="stylesheet" href="/css/posts.min.css" />
<script src="/js/components/randompost.min.js" defer></script>
```

### Responsive Design

This site looks different depending on the size and dimensions of the screen used to view it. For example, the header is a floating capsule on desktop, but takes up the whole width of the screen on mobile. Likewise, hover effects and mouse interactivity are disabled if you don't have a cursor (for example, on a mobile device).

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

**404 Page Rings**: [My 404 page](/404) features a rotating grid of concentric rings of dots that also reacts to your mouse. I was inspired by [GitHub's 404 page](https://github.com/404) that cheekily says "this is not the web page you're looking for" with an Octocat dressed as Obi-Wan Kenobi. Getting a 404 on GitHub is always delightful, and I tried to emulate that with my own 404 page by adding a fun visual effect.

**Mint Gradient**: All `<h1>` elements have a mint gradient applied to them. This gradient starts off at the standard **<span class="mint">spearmint teal</span>** accent color, and then fades into the standard white text color. This also applies to the title on the left side of my site header. This adds polish and branding.

**Header Blur**: I love [glassmorphic](https://css.glass/) blur effects, so I added a 20 pixel gaussian blur effect to my site header. For performance reasons, the header is the *only* element on the site that has a significant gaussian blur. When I was first designing this site, I put blurs everywhere, including on the article background. Turns out, this makes the page really, really, really slow. Blurring the header adds polish, and *not* blurring anything else adds frames per second.

**Header Nav Indicator**: The nav links in my site header glow when the current page is on their domain. Currently, the "Posts" nav link is glowing because you're on a post ([/posts/personalwebsite](/posts/personalwebsite)). On [my About page](/about), the "About" nav link glows. On [my Home page](/), the "Home" nav link glows. On my Projects page(/tags/projects), the "Projects" nav link glows. This helps with readability and polish.

**Header Birthday Mode**: On my birthday (September 13), my site header glows pinkish-orange, the title on the left side strobes between pastel red, cyan, blue, sage, orange, and pink, and the cake and party emojis (🎂🎉) are appended to the title. This helps with "yay its my birthday".

**Home Page Intro Text**: When [my Home page](/) first loads, the intro text starts off blurred and slightly floating, but then each character blurs and drops into place in sequence. This entrance animation adds polish.

**Home Page Profile Picture Click**: If you click on my profile picture (the spearmint crystal thing) on [my Home page](/), the intro text expands (by adjusting the letter spacing) and activates several animations. The "Ahoy! I'm" flips 180 degrees in 3D space, the "Ethan Marks" glows and has a subtle 3D tilt, and the "Software Developer" turns teal. I added this because people kept trying to click on my profile picture and being disappointed that nothing happened, so I made something happen. This adds a fun bit of interactivity.

## Lighthouse

As of August 31, 2025, the site earns a perfect 100 on [Lighthouse](https://developer.chrome.com/docs/lighthouse). Lighthouse is a tool developed by Google that audits web pages for performance and accessibility. A higher score means that the page loads more quickly and is more accessible. According to [official Lighthouse documentation](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): "A perfect score of 100 is extremely challenging to achieve and not expected".

[![A Lighthouse analytic page showing 100 performance, 100 accessibility, 100 best practices, 100 SEO](~/lighthouse-2025-08-31.webp)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fethmarks.github.io%2F)

My site's performance is largely due to it being lightweight and carefully optimized.
- **Static Rendering**: All of my site's content is present in the HTML. Unlike some sites that use [JSX](https://react.dev/learn/writing-markup-with-jsx) and [client-side rendering](https://developer.mozilla.org/en-US/docs/Glossary/CSR) to dynamically [hydrate](https://en.wikipedia.org/wiki/Hydration_(web_development)) their pages using JavaScript, my site render all content at build time. This uses much less processing power on your device and makes the page load much faster.
- **Optimized CSS and JS**: Each page on my site only loads the resources that it needs, and the resources that it does import are minified. I used custom partials to automate this process slightly, as discussed in the [Sass section](#sass). This per-page approach minimizes the data that needs to be downloaded and allows the page to load faster.
- **Optimized Images and Videos**: The images, videos, and animations on my website use the [WebP](https://en.wikipedia.org/wiki/WebP) and [WebM](https://en.wikipedia.org/wiki/WebM) formats, which allows them to load faster and use less data.

## Privacy

This site does not use cookies, trackers, analytics, or any external telemetry tools. This is partially because I care about your privacy, but mostly because I don't care about your personal information. Your data remains yours because I don't want it.

## Accessibility

This site is designed to be accessible to as many users as possible. I've done my best to follow best practices regarding meta tags, semantic markup, keyboard navigation, and alt text.

## Authoring

Each post (including the words you're reading right now) is written in Markdown. I occasionally use custom [Hugo shortcodes](https://gohugo.io/content-management/shortcodes/) for things like iframes, but I mostly stick with plain Markdown syntax.

I use the [Zed editor](~/switchingtozed) for all of my coding and most of my post writing, but I write the longer and more heavily-researched posts in [Obsidian](https://obsidian.md/).

I use [Hugo's live server](https://gohugo.io/commands/hugo_server/) to instantly (I've never seen it take longer than 100 milliseconds for a refresh) render the site locally so that I can see the changes I make in real time.

## Conclusion

My personal website is one of my favorite projects I've ever made. I've worked on it for longer than any other project, and I'm still adding new features and learning new things.

I'm proud of my little corner on the web, and I hope you enjoy it as much as I do. Thanks for reading.

~Ethan
