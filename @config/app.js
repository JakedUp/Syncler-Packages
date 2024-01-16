const App = Vue.createApp({
  data() {
    return {
      orion: {
        apiKey: '',
        commonProviders: 1
      },
      justwatch: {
        mode: 'default',
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
        params['orion-exclude'] = true;
      }
      const query = new URLSearchParams(params).toString().replace(/%2C/g, ',');
      return query ? `?${query}` : '';
    },
    vendorUrl() {
      return `https://syncler-providers.herokuapp.com/syncler/vendor-hybrid.json${this.expressQuery}`
    },
    expressUrl() {
      return `https://syncler-providers.herokuapp.com/syncler/express-hybrid.json${this.expressQuery}`
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
      return `https://syncler-providers.herokuapp.com/syncler/kosmos-justwatch.js${this.justwatchQuery}`
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
  mounted() {
    if (window.location.hash) {
      jQuery(`.nav-tabs .nav-link[data-bs-target="${window.location.hash}"]`).click();
      jQuery(`.nav-tabs .nav-link`).on('shown.bs.tab', function (event) {
        window.location.hash = $(event.target).attr('data-bs-target');
      });
    }
  }
});

App.mount('.c-app');