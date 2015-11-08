/**
 * Created by lbhurtado on 06/11/15.
 */


var params = (function (input, mobile, status) {
    'use strict';

    _.mixin({
        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        },
        titleCase: function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        analyzeParams: function (params) {
            var parts = [];
            _(params).each(function (param) {
                if (!_.isUndefined(param)) {
                    parts.push(param);
                }
            });
            var input = parts.pop();
            return {
                'input': input,
                'parts': parts
            };
        }
    });

    function sprintf() {
        //  discuss at: http://phpjs.org/functions/sprintf/
        // original by: Ash Searle (http://hexmen.com/blog/)
        // improved by: Michael White (http://getsprink.com)
        // improved by: Jack
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Dj
        // improved by: Allidylls
        //    input by: Paulo Freitas
        //    input by: Brett Zamir (http://brett-zamir.me)
        //   example 1: sprintf("%01.2f", 123.1);
        //   returns 1: 123.10
        //   example 2: sprintf("[%10s]", 'monkey');
        //   returns 2: '[    monkey]'
        //   example 3: sprintf("[%'#10s]", 'monkey');
        //   returns 3: '[####monkey]'
        //   example 4: sprintf("%d", 123456789012345);
        //   returns 4: '123456789012345'
        //   example 5: sprintf('%-03s', 'E');
        //   returns 5: 'E00'

        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
        var a = arguments;
        var i = 0;
        var format = a[i++];

        // pad()
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
                .join(chr);
            return leftJustify ? str + padding : padding + str;
        };

        // justify()
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                } else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        };

        // formatBaseX()
        var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            prefix = prefix && number && {
                    '2': '0b',
                    '8': '0',
                    '16': '0x'
                }[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };

        // formatString()
        var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };

        // doFormat()
        var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            var number, prefix, method, textTransform, value;

            if (substring === '%%') {
                return '%';
            }

            // parse flags
            var leftJustify = false;
            var positivePrefix = '';
            var zeroPad = false;
            var prefixBaseX = false;
            var customPadChar = ' ';
            var flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j)) {
                    case ' ':
                        positivePrefix = ' ';
                        break;
                    case '+':
                        positivePrefix = '+';
                        break;
                    case '-':
                        leftJustify = true;
                        break;
                    case "'":
                        customPadChar = flags.charAt(j + 1);
                        break;
                    case '0':
                        zeroPad = true;
                        customPadChar = '0';
                        break;
                    case '#':
                        prefixBaseX = true;
                        break;
                }
            }

            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values
            if (!minWidth) {
                minWidth = 0;
            } else if (minWidth === '*') {
                minWidth = +a[i++];
            } else if (minWidth.charAt(0) == '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            } else {
                minWidth = +minWidth;
            }

            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }

            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }

            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
            } else if (precision === '*') {
                precision = +a[i++];
            } else if (precision.charAt(0) == '*') {
                precision = +a[precision.slice(1, -1)];
            } else {
                precision = +precision;
            }

            // grab value using valueIndex if required?
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

            switch (type) {
                case 's':
                    return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                case 'c':
                    return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                case 'b':
                    return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o':
                    return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
                        .toUpperCase();
                case 'u':
                    return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'i':
                case 'd':
                    number = +value || 0;
                    number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                    prefix = number < 0 ? '-' : positivePrefix;
                    value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad);
                case 'e':
                case 'E':
                case 'f': // Should handle locales (as per setlocale)
                case 'F':
                case 'g':
                case 'G':
                    number = +value;
                    prefix = number < 0 ? '-' : positivePrefix;
                    method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                    textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                    value = prefix + Math.abs(number)[method](precision);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                default:
                    return substring;
            }
        };

        return format.replace(regex, doFormat);
    }

    var
        generatedParams = {
            state: null,
            forwards: []
        }

    var Router = {
        routes: {
            'subscribe *': "subscribe",
            'passage*': "passage",
            'info': "info",
            'challenge :origin :mobile': "challenge",
            'ping*': "ping",
            'bayan': "bayan",
            'rate*': "forex",
            'load :destination :amount': "load"
        },
        init: function () {
            this._routes = [];
            for (var route in this.routes) {
                if (this.hasOwnProperty('routes')) {
                    var methodName = this.routes[route];
                    var regex = route
                            .replace(/:\w+/g, '(\\w+)')
                            .replace(/\*/, '[ \t]*([^\n\r]*)') //everything after >
                            .replace(/\w+=\w+/g, '(\\w+=\\w+)\\b') //query string after ?
                        ;
                    console.log('regex = ' + regex);
                    this._routes.push({
                        pattern: '^' + regex + '$',
                        callback: this[methodName]
                    });
                }
            }
        },
        nav: function (path) {
            var i = this._routes.length;
            while (i--) {
                var regex = new RegExp(this._routes[i].pattern, "i");
                var args = path.match(regex);
                console.log('args = ' + args);
                if (args) {
                    this._routes[i].callback.apply(this, args.slice(1));
                }
            }
        },
        subscribe: function (param) {
            var
                name = _(param).titleCase(),
                group = "subscriber",
                replyFormat = "%s, you are now a subscriber.",
                reply = sprintf(replyFormat, name),
                state = null;

            generatedParams.name = name;
            generatedParams.groups = [group];
            generatedParams.reply = reply;
            generatedParams.state = state;
        },
        passage: function (param) {
            var
                passage = param ? param : "random",
                urlFormat = "http://labs.bible.org/api/?passage=%s&formatting=plain&type=text",
                url = sprintf(urlFormat, encodeURI(passage)),
                response = httpClient.request(url, {
                    method: 'GET'
                }),
                reply = response.content;

            generatedParams.reply = reply;
        },
        info: function (param) {
            generatedParams.reply = "The quick brown fox jumps over the lazy dog.";
        },
        challenge: function (vorigin, vmobile) {
            var
                url = "http://128.199.81.129/txtcmdr/challenge/" + vorigin + "/" + vmobile,
                response = httpClient.request(url, {
                    method: 'POST'
                });
            console.log(url);
        },
        bayan: function (params) {
            generatedParams.reply = "Sorry for the inconvenience. App under construction."
        },
        ping: function (params) {
            var
                ip = params ? params : "128.199.81.129",
                url = 'http://api.hackertarget.com/nping/?q=' + ip,
                response = httpClient.request(url, {
                    method: 'GET'
                }),
                yo = (response.content).match(/(RCVD.*)/);

            generatedParams.reply = yo[0];
        },
        forex: function (params) {
            var
                pair = params ? params : "USDPHP",
                url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22" +
                    pair +
                    "%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=",
                response = httpClient.request(url, {
                    method: 'GET'
                }),
                content = JSON.parse(response.content),
                yo = content.query.results.rate;

            generatedParams.reply = yo.Rate;
        },
        load: function (destination, amount) {
            generatedParams.forwards.push({
                content: amount,
                route_id: "PN9e8765e33c2c1743",
                to_number: destination
            });
        }
    };

    Router.init();
    Router.nav(input);

    return generatedParams;

}(message.content, contact.phone_number, state.id));

if (params.name)
    contact.name = params.name;

if (params.groups) {
    _(params.groups).each(function (group) {
        contact.addToGroup(project.getOrCreateGroup(group));
    });
}

if (params.state)
    state.id = params.state;

if (params.reply)
    sendReply(params.reply);

if (param.forwards) {
    _(forwards).each(function(option){
        project.sendMessage(option);
    });
}

