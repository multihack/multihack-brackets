# multihack-brackets
Synchronizes code and project structure between multiple users in realtime.

## Usage
1. **File > Start Multihack**  
2. Enter your desired room ID.  
3. Click **Join Room**. Your code is now being synchronized!
4. **File > Stop Multihack** will stop collaboration.

This project currently only syncs *changes* and will not realize any code differences on joining a room. Use Git or another version control to make sure you start with the same initial code.

## Running Your Own Instance
This extension points to the author's server by default.  
Please run your own instance of [multihack-server](https://github.com/RationalCoding/multihack-server) if you want lower latency and improved privacy.  
You can target a different host through the Brackets option **multihack-brackets.hostname**.
