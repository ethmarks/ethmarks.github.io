---
title: I'm switching to Zed, maybe
date: 2025-07-23
tags: [programming, zed]
description: I'm switching from VS Code to the Zed code editor
---

![VS Code (left) and Zed (right) each displaying this post's Markdown source, including this text. How did I do that?!](~/vscode_zed_comparison.webp "VS Code (left) vs Zed (right)")

I've been using [VS Code](https://code.visualstudio.com/) for pretty much all of my serious coding.

I have experimented with using other IDEs, though. I used [Python IDLE](https://docs.python.org/3/library/idle.html) when I first started using Python. I flirted with using [JetBrains IDEs](https://www.jetbrains.com/ides/). I tried using this weird new IDE called [Zed](https://zed.dev/). But through it all, I kept coming back to VS Code. IDLE is terrible and the only reason I was using it was because I literally didn't realize that other solutions existed, JetBrains is expensive and heavy, and Zed doesn't even support Windows. VS Code is a full IDE, it's free, and it's mature.

But I'm still drawn to Zed.

The first time I tried Zed was a little over a month ago, on June 15. I heard about Zed from some Zedlots (A portmanteau of 'Zed' and 'Zealot' coined by me to describe the Zed users who seem to do nothing other than fawn over it) on HN. It sounded interesting and their praise was overwhelming, so I decided to try it out. Then I found out that [it doesn't support Windows](https://www.windowswen.com/).

I still wanted to try Zed, but I didn't want to [sign up for early access](https://zed.dev/windows), didn't want to use an emulator, and *definitely* didn't want to [build it from source](https://github.com/zed-industries/zed/blob/main/docs/src/development/windows.md). Instead, I installed it with [scoop](https://scoop.sh/).

If you want to install it yourself, run the following commands in PowerShell.

```powershell
# Authorize, Download, and Install Scoop
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install Zed with Scoop
scoop bucket add extras
scoop install extras/zed
```

Anyways, once I had Zed installed, I did a bit of coding, decided after a couple hours that I didn't like it, stopped using it, and didn't open it again.

Until today, that is. I've decided to give Zed another shot. I'm using it to write the post you're reading right now. I've spent the last couple hours configuring it and trying to learn its idiosyncrasies.

From what I've seen so far, Zed has several distinct advantages, such as its [Rust-powered and incredibly fast rendering engine](https://zed.dev/posts/fastest-ai-code-editor) and excellent [out-of-your-face AI](https://zed.dev/posts/disable-ai-features) integration.

It definitely isn't perfect, though. For example, installing Zed on Windows with Scoop is pretty much as easy as it gets, but it's still a hacky solution that breaks things like auto-update. Similarly, the interface lacks polish and can feel unfriendly and overwhelming (which is almost impressive for such a minimalist editor). The only way to change settings is by [editing a JSON file](https://zed.dev/docs/configuring-zed). This is fine, I guess, but it's significantly worse for UX than a [normal settings dialogue](https://code.visualstudio.com/docs/configure/settings). Zed doesn't feel as welcoming and batteries-included as VS Code.

However, it's important to remember that Zed is new and still under development. It takes a while to build a fully-functional, polished, and stable code editor. The developers are (wisely) focusing their efforts on more important things before [Zed 1.0 releases later this year](https://zed.dev/roadmap). From what I've seen, Zed is already in an acceptable state, and it will only get better as time goes on.

I'll probably write a follow-up post at some point that details my experience with Zed and whether or not I abandoned it and switched back to VS Code. See you then!

~Ethan
