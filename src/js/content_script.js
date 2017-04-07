String.prototype.remove = function(index, count) {
    return this.substring(0, index) + this.substring(index + count);
};

String.prototype.insert = function(index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}
/*
Array.prototype.extend = function (other_array) {
    // you should include a test to check whether other_array really is an array
    other_array.forEach(function(v) {this.push(v)}, this);
}
*/
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function regexFromString(str) {
    var match = str.match(new RegExp('^/(.*?)/([gimy]*)$'));
    if (match === null) return /a^/;
    // Add /g and /m if they weren't specified
    if (match[2].indexOf('g') === -1) match[2] += 'g';
    if (match[2].indexOf('m') === -1) match[2] += 'm';

    try {
        return new RegExp(match[1], match[2]);
    } catch (err) {
        // Just drop it and return an empty replacement.
        if (err.name == 'SyntaxError') return /b^/;
        else throw err;
    }
}

function mimicLetterCase(originalWord, replacement) {
    if (!originalWord.length) return originalWord;
    var allCaps = true,
        titleCase = true;

    // Isolated words that begin with a capital letter shall be titlecase by default and lowercase otherwise
    var _tcmatch = originalWord.search('/\s/') === -1;
    if (_tcmatch) {
        titleCase = allCaps = originalWord[0].toUpperCase() == originalWord[0];
    }
    for (var i = 0; i < originalWord.length; ++i) {
        // If this letter is lowercase
        if (allCaps && originalWord[i].toUpperCase() != originalWord[i]) {
            // Then the word can't be AllCaps
            allCaps = false;
            if (!titleCase) break;
        }
        // If what comes after a space is a lowercase letter, this isn't TitleCase
        else if (originalWord[i].search(/\s/) === 0) {
            // Skip any extra space up to the second to last character
            while (++i < originalWord.length - 2 && originalWord[i].search(/\s/) === 0);
            // If the next letter isn't an uppercase letter, this ain't no titlecase
            if (i >= originalWord.length || originalWord[i].search(/[A-Z]/) === -1) titleCase = false;
            if (!allCaps) break;
        }
    }

    var result = replacement;
    // All-Caps
    if (allCaps) {
        result = result.toUpperCase();
    }
    // TitleCase
    else if (titleCase) {
        result = result.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
    // First Uppercase
    else if (originalWord[0].toUpperCase() == originalWord[0]) {
        result = result[0].toUpperCase() + result.substring(1).toLowerCase();
    }
    // Lowercase
    else {
        result = result.toLowerCase();
    }
    return result;
}

function replaceBackreferences(word, replacement) {
    var regexp = regexFromString(replacement.repA);

    var match = regexp.exec(word);
    // Get the content of each capturing group and replace any backreference in the replacement with it
    var _rep = replacement.repB;
    for (var j = 1; j < match.length; ++j) {
        if (!match[j]) continue;
        var br_i;
        while ((br_i = _rep.indexOf("\\" + j)) !== -1) {
            if (br_i > 0 && _rep[br_i - 1] == '\\') continue;

            _rep = _rep.remove(br_i, 2).insert(br_i, match[j]);
        }

    }
    return _rep;
}

function parseTokens(word, repB, replacement) {
    var original = replacement.repB; // The un-modified repB.
    // The empty space is because [^\\] matches anything BUT a \, but it doesn't work if there isn't a character to begin with.
    // A ? would make the match's length inconsistent, so fuck it.
    var tokens = (' ' + original).match(/[^\\]\\(C|L|I|E)/gi);
    if (!tokens) return repB;

    var index, oIndex;
    var _lastTest, _lastIndex, _xpBackref;
    tokens.forEach(function(v) {
        v = v.substring(1).toLowerCase();

        index = repB.toLowerCase().indexOf(v); // No starting position because the processed flags are already removed
        oIndex = original.toLowerCase().indexOf(v, oIndex + 1); // Starting position because original should stay intact

        if (index === -1) return; // Ex. when a successful if removes its else.

        repB = repB.remove(index, 2); // Remove the matched token.
        switch (v[1]) {
            case 'c': // Maintain (c)ase of the next word
                var endOfWord = repB.regexIndexOf(/(\W|$)/, index);
                var oEndOfWord = original.regexIndexOf(/(\W|$)/, oIndex + 2);

                repB = repB.remove(index, endOfWord - index).insert(index, original.substring(oIndex + 2, oEndOfWord));
                break;
            case 'l': // Maintain case of the next letter
                repB = repB.remove(index, 1).insert(index, original.substring(oIndex + 2, oIndex + 3));
                break;
            case 'i': // If the following capturing group was NOT matched, then insert... [Syntax: \I\1:whatever;\E:Also whatever;]
                _lastIndex = index;
                _lastTest = !/\\[1-9][0-9]?/.test(repB.substring(index, index + 2));

                // Expand the backreference from the original replacement
                _xpBackref = replaceBackreferences(word, {
                    repA: replacement.repA,
                    repB: original.substring(oIndex + 2, oIndex + 4)
                });
                // Apply the correct letter casing by giving it some context and then slicing it off
                var _contextualized = (repB[index - 1] || ' ') + _xpBackref;
                _xpBackref = mimicLetterCase(word, _contextualized).substring(1);
            case 'e': // Else, insert...

                if (v[1] == 'i') {
                    // Remove the 'if' block but not its contents unless the test failed.
                    // At this point we removed everything up to the colon, the easy part
                    repB = repB.substring(0, index) + repB.substring(index + _xpBackref.length + 1);

                    var _nesIndex = repB.regexIndexOf(/[^\\];/, index) + 1;
                    // If the test failed, remove everything up to the semicolon
                    if (!_lastTest) {
                        repB = repB.remove(index, _nesIndex - index + 1);
                    }
                    // Otherwise just remove the semicolon
                    else {
                        repB = repB.remove(_nesIndex, 1);
                        // And apply proper capitalization to the contents of this if
                        if (replacement.case == 'Maintain') {
                            var wordToCapitalize = index > 0 ? repB.substring(index - 1, _nesIndex) : ' ' + repB.substring(index, _nesIndex);
                            wordToCapitalize = mimicLetterCase(word, wordToCapitalize).substring(1);
                            repB = repB.remove(index, wordToCapitalize.length).insert(index, wordToCapitalize);
                        }
                    }
                } else if (v[1] == 'e') {
                    // Remove the 'else' block but not its contents.
                    // Again, remove up to the colon, which is easy (the colon IS expected to be exactly adjacent to the \E)
                    repB = repB.substring(0, index) + repB.substring(index + 1);

                    var _nesIndex = repB.regexIndexOf(/[^\\];/, index) + 1;
                    // If the earlier test succeeded, remove everything up to the semicolon
                    if (_lastTest) {
                        repB = repB.remove(index, _nesIndex - index + 1);
                    }
                    // Otherwise only remove the semicolon
                    else {
                        repB = repB.remove(_nesIndex, 1);
                        // And apply proper capitalization to the contents of this else
                        if (replacement.case == 'Maintain') {
                            var wordToCapitalize = index > 0 ? repB.substring(index - 1, _nesIndex) : ' ' + repB.substring(index, _nesIndex);
                            wordToCapitalize = mimicLetterCase(word, wordToCapitalize).substring(1);
                            repB = repB.remove(index, wordToCapitalize.length).insert(index, wordToCapitalize);
                        }
                    }
                }
                break;
        }

    });

    return repB;
}

function _replace(str, word, replacement, _repB) {
    var repB = _repB || replacement.repB;
    if (replacement.case == 'Maintain') repB = mimicLetterCase(word, repB);
    // This function parses specials tokens such as \C for maintaining case on a specific word.
    repB = parseTokens(word, repB, replacement);

    try {
        str = str.replace(new RegExp(escapeRegExp(word), 'g'), repB);
    } catch (err) {
        if (err.name == 'RangeError');
        else throw err;
    }
    return str;
}

function tryReplacement(source, replacement) {
    var replacedsource = source;
    switch (replacement.type) {
        case 'Simple':
            var rep = "\\b" + replacement.repA.toString() + "\\b";
            var exp = new RegExp(rep, 'gi');

            var match = exp.exec(replacedsource);
            var repB = replacement.repB;

            while (match != null) {
                var replacedPart = _replace(replacedsource.substring(match.index, match.index + match[0].length), match[0], replacement);
                replacedsource = replacedsource.substring(0, match.index) + replacedPart + replacedsource.substring(match.index + match[0].length);

                exp.lastIndex -= (match[0].length - replacedPart.length);
                match = exp.exec(replacedsource);
            }

            return replacedsource;
        case 'RegEx':
            var exp = regexFromString(replacement.repA);
            var match = exp.exec(replacedsource);
            var repB = replacement.repB;

            while (match != null) {
                repB = replaceBackreferences(match[0], replacement);

                var replacedPart = _replace(replacedsource.substring(match.index, match.index + match[0].length), match[0], replacement, repB);
                replacedsource = replacedsource.substring(0, match.index) + replacedPart + replacedsource.substring(match.index + match[0].length);

                exp.lastIndex -= (match[0].length - replacedPart.length);
                match = exp.exec(replacedsource);
            }

            return replacedsource;
        case 'Swap':
            // For swaps we'll do something less obvious but actually simpler: exactly what you had to do in WR1, but programmatically.
            // No extra code, no extra tears.

            var _swapReplacementA = {
                repA: replacement.repA,
                repB: mimicLetterCase(replacement.repA, 'WR SWAP TEMP__'),
                type: 'Simple',
                case: replacement.case
            };
            var _swapReplacementB = {
                repA: replacement.repB,
                repB: replacement.repA,
                type: 'Simple',
                case: replacement.case
            };
            var _swapReplacementC = {
                repA: mimicLetterCase(replacement.repB, 'WR SWAP TEMP__'),
                repB: replacement.repB,
                type: 'Simple',
                case: replacement.case
            };

            replacedsource = tryReplacement(source, _swapReplacementA);
            replacedsource = tryReplacement(replacedsource, _swapReplacementB);
            replacedsource = tryReplacement(replacedsource, _swapReplacementC);

            return replacedsource;
    }
}

var g_replacements = [{
        "active": true,
        "case": "Override",
        "repA": "anus",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "arse",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "arsehole",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "ass",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "ass-hat",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "ass-jabber",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "ass-pirate",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assbag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assbandit",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assbanger",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assbite",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assclown",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asscock",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asscracker",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asses",
        "repB": "butts",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assface",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assfuck",
        "repB": "rear-loving",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assfucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assgoblin",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asshat",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asshead",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asshole",
        "repB": "jerk",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asshopper",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assjacker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asslick",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asslicker",
        "repB": "buttlicker",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assmonkey",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assmunch",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assmuncher",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assnigger",
        "repB": "racial",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asspirate",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assshit",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "assshole",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asssucker",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asswad",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "asswipe",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "axwound",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bampot",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bastard",
        "repB": "illegitimate child",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "beaner",
        "repB": "mexican",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bitch",
        "repB": "female dog",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bitchass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bitches",
        "repB": "female dogs",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bitchtits",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bitchy",
        "repB": "mean",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "blow job",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "blowjob",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bollocks",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bollox",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "boner",
        "repB": "event",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "brotherfucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bullshit",
        "repB": "poop",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "bumblefuck",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "butt plug",
        "repB": "cork",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "butt-pirate",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "buttfucka",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "buttfucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "camel toe",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "carpetmuncher",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "chesticle",
        "repB": "breast",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "chinc",
        "repB": "chinese",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "chink",
        "repB": "asian",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "choad",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "chode",
        "repB": "small male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "clit",
        "repB": "female organs",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "clitface",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "clitfuck",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "clusterfuck",
        "repB": "mess up",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cock",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockass",
        "repB": "jerk",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockbite",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockburger",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockface",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockfucker",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockhead",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockjockey",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockknoker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockmaster",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockmongler",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockmongruel",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockmonkey",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockmuncher",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cocknose",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cocknugget",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockshit",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cocksmith",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cocksmoke",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cocksmoker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cocksniffer",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cocksucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cockwaffle",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "coochie",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "coochy",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "coon",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cooter",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cracker",
        "repB": "caucasian",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cum",
        "repB": "semen",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cumbubble",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cumdumpster",
        "repB": "professional",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cumguzzler",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cumjockey",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cumslut",
        "repB": "dirty girl",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cumtart",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cunnie",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cunnilingus",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cunt",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cuntass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cuntface",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cunthole",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cuntlicker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cuntrag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "cuntslut",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dago",
        "repB": "italian",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "damn",
        "repB": "darn",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "deggo",
        "repB": "italian",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dick",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dick-sneeze",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickbag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickbeaters",
        "repB": "hands",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickface",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickfuck",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickfucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickhead",
        "repB": "phallace face",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickhole",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickjuice",
        "repB": "semen",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickmilk",
        "repB": "sperm",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickmonger",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dicks",
        "repB": "male organes",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickslap",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dicksucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dicksucking",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dicktickler",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickwad",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickweasel",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickweed",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dickwod",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dike",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dildo",
        "repB": "toy",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dipshit",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "doochbag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dookie",
        "repB": "poop",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "douche",
        "repB": "female hygene product",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "douche-fag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "douchebag",
        "repB": "female hygene accessory",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "douchewaffle",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dumass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dumb ass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dumbass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dumbfuck",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dumbshit",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dumshit",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "dyke",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fag",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fagbag",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fagfucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "faggit",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "faggot",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "faggotcock",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fagtard",
        "repB": "homosexual idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fatass",
        "repB": "a fat person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fellatio",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "feltch",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "flamer",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuck",
        "repB": "fornicate",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckbag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckboy",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckbrain",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckbutt",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckbutter",
        "repB": "fluid",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucked",
        "repB": "acted",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucker",
        "repB": "actor",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckersucker",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckface",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckhead",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckhole",
        "repB": "jerk",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckin",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucking",
        "repB": "freaking",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucknut",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucknutt",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckoff",
        "repB": "go away",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucks",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckstick",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucktard",
        "repB": "moron",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fucktart",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckup",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckwad",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckwit",
        "repB": "dummy",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fuckwitt",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "fudgepacker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gay",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gayass",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gaybob",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gaydo",
        "repB": "homosexua",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gayfuck",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gayfuckist",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gaylord",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gaytard",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gaywad",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "goddamn",
        "repB": "goshdarn",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "goddamnit",
        "repB": "goshdarnit",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gooch",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gook",
        "repB": "chinese",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "gringo",
        "repB": "foreigner",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "guido",
        "repB": "italian",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "handjob",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "hard on",
        "repB": "event",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "heeb",
        "repB": "jewish person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "hell",
        "repB": "heck",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "ho",
        "repB": "woman",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "hoe",
        "repB": "Woman",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "homo",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "homodumbshit",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "honkey",
        "repB": "white person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "humping",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jackass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jagoff",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jap",
        "repB": "japanesse person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jerk off",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jerkass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jigaboo",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jizz",
        "repB": "semen",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "jungle bunny",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "junglebunny",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "kike",
        "repB": "jewish person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "kooch",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "kootch",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "kraut",
        "repB": "german",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "kunt",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "kyke",
        "repB": "jewish person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "lameass",
        "repB": "loser",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "lardass",
        "repB": "overweight individual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "lesbian",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "lesbo",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "lezzie",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "mcfagget",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "mick",
        "repB": "irish",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "minge",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "mothafucka",
        "repB": "jerk",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "mothafuckin",
        "repB": "mother loving",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "motherfucker",
        "repB": "mother lover",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "motherfucking",
        "repB": "fornicating with mother",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "muff",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "muffdiver",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "munging",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "negro",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "nigaboo",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "nigga",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "nigger",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "niggers",
        "repB": "african Americans",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "niglet",
        "repB": "african american child",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "nut sack",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "nutsack",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "paki",
        "repB": "pakistanien",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "panooch",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pecker",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "peckerhead",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "male organ",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "male organbanger",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "male organfucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "male organpuffer",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "piss",
        "repB": "urinate",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pissed",
        "repB": "urinated",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pissed off",
        "repB": "angry",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pissflaps",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "polesmoker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pollock",
        "repB": "polish person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "poon",
        "repB": "female organs",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "poonani",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "poonany",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "poontang",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "porch monkey",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "porchmonkey",
        "repB": "african american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "prick",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "punanny",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "punta",
        "repB": "female dog",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pussies",
        "repB": "female organs",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pussy",
        "repB": "female reproductive organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "pussylicking",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "puto",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "queef",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "queer",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "queerbait",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "queerhole",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "renob",
        "repB": "event",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "rimjob",
        "repB": "dirty act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "ruski",
        "repB": "russian",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "sand nigger",
        "repB": "middle eastern",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "sandnigger",
        "repB": "middle eastern",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "schlong",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "scrote",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shit",
        "repB": "poop",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitbag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitbagger",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitbrains",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitbreath",
        "repB": "bad breath",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitcanned",
        "repB": "fired",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitcunt",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitdick",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitface",
        "repB": "pooface",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitfaced",
        "repB": "drunk",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shithead",
        "repB": "jerk",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shithole",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shithouse",
        "repB": "bathroom",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitspitter",
        "repB": "butt",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitstain",
        "repB": "poop",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitter",
        "repB": "defecator",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shittiest",
        "repB": "worst",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitting",
        "repB": "pooping",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shitty",
        "repB": "bad",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shiz",
        "repB": "poop",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "shiznit",
        "repB": "poop",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "skank",
        "repB": "dirty girl",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "skeet",
        "repB": "semen",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "skullfuck",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "slut",
        "repB": "sexually popular woman",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "slutbag",
        "repB": "sexually popular woman",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "smeg",
        "repB": "poop",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "snatch",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "spic",
        "repB": "mexican",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "spick",
        "repB": "mexican american",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "splooge",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "spook",
        "repB": "white person",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "suckass",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "tard",
        "repB": "mentally challenged",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "testicle",
        "repB": "male organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "thundercunt",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "tit",
        "repB": "breast",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "titfuck",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "tits",
        "repB": "breasts",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "tittyfuck",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "twat",
        "repB": "female organs",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "twatlips",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "twats",
        "repB": "female organs",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "twatwaffle",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "unclefucker",
        "repB": "homosexual",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "va-j-j",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "vag",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "female organ",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "vajayjay",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "vjayjay",
        "repB": "female organ",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "wank",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "wankjob",
        "repB": "act",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "wetback",
        "repB": "mexican",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "whore",
        "repB": "hussy",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "whorebag",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "whoreface",
        "repB": "idiot",
        "type": "Simple"
    },
    {
        "active": true,
        "case": "Override",
        "repA": "wop",
        "repB": "italian",
        "type": "Simple"
    }
];
var g_bannedtags = ['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEXTAREA'];

function applyReplacements(node) {
    // Ignore any node whose tag is banned
    if (!node || $.inArray(node.tagName, g_bannedtags) !== -1) return;

    try {
        $(node).contents().each(function(i, v) {
            // Ignore any child node that has been replaced already or doesn't contain text
            if (v.isReplaced || v.nodeType != Node.TEXT_NODE) return;

            // Apply each replacement in order
            g_replacements.forEach(function(replacement) {
                if (!replacement.active) return;
                v.textContent = tryReplacement(v.textContent, replacement);
            });

            v.isReplaced = true;

        });
    } catch (err) {
        // Basically this means that an iframe had a cross-domain source, and WR can't do much about it.
        if (err.name == 'SecurityError');
        else throw err;
    }
}

function processMutations(mutations) {
    mutations.forEach(function(mut) {
        switch (mut.type) {
            case 'characterData':
                applyReplacements(mut.target);
                break;
            case 'childList':
                $(mut.addedNodes).each(function(i, node) {
                    applyReplacements($(node).find('*'));
                });
                break;
        }
    });
}

function main() {
    chrome.storage.local.get(['settings', 'global'], function(items) {
        // If the extension is disabled, do nothing.
        if (!items.global.enabled) {
            return;
        }


        // Return if there are no replacements
        if (!g_replacements || !g_replacements.length) {
            //chrome.runtime.sendMessage("sentiment");
            return;
        }

        // Apply the replacements once upon injection to each descendant of body
        var start = new Date().getMilliseconds();
        $('body *').each(function(i, v) {
            applyReplacements(v);
        });

        // And also to <title>
        applyReplacements($('title')[0]);

        var end = new Date().getMilliseconds();
        //console.log('Initial replacements took ' + end + 'ms.');

        // calling the sentiment part
        // And then apply them Mutations
        new MutationObserver(processMutations).observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    });
}

// Bind events to communicate with the browser action
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    // WR was enabled
    if (request == 'run_cs') {
        main();
        sentiment();
    }
    // WR was disabled
    if (request == 'refresh') {
        location.reload();
    }
});

function sentiment() {
    //console.log("message was loaded");
    chrome.runtime.sendMessage({
        message: "sentiment"
    }, function(response) {
        //console.log(response.message);
    });
    //console.log("message was sent");
}

main();
sentiment();
