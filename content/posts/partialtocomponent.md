---
title: "Dynamically converting a Hugo partial into a Web Component"
date: 2025-09-24
tags: [personal website, programming, webdev, zed, ai, automation]
description: "I used Hugo's resources.FromString to dynamically convert my site's header and footer into Web Components"
---

It's been quite a while since my last post here. I've been pretty busy with school stuff, but I've still found time to make several major changes to this site. Highlights include:

- Switching from CSS to Sass
- Completely redesigning my home page
- Self-hosting all assets including fonts
- Making lots of improvements to DX by abusing Hugo templates

As a developer who cares very deeply about DRY (Don't Repeat Yourself) and also understands the value of brand consistency, I've spent a substantial amount of time trying to come up with ways to reuse the exact same assets and styles across different projects.

For example, I created [ClasslessSpearmint](/posts/classlessspearmint) so that rather than duplicating the same styles across many different projects, I can just [add a single line of HTML](/posts/classlessspearmint#usage) to any page, and as if by magic the page will have my site's styles and aesthetic.

ClasslessSpearmint was already basically enough to make any page look like it belongs on my site. The only thing that was missing was my site header and my site footer.

In order to recreate the header and footer, I need two things: the layout (HTML) and the styling (CSS).

## Styles

Inserting styles into a webpage is easy: I just need to include a link to the CSS. I created a new file in my personal website, `components.scss`, that imports the header and footer styles to combine them into one SCSS file:

```scss
/* components.scss */
@import 'components/header';
@import 'components/footer';
```

Normally I'd need to publish `components.scss` in order to use it, but I created a Hugo template a while ago that automatically transpiles and publishes all SCSS files. Here's what it looks like, if you're curious.

```go-html-template
<!-- publish-scss.html -->
{{ range resources.Match "css/*.scss" }}
  {{ $css := . | toCSS }}
  {{ $cssMin := $css | minify }}
  {{ $css.Publish }}
  {{ $cssMin.Publish }}
{{ end }}
```

So all I need to do to import the component styles into another project is include this line of HTML:

```html
<link rel="stylesheet" href="https://ethmarks.github.io/css/components.min.css">
```

These component styles combined with ClasslessSpearmint provide all the styles necessary to imitate my site's aesthetic.

## Layout

Now for the tricky part, the HTML layout.

Here's what the HTML for my footer looks like as of the time of writing. The header's HTML is a little bit more complicated, but not by much.

```html
<!-- footer.html -->
<footer>
    <span id="repo">
        <a href="https://github.com/ethmarks/ethmarks.github.io" target="_blank">Website Source</a>
    </span>
    <span id="copyright"><a href="/about/">Ethan Marks</a>, &copy;2025</span>
    <span id="email">
        <a href="mailto:colourlessspearmint@gmail.com" target="_blank">Contact</a>
    </span>
</footer>
```

There are a few ways of dynamically inserting HTML into a page.

### Just Copy-Paste it

One approach is to just copy-paste the full HTML snippet into each page. This is by far the simplest solution, but it violates DRY.

The header and footer combined are a mere 18 lines of HTML. This is well within "why even bother with DRY" territory.

The reason I'm going to bother anyways is that I really, really care about DRY. I don't really have a rational justification for caring as much as I do, it's just that the idea of copy-pasting the exact same code in multiple places makes me uncomfortable.

So copy-pasting is out of the question. We'll need a clever way to insert the HTML dynamically while still operating from a single source of truth.

### Web Components

The way that this site inserts HTML is by using Hugo partials, but this only works with Hugo. The best universal solution is to use JavaScript Web Components. Web Components are [supported by basically every browser](https://caniuse.com/custom-elementsv1) and only use JavaScript, meaning they'll work on every device and with every build process.

The only question is how to get the data from the HTML partials into a JavaScript file.

### Zed Agent

I was curious to see how the [Zed Agent](https://zed.dev/agentic) would approach this problem without any supervision. I had no intention of using the code that it came up with, but I thought that this would be a good opportunity to experiment with vibe coding. I set Zed to use Claude Sonnet 4 and gave it the following prompt.

> **User**  \
> I want a script, accessible at `/js/ethmarks-components.js`, that defines two Web Components whose content is the same as @header.html and @footer.html. It is absolutely cardinally important that the code be DRY, so you can't just copy the HTMl. Instead, you'll have to do something clever with Hugo that dynamically creates a JS file and publishes it.
>
> The end result should be as such:
>
> - A script accessible at `/js/ethmarks-components.js`, that defines two Web Components whose content is the same as my header and footer
> - The current header and footer partials remain as they are, so the rest of the site continues to work
> - The header and footer partials remain the ONLY place in the codebase where the header and footer are defined
>
> You may use whatever Hugo magic you deem necessary.

It spent a few minutes reading my existing files, writing new ones, testing if the site built without errors (it often did not), and continued iterating until it had something that worked.

Its solution was *really* dumb.

It ignored my instruction to create the JS file dynamically and opted instead to make a static JS file that fetches the HTML content from a pseudo-dynamic API that it also created.

Here's the JS script it created to fetch that API data.

```js
// components.js
const apiURL = '/api/index.json'

class SiteHeader extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            this.innerHTML = data.header;
        } catch (error) {
            console.error('Failed to load header:', error);
            this.innerHTML = '<header><a href="https://ethmarks.github.io">Ethan Marks</a></header>';
        }
    }
}

class SiteFooter extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            this.innerHTML = data.footer;
        } catch (error) {
            console.error('Failed to load footer:', error);
            this.innerHTML = '<footer><span>Ethan Marks, &copy;2025</span></footer>';
        }
    }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
```

Here's its Hugo template to create a JSON file containing the header and footer HTML.

```go-html-template
<!-- list.API.json -->
{{ $data := dict
      "header" (partial "header.html" .)
      "footer" (partial "footer.html" .)
}}
{{ $data | jsonify (dict "indent" "  ") }}
```

Here's its markdown index file to force Hugo to render the JSON template.

```md
---
title: API
outputs:
  - API
---
```

And here are the changes it made to my Hugo config to create the "API" output format.

```toml
# hugo.toml
[mediaTypes]
  [mediaTypes."application/json"]
    suffixes = ["json"]

[outputFormats]
  [outputFormats.API]
    mediaType = "application/json"
    baseName = "index"
    isPlainText = true
    notAlternative = true
```

This solution is bad for two reasons.

First, it's hideously overcomplicated; as you'll see later, I managed to accomplish the same thing in a single file, with *far* less code, and without messing with the Hugo config.

Second, the JS script fetches the data from an API. This introduces an extra network request, slows down the page load, and possibly causes CORS issues.

To the Zed Agent's credit, it *did* adhere to my requirements. Its solution does define the Web Components, doesn't interfere with my existing partials, and references the partials in a DRY manner. And the only thing that it cost me (other than eating into my prompt quota) was a few minutes of my time (which I spent reading [Ringworld](https://www.goodreads.com/book/show/61179.Ringworld)).

I've come to similar conclusions from my other experiments with vibe coding. If your goal is 'code that works', vibe coding is probably the easiest and most labor-efficient way to achieve that goal. But if you care even slightly about the quality of the code, AI agents tend to take shortcuts and make dumb architectural decisions.

I think that AI-assisted coding can be very helpful, but vibe coding is not the answer. Humans aren't needed in coding because we give the code "soul". We are needed because, as of the current state of technology, we are the only consistent source of the high-quality intelligence necessary for making smart decisions. I look forward to a future where that isn't true, but that future is still a ways off.

Thanks for coming to my TED talk.

## My Solution

Anyways, here's how I solved the problem.

```go-html-template
<!-- ethmarks-components-js.html -->
{{- $header := partial "header.html" . | jsonify -}}
{{- $footer := partial "footer.html" . | jsonify -}}
{{- $js := printf `// Ethmarks Web Components
// Generated automatically from Hugo partials

class EthmarksHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = %s;
  }
}

class EthmarksFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = %s;
  }
}

customElements.define('ethmarks-header', EthmarksHeader);
customElements.define('ethmarks-footer', EthmarksFooter);
` $header $footer -}}
{{- $resource := resources.FromString "js/ethmarks-components.js" $js -}}
{{- $resource.Publish -}}
```

That's it. That's the whole thing.

The only other thing I had to do was add this line to a layout somewhere on the site: `{{- partial "ethmarks-components-js.html" . -}}`.

As of the time of writing, my template produces the following JS:

```js
// Ethmarks Web Components
// Generated automatically from Hugo partials

class EthmarksHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "\u003cheader\u003e\n    \u003ca href=\"/\" id=\"title\" tabindex=\"0\" aria-label=\"Home\"\u003eEthan Marks\u003c/a\u003e\n    \u003cnav\u003e\n        \u003ca class=\"staggered\" href=\"/\"\u003eHome\u003c/a\u003e\n        \u003ca class=\"staggered\" href=\"/about/\"\u003eAbout\u003c/a\u003e\n        \u003ca class=\"staggered\" href=\"/posts/\"\u003ePosts\u003c/a\u003e\n        \u003ca class=\"staggered active\" href=\"/tags/projects/\"\u003eProjects\u003c/a\u003e\n    \u003c/nav\u003e\n\u003c/header\u003e\n";
  }
}

class EthmarksFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "\u003cfooter\u003e\n    \u003cspan id=\"repo\"\u003e\n        \u003ca href=\"https://github.com/ethmarks/ethmarks.github.io\" target=\"_blank\"\u003eWebsite Source\u003c/a\u003e\n    \u003c/span\u003e\n    \u003cspan id=\"copyright\"\u003e\u003ca href=\"/about/\"\u003eEthan Marks\u003c/a\u003e, \u0026copy;2025\u003c/span\u003e\n    \u003cspan id=\"email\"\u003e\n        \u003ca href=\"mailto:colourlessspearmint@gmail.com\" target=\"_blank\"\u003eContact\u003c/a\u003e\n    \u003c/span\u003e\n\u003c/footer\u003e\n";
  }
}

customElements.define('ethmarks-header', EthmarksHeader);
customElements.define('ethmarks-footer', EthmarksFooter);
```

The final JS isn't exactly pretty, but the source template (the code whose prettiness is actually important) is simple, concise, and follows best practices.

### How it Works

```go-html-template
{{- $header := partial "header.html" . | jsonify -}}
{{- $footer := partial "footer.html" . | jsonify -}}
```

First, the template retrieves the header and footer HTML content by using Hugo's [`partial`](https://gohugo.io/functions/partials/include) function. It then passes the content through the [`jsonify`](https://gohugo.io/functions/encoding/jsonify) function, which escapes things like brackets and newlines.

```go-html-template
{{- $js := printf `// Ethmarks Web Components
// Generated automatically from Hugo partials

class EthmarksHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = %s;
  }
}

class EthmarksFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = %s;
  }
}

customElements.define('ethmarks-header', EthmarksHeader);
customElements.define('ethmarks-footer', EthmarksFooter);
` $header $footer -}}
```

Next, it defines the JavaScript that handles the actual Web Component logic. I used `%s` to serve as placeholders where the HTML content will eventually go. The Hugo template treats the JS as one big string. After it defines the JS, it fills in the placeholders with the header and footer content.

```go-html-template
{{- $resource := resources.FromString "js/ethmarks-components.js" $js -}}
{{- $resource.Publish -}}
```

Lastly, it utilizes Hugo's [`resources.FromString`](https://gohugo.io/functions/resources/fromstring/) function to convert the filled-in JS string into a Resource, which it then outputs to a file using the [`resource.Publish`](https://gohugo.io/methods/resource/publish) function.

### Usage

To use my components all I have to do is link to `ethmarks-components.js` and to the header and footer styles via `components.css` or via some other stylesheet that includes those styles. Then all I have to do is reference the Web Components.

Here's a demo page that does exactly that.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Components Test</title>

    <!-- global.css includes site styles & component styles -->
    <link rel="stylesheet" href="https://ethmarks.github.io/css/global.min.css">

    <script src="https://ethmarks.github.io/js/ethmarks-components.js" defer></script>
</head>
<body>
    <ethmarks-header></ethmarks-header>
    <main>
        <article>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Olim erat homo quidam qui in silva habitabat. Hic vir singulis diebus ad fontem ambulabat ut aquam hauriret. Sed quadam die, cum ad fontem pervenit, vidit ibi puellam pulcherrimam capillis aureis. Puella ei dixit se esse nympham fontis et si vellet secum manere, magnam felicitatem ei daturam </p>
            <p>Vir autem, qui uxorem domi habebat et liberos tres, respondit se non posse relinquere familiam suam. Tunc nympha irascens malum carmen cantavit et statim vir in cervum conversus est. Cornua magna ei creverunt et pedes eius ungulae factae sunt.</p>
            <p>Diu per silvam errabat, suam formam humanam desiderans. Aliquando prope domum suam ibat et uxorem liberosque videbat, sed illi eum non cognoscebant. Uxor eius saepe dicebat viris vicinis maritum suum mysterioso modo evanisse.</p>
            <p>Post multos menses, cervus ad fontem rediit et nympham rogavit ut maledicto liberaret eum. Nympha, quae iam paenitentiam egerat crudelitatis suae, respondit se posse eum liberare si aliquis pro eo mortem oppeteret. Cervus tristis factus est, nam neminem noverat qui hoc faceret.</p>
            <p>Sed ecce! Canis fidelis qui eum per totam silvam secutus erat, subito in aquam saluit. Aquae magicae canem statim necaverunt, sed simul cervum in hominem retransformaverunt. Vir domum cucurrit et familiam suam amplexatus est, numquam obliturus sacrificium canis fidelis.</p>
            <p>Postea semper ad fontem revertebatur ut flores ibi poneret in memoriam canis sui, et nympha, quae nunc benigna facta erat, fonti virtutem dedit ut aegros sanaret qui cum fide ad eum venirent.</p>
        </article>
    </main>
    <ethmarks-footer></ethmarks-footer>
</body>
</html>
```

And here's what it looks when rendered.

{{< iframe src="/demos/ethmarks-components.html" >}}

It looks almost exactly like a page on my site. All that from just a few lines of HTML!

I'm already using this approach for [Thessa](https://ethmarks.github.io/thessa/). The [source code for Thessa](https://github.com/ethmarks/thessa) lives in a separate repo from my personal website, so I couldn't just use my normal Hugo partials. Instead, I used `ethmarks-components.js` to import the header and footer using Web Components. The components on Thessa look exactly the same as the components on my personal website. This is because they *are* exactly the same, right down to the HTML.

## Conclusion

I think that this approach of using Hugo's templating to dynamically convert partials into Web Components is pretty elegant. The use case is pretty niche, so I don't expect this to be very useful to other people, but just on the off chance that it is, I thought I'd write a post about it. I hope you found it helpful and/or interesting. Thanks for reading!

~Ethan
