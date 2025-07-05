---
noindex: true
title: What3Words
date: 2025-07-04
tags: [curios, cartography]
slug: what3words
description: an exploration of what3words, a geolocation system to encode every 3mx3m square on earth with a unique sequence of three words
link: https://what3words.com/collarless.spearmint.blog
link_name: What3Words Website
link_icon: link
---

![The What3Words grid in San Fransisco](https://corpassets.what3words.com/wp-content/uploads/2020/08/10764_About-us_2-1.jpg)

A few days ago, I stumbled upon What3Words. I'm torn between finding it funny, finding it stupid, and finding it actually quite practical. 

Basically, What3Words is a [geolocation system](https://en.wikipedia.org/wiki/Positioning_system) that uses an algorithm to generate a 3-by-3-meter grid of squares, each with its own three word address. They used 57 trillion of these squares to cover the entire Earth. What this means is that you can describe any location on Earth down to 3 meters of precision using only three English words.

What3Words's goal is to allow people to communicate their precise location in human-friendly terms. This seemingly simple task is actually something that most other common geolocation systems fail at.

## Other Systems

**(405 Nasa Pkwy W, Merritt Island, FL 32953)**: Street addresses are the worst common geolocation systems, so it makes sense that they're also the most commonly used. They rely on human-chosen placenames, but humans are really bad at naming things, so there's a lot of overlap, dumb spellings, and just general ambiguity. The fact that there are [placenames with disambiguation pages on Wikipedia](https://en.wikipedia.org/wiki/London_(disambiguation)) is problematic. Street addresses also tend to be very long, they have low and wildly varying precision, and they're only assigned to populated areas. They are human friendly because there's significant cultural inertia around street addresses. 

**(28.5234°N, 80.6830°W)**: Using a 2D coordinate system like latitude and longitude is less human-friendly, but much more precise. There's still some ambiguity because there are multiple [conflicting standards](https://xkcd.com/927/), but [WGS 84](https://en.wikipedia.org/wiki/World_Geodetic_System#WGS_84) is what [GPS](https://en.wikipedia.org/wiki/Global_Positioning_System) uses. Also, to get precision down to single-digit meters, you [need four decimal points](https://xkcd.com/2170/), meaning you have to say *twelve* numbers.

**(G8F8+9R2)** [Plus Codes](https://maps.google.com/pluscodes/) are a system designed by Google that uses variable-length [alphanumeric](https://en.wikipedia.org/wiki/Alphanumericals) strings. It has a meager 14 meters of precision, and I only mention it because it's well-known and slightly better than latitude and longitude.

## Advantages

**(///doses.flattens.overseer)** What3Words is more precise than all of these systems while also being far more human-friendly. 3 meters is the limit of what the average smartphone can triangulate its position to, so smaller scales would require specialized equipment to use.