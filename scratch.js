/**
 * Created by lbhurtado on 08/11/15.
 */

function ArgumentsToArray(args) {
    return [].slice.apply(args);
}

var
    generatedParams = {},
    argvUtililty = require("ext/applester-scripts/string2argv"),
    pathParser = require("ext/applester-scripts/pathparser.min"),
    generatedURL = argvUtililty.parseArgsStringToArgv(input).join('/'),

    router = new pathParser(generatedParams),
    generateWordFromURL = function (params) {
        return (_(params).analyzeParams())
            .parts
            .join(' ');
    },
    generateNameFromURL = function (params) {
        return _((generateWordFromURL(params))
            .replace(/[^\w\s]/gi, ''))
            .titleCase();
    };

router.add('subscribe/:name1/:name2/:name3/:name4', function () {
    var
        name = generateNameFromURL(generatedParams),
        group = "subscriber",
        replyFormat = "%s, you are now a subscriber.",
        reply = sprintf(replyFormat, name),
        state = null;

    generatedParams.name = name;
    generatedParams.groups = [group];
    generatedParams.reply = reply;
    generatedParams.state = state;
});

router.add('passage/random', function () {
    sendPassage("random");
});

router.add('passage/daily', function () {
    sendPassage("votd");
});

router.add('passage/:bookname/:chapter/:verse', function () {
    var passage = generateWordFromURL(generatedParams);

    console.log('passage/:bookname/:chapter/:verse');
    sendPassage(passage);
});

router.add('bayan', function () {
    generatedParams.reply = "Sorry for the inconvenience. App under construction.";
    generatedParams.state = null;
    generatedParams.groups = ['under_construction'];
});

router.run(generatedURL);


//var input = "?q1=1&q2=2";
//var regex = /(\?|\&)([^=]+)\=([^&]+)/ig;
//
//var matches, output = [];
//while (matches = regex.exec(input)) {
//    output.push(matches[2] + '=' + matches[3]);
//}

//console.log('output = ' + output);

var i = arguments.length;
while (i--) {
    console.log('>>>> arguments ' + i + ' = ' + arguments[i]);
}