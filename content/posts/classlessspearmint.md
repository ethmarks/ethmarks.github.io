---
title: ClasslessSpearmint
date: 2025-07-20
tags: [webdev, programming, ai, codepen]
description: ClasslessSpearmint is a Classless CSS style that aesthetically styles raw HTML with my website's theme without needing to assign HTML classes
link: https://github.com/ethmarks/ClasslessSpearmint
link_name: GitHub Repo
link_icon: github
---

Whenever I throw together a simple [CodePen](/tags/codepen) for a quick demo (e.g. for my [text scramble animation](/posts/scrambleanim)), I usually include this single line of code.

```css
@import url("https://cdn.jsdelivr.net/npm/yorha@1.2.0/dist/yorha.min.css")
```

What this snippet does is import [Yorha](https://www.cssbed.com/yorha/), a [Classless CSS](https://css-tricks.com/no-class-css-frameworks/) theme.

## What is Classless CSS?

Most CSS is custom-written for a specific page or site. This allows web developers to customize the content presentation (you know, the whole point of CSS), but it takes time to write and includes a lot of boilerplate.

Classless CSS is a generic, one-size-fits-all, drop-in solution that styles raw HTML elements. It's whole purpose is to make raw HTML look nice without any effort.

My introduction to Classless CSS was [cssbed.com](https://www.cssbed.com/), a neat website that demos 27 different Classless CSS themes. After trying every single one of them, I settled on Yorha as my favorite. Yorha provides a nice minimalist beige palette, sleek button hover effects, and doesn't try to center the content.

I used Yorha for my CodePen demos so that they weren't just plain unstyled HTML, and so that I didn't have to spend time writing CSS for each demo (I spent enough time writing CSS as it is).

## ClasslessSpearmint

Earlier today, I wondered what my website's theme would look like as Classless CSS.

In the spirit of Classless CSS (i.e. laziness), I fed my site's main CSS file, `spearmint.css`, alongside `yorha.css` to Gemini 2.5 Pro with the following prompt:

> I'm providing you with two CSS files. One, Yorha, is classless and has a beige theme. The other, Spearmint, is not classless and has a sleek teal theme. I want you to make a new CSS file: a classless sleek teal theme. In other words, follow the format of Yorha but the aesthetic of Spearmint. Make sure that all elements styled in Yorha show up in your CSS.

It spat out 383 lines of CSS. I call it `classlessspearmint.css`.

I was impressed by how good of a job Gemini did. It followed my site's aesthetic pretty well, and also added support for a bunch of HTML features that I never use and didn't implement, like the `<mark>` tag that highlights text.

## Demo

I wanted to test ClasslessSpearmint out, but I think that the HTML demo on cssbed.com is a bit lackluster.

So I went back to Gemini and asked for a Classless CSS test suite. After several rounds of feedback ("Why are you using classes? That completely subverts the entire point of this exercise. Try again."), it responded with a nice HTML page that does a good job demoing lots of different HTML elements. Also, at my request, all of the [lorem ipsum](https://en.wikipedia.org/wiki/Lorem_ipsum) text is [centered around salt](/posts/saltassociation).

Here's what the test suite looks like with ClasslessSpearmint applied.

{{< iframe src="https://ethmarks.github.io/ClasslessSpearmint/spearmint_demo.html" title="ClasslessSpearmint Test Suite" >}}

If you'd like to compare them, here's the same demo but using Yorha.

{{< iframe src="https://ethmarks.github.io/ClasslessSpearmint/yorha_demo.html" title="Yorha Test Suite" >}}

## Usage

If you'd like to use ClasslessSpearmint yourself, just include this line in your HTML head.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ethmarks/ClasslessSpearmint@main/classlessspearmint.css">
```

Or you can include this line at the top of a CSS stylesheet.

```css
@import url("https://cdn.jsdelivr.net/gh/ethmarks/ClasslessSpearmint@main/classlessspearmint.css");
```

## Conclusion

I'm undecided as to whether I'm going to use ClasslessSpearmint for future unstyled CodePen demos. It definitely fits in better with my site's aesthetic, but I'm not sure if I prefer stylistic consistency or the minimalism provided by Yorha. Regardless, it's pretty interesting to see my site's entire theme compressed into a Classless CSS file.

~Ethan
