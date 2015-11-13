/**
 * Created by lbhurtado on 06/11/15.
 */


var params = (function (input, phone_number, status, vars) {
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

    function strip_tags(input, allowed) {
        //  discuss at: http://phpjs.org/functions/strip_tags/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Luke Godfrey
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //    input by: Pul
        //    input by: Alex
        //    input by: Marc Palau
        //    input by: Brett Zamir (http://brett-zamir.me)
        //    input by: Bobby Drake
        //    input by: Evertjan Garretsen
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Onno Marsman
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Eric Nagel
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // bugfixed by: Tomasz Wesolowski
        //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
        //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
        //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
        //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
        //   returns 2: '<p>Kevin van Zonneveld</p>'
        //   example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
        //   returns 3: "<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>"
        //   example 4: strip_tags('1 < 5 5 > 1');
        //   returns 4: '1 < 5 5 > 1'
        //   example 5: strip_tags('1 <br/> 1');
        //   returns 5: '1  1'
        //   example 6: strip_tags('1 <br/> 1', '<br>');
        //   returns 6: '1 <br/> 1'
        //   example 7: strip_tags('1 <br/> 1', '<br><br/>');
        //   returns 7: '1 <br/> 1'

        allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '')
            .replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });
    }

    var
        generatedParams = {
            state: undefined,
            vars: {},
            forwards: [],
            posts: []
        },
        cache = {
            id: {
                project: "PJf3e398e4fb9f4a07",
                group: {
                    'Sent Airtime': "CGd8a70f14651c80d5",
                    'subscriber': "CGa9242f10f828f6ab"
                },
                phone: {
                    'beverly_hills': "PN59a2e385cb40a474",
                    'samsung_smart': "PN59a2e385cb40a474",
                    'lg_smart': "PN9e8765e33c2c1743",
                    'oppo_globe': "PN9483093de6bafd0b"
                }
            }
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
                        var regex = /(63|0)(\d{3})\d{7}$/;
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
            formalize: function (somenumber) {
                var
                    regex = /(63|0)(\d{10})$/,
                    matches = somenumber.match(regex);

                if (matches) {
                    return '63' + matches[2];
                }

                return somenumber;
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
            },
            getGroupId: function (vname) {
                if (cache.id.group[vname]) {
                    return cache.id.group[vname];
                }

                return null;
            },
            replaceAll: function (str,mapObj){
                var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

                return str.replace(re, function(matched){
                    return mapObj[matched.toLowerCase()];
                });
            },
            getYahooURI: function (vtemplate, mapping) {
                var
                    pre = "https://query.yahooapis.com/v1/public/yql?q=",
                    post = "&format=json&env=store://datatables.org/alltableswithkeys",
                    str =  this.replaceAll(vtemplate, mapping),
                    retval  = encodeURI(pre + str + post);

                console.log('retval = ' + retval);

                //http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings

                return retval;

            }
        },
        origin = Library.formalize(phone_number);

    var Router = {
        routes: {
            'join :group *username': "join",
            'baligod *username': "baligod",
            'passage*params': "passage",
            'info': "info",
            'recruit (0\\d{3}\\d{7}|63\\d{3}\\d{7}|\\+63\\d{3}\\d{7})': "recruit",
            'confirm (\\d{4,6})': "confirm",
            'ping*host': "ping",
            'bayan': "bayan",
            'rate*pair': "forex",
            'load (0\\d{3}\\d{7}|63\\d{3}\\d{7}) (20|30|50)': "load",
            'cloud load (0\\d{3}\\d{7}|63\\d{3}\\d{7})': "cloudload",
            'm=\\d{15}.*querystring': "igps",
            'news*params': "news",
            'broadcast :group *message': "broadcast",
            '@:group *message': "broadcast",
            'bible*passage': "bible",
            'weather*location': "weather"
        },
        init: function () {
            this._routes = [];
            for (var route in this.routes) {
                if (this.hasOwnProperty('routes')) {
                    var methodName = this.routes[route];
                    var regex = route
                            .replace(/:\w+/g, '(\\w+)')
                            .replace(/\*\w+/, '[ \t]*([^\n\r]*)') //everything after >
                            .replace(/\w+=\w+/g, '(\\w+=\\w+)\\b') //query string after ?
                        ;
                    //console.log('regex = ' + regex);
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
        join: function (vgroup, vusername) {
            var
                username = _(vusername).titleCase(),
                group = vgroup.toLowerCase(),
                group_id = Library.getGroupId(group),
                replyFormat = "%s, you are now a subscriber.",
                reply = sprintf(replyFormat, username),
                state = null;

            generatedParams.name = username;
            generatedParams.group_ids = [group_id];
            generatedParams.reply = reply;
            generatedParams.state = state;
        },
        baligod: function (vusername) {
            var
                username = _(vusername).titleCase(),
                group = "subscriber",
                group_id = Library.getGroupId(group),
                replyFormat = "%s, you are now part of Atty. Baligod's campaign.",
                reply = sprintf(replyFormat, username),
                state = null;

            generatedParams.name = username;
            generatedParams.group_ids = [group_id];
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
        recruit: function (vmobile) {
            var
                destination = Library.formalize(vmobile),
                url = "http://128.199.81.129/txtcmdr/challenge/" + origin + "/" + destination,
                response = httpClient.request(url, {
                    method: 'POST'
                }),
                reply = "One-time PIN has been sent.  Ask your recruit and reply using that PIN.",
                nextState = "confirm";

            console.log('recruit url = ' + url);

            if (response.status === 200) {
                generatedParams.reply = reply;
                generatedParams.vars.mobile = destination;
                generatedParams.state = nextState;
            }

        },
        confirm: function (vpin) {
            var
                destination = vars.mobile,
                pin = vpin,
                url = "http://128.199.81.129/txtcmdr/confirm/" + origin + "/" + destination + "/" + pin,
                response = !pin || httpClient.request(url, {
                        method: 'POST'
                    }),
                missive = {
                    content: "Thank you.  You are now part of our campaign. You will receive news and messages from our HQ.",
                    to_number: destination
                },
                nextState = null;

            if (response.status === 200) {
                generatedParams.vars.mobile = null;
                generatedParams.forwards.push(missive);
                generatedParams.state = nextState;
                this.load(destination, 20);
            }

            //if (response.status === 200) {
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
            //}
            //else {
            //
            //}
            console.log('confirm url = ' + url);
            console.log('response.status = ' + response.status);
        },
        bayan: function (params) {
            generatedParams.reply = "Sorry for the inconvenience. App under construction."
        },
        ping: function (vhost) {
            var
                ip = vhost ? vhost : "128.199.81.129",
                url = 'http://api.hackertarget.com/nping/?q=' + ip,
                response = httpClient.request(url, {
                    method: 'GET'
                }),
                yo = (response.content).match(/(RCVD.*)/);

            console.log('ping ip = ' + ip);
            console.log('url ip = ' + url);

            generatedParams.reply = yo[0];
        },
        forex: function (params) {
            var
                //pair = params ? params : "USDPHP",
                pair = params ? params : "USDPHP,PHPJPY,SGDPHP,HKDPHP,CNYPHP",
                mapping = {
                    ':pair': pair
                },
                uri = Library.getYahooURI("select * from yahoo.finance.xchange where pair in (':pair')", mapping),
                response = httpClient.request(uri, {
                    method: 'GET'
                }),
                content = JSON.parse(response.content),
                yo = '';

            if (_(content.query.results.rate).isArray()) {
                var _pairs = pair.split(',');
                var _rates = _(content.query.results.rate).pluck('Rate');
                for (i = 0, j=_rates.length ; i <j ; i++) {
                    yo = yo + _pairs[i].toUpperCase() + '=' + _rates[i] + "\n";
                }
            }
            else {
                yo = pair.toUpperCase() + '=' + content.query.results.rate.Rate;
            }


            generatedParams.reply = yo + "\n - brought to you by CANDIDATE";
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
        },
        igps: function () {
            var
                uri = input,
                records = {};

            uri.replace(
                new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                function ($0, $1, $2, $3) {
                    records[$1] = $3;
                }
            );

            generatedParams.posts.push({
                table: "igps",
                data: records
            });

            //_(records).each(function (value, key) {
            //    console.log(key + ' = ' + value);
            //});

        },
        news: function (params) {
            var
                category = params ? params : "metro",
                getURL = function (vcategory) {
                    var urls = {
                        'metro': "http://www.gmanetwork.com/news/rss/news/metro",
                        'flash': "http://www.gmanetwork.com/news/rss/videos/show/flashreport",
                        'showbiz': "http://www.gmanetwork.com/news/rss/showbiz",
                        'balitanghali': "http://www.gmanetwork.com/news/rss/videos/show/balitanghali",
                        '24oras': "http://www.gmanetwork.com/news/rss/videos/show/24oras",
                        'ofw': "http://www.gmanetwork.com/news/rss/news/pinoyabroad",
                        'sports': "http://www.gmanetwork.com/news/rss/sports"
                    };

                    return urls[vcategory];
                },
                cnt = 4,
                mapping = {
                    ':url': getURL(category),
                    ':count': cnt
                },
                uri = Library.getYahooURI("select title from rss where url=':url' | truncate(count=:count)", mapping),
                response = httpClient.request(uri, {
                    method: 'GET'
                }),
                content = JSON.parse(response.content),

                yo = content.query.results.item,
                reply = function () {
                    var x = [];
                    for (var i = 0, len = yo.length; i < len; i++) {
                        var y = yo[i],
                            z = y.title.replace(/&rsquo;/g, "'"),
                            z = z.replace(/&#39;/g, "'"),
                            z = strip_tags(z);
                        x.push(z);
                    }
                    return x.join("\n");
                };

            generatedParams.reply = reply() + "\n - brought to you by CANDIDATE";
        },
        broadcast: function (vgroup, vmessage) {
            var
                getMissive = function (vgroup_id, vtext) {
                    if (!vgroup_id) {
                        return {
                            content: "[[contact.name]], the group '" + vgroup + "' does not exists.",
                            to_number: origin,
                            is_template: true
                        };
                    }
                    if (vtext) {
                        return {
                            content: "[[contact.name]], " + vtext,
                            group_id: vgroup_id,
                            is_template: true
                        };
                    }

                    return null;
                },
                group_id = Library.getGroupId(vgroup),
                missive = getMissive(group_id, vmessage);

            generatedParams.forwards.push(missive);
        },
        bible: function (params) {
            var
                passage = params ? _(params).titleCase() : "John 3:16",
                mapping = {
                    ':passage': passage
                },
                uri = Library.getYahooURI("select * from bible.bible where language='en' and bibleref=':passage'", mapping),
                response = httpClient.request(uri, {
                    method: 'GET'
                }),
                content = JSON.parse(response.content),
                yo = content.query.results.passage.replace(/\n.$/, '').trim();

            generatedParams.reply = yo + "\n\n- " + passage;

            //Library.getYahooURI("select * from yahoo.finance.xchange where pair in (\":pair\")", {':pair': "USDPHP,USDJPY"});
        },
        weather: function (params) {
            var
                location = params ? params : "Manila, Philippines",
                mapping = {
                    ':location': location
                },
                uri = Library.getYahooURI("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=':location') and u='c'", mapping),
                response = httpClient.request(uri, {
                    method: 'GET'
                }),
                content = JSON.parse(response.content),
                yo = content.query.results.channel.item;

            var conditions = [
                yo.title,
                yo.condition.text,
                '\n'
            ];
            _(yo.forecast).each(function (forecast) {
                conditions.push(forecast.day + " " + forecast.date +  " " + forecast.text + " " + forecast.low + "℃-" + forecast.high + "℃");
            });

            generatedParams.reply = conditions.join("\n");
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

if (params.group_ids) {
    _(params.group_ids).each(function (group_id) {
        var group = project.initGroupById(group_id);
        contact.addToGroup(group);
    });
}

if (params.state !== undefined) {
    console.log('params.state = ' + params.state);
    state.id = params.state;
}


if (params.vars) {
    _(params.vars).each(function (value, key) {
        contact.vars[key] = value;
    });
}
if (params.reply)
    sendReply(params.reply);

if (params.forwards) {
    _(params.forwards).each(function (option) {
        if (option.to_number) {
            project.sendMessage(option);
        }
        else if (option.group_id) {
            project.sendMessages(option);
        }
    });
}

if (params.posts) {
    _(params.posts).each(function (option) {
        console.log('table = ' + option.table);

        _(option.data).each(function (value, key) {
            console.log(key + ' = ' + value);
        });

        var
            tbl = project.getOrCreateDataTable(option.table),
            recs = option.data;

        tbl.createRow({
            contact_id: contact.id,
            vars: recs
        });
    });
}

