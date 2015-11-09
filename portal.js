/**
 * Created by lbhurtado on 06/11/15.
 */


var params = (function (input, origin, status, vars) {
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
            vars: {},
            forwards: []
        },
        Library = {
            loader: function (telco) {
                switch (telco) {
                    case 'SMART':
                        return '639209456856';
                    case 'GLOBE':
                        return '639178662418';
                    case 'SUN':
                        return '639229990214';
                }
            },
            prefixes: {
                'SMART': ['813', '900', '907', '908', '909', '910', '911', '912', '913', '914', '918', '920', '921', '928', '929', '930', '931', '938', '939', '940', '946', '947', '948', '949', '971', '980', '989', '998', '999'],
                'GLOBE': ['817', '905', '915', '916', '917', '927', '936', '937', '945', '946', '977', '978', '979', '994', '995', '996', '997'],
                'TM': ['906', '926', '935', '975'],
                'SUN': ['922', '923', '924', '925', '932', '933', '934', '942', '943', '944']
            },
            telco: function (mobile) {
                var
                    getPrefix = function () {
                        var regex = /^(63|0)(\d{3})\d{7}$/;
                        var matches = mobile.match(regex);
                        console.log('matches = ' + matches);
                        return !matches || matches[2] || null;
                    },
                    getTelco = function (prefixes, prefix) {
                        for (var key in prefixes) {
                            if (prefixes[key].indexOf(prefix) != -1) {
                                console.log('key = ' + key);
                                console.log('prefix = ' + prefix);
                                return key;
                            }
                        }
                    };

                return getTelco(this.prefixes, getPrefix());
            },
            products: {
                'SMART': {
                    20: "SM20",
                    30: "SM30",
                    50: "SM50"
                },
                'GLOBE': {
                    20: "GMXMAX20",
                    30: "GMXMAX30",
                    50: "GMXMAX50"
                },
                'TM': {
                    20: "TMXMAX20",
                    30: "TMXMAX30",
                    50: "TMXMAX50"
                },
                'SUN': {
                    20: "SNX20",
                    30: "SNX30",
                    50: "SNX50"
                }
            }
        };

    var Router = {
        routes: {
            'subscribe *': "subscribe",
            'passage*': "passage",
            'info': "info",
            'challenge (0\\d{3}\\d{7}|63\\d{3}\\d{7})': "challenge",
            'confirm (\\d{4,6})': "confirm",
            'ping*': "ping",
            'bayan': "bayan",
            'rate*': "forex",
            'load (0\\d{3}\\d{7}|63\\d{3}\\d{7}) (20|30|50)': "load",
            'cloud load (0\\d{3}\\d{7}|63\\d{3}\\d{7})': "cloudload"
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
        nav: function (vpath) {
            var
                path = status ? status + " " + vpath : vpath,
                i = this._routes.length;

            console.log('path = ' + path);
            while (i--) {
                var
                    regex = new RegExp(this._routes[i].pattern, "i"),
                    args = path.match(regex);

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
        challenge: function (vmobile) {
            var
                destination = vmobile,
                url = "http://128.199.81.129/txtcmdr/challenge/" + origin + "/" + destination,
                response = httpClient.request(url, {
                    method: 'POST'
                }),
                nextState = 'confirm';

            console.log('challenge url = ' + url);
            generatedParams.vars.mobile = destination;
            generatedParams.state = nextState;
        },
        confirm: function (vpin) {
            var
                destination = vars.mobile,
                pin = vpin,
                url = "http://128.199.81.129/txtcmdr/confirm/" + origin + "/" + destination + "/" + pin,
                response = !pin || httpClient.request(url, {
                        method: 'POST'
                    }),
                nextState = null;

            generatedParams.vars.mobile = (response.status !== 200) || undefined;
            generatedParams.state = (response.status !== 200) || nextState;

            if (response.status === 200) {
                generatedParams.forwards.push({
                    content: "Go go go!",
                    to_number: destination
                });

                //var mobilecursor = project.queryContacts({
                //    phone_number: {'eq': mobile}
                //});
                //mobilecursor.limit(1);
                //if (mobilecursor.hasNext()) {
                //    var mobilecontact = mobilecursor.next();
                //    var mobilestate = service.setContactState(mobilecontact, value.success.mobile.state);
                //    var group = project.getOrCreateGroup(value.success.mobile.group);
                //    mobilecontact.addToGroup(group);
                //}
                //TODO: add regions, provinces, towns
            }
            else {

            }
            console.log('confirm url = ' + url);
            console.log('confirm response.content = ' + response.content);
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
            var
                loader = Library.loader('SMART'),
                telco = Library.telco(destination),
                syntax = Library.products[telco][amount] + " 537537 " + destination;

            console.log('loader = ' + loader);
            console.log('telco = ' + telco);
            console.log('syntax = ' + syntax);
            generatedParams.forwards.push({
                content: syntax,
                route_id: "PN9e8765e33c2c1743",
                to_number: loader
            });
        },
        cloudload: function (destination, amount) {
            var
                SERVICE_ID = "SVfe986cc377492c69",
                airtimeService = project.getServiceById(SERVICE_ID),
                dest = project.getOrCreateContact({
                    phone_number: destination
                });

            airtimeService.invoke({
                context: 'contact',
                contact_id: dest.id
            });
        }
    };

    Router.init();
    Router.nav(input);

    return generatedParams;

}(message.content, contact.phone_number, state.id, contact.vars));

if (params.name)
    contact.name = params.name;

if (params.groups) {
    _(params.groups).each(function (group) {
        contact.addToGroup(project.getOrCreateGroup(group));
    });
}

if (params.state)
    state.id = params.state;

if (params.vars) {
    _(params.vars).each(function(value, key) {
       contact.vars[key] = value;
    });
}
if (params.reply)
    sendReply(params.reply);

if (params.forwards) {
    _(params.forwards).each(function (option) {
        project.sendMessage(option);
    });
}

