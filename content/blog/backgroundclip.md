---
title: Firefox is the only browser that handles background-clip correctly
date: 2025-07-11
tags: [programming, webdev, personalwebsite]
description: I discovered the compatibility issues of the CSS background-clip attribute
---

My laptop is fairly powerful, which means that it's heavy and has a short battery life. Because of this, I use a [laptop dock](https://www.youtube.com/watch?v=Pc31L3zJiaU) to turn it into effectively a desktop with a built-in keyboard. I like being able to code from places other than my desk, so I've been looking into buying a lightweight portable laptop with just barely enough processing power to run a browser, and just using a [remote tunnel](https://code.visualstudio.com/docs/remote/tunnels) to puppeteer my main laptop that has all of my files on it. The best way to do this seems to be [vscode.dev](https://code.visualstudio.com/blogs/2021/10/20/vscode-dev), so I decided to try it out and see if that was a viable solution. I booted up the webpage in Firefox, aaaaand it doesn't work.

{{< figure src="/media/vscode-dot-dev-icon-font.webp" alt="when vscode.dev runs in Firefox, all of the icons are replaced with empty boxes" >}}

[Firefox has trouble with icon fonts](https://support.mozilla.org/en-US/questions/1016919), so all of the interface buttons were replaced with empty boxes. After an hour of trying to fix it, I just gave up and used another browser. Much as I dislike it, Google Chrome is less buggy than Firefox and has more support for new browser technologies (like [CSS carousels](https://chrome.dev/carousel/)), so I grudgingly conceded that it's fine for just running a web app. I installed Chrome, navigated to vscode.dev, and it worked perfectly. I'm still very impressed that Microsoft managed to make a browser port of an entire code editor.

I logged into my GitHub account, did some configuration, and started coding. I started up my [personal website's](/blog/personalwebsite) [Hugo](/blog/hugoswitch) [server](https://gohugo.io/commands/hugo_server/) and opened it in a new Chrome tab. At that point, I discovered that portions of my website were invisible.

{{< figure src="/media/background-clip-firefox-chrome.webm" alt="The mint gradient is visible on Firefox but not on Chrome" >}}

I opened the page on Firefox, and it looked fine, so the problem was browser-specific. I started troubleshooting the problem. I disabled likely-looking CSS styles at random until something changed, and eventually realized that I could make the text visible by unchecking the "[webkit-text-fill-color](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-text-fill-color): transparent;" style. The resulting text was pure white rather than my mint gradient, so I continued troubleshooting. I discovered that the blog titles still showed up on Chrome despite using -webkit-text-fill-color style. I eventually realized that the problem was in how the two browsers handled the "[background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip): text;" style.

What "background-clip: text;" does is makes it so that the background of an element (in this case, the background is the mint gradient) is only visible in places where the text is. It's as though there was masking tape everywhere except for the text.

On Firefox, all text contained within a background-clipped element is considered part of the background clip. It doesn't matter if that text is the direct content of the element or it's inside some nestled [spans](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/span): it's all considered part of the parent element. On Chrome (and Edge, Opera, Brave, Vivaldi, etc), this is not the case. The text *must* be the direct content of the element, otherwise it isn't counted. The text in my "Welcome To My Personal Website" heading was contained in nestled spans, so Firefox counted it as part of the background-clip while Chrome did not.

I looked into ways to fix this, but all of them either ruined the effect or just didn't work. In the end, I settled on just using a solid mint colour by default, and only adding the mint gradient if the page was loaded in Firefox.

```css
h1 {
    color: var(--color-h1);
    
    @-moz-document url-prefix() {
        /* Add a cool gradient on Firefox; other browsers don't support it :( */
        background: linear-gradient(
            135deg,
            var(--color-text),
            var(--color-accent)
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
```

Then I checked to see if anyone else had noticed this. I found a [Stack Overflow post](https://stackoverflow.com/questions/55198363/webkit-background-clip-text-working-on-mozilla-but-not-on-chrome). The author of the post, [Paul Stephen Davis](https://stackoverflow.com/users/5925418/paul-stephen-davis), noticed the background-clip inconsistency while working on his photography website and asked for help. A user named [Jason](https://stackoverflow.com/users/4243228/jason) suggested changing the display type to inline (which doesn't fix it) and then gave up. 

This was over 6 years ago.

I think that Firefox's implementation is much better, both in principle and in what it allows you to do. Chrome apparently doesn't agree, and has spent the last 6 years being wrong.

Please fix it, Google.

~Ethan