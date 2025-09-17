---
title: This site uses Hugo now
date: 2025-07-10
tags: [programming, webdev, personal website]
description: I switched from using my custom Python SSG to using Hugo
---

![A faithful replication of the official Hugo banner used in their documentation, with the text modified to read 'Switching to Hugo'](~/hugo-banner.webp)

Up until yesterday, I wrote all of my posts in [Mint Flavoured Markdown](/posts/mfm) and rendered them into HTML with a Python script I wrote called build.py. build.py was very helpful in simplifying the process of writing new posts. The final version of build.py is archived [here](https://github.com/ethmarks/ethmarks.github.io/blob/b194fe064cbbc43dc714fbde7b27d47dfcad262f/build.py).

I spent nearly a month developing build.py, so the speed at which I completely abandoned it in favour of [Hugo](https://gohugo.io/) says something about how much I like it.

## Reasoning

Many of my [projects](/tags/projects) were developed in an effort to solve a current problem or avoid a future problem. This switch to Hugo is not one of them. build.py worked perfectly fine, I just felt like Hugo was much better than what I currently had.

### Performance

Hugo is breathtakingly fast. As of today (July 10), a full Hugo build of my site takes 125 milliseconds.

![My Hugo site takes 125 milliseconds to build 85 pages and 60 static files](~/hugo-build-screenshot.webp "A full Hugo build takes 125 milliseconds")

125 milliseconds is too short of a time for humans to intuitively understand, so I'll use an analogy to try to put it into perspective. 125 milliseconds is roughly the time that it takes sound to travel 42.9 meters (140.7 feet), or about the length of one and a half basketball courts. So if you were standing one and a half basketball courts away from me, and I blasted an air horn and started a Hugo build at exactly the same time, the Hugo build would finish before you heard the air horn.

But it gets better. Hugo provides a [live development server](https://gohugo.io/commands/hugo_server/) via the `hugo server` command that rebuilds the site each time a file is changed. To save time, it only rebuilds the pages that use the modified file. This speeds up builds dramatically because it's only reprocessing a small part of the site. Currently, single-page rebuilds take about 9 milliseconds (I've seen it at 3ms a few times, but it averages closer to 7-10). That's about the time it takes sound to travel 3.1 meters (10.2 feet). If you're talking to someone from across an office or classroom or whatever, the time that it takes for the words to leave your mouth and arrive at their ears is longer than the time it takes for Hugo to rebuild a single page. Obviously, this is basically instantaneous. The difference between rebuilding a page once and rebuilding it two dozen times is basically negligible: It's still an order of magnitude faster than the blink of an eye.

In contrast, build.py took around 3 seconds (3000 milliseconds) to build (and sometimes even longer), and didn't have the functionality to only rebuild specific pages. 3000 milliseconds is enough time for me to rebuild a single page with Hugo 330 times, rebuild the entire site with Hugo 24 times, or furiously blink at my computer 12 times (assuming a 100 millisecond blink time and a 150 millisecond refractory period).

Hugo and build.py aren't even in the same league in terms of build speed. This is largely due to the fact that Hugo is written in Go, while build.py was written in Python. Go is a [compiled language](https://en.wikipedia.org/wiki/Compiled_language), while Python is an [interpreted language](https://en.wikipedia.org/wiki/Interpreter_(computing)). Another significant factor is optimization: Hugo was created by a team of highly talented developers who optimized it to run very quickly. build.py was created by a single Me who didn't optimize it at all.

### Built-in Functionality

Hugo has a lot of features, and all of them are built-in, meaning I didn't have to code them. For example, Hugo natively handles [tags](/tags), which it calls [taxonomies](https://gohugo.io/content-management/taxonomies/) for some reason. build.py had tags too, but they were a lot of work to implement and added a lot of complexity. Hugo's taxonomies were still a lot of work for its developers to implement (much more than my crude tags system), but critically *I didn't have to do any of that work*, so it isn't relevant.

### Modularity

Hugo strongly encourages [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (Don't Repeat Yourself) code. For example, each page's [head](https://developer.mozilla.org/en-US/docs/Web/API/Document/head) section (that defines things like the [favicon](https://developer.mozilla.org/en-US/docs/Glossary/Favicon) and page title) is defined exactly once in the entire codebase: in `layouts/_default/baseof.html`. Every single layout (including posts like this one, taxonomy pages, etc.) is rendered from the same basic template.

I could have implemented something like this in build.py (at the expense of performance and complexity), but I didn't, so each template had to redefine things like the head section. This approach gave me slightly more flexibility, but came at the cost of adding a bunch of repetitive definitions I had to manually synchronize across templates.

### Shortcodes

Hugo also includes [shortcodes](https://gohugo.io/content-management/shortcodes/), which are inline templates, very similar to the [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) that I was using before. The big difference is that shortcodes render at build time, whereas Web Components render on page load. With Web Components, *your* device had to render the templates, which introduced performance overhead, used your electricity, and meant that if you just refused to render it (by turning JavaScript off), my site didn't work. Hugo shortcodes give me the same templating functionality without sacrificing performance or compatibility.

### Established and Proven

As much as making your own versions of existing tools is smiled upon for personal projects, it's often frowned upon in a professional setting. It's impractical and selfish to waste developer time on making a worse version of something that already exists, so learning how to use industry standard frameworks is important to being a useful developer. Hugo is a mature, widely-used SSG, whereas build.py was not.

## Tradeoffs

There are a few consequences of switching to Hugo, though.

### Less Powerful

To process and render templates, build.py used hardcoded Python functions that searched for text that matched a regex, extracted it, processed it, and injected the result back in. For example, there was one function, `parse_iframe()`, that implemented the [MFM iframe tag](/posts/mfm#iframes).

```python
def parse_iframe(body):
    # This function finds MFM iframe syntax ![[$title]]($url) and replaces it with an iframe tag.
    pattern = r"!\[\[([^\]]+)\]\]\((.*?)\)"
    replacement = r'<iframe scrolling="no" title="\1" src="\2" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>'
    return re.sub(pattern, replacement, body)
```

Hugo, on the other hand, uses the [Go templating language](https://pkg.go.dev/html/template) for layouts and shortcodes, which I didn't even know existed until I started using Hugo. It's a very nice language that's simple, extensible, and elegant, but it just isn't as powerful as Python. build.py didn't have any functions that required powerful processing capabilities, but it's conceivable it might have eventually.

For example, maybe I decide to add an AI-generated summary to each post (to be clear, I have no intentions of doing this). With Python, this is extremely simple: literally just a few lines of code to implement a subprocess to [Ollama](https://ollama.com/). With Hugo, I can't do anything like that (unless I want to use an API, in which case I could make clever usage of [resources.GetRemote](https://gohugo.io/functions/resources/getremote) to dynamically call the Gemini API). Hugo doesn't support running local commands (probably because of the massive security risk it would pose) complex image processing, nor lots of other stuff, so I'm limited to its extensive but limited built-in functionality. And besides, most of the things that I could *technically* do in Hugo would involve extremely convoluted and complicated logic chains to do something that could be done much easier in Python.

### Less Charm

There's a certain air to being able to say "I made this without any frameworks" on my [personal website's project page](/posts/personalwebsite) gives. I'm going to call it "charm", but it's probably closer to "smugness". Anyways, using a prebuilt SSG like Hugo means that I can't honestly claim that this site is built using only my own tools. I think that this significantly reduces the overall charm of the site.

There are a few asterisks to this...

1. I still made almost everything else myself
2. I proved that I was capable of making an SSG that accomplished basically the same thing
3. I switched to Hugo out of pragmatism because I'm capable of flinching from my dogma

...but there's no getting around that the SSG is a very important part of any static site, and the one I'm using wasn't made by me.

### Less Flexible

Hugo has a prebuilt and opinionated site structure. All Markdown content must go in the `content/` directory. All HTML templates must go in the `layout/` directory. Things like that.

This is a *very* minor drawback, and Hugo's structure is quite reasonable and is extremely close to what I was using before, but if I wanted to structure my site in a different way, I wouldn't be able to do it.

With build.py, I could structure my site however I wanted. If I decide that Markdown files must be in a directory called `html/`, I just need to change a few lines of code to make that happen. I enjoyed the freedom to do whatever I liked no matter how <s>stupid</s> creative it was, and I don't have that with Hugo.

## Conclusion

I didn't make the decision to switch to Hugo lightly, but I'm pretty happy with my choice overall. Porting my site to Hugo was a valuable learning experience, Hugo's `server` command is an extremely convenient authoring tool for writing posts, and I was spared from having to come up with a new name for build.py because that extremely generic name based on the filename wasn't going to work for much longer.

~Ethan
