/* main.ts */
function init() {
    // Clear the message box. 
    document.getElementById("taOutput").value = "";
    // Set the initial values for our globals.
    tokenList = [];
    inString = false;
    currentLine = 1;
    errorCount = 0;
    lexError = false;
    lexErrors = [];
    //Parser var
    nextTokenIndex = 0;
    parseError = false;
    eofReached = false;
}
function btnCompile_click() {
    // This is executed as a result of the user pressing the 
    // "compile" button between the two text areas, above.  
    // Note the <input> element's event handler: onclick="btnCompile_click();
    init();
    // Grab the tokens from the lexer . . .
    //tokenList = _Lexer.lex();
    putMessage("Lexing Started");
    sourceCode = document.getElementById("taSourceCode").value;
    putMessage("Src:" + sourceCode);
    tokenList = _Lexer.lex();
    if (!lexError) {
        for (var token in tokenList) {
            putMessage(tokenList[token].line + "  |  " + tokenList[token].kind.name + "  |  \'" + tokenList[token].value + "\'");
        }
    }
    else {
        putMessage("Lex ERROR, parse cancelled");
        for (var error in lexErrors) {
            putMessage(lexErrors[error]);
        }
    }
    if (!lexError) {
        putMessage("Commencing Parse");
        var test = _Parser.parse();
    }
}
function putMessage(msg) {
    document.getElementById("taOutput").value += msg + "\n";
}
/*
// PARSE STUFF
//
function parse() {
    putMessage("Parsing [" + tokenList + "]");
    // Grab the next token.
    currentToken = getNextToken();
    // A valid parse derives the G(oal) production, so begin there.
    parseG();
    // Report the results.
    putMessage("Parsing found " + errorCount + " error(s).");
}

function parseG() {
    // A G(oal) production can only be an E(xpression), so parse the E production.
    parseE();
}

function parseE() {
    // All E productions begin with a digit, so make sure that we have one.
    checkToken("digit");
    // Look ahead 1 char (which is now in currentToken because checkToken
    // consumes another one) and see which E production to follow.
    if (currentToken != EOF) {
        // We're not done, we expect to have an op.
        checkToken("op");
        parseE();
    } else {
        // There is nothing else in the token stream,
        // and that's cool since E --> digit is valid.
        putMessage("EOF reached");
    }
}

function checkToken(expectedKind) {
    // Validate that we have the expected token kind and et the next token.
    switch (expectedKind) {
        case "digit": putMessage("Expecting a digit");
            if (currentToken == "0" || currentToken == "1" || currentToken == "2" ||
                currentToken == "3" || currentToken == "4" || currentToken == "5" ||
                currentToken == "6" || currentToken == "7" || currentToken == "8" ||
                currentToken == "9") {
                putMessage("Got a digit!");
            }
            else {
                errorCount++;
                putMessage("NOT a digit.  Error at position " + tokenIndex + ".");
            }
            break;
        case "op": putMessage("Expecting an operator");
            if (currentToken == "+" || currentToken == "-") {
                putMessage("Got an operator!");
            }
            else {
                errorCount++;
                putMessage("NOT an operator.  Error at position " + tokenIndex + ".");
            }
            break;
        default: putMessage("Parse Error: Invalid Token Type at position " + tokenIndex + ".");
            break;
    }
    // Consume another token, having just checked this one, because that
    // will allow the code to see what's coming next... a sort of "look-ahead".
    currentToken = getNextToken();
}

function getNextToken() {
    var thisToken = EOF;    // Let's assume that we're at the EOF.
    if (tokenIndex < tokens.length) {
        // If we're not at EOF, then return the next token in the stream and advance the index.
        thisToken = tokens[tokenIndex];
        putMessage("Current token:" + thisToken);
        tokenIndex++;
    }
    return thisToken;
}

*/
