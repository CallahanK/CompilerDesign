/* lexer.ts  */
var TSC;
(function (TSC) {
    var Lexer = (function () {
        function Lexer() {
        }
        Lexer.lex = function () {
            // Trim the leading and trailing spaces.
            sourceCode = TSC.Utils.trim(sourceCode);
            return tokenize(sourceCode);
            function tokenize(tmpSrc) {
                var currentTokenType = matchToken(tmpSrc);
                var currentLength = getTokenLength(currentTokenType);
                var srcTokenizing = tmpSrc.substring(currentLength);
                var currentToken = new Token();
                try {
                    console.log("null try");
                    var switcher = currentTokenType.name;
                }
                catch (tmpEr) {
                    console.log("null catch");
                    var switcher = null;
                }
                switch (switcher) {
                    case 'T_NEWLINE':
                        currentLine++;
                        console.log("NEW LINE");
                    case 'T_SPACE':
                        if (inString) {
                            currentToken.kind = currentTokenType;
                            currentToken.line = currentLine;
                            currentToken.value = tmpSrc.substring(0, currentLength);
                        }
                        else {
                            //next token
                            return tokenize(srcTokenizing);
                        }
                        break;
                    case null:
                        //Lexing error
                        //Don't add token
                        //Continue to next token
                        lexErrors.push("Unidentified symbol: " + tmpSrc.substring(0, currentLength) + " found on line:" + currentLine);
                        errorCount++;
                        lexError = true;
                        break;
                    case 'T_QUOTE':
                        //Toggle in string
                        inString = !inString;
                    default:
                        console.log("default");
                        currentToken.kind = currentTokenType;
                        currentToken.line = currentLine;
                        currentToken.value = tmpSrc.substring(0, currentLength);
                        break;
                }
                if (srcTokenizing.length > 0) {
                    console.log("adding token");
                    return new Array(currentToken).concat(tokenize(srcTokenizing));
                }
                else {
                    console.log("adding last token");
                    return new Array(currentToken);
                }
            }
        };
        return Lexer;
    })();
    TSC.Lexer = Lexer;
})(TSC || (TSC = {}));
