(function(w, d, undefined) {

    w.onload = function() {
        gapi.client.setApiKey('AIzaSyAHFvb3G7ggcDtz_MDy04DntEnHs8eCEbc');
        gapi.client.load('urlshortener', 'v1', function() {});
    }

    var input = d.getElementsByClassName('share__short-link')[0];
    var share = d.getElementsByClassName('share')[0];
    var cache = {};


    share.onclick = function onShareClick() {
        var url = w.location.href;

        if (cache[url]) {
            shareCallback({ id: cache[url], longUrl: url });
        } else {
            w.demo.makeShort(url);
        }

        return false;
    };

    w.demo = w.demo || {},

    w.demo.makeShort = function(url) {
        if (!url) return;

        var request = gapi.client.urlshortener.url.insert({
            resource: { longUrl: url }
        });

        request.execute(shareCallback);
    };

    var shareCallback = function(res) {
        if (res && res.id) {
            input.value = res.id;
            input.style.display = 'inline';
            input.select();

            if (!cache[res.longUrl]) {
                cache[res.longUrl] = res.id;
            }
        } else {
            input.style.display = 'none';
            console.error('Error getting short url from goo.gl… :(');
        }
    };

    var onInputClick = function() {
        input.select();

        return false;
    };

    input.onchange = onInputClick;

})(window, document);
