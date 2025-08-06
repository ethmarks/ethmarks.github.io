---
title: I accidentally corrupted my hard drive partition table
date: 2025-08-05
tags: [tech, linux]
description: Due to a catastrophic failure during a disk partitioning job, my hard drive's partition table became corrupted and I had to fix it
---

Four days ago, on August 1st, I decided to switch to Linux from Windows. My reasons for doing so aren't relevant to this story, but basically I was just annoyed at the bloatedness and lack of customizability of Windows.

Fully switching to Linux isn't an option for me. My college requires the use of Microsoft 365, which is available in a web version and a desktop version. The web version is buggy, slow, and not feature-complete, and the desktop version is only available on Windows. Similarly, the Adobe suite is only available on Windows and none of the cross-platform open-source alternatives like GIMP or Krita are anywhere near as good as Photoshop.

So I need to have Windows, but I also want to have Linux. Thankfully, there's a solution to this: [dual booting](https://en.wikipedia.org/wiki/Multi-booting). I can "cut" my hard drive into two partitions: one for Windows and one for Linux.

Based on the title of this post, guess how that went.

## I totally know what I'm doing

I have experience in [flashing operating systems](https://medium.com/@llillydpritchard/mastering-the-art-of-flashing-an-operating-system-onto-your-laptop-56b69003dcca). I run a small personal business which involves flashing [Chrome OS Flex](https://chromeos.google/products/chromeos-flex/) onto old laptops. This technically makes me a professional operating system flasher. Also, I used to dual-boot Ubuntu and Windows on my old Lenovo laptop a few years ago.

And yet, despite my experience, I still managed to completely mess up this simple partitioning.

After deciding to switch to Linux, I spent a few hours researching Linux distros and eventually settled on [Kubuntu](https://kubuntu.org/). I downloaded the Kubuntu [ISO](https://en.wikipedia.org/wiki/Optical_disc_image) and loaded it to my USB drive with [Balena Etcher](https://etcher.balena.io/). I rebooted my computer, interrupted [BIOS](https://en.wikipedia.org/wiki/BIOS), and had BIOS boot from USB. Once Kubuntu loaded, I set it up, ran some tests, and decided it was acceptable. All good so far.

I considered making backups of any important data that I had on my drive, but decided against it. My thought process was essentially: "It would take a bunch of manual effort to pick out important files, and then it would take a multiple hours to back them up to the cloud. I don't want to wait hours. Besides, *most* of my data is backed up on GitHub, and I've partitioned dozens of drives without ever losing data. I'm sure it'll be fine."

So I opened up the KDE Partition Manager, selected my 1 terabyte SSD, selected my Windows partition, selected "Resize/Move", entered my desired partition size, and clicked "Apply".

About 15 minutes passed, during which the program successfully resized my partition and was performing the final steps to finish the resizing.

![KDE Partition Manager showing the partition being resized](~/kdepartitionmanager.webp)


Then Linux crashed.

## Oh no! Consequences!

I don't know exactly what caused the crash. It could have been a cascading failure from the disk partition process, or it could have been a physical hardware error on my cheap 2-year-old flash drive.

What I *do* know is that the crash occurred ***during a write operation to the partition table***.

For those who don't know, the partition table is the part of a hard drive that tells the computer where the partitions are so they aren't overridden. It's like a zoning chart so that your neighbor doesn't start building on your land.

My first indication that something had gone wrong was when the partition manager log filled with errors. I didn't take a photo, but it said something about "failed to set geometry" (in this case, "geometry" means the metadata of the partition, otherwise known as the partition table).

The Desktop Environment crashed. The Linux kernel was still running, so I could still move my mouse, but the rest of the screen was blank.

My first instinct was to get to a terminal. I pressed CTRL + ALT + F2. Rather than a terminal as I expected, I got a non-interactive wall of text filled with SQUASHFS errors. Same with the CTRL + ALT + F3, F4, F5, and F6 terminals.

![A terminal full of SQUASHFS errors](~/squashfs.webp)

There was clearly nothing to be done from the failing Kubuntu instance, so I shut down my computer. It was quite late, so I decided to go to sleep and deal with it in the morning. I made sure to physically unplug the power cable so that my laptop wouldn't auto-start while I was sleeping.

## Fixing the partition error

In the morning, I made a plan. If Windows was bootable, then I would try to exfiltrate and back up any important data, then focus on fixing my drive. If it wasn't, I would just consider the data lost and focus on wiping my drive and starting anew.

I took a deep breath and started up my laptop. To my surprise and delight, Windows booted up normally. Well, not quite normally. Everything was fine at first glance, but it soon became clear that something was deeply wrong.

![GParted showing the C: partition with 930.77 gigabytes of size, 494.76 gigabytes used, and 191.87 gigabytes unused](~/gparted.webp)

Different programs disagreed on how big my partition was. The ones that read from the partition table said it was around 930.77 gigabytes, while the ones that actually looked at the partition said it was 686.63 gigabytes. There were also some weird cases like GParted, which claimed that my partition was 930.77 gigabytes in total, 494.76 gigabytes of which were used, leaving 191.87 gigabytes remaining. Those numbers don't add up, so clearly it was pulling some data from the partition table and some from the partition itself. Also, every drive-related command that I ran came back with errors.

Using this seemingly healthy but subtly "wrong" operating system was unnerving and unsettling. It's like liminal horror for developers. I did not enjoy it.

I spent the next hour looking through my file system and copying any irreplaceable files into a central "BACKUP" folder. It was about 21 gigabytes when compressed into a [tarball](https://en.wikipedia.org/wiki/Tar_(computing)). Now I had to figure out how to get it off my computer.

I couldn't use Google Drive because it would take 6-7 hours to upload and I can't rely on Windows staying operational for that long. This meant I had to transfer the files to a local device. My brother has a multi-terabyte hard drive on his desktop that he very kindly offered to let me store my backup on. I couldn't send it via Bluetooth because 21 gigabytes is too big for Quick Share. I couldn't use a removable storage medium because my only working USB drive was the one that caused Linux to crash. I couldn't use a USB cable because for some reason Windows doesn't support file transfer over USB.

My solution was to cannibalize an Ethernet cable from my Xbox and use it to connect my laptop to my brother's desktop. I then spent 15 minutes setting up an [FTP server](https://en.wikipedia.org/wiki/File_Transfer_Protocol) (seriously Microsoft, why did you make this so complicated), and copied my backup onto his hard drive.

With my backup secure, I shifted focus to fixing my drive.

![A PowerShell terminal showing errors from the command `chkdsk /scan`](~/chkdsk.webp)

I did a lot of research, read a lot of discussions and tutorials, ran a lot of diagnostics, and tried a lot of commands. Half an hour later, I had successfully managed to ruin my drive so badly that Windows forcibly shut itself down.

When I tried to turn it back on, Windows refused to boot.

![The Windows Disk Repair Utility fixing the C: drive](~/diskrepair.webp)

But then, unexpectedly, the Windows Disk Repair Utility activated, noticed my ruined drive, and fixed it for me. I have no idea what it did, but when it finished, Windows booted normally, all programs agreed on partition size, and all diagnostics reported a healthy drive.

According to the [Wikipedia article on deus ex machina](https://en.wikipedia.org/wiki/Deus_ex_machina):

> "Deus ex machina is a plot device whereby a seemingly unsolvable problem in a story is suddenly or abruptly resolved by an unexpected and unlikely occurrence"

This pretty much perfectly describes my interaction with the Windows Disk Repair Utility. It just unexpectedly swooped in to save the day.

## Installing Linux for realsies this time

After Windows fixed my drive, I turned my attention to installing Kubuntu, hopefully without nearly wiping my hard drive this time.

I learned my lesson about using the KDE Partition Manager and did the partitioning using Windows' Disk Management program. It was successful and uneventful.

I couldn't trust my old USB drive, so I went out and bought a new one. I downloaded the Kubuntu ISO and Balena Etcher to my brother's computer, then flashed it to my new USB drive. I booted it up on my computer, installed Kubuntu onto the new partition, and spent the rest of the day messing around with settings and installing stuff.

## Conclusion

![A screenshot of my computer running Kubuntu](~/kubuntu.webp)

I'm pretty happy with Kubuntu. It's faster, nicer, and more customizable than Windows. I've only had to switch back to Windows twice so far, once to move over some files that I forgot to include in my backup and once to respond to an email in Outlook. I've very much enjoyed using Kubuntu and setting it up. I did *not* enjoy the installation process, though.
