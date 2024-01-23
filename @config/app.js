const App = Vue.createApp({
  data() {
    return {
      url: {
        server: 'https://syncler-providers.herokuapp.com/syncler'
      },
      express: {
        packages: {
          'OpenScrapers': 'https://raw.githubusercontent.com/SynclerScrapers/OpenScrapers/main/express/openscraper.json',
          'Orion - Wako': 'https://wako.orionoid.com/ABCDEFGHIJKLMNOPQRSTUVWXYZ123456',
          'Squizzle - Fast': 'https://raw.githubusercontent.com/providers4syncler/providers/main/fast',
          'Squizzle - Ultimate': 'https://raw.githubusercontent.com/providers4syncler/providers/main/squizzle',
          'Aki07 - Unified': 'https://raw.githubusercontent.com/itzAki07/scraper/main/scraper.json',
        },
        providers: {},
        blacklist: []
      },
      orion: {
        apiKey: '',
        commonProviders: 1
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
    expressQuery() {
      const params = {};
      if (this.orion.apiKey) {
        params['orion-api-key'] = this.orion.apiKey;
      }
      if (!this.orion.commonProviders) {
        params['exclude-orion'] = true;
      }
      if (this.express.blacklist.length) {
        params.blacklist = this.express.blacklist.join(',');
      }
      const query = new URLSearchParams(params).toString().replace(/%2C/g, ',');
      return query ? `?${query}` : '';
    },
    vendorUrl() {
      return `${this.url.server}/vendor-hybrid.json${this.expressQuery}`
    },
    expressUrl() {
      return `${this.url.server}/express-hybrid.json${this.expressQuery}`
    },
    justwatchQuery() {
      const params = {};
      if (this.justwatch.mode == 'whitelist' && this.justwatch.whitelist.length) {
        params.whitelist = this.justwatch.whitelist.join(',');
      } else
      if (this.justwatch.mode == 'blacklist' && this.justwatch.blacklist.length) {
        params.blacklist = this.justwatch.blacklist.join(',');
      }
      const query = new URLSearchParams(params).toString().replace(/%2C/g, ',');
      return query ? `?${query}` : '';
    },
    justwatchUrl() {
      return `${this.url.server}/kosmos-justwatch.js${this.justwatchQuery}`
    }
  },
  watch: {
    'orion.apiKey': function (newVal, oldVal) {
      if (newVal) {
        this.orion.apiKey = newVal.toUpperCase();
        this.orion.commonProviders = 1;
      }
    }
  },
  methods: {
    getProviders: function () {
      return fetch(this.expressUrl)
        .then(response => response.json())
        /*
        .then(json => Object.keys(json).filter(key => !key.includes('_manifest')).reduce((result, key) => ({...result, [key]: json[key].name}), {}));
        */
        .then(json => Object.fromEntries(Object.entries(json).filter(([key, value]) => key !== '_manifest')));
    }
  },
  created() {
    this.getProviders().then((providers) => {
      /*
      providers.orion = {
        name: 'Orion'
      };
      */
      this.express.providers = providers;
    });
  },
  mounted() {
    let $navTabs = jQuery(`.nav-tabs .nav-link`);
    if (window.location.hash) {
      $navTabs.filter(`[data-bs-target="${window.location.hash}"]`).click();
    }
    $navTabs.on('shown.bs.tab', function (event) {
      window.location.hash = $(event.target).attr('data-bs-target');
    });
  }
});

App.mount('.c-app');