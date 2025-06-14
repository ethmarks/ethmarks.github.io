---
index: True
title: Liquid Glass
date: 2025-06-14
tags: [tech]
slug: liquidglass
description: My thoughts on Apple's new Liquid Glass design
---

![The new MacOS 26, displaying its glassmorphic Liquid Glass interface](https://cdn.mos.cms.futurecdn.net/x6hH5edzsmvbowYLaPTkmH-970-80.jpg.webp)

As part of [IOS 26](https://www.apple.com/newsroom/2025/06/apple-elevates-the-iphone-experience-with-ios-26/), Apple unveiled their new [Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass) material and incorporated it into the design of the iPhone, iPad, Mac, Apple Watch, Apple TV, and Apple Vision.

For context, I'm not a huge Apple fan: I'm writing this on a Windows laptop, listening to music from my Android phone. I don't dislike Apple, but I generally disapprove of the Apple ecosystem and don't think that it's right for me.

That being said, I absolutely love Liquid Glass. At no other point in time has my opinion of Apple been higher than when they showed off the new interface at the [WWDC25 keynote](https://developer.apple.com/videos/play/wwdc2025/101/). It's not a 

## Glassmorphism

Liquid Glass is just the Applelogism (A term coined by me to describe Apple's tendency to take popular existing concepts and give them a really generic Apple-ey name; see also Microsoft Excel and Apple Numbers) for [**Glassmorphism**](https://hype4.academy/tools/glassmorphism-generator): a design philosophy that uses translucent blur to emulate [frosted glass](https://en.wikipedia.org/wiki/Frosted_glass).

![Windows Aero's glassmorphic interface, featuring transparent blurred backgrounds](https://upload.wikimedia.org/wikipedia/en/a/a3/Windows_Vista.png)

As many other people have pointed out, Apple absolutely did not invent glassmorphism. Frosted glass designs were first popularized by [Windows Aero](https://en.wikipedia.org/wiki/Windows_Aero) in 2007, and [lots](https://css.glass/) [of](https://tricks-glassmorphism.webflow.io/) [other](https://reflect.app/) [designers](https://hype4.academy/tools/glassmorphism-generator) [have](https://www.reflectorai.app/) [used](https://www.behance.net/gallery/113924121/Kit-UI-Glassmorphism-trend#) [it](https://leanrada.com/) [since](https://jetgirl.art/), including me!

This website (at least, as of the time of writing) features a glassmorphic header at the top of each page. The header has gone through quite a bit of iteration, but the frosted glass effect has been present from [the very first design](https://github.com/ColourlessSpearmint/colourlessspearmint.github.io/commit/e4d6dcd0c97ed13c39c4b96709b844a0465720f3#diff-9bef76ac5cd1246a53c15ea6cf7aea15d8af6c1fd0978867c27ba8fe9ae6b1f4), created on April 11, 2025. Glassmorphism is one of my favorite effects, so I was absolutely delighted that Apple decided to implement it in the form of Liquid Glass.

## Advantages of Liquid Glass

At its core, the only thing that Liquid Glass does is make the iPhone look prettier. It accomplishes this exceptionally well.

### Novelty

![Liquid Glass promotional material with the text "Introducing Liquid Glass" in chromatic type, next to six colourful pieces of glass, visibly refracting light and demonstrating additive color mixing](https://i.ytimg.com/vi/jGztGfRujSE/maxresdefault.jpg)

First, Liquid Glass is unique. Despite Windows Vista featuring glassmorphism more than 18 years ago, later versions of Windows use [Fluent Design](https://en.wikipedia.org/wiki/Fluent_Design_System), which is the same boring [flat design language](https://en.wikipedia.org/wiki/Flat_design) that pretty much every other interface uses. With its novel transparency, Liquid Glass is a splash of colour (or lack thereof) that makes it stand out.

![Four Apple devices: A Macbook, an iPad, an iPhone, and an Apple Watch, all lined up in a row and using a glassmorphic Liquid Glass interface with frosted glass buttons and widgets](https://platform.theverge.com/wp-content/uploads/sites/2/2025/06/liquidglassmain2.jpg?quality=90&strip=all&crop=0,0,100,100)

### Futuristic

Second, Liquid Glass feels futuristic. It

### Animations

![Test video](../../images/liquid_glass_coalescence.webm)

Third, Liquid Glass is, well, *liquid*. It moves and behaves organically and realistically. For example, if two buttons made of Liquid Glass merge into one, they coalescence [like real blobs of liquid](youtu.be/Aq5ydeWWr4A). It reminds me of [object blending via ray marching](https://youtu.be/Cp5WWtMoeKg&t=198), although apparently Apple actually used [signed distance field interpolation](https://en.wikipedia.org/wiki/Signed_distance_function) for the [Fluid Morph](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass) effect, not [ray marching](https://en.wikipedia.org/wiki/Ray_marching).

