---
title: Thessa v1
published: 2025-05-21
tags: [programming, github, webdev, ai]
description: An AI-powered thesaurus
github: https://github.com/ethmarks/thessa/tree/745a7ba29eea522d655c7330434ba60506f60ad6
---

_Note: This page is a retrospective on an older version of [Thessa](/posts/thessa), my AI-powered thesaurus. The publication date (May 21, 2025) represents the creation date of Thessa v1, not the date that I wrote this post (December 31, 2025). The original post is archived [here](/posts/thessa-archive)._

![A screenshot of the Thessa v1 interface showing synonyms for the word 'screenshot'](~/thessa_2025-09-23.webp)

In May 2025, I made Thessa v1, an AI-powered thesaurus.

Thessa v1 was my second published website (my first was my [personal website](/posts/personalwebsite)), and I built it to streamline the process of asking LLMs for synonyms to specific words and phrases.

## Tech Stack

Thessa v1 went through a decent amount of iteration before I completely rewrote it for [Thessa v2](/posts/thessa).

### Frontend

At the start, Thessa was a single HTML file that lived in the `static/` directory in my personal website. All of its styling and logic was contained within inline `<style>` and `<script>` tags.

Later, I moved Thessa to its own repository (rather than having it live in my personal website's repo). I also separated the styling into `style.css` and the logic into `script.js`.

Then I added [Vite](https://vite.dev/) to the Thessa. It was still using vanilla HTML, CSS, and JS, but it was being processed through Vite. I did this because I wanted Vite's asset minification, cache busting, and bundling capabilities and because I thought that Vite was interesting.

### LLM Provider

Initially, Thessa v1 was powered by the Gemini API. The Gemini API requires an API key in order to work, so I needed to find a way to provide one. The standard way of doing this is to use a server-side function. Because Thessa was purely a static site, I couldn't use any server-side functions. My next idea was to just hardcode an API key. This was a terrible idea because it would have allowed anybody and everybody to use my Gemini API key for their own projects, using up my API limits and making it so that legitimate Thessa users would be locked out. So instead I settled on a BYOK (Bring Your Own Key) approach. Thessa didn't have any keys by default, and users would use their own keys to access it. This was an easy solution, but it added a huge amount of friction for people who want to try out Thessa.

Then, in November 2025, I discovered no-auth LLM APIs like [ch.at](https://ch.at/) (link might not work because I think it shut down a while ago) and [llm7.io](https://llm7.io/)'s Anonymous tier. So I created and merged [this PR](https://github.com/ethmarks/thessa/pull/1) that switch Thessa from Gemini API to using ch.at and llm7.io's free APIs. This meant that Thessa no longer required users to bring their own keys, which made it much more convenient and accessible.

### Hosting

Thessa v1 was hosted on GitHub Pages. I chose GitHub Pages because it was the only hosting platform that I knew how to use and because it was where my personal website was already hosted.

## Features

The central principle behind Thessa is utility and convenience. Thessa v1 had lots of little features to improve the user experience and reduce friction. For example, upon loading, Thessa v1 immediately displayed the input bar and focused it. There was no landing page, no introduction, and no entrance animation. Likewise, rather than having to fiddle with selecting the synonym or having to type it out manually, you could just double-click on a synonym to instantly copy it to your clipboard. And rather than having to look up the synonym in a dictionary, you could just click on a synonym to pull up its definition in order to gauge the shades of meaning.

## Prompts

These are the prompts that Thessa v1 used. They've gone through lots of tweaking and iteration, but these are the final prompts before the Thessa v2.

### Synonyms

> You are a sophisticated thesaurus that provides ${count} diverse alternatives for any input.
>
> Input: "${word}"
>
> Instructions:
>
> 1. If the input is a SINGLE WORD:
>    - Provide ${count} diverse synonyms
>    - Mix common everyday words and rare archaic words
> 2. If the input is a PHRASE or MULTIPLE WORDS:
>    - Provide ${count} synonymous phrases or expressions
>
> Always return exactly ${count} synonyms, newline separated. Your response will be interpreted by a script, so include only the newline-separated list without any other text. Do not use commas, asterisks, or dashes.`;

### Definitions

> You are a comprehensive dictionary that defines any input intelligently.
>
> Input: "${word}"
>
> Instructions:
>
> 1. If the input is a REAL WORD:
>    - Provide (part of speech) followed by concise definition
>    - For multiple meanings, separate with semicolons
>    - Use clear, accessible language
> 2. If the input is a PHRASE:
>    - Provide (phrase) followed by explanation of meaning/usage
>    - Focus on the overall concept or idiom meaning
>
> Examples:
>
> - "bank" → "(noun) A financial institution; the edge of a river"
> - "sprint" → "(verb) To run at full speed over a short distance; (noun) A short, fast run"
> - "break down" → "(phrase) To stop functioning; to analyze in detail"
>
> Return only the definition without introductory text.

## Conclusion

Over the 224 days that I used Thessa v1, I found it quite useful. It consistently provided more interesting synonyms than Google did, and it was extremely easy to use. I don't know if anyone else got any value out of it, but I know that I did.

~Ethan
