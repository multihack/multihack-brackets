# multihack-brackets

Synchronizes code and project structure between multiple users in realtime.  

**Still in active development. Fully working, but expect constant updates.**

Also check out [the web version](https://github.com/RationalCoding/multihack-web). (Now compatible with this extension!)

## Usage 
1. Open the folder containing your project.
2. Press the sync icon on the right toolbar.  
3. Enter the same room ID.  
4. Your code is now being synced!  
5. Click the sync button again to leave the room, join the voice call, or fetch code.  

**Files in your project will be overwritten! Make a backup!**  

## Voice Calls

Brackets does not allow microphone access by default. You must launch brackets with:  

`brackets --args --enable-media-stream` if you want to enable voice calls.  

## Fetch Code

If someone joins the room with new code, it will not be watched and therefore not synced.  

To get unwatched code or force a sync, press "Fetch Code" on the side that doesn't have the correct code.

## Running Your Own Instance
This extension points to the author's server by default. No code is sent through the server as long as your version of Brackets supports WebRTC (which most do). 

If you want your own instance, see [multihack-server](https://github.com/RationalCoding/multihack-server).

You can target a different host through the Brackets option **multihack-brackets.hostname**.

## Introducing version 3.0!

- Network has changed from server forwarding to 100% peer-to-peer! Blazing fast speeds (especially over LANs), and unlimited project sizes!

- Check out [the new protocol](https://github.com/RationalCoding/multihack-wire) if you're wondering why it's so much faster!

- General performance and quality improvements.
