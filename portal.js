/**
 * Created by lbhurtado on 06/11/15.
 */

var telerivet = {
    'project': project,
    'contact': contact,
    'message': message,
    'state': state.id
};

var params = (function (vtelerivet) {
    'use strict';

    _.mixin({
        capitalize: function (string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        },
        titleCase: function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }).trim();
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
        },
        parseHtmlEntities: function (str) {
            return str.replace(/&#([0-9]{1,3});/gi, function (match, numStr) {
                var num = parseInt(numStr, 10); // read num as normal number
                return String.fromCharCode(num);
            });
        },
        inSeveralLines: function (choices) {
            var list = "";
            for (var key in choices) {
                //list = list + "'" + key + "' (" + choices[key] + ")" + ((_.last(choices, key)) ? "\n" : "");
                list = list + "[" + key + "] \"" + choices[key] + "\"" + ((_.last(choices, key)) ? "\n" : "");
            }

            return list;
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
            posts: [],
            lookups: [],
            attributes: [],
            contact: undefined
        },
        cache = {
            id: {
                project: "PJf3e398e4fb9f4a07",
                group: {
                    'Sent Airtime': "CGd8a70f14651c80d5",
                    'subscriber': "CGa9242f10f828f6ab",
                    'gethsemane': "CG9d590f8998e75621",
                    'baligod': "CGefc6381de8f8718d",
                    'baligod-family': "CG0d99bd09335330a8",
                    'baligod-freemasons': "CG4201a44b93d1d06b",
                    'baligod-friends': "CG142380493e3cec7f",
                    'baligod-upvanguards': "CG428482473c5000cb"
                },
                phone: {
                    'beverly_hills': "PN59a2e385cb40a474",
                    'samsung_smart': "PN59a2e385cb40a474",
                    'lg_smart': "PN9e8765e33c2c1743",
                    'oppo_globe': "PN9483093de6bafd0b"
                },
                table: {
                    'lookup': "DTe78aa9a4d878c1b3"
                }
            }
        },
        keywords = {
            news: {
                headers: {
                    title: "News App",
                    description: "News App Description",
                    syntax: "news \<location\>",
                    options: "options: \[city\], \[country\]",
                    example: "e.g. news Manila, Philippines"
                }
            },
            read: {
                headers: {
                    title: "Read App",
                    description: "Read App Description",
                    syntax: "read \<news item\>",
                    options: "options: \[1\], \[2\], \[3\], \[4\]",
                    example: "e.g. read 3"
                }
            },
            balita: {
                headers: {
                    title: "Balita App",
                    description: "Balita App Description",
                    syntax: "balita \<option\>",
                    options: "options: metro,flash,showbiz,balitanghali,24oras,ofw,sports",
                    example: "e.g. balita flash"
                }
            },
            bible: {
                headers: {
                    title: "Bible App",
                    description: "Bible App Description",
                    syntax: "bible \[passage\]",
                    options: "options: \[book\] \[chapter\]:\[verse\]",
                    example: "e.g. bible John 3:16"
                }
            },
            weather: {
                headers: {
                    title: "Weather App",
                    description: "Weather App Description",
                    syntax: "weather \<location\>",
                    options: "options: \[city\], \[country\]",
                    example: "e.g. weather Manila, Philippines"
                }
            },
            rate: {
                headers: {
                    title: "Rate App",
                    description: "Rate App Description",
                    syntax: "rate \<pair\>",
                    options: "options: USDPHP,PHPJPY,SGDPHP,HKDPHP,CNYPHP",
                    example: "e.g. rate USDPHP,PHPUSD"
                }
            },
            ping: {
                headers: {
                    title: "Ping App",
                    description: "Ping App Description",
                    syntax: "ping \<host\>",
                    options: "options:  \[ip address\], \[host@domain name\]",
                    example: "e.g. ping yahoo.com"
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
            replaceAll: function (str, mapObj) {
                var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

                return str.replace(re, function (matched) {
                    return mapObj[matched.toLowerCase()];
                });
                //http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
            },
            getYahooURI: function (vtemplate, mapping) {
                var
                    pre = "https://query.yahooapis.com/v1/public/yql?q=",
                    post = "&format=json&env=store://datatables.org/alltableswithkeys",
                    str = this.replaceAll(vtemplate, mapping),
                    uri = encodeURI(pre + str + post);

                return uri;
            },
            getYahooContent: function (vtemplate, mapping) {
                var
                    pre = "https://query.yahooapis.com/v1/public/yql?q=",
                    post = "&format=json&env=store://datatables.org/alltableswithkeys",
                    str = this.replaceAll(vtemplate, mapping),
                    uri = encodeURI(pre + str + post),
                    response = httpClient.request(uri, {
                        method: 'GET'
                    }),
                    content = JSON.parse(response.content);

                return content;
            },
            getTxtCmdrData: function (vurl, vkeys) {
                var
                    response = httpClient.request(vurl, {
                        method: 'GET'
                    }),
                    content = JSON.parse(response.content),
                    processData = function (vcontent, vkeys) {
                        var data = {};

                        _(vcontent).each(function (element) {
                            data[element[vkeys[0]]] = element[vkeys[1]];
                        });

                        return data;
                    };

                return processData(content.data, vkeys);
            },
            getLookupTableData: function (vcode) {
                var
                    table = project.initDataTableById(cache.id.table.lookup),
                    cursor = table.queryRows({
                        contact_id: vtelerivet.contact.id,
                        vars: {'code': vcode}
                    });

                cursor.limit(1);

                if (cursor.hasNext()) {
                    var row = cursor.next();

                    return {
                        code: row.vars.code,
                        context: row.vars.context,
                        key: row.vars.key,
                        value: JSON.parse(row.vars.value)
                    };
                }

                return false;
            },
            setTxtCmdrSettingsAPIResponse: function (vproject, vkey, vvalue, voperation, vdescription) {
                var
                    code = vproject + "/" + vkey,
                    data = {
                        'value': vvalue,
                        'description': vdescription,
                        'operation': voperation
                    },
                    method = (['get', 'check'].indexOf(voperation.toLowerCase()) !== -1) ? 'GET' : 'POST',
                    url = "http://lumen.txtcmdr.net/txtcmdr/settings/" + code,
                    response = httpClient.request(url, {
                        'method': method,
                        'data': data
                    });
                console.log('setTxtCmdrSettingsAPIResponse operation = ' + data.operation);
                console.log('setTxtCmdrSettingsAPIResponse code = ' + code);
                console.log('setTxtCmdrSettingsAPIResponse value = ' + data.value);
                console.log('setTxtCmdrSettingsAPIResponse description = ' + data.description);
                console.log('setTxtCmdrSettingsAPIResponse url = ' + url);
                console.log('setTxtCmdrSettingsAPIResponse method = ' + method);
                return response;
            },
            getTxtCmdrSettingsAPIResponse: function (vproject, vkey) {
                return this.setTxtCmdrSettingsAPIResponse(vproject, vkey, null, 'get', null);
            },
            getTxtCmdrSettingsAPIContent: function (vproject, vkey) {
                var response = this.setTxtCmdrSettingsAPIResponse(vproject, vkey, null, 'get', null);

                return JSON.parse(response.content);
            },
            getSettingOptionFromArguments: function (args) {
                return args[0];
            },
            getSettingValueFromArguments: function (args) {
                var ar = _(args).toArray().slice(1);

                return _(ar).filter(function (value) {
                    return value;
                });
            },
            //parseHtmlEntities: function (str) {
            //    return str.replace(/&#([0-9]{1,3});/gi, function (match, numStr) {
            //        var num = parseInt(numStr, 10); // read num as normal number
            //        return String.fromCharCode(num);
            //    });
            //}
        },
        vars = vtelerivet.contact.vars,
        INPUT = vtelerivet.message.content,
        PATH = INPUT,
        ORIGIN = Library.formalize(vtelerivet.contact.phone_number),
        PROJECT = 'demo';

    var Router = {
        routes: {
            'join $group *username': "join",
            '(gethsemane|getshemane|gehtsemane)': "gethsemane",

            'baligod': "autorecruit",
            'baligod *username': "baligod",

            'passage*params': "passage",
            'info': "info",

            'recruit (0\\d{3}\\d{7}|63\\d{3}\\d{7}|\\+63\\d{3}\\d{7})': "recruit",
            'confirm (\\d{4,6})*profile': "confirm",

            'bayan': "bayan",

            'load (0\\d{3}\\d{7}|63\\d{3}\\d{7}) (20|30|50)': "load",
            'cloud load (0\\d{3}\\d{7}|63\\d{3}\\d{7})': "cloudload",
            'm=\\d{15}.*querystring': "igps",

            'news *location ([1-4])': "news",
            'news *location': "news",
            'news': "syntax",
            'read ([1-4])': "read",
            'read': "syntax",
            'balita <metro|flash|showbiz|balitanghali|24oras|ofw|sports>': "balita",
            'balita': "syntax",
            'bible *passage': "bible",
            'bible': "syntax",
            'weather *location': "weather",
            'weather': "syntax",
            'rate *pair': "rate",
            'rate': "syntax",
            'ping *host': "ping",
            'ping': "syntax",
            'define *word': "define",

            'broadcast $group *message': "broadcast",
            '@$group *message': "broadcast",

            'default (location|news) *params': "default",
            'update name *name': "update_name",

            'islands': "islands",
            'regions (L|V|M)': "regions",
            'regions ((?!L|V|M).)': "regions_error",
            'provinces (1|2|3|4A|4B|5|6|7|8|9|10|11|12|13|NCR|CAR|ARMM|NEGROS)': "provinces",
            'provinces ((?!1|2|3|4A|4B|5|6|7|8|9|10|11|12|13|NCR|CAR|ARMM|NEGROS).)': "provinces_error",
            'towns (0\\d{3})': "towns",
            'towns (?!0\\d{3})': "towns_error",

            //'auto[-_\\s]?forward': "auto_forward",
            //'auto[-_\\s]?forward (remove|cut|delete)': "auto_forward_remove",
            //'(get|check|set|replace|add|append|insert|delete|cut|remove|clear|empty|unset) forwards?\\s?(0\\d{3}\\d{7}|63\\d{3}\\d{7}|\\+63\\d{3}\\d{7})*\\D*(0\\d{3}\\d{7}|63\\d{3}\\d{7}|\\+63\\d{3}\\d{7})*\\D*(0\\d{3}\\d{7}|63\\d{3}\\d{7}|\\+63\\d{3}\\d{7})*\\D*': "forwards",
            //'(?:get\\s|\\?)$option': "get",
            'ring': "ring",
            '[append|replace|remove] [string|array|list|querystring|json] [autoreply|forwards] *value': "setsetting",
            'get $key': "getsetting",
            '[location|status|plan]*value': "selfstring"
        },
        init: function () {
            this._routes = [];
            for (var route in this.routes) {
                if (this.hasOwnProperty('routes')) {
                    var methodName = this.routes[route];
                    var
                        regex = route
                            //.replace(/:\w+/g, '(\\w+)')
                            //.replace(/--\w+/g, '(\\w+)')
                            .replace(/\$\w+/g, '(\\w+)')
                            //.replace(/\(([\/]?[^\)]+)\)/g, "($1)")

                            .replace(/\[(.*?)\]/g, "($1)")

                            .replace(/<([\/]?[^\)]+)>/g, "($1)")
                            .replace(/%(\w+)/g, "($1)") //default value
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
                i = this._routes.length;

            PATH = vtelerivet.state ? vtelerivet.state + " " + vpath : vpath;

            if (vtelerivet.message.message_type == 'call') {
                PATH = 'ring';
            }

            console.log('PATH = ' + PATH);

            while (i--) {
                var regex = new RegExp(this._routes[i].pattern, "i");
                var args = PATH.match(regex);

                //console.log('args = ' + args);
                if (args) {
                    this._routes[i].callback.apply(this, args.slice(1));
                }
            }
        },
        after: function () {
            var
                key = 'forwards',
                response = Library.getTxtCmdrSettingsAPIResponse(PROJECT, key),
                content = JSON.parse(response.content),
                getNumbers = function () {
                    if (response.status === 200) {
                        return content.data.value;
                    }
                    return "Error!";
                },
                numbers = getNumbers(),
                missive = {
                    content: "from " + (vtelerivet.contact.name != ORIGIN ? vtelerivet.contact.name + " [" + ORIGIN + "]" : ORIGIN) + ": " + INPUT,
                    to_numbers: numbers
                };

            console.log('numbers = ' + numbers);

            generatedParams.forwards.push(missive);
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
        gethsemane: function () {
            var
                group = "gethsemane",
                group_id = Library.getGroupId(group),
                state = null,
                reply = [];

            reply.push("Thank you for signing up with Gethsemane Parish.");
            reply.push("You may send the following keywords for details:");
            reply.push("");
            reply.push("INFO");
            reply.push("SCHEDULE");
            reply.push("NEWS");
            reply.push("CONFIDE");
            reply.push("SUGGEST");
            reply.push("SUPPORT");
            reply.push("NOURISH");
            reply.push("PREX");
            reply.push("CFC");
            reply.push("ASK");
            reply.push("DISASTER");
            reply.push("NOVENA");

            generatedParams.group_ids = [group_id];
            generatedParams.reply = reply.join("\n");
            generatedParams.state = state;
        },
        baligod: function (vusername) {
            var
                username = _(vusername).titleCase(),
                group = "subscriber",
                group_id = Library.getGroupId(group),
                replyFormat = "%s, bless you. Soon we will stop the corrupt. Click http://duterte.baligod.ph to know more. Thank you. \n- Levi Baligod",
                reply = sprintf(replyFormat, username),
                state = null;

            generatedParams.name = username;
            generatedParams.group_ids = [group_id];
            generatedParams.reply = reply;
            generatedParams.state = state;
        },
        autorecruit: function() {
            var
                group = "baligod",
                group_id = Library.getGroupId(group),
                reply = "BALIGOD sa Senado!\n\n" + "Help me help the Filipinos. Pls reply w/ your name & 2 other cell numbers ex. \"Juan de la Cruz 09181234567 09177654321\"." + "\n - Levi Baligod.",
                state = "baligod";

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
            var
                data = {
                    'q1': "question 1",
                    'q2': "question 2"
                },
                group_id = Library.getGroupId("gethsemane"),
                group = project.initGroupById(group_id),
                reply = "";

            if (telerivet.contact.isInGroup(group)) {
                generatedParams.reply = _(data).inSeveralLines();
            }
        },
        recruit: function (vmobile) {
            var
                destination = Library.formalize(vmobile),
                url = "http://128.199.81.129/txtcmdr/challenge/" + ORIGIN + "/" + destination,
                response = httpClient.request(url, {
                    method: 'POST'
                }),
                reply = "One-time PIN has been sent.  Ask the recruit for the PIN, his/her name and age and reply \<PIN\> \<NAME\> \<AGE\>.",
                nextState = "confirm";

            console.log('recruit url = ' + url);

            if (response.status === 200) {

                generatedParams.reply = reply;
                generatedParams.vars.mobile = destination;
                generatedParams.state = nextState;
            }

        },
        confirm: function (vpin, vprofile) {
            var
                destination = vars.mobile,
                pin = vpin,
                url = "http://128.199.81.129/txtcmdr/confirm/" + ORIGIN + "/" + destination + "/" + pin,
                response = !pin || httpClient.request(url, {
                        method: 'POST'
                    }),
                missive = {
                    content: "Thank you.  You are now part of our campaign. You will receive news and messages from our HQ.  " + "https://twitter.com/77txtcmdr/status/672244567761096704",
                    //"\ntwitter://post?message=%23txtcmdr%20rocks!&in_reply_to_status_id=672244567761096704",
                    to_number: destination
                },
                nextState = null;

            if (response.status === 200) {
                var
                    profile = vprofile.match(/([A-Z a-z]*)(\d*)/),
                    name = _(profile[1]).titleCase(),
                    age = profile[2],
                    contact = {
                        phone_number: destination,
                        add_group_ids: [cache.id.group.subscriber]
                    };

                if (name) {
                    contact.name = name;
                }
                if (age) {
                    contact.vars = {'age': age};
                }

                generatedParams.contact = contact;
                generatedParams.vars.mobile = null;
                generatedParams.forwards.push(missive);
                generatedParams.state = nextState;
                this.load(destination, 20);
                this.cloudload(destination, 20);
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

            console.log('cloud load...');
        },
        igps: function () {
            var
                uri = INPUT,
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

        broadcast: function (vgroup, vmessage) {
            var
                getMissive = function (vgroup_id, vtext) {
                    if (!vgroup_id) {
                        return {
                            content: "[[contact.name]], the group '" + vgroup + "' does not exists.",
                            to_number: ORIGIN,
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

        news: function (params, vnumber) {
            var
                search = params ? params : vars.default_location,
                mapping = {
                    ':search': params
                },
                _content = Library.getYahooContent("select * from google.news where q = ':search'", mapping),
                __content = Library.getYahooContent("select * from google.news where q = ':search'", mapping),
                content = Library.getYahooContent("select * from google.news where q = ':search'", mapping),
                yo = content.query.results.results,
                newscasts = [],
                i = 0;

            _(yo).each(function (newscast) {
                i = i + 1;
                if (!vnumber) {
                    newscasts.push("");
                    newscasts.push(i + ". " + newscast.publisher);
                    newscasts.push("   " + newscast.titleNoFormatting);
                    newscasts.push("   " + newscast.publishedDate);
                }
                else {
                    if (vnumber == i) {
                        newscasts.push(newscast.publisher);
                        newscasts.push(newscast.content);
                        newscasts.push(newscast.unescapedUrl);
                    }
                }

            });

            var reply = _(newscasts.join("\n"))
                .parseHtmlEntities()
                .replace(/&quot;/g, "'");

            this.default('read', params);
            generatedParams.reply = reply;
        },
        read: function (vnumber) {
            if (vars['last_read']) {
                console.log('vars last_read = ', vars['last_read']);
                this.news(vars['last_read'], vnumber);
            }
            else {
                this.syntax('read');
            }
        },
        balita: function (vcategory) {
            var
            //category = params ? params : "metro",
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

                    return urls[vcategory.toLowerCase().trim()];
                },
                cnt = 4,
                mapping = {
                    ':url': getURL(vcategory),
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
                            z = z.replace(/&nbsp;/g, ""),
                            z = z.replace(/[^\x20-\x7E]+/g, ''),
                            z = strip_tags(z);
                        x.push(z);
                    }
                    return x.join("\n");
                };

            generatedParams.reply = reply() + "\n - brought to you by CANDIDATE";
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
            //location = params ? params : "Manila, Philippines",
                location = params ? params : vars.default_location,
                mapping = {
                    ':location': location
                },
                content = Library.getYahooContent("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=':location') and u='c'", mapping),
                yo = content.query.results.channel,
                forecasts = [
                    yo.item.title,
                    yo.item.condition.text + " " + yo.item.condition.temp + "℃"
                ];

            _(yo.item.forecast).each(function (forecast) {
                forecasts.push("");
                forecasts.push(forecast.day + " " + forecast.date);
                forecasts.push(forecast.text + " " + forecast.low + "℃-" + " " + forecast.high + "℃");
            });

            generatedParams.reply = forecasts.join("\n");
        },
        rate: function (params) {
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
                for (i = 0, j = _rates.length; i < j; i++) {
                    yo = yo + _pairs[i].toUpperCase() + '=' + _rates[i] + "\n";
                }
            }
            else {
                yo = pair.toUpperCase() + '=' + content.query.results.rate.Rate;
            }


            generatedParams.reply = yo + "\n - brought to you by CANDIDATE";
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
        define: function (vword) {
            var
                mapping = {
                    ':word': vword
                },
                uri = Library.getYahooURI("SELECT * FROM dictionaryapi WHERE dictionary='collegiate' AND word=':word' AND api_key='8f7f1fe0-f169-4425-a837-2fc66b715a7b'", mapping),
                response = httpClient.request(uri, {
                    method: 'GET'
                }),
                content = JSON.parse(response.content),
                yo = content.query.results,
                definitions = [];

            console.log("Lester was here.");
            _(yo.entry[0].def.dt).each(function (entry) {
                if (_.isString(entry)) {
                    definitions.push(entry);
                }

            });

            var reply = definitions.join("\n");

            generatedParams.reply = reply;
        },

        default: function (vattrib, vparams) {
            var
                lookup = {
                    'location': "default_location",
                    'news': "default_news",
                    'read': "last_read",
                    'island_group_id': "default_island_group_id",
                    'regions': "regions_data",
                    'region': "ni_network_name",
                    'region_id': "default_region_id",
                    'province_id': "default_region_id",
                    'town_id': "default_town_id"
                }

            console.log('default attrib = ' + lookup[vattrib]);
            console.log('default params = ' + vparams);

            if (lookup[vattrib]) {
                generatedParams.attributes.push({
                    key: lookup[vattrib],
                    value: vparams
                });
            }
        },
        syntax: function () {
            var
                params = INPUT.toLowerCase(),
                text = [];

            _(keywords[params].headers).each(function (object) {
                text.push(object);
            });

            generatedParams.reply = text.join("\n");
        },

        islands: function () {
            var
                url = "http://lumen.txtcmdr.net/ph/islandgroups",
                data = Library.getTxtCmdrData(url, ['id', 'name']),
                reply = _(data).inSeveralLines(),
                nextState = 'regions';

            generatedParams.reply = reply;
            generatedParams.state = nextState;
        },
        regions: function (visland_id) {
            var
                url = "http://lumen.txtcmdr.net/ph/" + visland_id + "/regions",
                data = Library.getTxtCmdrData(url, ['code', 'name']),
                reply = _(data).inSeveralLines(),
                nextState = "provinces";

            generatedParams.lookups.push({
                table: {
                    id: cache.id.table.lookup,
                    name: "lookup"
                },
                record: {
                    code: "regions",
                    context: url,
                    key: visland_id,
                    value: JSON.stringify(data)
                }
            });
            generatedParams.reply = reply;
            generatedParams.state = nextState;
        },
        regions_error: function () {
            generatedParams.reply = vars.lastReply;
        },
        provinces: function (vregion_code) {
            var
                url = "http://lumen.txtcmdr.net/ph/" + vregion_code + "/provinces",
                data = Library.getTxtCmdrData(url, ['code', 'name']),
                regionData = Library.getLookupTableData("regions"),
                reply = _(data).inSeveralLines(),
                nextState = "towns";


            if (regionData) {
                generatedParams.lookups.push({
                    table: {
                        id: cache.id.table.lookup,
                        name: "lookup"
                    },
                    record: {
                        code: "region",
                        context: PATH,
                        key: vregion_code,
                        value: regionData.value[vregion_code]
                    }
                });
            }

            generatedParams.lookups.push({
                table: {
                    id: cache.id.table.lookup,
                    name: "lookup"
                },
                record: {
                    code: "provinces",
                    context: url,
                    key: vregion_code,
                    value: JSON.stringify(data)
                }
            });
            generatedParams.reply = reply;
            generatedParams.state = nextState;
        },
        provinces_error: function () {
            generatedParams.reply = vars.lastReply;
        },
        towns: function (vprovince_code) {
            var
                url = "http://lumen.txtcmdr.net/ph/" + vprovince_code + "/towns",
                data = Library.getTxtCmdrData(url, ['code', 'name']),
                provinceData = Library.getLookupTableData("provinces"),
                reply = _(data).inSeveralLines(),
                nextState = "town";

            console.log('towns url = ' + url);

            if (provinceData) {
                generatedParams.lookups.push({
                    table: {
                        id: cache.id.table.lookup,
                        name: "lookup"
                    },
                    record: {
                        code: "province",
                        context: PATH,
                        key: vprovince_code,
                        value: provinceData.value[vprovince_code]
                    }
                });
            }

            generatedParams.lookups.push({
                table: {
                    id: cache.id.table.lookup,
                    name: "lookup"
                },
                record: {
                    code: "towns",
                    context: url,
                    key: vprovince_code,
                    value: JSON.stringify(data)
                }
            });

            generatedParams.reply = reply;
            generatedParams.state = nextState;
        },
        towns_error: function () {
            generatedParams.reply = vars.lastReply;
        },
        town: function (vtown_code) {
            var
                townData = Library.getLookupTableData("towns"),
                reply = "Thank you.",
                nextState = null;

            if (townData) {
                generatedParams.lookups.push({
                    table: {
                        id: cache.id.table.lookup,
                        name: "lookup"
                    },
                    record: {
                        code: "town",
                        context: PATH,
                        key: vtown_code,
                        value: townData.value[vtown_code]
                    }
                });
            }

            generatedParams.reply = reply;
            generatedParams.state = nextState;
        },

        forwards: function () {
            var
                key = "forwards",
                value = _(Library.getSettingValueFromArguments(arguments)).map(function (number) {
                    return Library.formalize(number);
                }),
                operation = Library.getSettingOptionFromArguments(arguments),
                description = "forwarding numbers",

                response = Library.setTxtCmdrSettingsAPIResponse(PROJECT, key, value, operation, description),
                content = JSON.parse(response.content),
                getReply = function () {
                    if (response.status === 200) {
                        var delimitedValue = content.data.value ? content.data.value.join(',') : "";

                        return description + ": [" + delimitedValue + "]";
                    }

                    return "Error!" + _(description).titleCase();
                },
                reply = getReply();

            generatedParams.reply = reply;
            //TODO: clean this up. options or no options
        },
        auto_forward: function () {
            this.forwards('append', ORIGIN);
        },
        auto_forward_remove: function () {
            this.forwards('remove', ORIGIN);
        },
        ring: function () {
            var
                reply = "Missed call",
                nextState = null;

            generatedParams.reply = reply;
            generatedParams.state = nextState;
        },
        get: function (option) {
            var
                key = 'autoreply',
                response = Library.getTxtCmdrSettingsAPIResponse(PROJECT, key),
                content = JSON.parse(response.content),
                getReply = function () {
                    if (response.status === 200) {
                        return content.data.value[option];
                    }
                    return "Error!";
                },
                reply = getReply();

            generatedParams.reply = reply;
        },
        setsetting: function (voperation, vformat, vkey, vvalue, vdescription) {
            var
                getValues = function (value, format) {
                    switch (format) {
                        case 'string':
                            var str = value.trim();

                            return str;

                        case 'array':
                            var arr = [];
                            value.replace(/([^,]+)/g, function (s, match) {
                                arr.push(match.trim());
                            });

                            return arr;

                        case 'querystring':
                            var obj = {};

                            value.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {
                                obj[$1.trim()] = $3.trim();
                            });

                            return obj;

                        case 'json':

                            return JSON.parse(value);
                    }
                },
                values = getValues(vvalue, vformat),
                response = Library.setTxtCmdrSettingsAPIResponse(PROJECT, vkey, values, voperation, vdescription),
                content = JSON.parse(response.content),
                getReply = function (format, content) {
                    var
                        str = "undefined",
                        compiled = _.template("<%= key %> : <%= value %>");
                    switch (format) {
                        case 'string':
                            str = content.data.value;
                            break;
                        case 'array':
                            str = content.data.value.join(",");
                            break;
                        case 'querystring':
                        case 'json':
                            str = JSON.stringify(content.data.value);
                            break;
                    }
                    return compiled({'key': content.data.key, 'value': str});
                },
                reply = getReply(vformat, content);

            generatedParams.reply = reply;
        },
        getsetting: function(vkey) {
            var
                content = Library.getTxtCmdrSettingsAPIContent(PROJECT, vkey),
                getFormat = function () {
                    if (typeof content.data.value === 'string') {
                        return 'string';
                    }
                    else if (Array.isArray(content.data.value)) {
                        return 'array';
                    }
                    else if (typeof content.data.value === 'object') {
                        return 'json';
                    }
                    else {
                        return 'undefined';
                    }
                },
                format = getFormat(),
                getReply = function (format, content) {
                    var
                        str = "undefined",
                        compiled = _.template("<%= key %> : <%= value %>");
                    switch (format) {
                        case 'string':
                            str = content.data.value;
                            break;
                        case 'array':
                            str = content.data.value.join(",");
                            break;
                        case 'querystring':
                        case 'json':
                            str = JSON.stringify(content.data.value);
                            break;
                    }
                    return compiled({'key': content.data.key, 'value': str});
                },
                reply = getReply(format, content);

            generatedParams.reply = reply;
        },
        selfstring: function(vattribute, vvalue) {
            var
                attribute = vattribute.toLowerCase(),
                _key = _.template("<%= mobile %>.<%= attribute %>"),
                key = _key({'mobile': ORIGIN, 'attribute': attribute}),
                _description = _.template("<%= attribute %> of <%= name %>"),
                description = _description({'name': vtelerivet.contact.name, 'attribute': attribute});

            this.setsetting('replace', 'string', key, vvalue, description);
        }
    };

    Router.init();
    Router.nav(INPUT);
    //Router.after();

    return generatedParams;

}(telerivet));

if (params.contact) {
    console.log(JSON.stringify(params.contact));

    project.getOrCreateContact(params.contact);
}

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

if (params.reply) {
    sendReply(params.reply);
    contact.vars.lastReply = params.reply;
    console.log("reply.size = " + params.reply.length);
}

if (params.forwards) {
    _(params.forwards).each(function (option) {
        if (option.to_number) {
            project.sendMessage(option);
        }
        else if (option.group_id || option.to_numbers.length) {
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

if (params.lookups) {
    var
        lookupTable = function (vtable) {
            if (vtable.id) {
                var table = project.initDataTableById(vtable.id);

                if (!table) {
                    table = project.getOrCreateDataTable(vtable.name);
                }

                console.log('lookup table, ' + vtable.id + 'was used.');

                return table;
            }
            else {
                return project.getOrCreateDataTable(vtable.name);
            }
        },
        updateLookup = function (vlookup) {
            var
                table = lookupTable(vlookup.table);
            cursor = table.queryRows({
                contact_id: contact.id,
                vars: {
                    'code': vlookup.record.code
                }
            });

            console.log('table id = ' + table.id);

            cursor.limit(1);
            if (cursor.hasNext()) {
                var row = cursor.next();

                row.vars = vlookup.record;
                row.save();
            }
            else {
                table.createRow({
                    contact_id: contact.id,
                    vars: vlookup.record
                });
            }
        };

    _(params.lookups).each(function (lookup) {
        updateLookup(lookup);
    });
}

if (params.attributes) {
    _(params.attributes).each(function (items) {
        contact.vars[items.key] = items.value;
    });
}

//console.log('project name = ' + project.name);
//console.log('project timezone = ' + project.timezone_id);
console.log('counter = 15');

//_(project.getUsers()).each(function (user) {
//    console.log('user.id = ' + user.id);
//    console.log('user.name = ' + user.name);
//    console.log('user.email = ' + user.email);
//});
