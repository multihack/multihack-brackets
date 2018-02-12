# multihack-brackets

[![Gitter chat](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/multihack/multihack)
![Alpha](https://img.shields.io/badge/status-alpha-green.svg?style=flat)

Synchronizes code and project structure between multiple users in realtime.  

Also check out [the web version](https://github.com/RationalCoding/multihack-web).

**Still in active development. Expect instability and constant updates.**

## Usage 
1. Open the folder containing your project (or an empty folder if you want your team's code).
2. Press the sync icon on the right toolbar.  
3. Enter the same room ID.  
4. Your code is now being synced!  
5. Click the sync button again to leave the room, join the voice call, or fetch code.  

**Files in your project will be overwritten! Make a backup!**  

## Voice Calls

Brackets does not allow microphone access by default. You must launch brackets with:  

`brackets --args --enable-media-stream` if you want to enable voice calls.  

## Running Your Own Instance
This extension points to the author's server by default. No code is sent through the server as long as your version of Brackets supports WebRTC (which most do). 

If you want your own instance, see [multihack-server](https://github.com/RationalCoding/multihack-server).

You can target a different host through the Brackets option **multihack-brackets.hostname**.

## Introducing Version 4.0!

- Multihack now uses a [Conflict-Free Replicated Data Type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) to merge conflicts and ensure everyone is always looking at the same code. Thanks @kifhan for assistance with this!

- You can now see your team's carets, and the notifications are less instrusive. Thanks to @Worie!

- New sidebar icon. Thanks @tweakimp!
