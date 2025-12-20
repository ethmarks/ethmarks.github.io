---
title: Blips
published: 2025-12-20
created: 2025-10-07
tags: [projects, programming, webdev, github, personal website]
description: "My personal micro-blog; it's basically Ethan-flavoured Tumblr"
link: https://github.com/ethmarks/blips
link_name: GitHub Repo
link_icon: github
---

[Blips](https://ethmarks.github.io/blips/) is my personal microblog. Whereas my [Posts](/posts) (like the one you're reading right now) are long-form articles, my blips are smaller, more spontaneous updates. Just little "blips" on a radar.

{{< iframe src="https://ethmarks.github.io/blips/" alt="Blips microblog showing recent blips with a dark teal interface" >}}

## Why?

I made Blips because I wanted to have a place to write about smaller things. The way I saw it, I had three options to achieve this:

1. **Just use Twitter**. Pass. Even disregarding all of the... *other* reasons not to use Twitter, I don't really want to use platforms that I don't control. I don't have administrator permissions over the Twitter platform (at least, I didn't last I checked), which means that my hypothetical tweets would be fully at Twitter's behest. I would have zero control over the platform features and content presentation. This is a pretty unappealing concept to me, so I really didn't want to use a pre-existing platform like Twitter or Tumblr or whatever.
2. **Just use my Posts**. This was an *okay* option, but it had a few major downsides. First of all, it's super inconvenient: in order to make a Post, I must have access to one of my laptops, create a new markdown file, fill in the frontmatter, write the actual content, test it, commit it, and push it. In contrast, I can make a Blip on any device (including my phone) and all I have to do is write the content and press 'publish'. Secondly, mixing a bunch of first-draft tidbits with my higher-effort articles would dilute the quality my Posts, which I don't want.
3. **Make my own platform**. This is the option that I chose because it was by far the best. The only potential downside was that it would require a lot of development effort. I *like* development effort. By building my own platform, I made a platform that is controlled by me, is well-suited for short-form content, is convenient to publish on, *and* gave me an excuse to code stuff. It's an all-around win.

## What I blip about

I write blips about anything that I find noteworthy. In practice, this means it's usually tech-related stuff. I've occasionally blipped about cartography, literature, movies, and sci-fi, but the bulk of my blips are about techy stuff. I try to write in fairly accessible way for a non-technical audience, but I frequently fail at this. Sorry about that.

My blips have pretty varied purposes. Some are basically just 'I did this thing', some are shower thoughts, and some are about interesting projects, tidbits, or quotes that I've stumbled upon. 

To give you a sample, here's a blip that I published on October 5th. It's just an amusing and interesting quote that I found.

> "On two occasions I have been asked by members of Parliament, 'Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?' I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question."
> ~ Charles Babbage (inventor of the calculator), 1864

Blips also often foreshadow my in-progress projects. For example, while I was researching my ["Mercator's World Map was Useless"](/posts/mercator/) post, I published this blip:

> I'm doing some research on Age of Discovery maps for an upcoming project. I just learned about Terra Australis: https://en.wikipedia.org/wiki/Terra_Australis. It's one of the single most bizarre things I've ever learned.
> 
> Bascially, around the 15th century, cartographers noticed that "hey, there's all this land in the Northern Hemisphere, but not as much land in the Southern Hemisphere" So they decided "well I guess we'll just invent a continent. We'll call it Terra Australis (Latin for 'Southern Land'). Even though nobody has ever surveyed this continent, seen it, heard about it, or acquired any empirical data whatsoever to suggest that it exists, we're going to put it on maps anyways".
> 
> They did this for three hundred years until people started trying to explore it and eventually realized that this imaginary continent was, in fact, imaginary.
> 
> If there's a moral to this story, I have no idea what it is.

## Tech Stack

Blips uses [SvelteKit](https://svelte.dev/) for the frontend and [Sanity CMS](https://www.sanity.io/) for the backend.

### SvelteKit

Building Blips was my first time using a JS-based web framework. Really. I had always used Flask or Hugo or just plain HTML files. I wanted to branch out and expand my skill set, but after spending years hearing people complain about React, I didn't want to go with NextJS. Instead, I chose a framework that I've only ever heard good things about: SvelteKit. I think that it was a pretty good decision. SvelteKit produces fast and performant websites, I like its philosophy, it facilitates access to the entire NodeJS package ecosystem, and it's a serious and respectable framework. Building with SvelteKit was an enjoyable and educational experience, and I plan to use SvelteKit again in future projects.

### Sanity

I needed a way to store the content of Blips, and just storing Markdown files in the repo would defeat the point of a convenient microblog. So I needed to use a Content Management System. 

![Mobile screenshot of Sanity Studio in a project named 'ethmarks-blips' with the content "Kind of crazy that the internet has been around long enough to have witnessed major geopolitical shifts. For example, when first started being registered to countries in 1985, East Germany received .dd. After the reuinification of Germany in 1990, it switched over to .de, leaving .dd unused. Likewise, .cs was originally used by Czechoslovakia until it split into the Czech Republic (.cz) and Slovakia (.sk). Cold War-era countries having their own ccTLDs kind of feels like Napolean having an email address."](~/sanity_studio_screenshot.webp "Editing a blip on my phone")

Whichever one I chose, it needed to be headless (meaning I can use my own frontend), provide a hosted interface (meaning I can use it on my phone's browser), support webhooks (meaning I can make my webpage automatically update when I add a new blip), and have a free tier (meaning I'm cheap). Sanity was the first CMS that I found that fulfilled all of those criteria. In retrospect, [Strapi CMS](https://strapi.io/) might have been a slightly better choice, but I haven't had any problems with Sanity.

## Conclusion

Blips was delightful to develop and is delightful to use. It's nice having a platform to publish the things that I want to talk about but aren't substantial enough to write multiple paragraphs about. I've written 57 blips as of the time of writing, and I don't intend to stop any time soon.

~Ethan
