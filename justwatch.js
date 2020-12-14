/*
{
  "name": "JustWatch",
  "id": "com.jakedup.justwatch",
  "version": 1,
  "classPath": "JakedUp.JustWatch",
  "permaUrl": "hhttps://raw.githubusercontent.com/JakedUp/Syncler-Packages/main/justwatch.js"
}
*/

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.JakedUp = {})));
} (this, (function(exports) {
  'use strict';

  var simplify_string = function(string, spaces) {
    return (string || '')
    .toString()
    .replace(/[\{\}\[\]\(\)\-\_\.\s]+/g, ' ')
    .replace(/(^\s*The\s+|\,\s*The\s*$)/gi, '')
    .replace(/\s+(And|&|\'?N)\s+/gi, ' ')
    .replace(/\s+(Part|Pt\.)\s+/gi, ' ')
    .replace(/[^A-Za-z0-9\s]/g, '')
    .replace(/\s+/g, spaces || '')
    .toLowerCase();
  };

  var object_map = function(object, callback) {
    var new_array = [];
    Object.keys(object).forEach(function(key, index) {
      new_array.push(callback(object[key], key))
    });
    return new_array;
  };

  class JustWatch {
    constructor() {
      this.sourceProviders = [
        new JustWatchProvider()
      ];
    }
    createBundle(env, request) {
      return new Promise((resolve, reject) => {
        var bundle = {
          sources: [],
          sourceProviderMetadatas: this.sourceProviders.map(function(provider) {
            return provider.metadata;
          })
        };
        resolve(bundle);
      });
    }
    createSourceProvider(env, metadata) {
      return this.sourceProviders.filter(function(provider) {
        return provider.metadata.name == metadata.name;
      })[0];
    }
  }

  class JustWatchProvider {
    constructor() {
      this.metadata = {
        name: 'JustWatch',
        premium: false,
        containsTorrents: false,
        requiresDebrid: false,
      };
    }
    search(env, request) {
      request.collectionItem = request.movie || request.episode;
      request.collection = request.collectionItem.show || request.collectionItem;
      request.meta = {};
      request.meta.type = request.movie ? 'movie' : 'show';
      request.meta.title = (request.collection.titles.original||{}).title || request.collection.titles.main.title;
      request.meta.year = new Date(request.collection.release * 1000).getFullYear();
      request.meta.runtime = request.meta.type == 'movie' ? '110 min' : '50 min';
      request.meta.filesize = (parseInt(request.meta.runtime) * 60) * (request.meta.type == 'movie' ? 1000000 : 500000);

      var providers = {
        8: {
          name: 'Netflix',
          android_ids: ['com.netflix.mediaclient', 'com.netflix.ninja'],
          justwatch_slug: 'nfx'
        },
        15: {
          name: 'Hulu',
          android_ids: ['com.hulu.plus', 'com.hulu.livingroomplus'],
          justwatch_slug: 'hlu'
        },
        9: {
          name: 'Amazon Prime Video',
          android_ids: ['com.amazon.avod.thirdpartyclient', 'com.amazon.amazonvideo.livingroom', 'com.amazon.amazonvideo.livingroom.firetv'],
          justwatch_slug: 'amp'
        },
        337: {
          name: 'Disney+',
          android_ids: ['com.disney.disneyplus'],
          justwatch_slug: 'dnp'
        },
        384: {
          name: 'HBO MAX',
          android_ids: ['com.hbo.hbonow', 'com.hbo.go'],
          justwatch_slug: 'hbm'
        },
        37: {
          name: 'Showtime Anytime',
          android_ids: ['com.showtime.showtimeanytime', 'com.showtime.standalone'],
          justwatch_slug: 'sho'
        },
        123: {
          name: 'FXNow',
          android_ids: ['com.fxnetworks.fxnow'],
          justwatch_slug: 'fxn'
        },
        12: {
          name: 'Crackle',
          android_ids: ['com.gotv.crackle.handset', 'com.crackle.androidtv', 'com.crackle.androidtv.svod'],
          justwatch_slug: 'crk'
        },
        73: {
          name: 'Tubi',
          android_ids: ['com.tubitv'],
          justwatch_slug: 'tbv'
        },
        7: {
          name: 'VUDU',
          android_ids: ['air.com.vudu.air.DownloaderTablet', 'com.nvidia.vuduapp'],
          justwatch_slug: 'vdu'
        },
        3: {
          name: 'Google TV',
          android_ids: ['com.google.android.videos'],
          justwatch_slug: 'ply'
        },
        192: {
          name: 'YouTube',
          android_ids: ['com.google.android.youtube', 'com.google.android.youtube.tv', 'com.amazon.firetv.youtube', 'com.google.android.youtube.googletv', 'com.google.android.youtube.googletv'],
          justwatch_slug: 'yot'
        }
      };

      var search_justwatch = function(title, year, type) {
        var config = {
          'page_size': 5,
          'page': 1,
          'query': title,
          'release_year_from': year-1,
          'release_year_until': year+1,
          'matching_offers_only': true,
          'content_types': [
            type
          ],
          'monetization_types': [
            'flatrate',
            'free',
            'ads',
            // 'rent',
            // 'buy',
            // 'cinema'
          ],
          'providers': object_map(providers, function(provider, id) {
            return provider.justwatch_slug;
          }),
        };
        var url = 'https://apis.justwatch.com/content/titles/en_US/popular?language=en&body='+encodeURIComponent(JSON.stringify(config));
        var axios = env.httpClientFactory.createNewInstance();
        return axios.request({
          url: url
        }).then(response => {
          return response.data;
        }).then(results => {
          var result = {};
          if (results.items) {
            results.items.some(function(item, index) {
              if (
                (
                  (simplify_string(item.title).startsWith(simplify_string(title))) ||
                  (simplify_string(item.original_title).startsWith(simplify_string(title)))
                ) &&
                (
                  (simplify_string(item.original_release_year).indexOf(simplify_string(year)) > -1) ||
                  (simplify_string(item.localized_release_date).indexOf(simplify_string(year)) > -1)
                )
              ) {
                item.offers = item.offers.reverse();
                result = item;
                return true;
              }
            });
            console.log('Success fetching API!');
          } else {
            console.log('Error fetching API!');
          }
          return result;
        });
      }

      return new Promise((resolve, reject) => {
        search_justwatch(request.meta.title, request.meta.year, request.meta.type).then(result => {
          var uniques = [];
          var results = [];
          if (result.offers) {
            result.offers.forEach(function(offer, index) {
              if (!uniques.includes(offer.provider_id)) {
                uniques.push(offer.provider_id);
                var provider = providers[offer.provider_id];
                provider.android_ids.forEach(function(android_id) {
                  results.push({
                    name: `${request.meta.title} (${request.meta.year}) (${offer.presentation_type.toUpperCase()})`,
                    androidPackageName: android_id,
                    androidPackageData: offer.urls.standard_web || offer.urls.deeplink_android_tv,
                    url: offer.urls.standard_web || offer.urls.deeplink_android_tv,
                    quality: offer.presentation_type,
                    sizeInBytes: request.meta.filesize
                  });
                });
              }
            });
            console.log(results.length+' results found!');
          } else {
            console.log('No results found!');
          }
          resolve(results);
        });
      });
    }
  }

  exports.JustWatch = JustWatch;

  Object.defineProperty(exports, '__esModule', {value: true});
})));