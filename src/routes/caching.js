//caching pages
function Caching() {
    'use strict';
    
    let cache = {};

    this.getPageFromCache = function(url, cb) {
        if (cache[url]) {
            cb(undefined, cache[url]);
        } else {
            cb();
        }
    }
  
    this.setPageToCache = function(url, content) {
      cache[url] = content ;
    }
}

module.exports = Caching;