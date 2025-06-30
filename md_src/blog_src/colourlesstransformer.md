---
index: True
title: ColourlessTransformer
date: 2024-12-22
tags: [projects, programming, automation]
slug: colourlesstransformer
description: My Gradio interface for PaintTransformer, a neural image filter that turns photos into paint timelapses
link: https://github.com/ColourlessSpearmint/ColourlessTransformer
link_name: GitHub Repo
link_icon: github
---

[PaintTransformer](https://github.com/Huage001/PaintTransformer) is a neural network that approximates images using paint strokes. This gives it a very pretty and stylized watercolor/painterly aesthetic.

I like how this looks, and I'll sometimes just run random photos through it to see how they turn out.

<figure>
    <div class="juxtapose-container">
        <div class="juxtapose long">
            <img src="https://github.com/ColourlessSpearmint/ColourlessTransformer/raw/main/images/walkway.jpg" alt="A concrete walkway runs alongside a dense hedge of flowering bushes, all under a sleek red pergola.">
            <img src="https://github.com/ColourlessSpearmint/ColourlessTransformer/raw/main/images/walkway_painttransformer.jpg" alt="A highly stylized watercolor of a concrete walkway runs alongside a dense hedge of flowering bushes, all under a sleek red pergola.">
        </div>
    </div>
    <figcaption>PaintTransformer applied to a photo I took at <a href="https://franklloydwright.org/taliesin-west/">Taliesin West</a></figcaption>
</figure>

Another cool thing you can do is save each step as a frame, which creates a cool animation similar to a [watercolor timelapse](https://youtu.be/1rc0qmqcqMY).

Because of how PaintTransformer works, the brush size gets smaller and smaller as times goes on (so that it can add details), but this makes for a fun charades-like game: *how quickly can you guess what it's painting?*

![A PaintTransformer timelapse of my Taliesin photo](https://github.com/ColourlessSpearmint/ColourlessTransformer/raw/main/images/walkway.webm)

PaintTransformer was developed in [this paper](https://arxiv.org/abs/2108.03798) by a team of researchers. It was later [implemented in PyTorch](https://github.com/Huage001/PaintTransformer) by [Huage001](https://github.com/Huage001)

I wanted to use PaintTransformer, but my makeshift solution of uploading files to a Colab runtime was too clunky to be used at scale. So I took this opportunity to brush up on my interface coding skills and code a client. I decided to name it ColourlessTransformer because I was going through a phase of naming everything eponymously after my username.

## Streamlit

This was my first time working with [Streamlit](https://streamlit.io/). I originally planned to use [Gradio](https://www.gradio.app/) for this project because I had previous experience, but Gradio is an extremely heavy framework for my use case, and the 2-minute starting times were bothering me.

I'm quite happy with how the Streamlit app turned out. A detail I'm particularly proud of is how the previous output fades out slightly while the new one is processing.

![ColourlessTransformer Streamlit demo](/images/colourlesstransformer_streamlit.webp)

## Usage

If you want to try this out on your own, follow the [instructions in the README](https://github.com/ColourlessSpearmint/ColourlessTransformer?tab=readme-ov-file#usage). You'll need Git, Python, a GPU, and some familiarity with the terminal.

## Conclusion

ColourlessTransformer was one of my favorite projects because I started with a complex task that took 3-5 minutes of tedious parameter filling and file reorganization and ended with a sleek, fast, and painless custom application.

Apparently it wasn't enough to automate watercolor; I also had to automate the automation.

~Ethan
