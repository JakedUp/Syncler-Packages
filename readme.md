# Express - Hybrid:

*This intelligently combines all known Express packages for Syncler on-the-fly into a single hybrid package, de-duping any duplicate providers in the process. Please note that one of the source packages is Orion's Wako package, which includes many useful non-authenticated providers alongside Orion's own authenticated custom Search provider. I have provided 3 different flavors of my package depending on whether you want to use Orion Search or not, and whether you want Orion's Wako providers or not. To get an Orion API key, please visit* [*https://panel.orionoid.com/*](https://panel.orionoid.com/)

### All Known Sources (Including Orion Search)
   * *Provide an Orion API key to include the Orion Custom search provider as you have configured it in the Orion Panel*
   * [https://syncler-providers.000webhostapp.com/express-hybrid.json?orion-api-key=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456](https://syncler-providers.000webhostapp.com/express-hybrid.json?orion-api-key=) (use your own API key!)

### All Known Sources (Excluding Orion Search)
   * *Use this if you want all of the sources from Orion's Wako package, but have no intention on using the Orion service itself*
   * [https://syncler-providers.000webhostapp.com/express-hybrid.json](https://syncler-providers.000webhostapp.com/express-hybrid.json)

### Only Include Sources Not Found In Orion's Package
   * *Use this if you do not trust giving your API key to a third party, and plan on installing Orion's Wako package separately*
   * [https://syncler-providers.000webhostapp.com/express-hybrid.json?exclude-orion=true](https://syncler-providers.000webhostapp.com/express-hybrid.json?exclude-orion=true)

**Sources Used:**

* `https://wako.orionoid.com/ABCDEFGHIJKLMNOPQRSTUVWXYZ123456`
* `https://raw.githubusercontent.com/providers4syncler/providers/main/fast`
* `https://raw.githubusercontent.com/providers4syncler/providers/main/squizzle`
* `https://raw.githubusercontent.com/itzAki07/scraper/main/Wako.txt`

&#x200B;

# Kosmos - JustWatch:

*This is essentially the same as Syncler's built-in WatchNow provider, with some enhancements. This will search a pre-defined list of streaming service providers (Netflix, Hulu, Amazon, etc), and will return a link to those apps if a result is found and you have that app installed. Upon clicking a JustWatch result, Syncler will launch the respective streaming app and attempt to deep link you directly to the title. If a deep link cannot be established, you will be taken to the main activity of that application.*

### JustWatch (Default Streaming Providers)
   * *This searches popular streaming services and attempts to deep link within those apps that the user has installed*
   * [https://syncler-providers.000webhostapp.com/kosmos-justwatch.js](https://syncler-providers.000webhostapp.com/kosmos-justwatch.js)

### JustWatch (Whitelisted Streaming Providers)
   * *User can whitelist which streaming services they would like searched; Useful for those who have a streaming service app pre-installed on their device, but don't actually use that service*
   * [https://syncler-providers.000webhostapp.com/kosmos-justwatch.js?whitelist=netflix,hulu,amazon-prime-video,disney,hbo-max,showtime-anytime,fxnow,crackle,tubi,vudu,google-tv,youtube](https://syncler-providers.000webhostapp.com/kosmos-justwatch.js?whitelist=netflix,hulu,amazon-prime-video,disney,hbo-max,showtime-anytime,fxnow,crackle,tubi,vudu,google-tv,youtube)

### JustWatch (Blacklisted Streaming Providers)
   * *User can blacklist which streaming services they would like searched; Useful for those who have a streaming service app pre-installed on their device, but don't actually use that service*
   * [https://syncler-providers.000webhostapp.com/kosmos-justwatch.js?blacklist=netflix,hulu,amazon-prime-video,disney,hbo-max,showtime-anytime,fxnow,crackle,tubi,vudu,google-tv,youtube](https://syncler-providers.000webhostapp.com/kosmos-justwatch.js?blacklist=netflix,hulu,amazon-prime-video,disney,hbo-max,showtime-anytime,fxnow,crackle,tubi,vudu,google-tv,youtube)
