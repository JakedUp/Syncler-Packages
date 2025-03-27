(function() {

const urlParams = new URLSearchParams(window.location.search);
const App = Vue.createApp({
  data() {
    return {
      express: {
        packages: {
          'OpenScrapers': 'https://raw.githubusercontent.com/SynclerScrapers/OpenScrapers/main/express/openscraper.json',
          'Orion - Wako': 'https://wako.orionoid.com/ABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
          'Squizzle - Fast': 'https://raw.githubusercontent.com/providers4syncler/providers/main/fast',
          'Squizzle - Ultimate': 'https://raw.githubusercontent.com/providers4syncler/providers/main/squizzle',
          'Syncler.ml - Providers': 'https://pastebin.com/raw/Rue82khh?source=http://go.syncler.ml/express',
          'Aki07 - Unified': 'https://pastebin.com/raw/jgCnPnwR?source=https://raw.githubusercontent.com/itzAki07/scraper/main/scraper.json',
        },
        providers: {},
        blacklist: (urlParams.get('blacklist') || '').split(',').filter(Boolean)
      },
      orion: {
        apiKey: urlParams.get('orion-api-key') || '',
        commonProviders: urlParams.get('common-providers') || 'on'
      },
      jackett: {
        baseUrl: urlParams.get('jackett-base-url') || '',
        apiKey: urlParams.get('jackett-api-key') || ''
      },
      kosmos: {
        packages: {
          /*
          'WeeklyProblem - Bouncy': 'https://raw.githubusercontent.com/WeeklyProblem/Bouncy/main/bouncy.min.js'
          */
        }
      },
      justwatch: {
        mode: 'default',
        providers: {
          'netflix': 'Netflix',
          'hulu': 'Hulu',
          'amazon-prime-video': 'Amazon Prime Video',
          'disney': 'Disney',
          'hbo-max': 'HBO Max',
          'showtime-anytime': 'Showtime Anytime',
          'fxnow': 'FX Now',
          'crackle': 'Crackle',
          'tubi': 'Tubi',
          'vudu': 'Vudu',
          'google-tv': 'Google TV',
          'youtube': 'YouTube',
        },
        blacklist: [],
        whitelist: []
      }
    }
  },
  computed: {
    server() {
      const version = urlParams.get('v') == 1 ? 1 : 2;
      return {
        version: version,
        url: version == 2 ? 'https://jakedup.com/syncler' : 'https://syncler-providers.herokuapp.com/syncler'
      };
    },
    expressParams() {
      const params = {};
      if (this.orion.apiKey) {
        params['orion-api-key'] = this.orion.apiKey;
      }
      if (this.orion.commonProviders === 'off') {
        if (this.server.version == 2) {
          params['common-providers'] = 'off';
        } else {
          params['exclude-orion'] = true;
        }
      }
      if (this.jackett.baseUrl && this.jackett.apiKey) {
        params['jackett-base-url'] = this.jackett.baseUrl.replace(/[\/\s]+$/, '');
        params['jackett-api-key'] = this.jackett.apiKey;
      }
      if (this.express.blacklist.length) {
        params['blacklist'] = this.express.blacklist.join(',');
      }
      return params;
    },
    vendorUrl() {
      return `${this.server.url}/${this.server.version == 2 ? 'vendor' : 'vendor-hybrid.json'}${this.paramsToQuery(this.expressParams)}`;
    },
    expressUrl() {
      return `${this.server.url}/${this.server.version == 2 ? 'express' : 'express-hybrid.json'}${this.paramsToQuery(this.expressParams)}`;
    },
    justwatchParams() {
      const params = {};
      if (this.justwatch.mode == 'whitelist' && this.justwatch.whitelist.length) {
        params['whitelist'] = this.justwatch.whitelist.join(',');
      } else
      if (this.justwatch.mode == 'blacklist' && this.justwatch.blacklist.length) {
        params['blacklist'] = this.justwatch.blacklist.join(',');
      }
      return params;
    },
    justwatchUrl() {
      return `${this.server.url}/${this.server.version == 2 ? 'justwatch.js' : 'kosmos-justwatch.js'}${this.paramsToQuery(this.justwatchParams)}`;
    }
  },
  watch: {
    'orion.apiKey': function (newVal, oldVal) {
      if (newVal) {
        this.orion.apiKey = newVal.replace(/\/+$/, '').replace(/^.*\/+/, '').toUpperCase();
        this.orion.commonProviders = 'on';
      }
    }
  },
  methods: {
    paramsToQuery: function (params) {
      const query = new URLSearchParams(params || {}).toString().replace(/%2C/g, ',');
      return query ? `?${query}` : '';
    },
    getProviders: function () {
      return fetch(this.expressUrl.replace(/\?.*/, ''))
        .then(response => response.json())
        .then(json => Object.fromEntries(Object.entries(json).filter(([key, value]) => key !== '_manifest')));
    }
  },
  created() {
    this.getProviders().then((providers) => {
      this.express.providers = providers;
    }).catch((error) => console.error('Failed to fetch providers list'))
  },
  mounted() {
    const $navTabs = $(`#tabs .nav-link`);
    if (urlParams.size) {
      const id = urlParams.get('id');
      $navTabs.filter(`[data-bs-target="#${id}"]`).click();
    }
    $navTabs.on('shown.bs.tab', function (event) {
      const id = $(event.target).attr('data-bs-target').replace(/^#/, '');
      urlParams.set('id', id);
      const newUrl = window.location.pathname + '?' + urlParams.toString();
      history.replaceState(null, null, newUrl);
    });
    if (urlParams.size) {
      const newParams = new URLSearchParams();
      urlParams.has('v') && newParams.set('v', urlParams.get('v'));
      urlParams.has('id') && newParams.set('id', urlParams.get('id'));
      const newUrl = window.location.pathname + '?' + newParams.toString();
      history.replaceState(null, null, newUrl);
    }
  }
});

App.mount('.c-app');

window.App = App;

}())