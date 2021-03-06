# blessedBot

A bot and client for <a href="https://github.com/AndrewBelt/hack.chat">hack.chat</a> that uses Node.js which uses the ncurses-like <a href="https://github.com/chjj/blessed">blessed</a> library.

## Usage

``` js
$ git clone https://github.com/elixirx/blessedBot/
$ cd blessedBot
$ npm install
$ nodejs main.js
```

Note: some installations of Node.js will use the `node` command rather than `nodejs`

P.S. If you can't figure out how to change your username and trip, I'm sorry but I'm an asshole.

## Issues

- If you have issues when running such as `Error: Cannot find module 'blessed'`, then try installing the module manually by using `npm install blessed` while in the project's root directory. If that doesn't work, manually download <a href="https://github.com/chjj/blessed">blessed</a> and add it to the `node_modules` folder inside the project.

- If the edges of boxes are letters rather than lines, you should try removing the whole project and starting over, running `npm install` and then `npm install blessed` in that order.

## Commands

Yhea the commands can be found in the main.js file. If you're too lazy to check it out, I'm sorry but I'm an asshole.

## Controls

- __Spacebar__ - Toggles the list of online users
- __Enter__ - Focus on the input box
- __Escape__ - Sends text if unfocused from input box, otherwise, unfocuses from input box
- __Up/Down Keys__ - Scroll through the chat history
- __Q__ - Terminate the program
- __C__ - Toggles from chat input box to console input box

### Console

Some valid console commands that have been implemented into the bot are:

- `leave` closes the websocket to the current channel.
- `join [channel]` opens a websocket connection to the specified room, if unspecifed, will connect to ?lounge
- `control` toggles the bouncer to be used as a bot and respond to commands of others in the channel (on by default)
