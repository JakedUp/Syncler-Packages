# Vendor - Hybrid:

*This intelligently combines all known packages for Syncler on-the-fly into a single hybrid package, de-duping any duplicate providers in the process. Please note that one of the source packages is Orion's Wako package, which includes many useful non-authenticated providers alongside Orion's own authenticated custom Search provider. I have provided 3 different flavors of my package depending on whether you want to use Orion Search or not, and whether you want Orion's Wako providers or not. To get an Orion API key, please visit* [*https://panel.orionoid.com/*](https://panel.orionoid.com/)

### All Known Providers (Including Orion Search)
   * *Provide an Orion API key to include the Orion Custom search provider as you have configured it in the Orion Panel*
   * [https://syncler-providers.herokuapp.com/syncler/vendor-hybrid.json?orion-api-key=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456](https://syncler-providers.herokuapp.com/syncler/vendor-hybrid.json?orion-api-key=) (use your own API key!)

### All Known Providers (Excluding Orion Search)
   * *Use this if you want all of the providers from Orion's Wako package, but have no intention on using the Orion service itself*
   * [https://syncler-providers.herokuapp.com/syncler/vendor-hybrid.json](https://syncler-providers.herokuapp.com/syncler/vendor-hybrid.json)

### Only Include Providers Not Found In Orion's Package
   * *Use this if you do not trust giving your API key to a third party, and plan on installing Orion's Wako package separately*
   * [https://syncler-providers.herokuapp.com/syncler/vendor-hybrid.json?exclude-orion=true](https://syncler-providers.herokuapp.com/syncler/vendor-hybrid.json?exclude-orion=true)

**Packages Used:**

* [com.jakedup.hybrid](packages.md)