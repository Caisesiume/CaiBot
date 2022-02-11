# CaiBot
Quick links
- [How to get started?](https://github.com/Caisesiume/CaiBot#How-to-get-started-with-the-bot?)
- [About](https://github.com/Caisesiume/CaiBot#About)
- [Technical Details](https://github.com/Caisesiume/CaiBot#technical-info)

## How to get started with the bot?
<hr>

*Having some programming experience will be helpful when getting started.*

> Firstly, you want to clone the repo to where you want to run the bot. 

> Go to [Twitch's Dev page](https://dev.twitch.tv/) and to your console. Grab your *Client ID* and *Client Secret*, using these you can get your *accessToken* and *refreshToken*. 

**Remember to include moderation in the scope (*chat:edit* and *channel:moderate*).*

> Swap the placeholders in respective json file in the ``caibot/Auth/`` folder with the real ``clientID``,``clientSecret``, ``accessToken`` and ``refreshToken`` you just got from the previous step. 
>
> > Additionally, you want to check out ``caibot/Channel/chanels.json``
> >
> > Swap the ``channel_key`` to ``#<ChannelYouWantToJoin>``
> >
> > Swap the ``channel_name`` to ``<ChannelYouWantToJoin>``
> 
> > If you have experience with JSON structures you could edit all bot settings this way. Keep in mind to only change values. 
If you do not have experience with JSON, it's recommended to use chat commands for editing purposes. (You still need to change ``channel_key`` and ``channel_name`` manually)

> Before starting the bot, you will need to install the nessesary npm packages to use the bot. 
> 
> Use:  ``npm install``

> When you set up the authorization part and installed all the packages, you can simply use ``npm start`` to start the bot.

> It is recommended to use a Twitch account specific to the bot.

## About
<hr>

**This repository contains a version of a Twitch Chatbot with limited functionality. The full system is not open source.**

CaiBot is a hobby project about twitch chat moderation which turned out much larger than expected...

Don't expect a lot of updates to this repository. Updates will happen every once in a while to add features existing in the live version of the chatbot.

You can find the currently usable commands and similar in the [GitHub wiki](https://github.com/Caisesiume/CaiBot/wiki/Home).

> Some of the features:
>
> * Chat moderation
> * Commands
> * Sub/Resub reactions
> * [Custom channel point rewards](https://github.com/Caisesiume/CaiBot/wiki/Channel-Point-Rewards)

Feel free to use this repo to create your own chat bot for your twitch chat! 

## Technical info
The bot is node.js based(12.x) and connects to twitch using the Twitch.js API (depricated. Use [Twurple](https://twurple.js.org/)).

See ``caibot/package.json`` to see what npm packages the bot is using.

There is no UI or frontend layer. This system is intended to be run using a console.

There is no database used in this version. All settings and values are saved to json files. You can easily change the different settings for your channel by editing values in ``caibot/Channel/channels.json``. Keep in mind to only change the values and maintain the overall structure.

The current state of the bot is limited. It has a few cool features that works but it is not free from issues, just a heads up.


<img src="https://cdn.frankerfacez.com/emoticon/218530/2" alt="FFZ emote PepoG" width="30px">
</img>

*This repository is not under development any more, and will not be fully completed. Updates may still happen occationally*
