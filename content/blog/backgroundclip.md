---
title: Firefox is the only browser that handles background-clip correctly
date: 2025-07-11
tags: [programming, webdev, personalwebsite]
description: I discovered the compatibility issues of the CSS background-clip attribute
---

My laptop is fairly powerful, which means that it's heavy and has a short battery life. Because of this, I plug it into a [laptop dock and use it as basically a desktop](https://www.youtube.com/watch?v=Pc31L3zJiaU). I like being able to code from places other than my desk, so I've been looking into buying a lightweight portable laptop with just barely enough processing power to run a browser, and just using a [remote tunnel](https://code.visualstudio.com/docs/remote/tunnels) to puppeteer my main laptop that has all of my files on it. The best way to do this seems to be [vscode.dev](https://code.visualstudio.com/blogs/2021/10/20/vscode-dev), so I decided to try it out and see if that was a viable solution. I booted up the webpage in Firefox, aaaaand it doesn't work. Not really, anyways. 

{{< figure src="/media/vscode-dot-dev-icon-font.webp" alt="A screenshot of vscode.dev running in Firefox, where all of the icons are replaced with empty boxes" >}}

[Firefox has trouble with icon fonts](https://support.mozilla.org/en-US/questions/1016919), so all of the interface buttons were replaced with empty boxes. After an hour of trying to fix it, I just gave up and used another browser. Much as I dislike it, Google Chrome is less buggy than Firefox and has more support for new browser technologies (like [CSS carousels](https://chrome.dev/carousel/)), so I conceded that it's fine for just running a web app. I booted up vscode.dev in Chrome, and it worked perfectly.

I logged into my GitHub account, did some configuration, and started coding. I started up my [personal website's](/blog/personalwebsite) [Hugo](/blog/hugoswitch) server and opened it in a new Chrome tab. At that point, I discovered that large sections of my website were invisible.