# multihack-brackets

Synchronizes code and project structure between multiple users in realtime.  

Also check out [the web version](https://github.com/RationalCoding/multihack-web). (Now compatible with this extension!)

## Usage
1. You and another person with this extension should have the same project open.  
2. Press the sync icon on the right toolbar.  
3. Enter the same room ID.  
4. Your code is now being synced!  
5. Click the sync button again to leave the room, join the voice call, or fetch code.  

## Sharing Projects

**Only changes made after joining a room will be synced.** To get the same initial code, either use something like Git or click the sync button again and do **Fetch Code**. This is also for if you lose sync.  

*There is a project size limit for "Fetch Code" on the public server, but not on a private one.*  

If peers have different sets of code, the peer who joined first will take priority.  

**Files in your project will be overwritten. This cannot be undone.**  

## Voice Calls
Brackets does not allow microphone access by default. You must launch brackets with:  

`brackets --args --enable-media-stream` if you want to enable voice calls.  

## Running Your Own Instance
This extension points to the author's server by default.  

Please run your own instance of [multihack-server](https://github.com/RationalCoding/multihack-server) if you want lower latency, improved privacy, and unlimited fetch sizes.  

You can target a different host through the Brackets option **multihack-brackets.hostname**.

## Introducing version 3.0!

- Network has changed from server forwarding to 100% peer-to-peer! Blazing fast speeds (especially over LANs), and unlimited project sizes!

- General performance and quality improvements.

## Future Features
- [x] Integration with web version
- [ ] Integration with future versions on Atom and VSCode
- [x] Switch from server forwarding to P2P
- [x] Audio calls
- [ ] Video calls
- [ ] Text chat
- [x] Initial code sync
- [ ] End-to-end encryption
- [ ] Cursor and selection tracking
