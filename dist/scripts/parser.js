/* parser.ts  */
var TSC;
(function (TSC) {
    var Parser = (function () {
        function Parser() {
        }
        Parser.parse = function () {
            parseProgram();
            //Recurrsive Descent Parser 
            function parseProgram() {
                parseBlock();
                matchByValue("$");
            }
            function parseBlock() {
                matchByValue("{");
                parseStatementList();
                matchByValue("}");
            }
            function parseStatementList() {
                //TODO
                var tmpNextToken = nextToken().kind.name;
                console.log("attempting parseStatement list");
                if (tmpNextToken == 'T_PRINT' || tmpNextToken == 'T_WHILE' || tmpNextToken == 'T_IF' || tmpNextToken == 'T_LBRACE' || tmpNextToken == 'T_INT' || tmpNextToken == 'T_STRING' || tmpNextToken == 'T_BOOLEAN' || tmpNextToken == 'T_CHAR') {
                    console.log("matched a statement");
                    parseStatement();
                }
                else {
                }
            }
            function parseStatement() {
                var switcher = nextToken().value;
                console.log("parseing statement");
                switch (switcher) {
                    case 'print':
                        console.log("found a print");
                        parsePrintStatement();
                        break;
                    case 'int':
                    case 'string':
                    case 'boolean':
                        parseVarDecl();
                        break;
                    case 'while':
                        parseWhileStatement();
                        break;
                    case 'if':
                        parseIfStatement();
                        break;
                    case '{':
                        parseBlock();
                        break;
                    default:
                        parseAssignmentStatement();
                }
            }
            function parsePrintStatement() {
                matchByValue("print");
                matchByValue("(");
                parseExpr();
                matchByValue(")");
            }
            function parseAssignmentStatement() {
                parseId();
                matchByValue("=");
                parseExpr();
            }
            function parseVarDecl() {
                parseType();
                parseId();
            }
            function parseWhileStatement() {
                matchByValue("while");
                parseBooleanExpr();
                parseBlock();
            }
            function parseIfStatement() {
                matchByValue("if");
                parseBooleanExpr();
                parseBlock();
            }
            function parseExpr() {
                if (nextToken().kind.name == 'T_DIGIT') {
                    parseDigit();
                    parseIntExpr();
                }
                else if (nextToken().value == '"') {
                    parseStringExpr();
                }
                else if (nextToken().value == '(') {
                    parseBooleanExpr();
                }
                else {
                    parseId();
                }
            }
            function parseIntExpr() {
                parseDigit();
                if (nextToken().value == "+") {
                    parseIntOp();
                    parseExpr();
                }
                else {
                }
            }
            function parseStringExpr() {
                matchByValue('"');
                parseCharList();
                matchByValue('"');
            }
            function parseBooleanExpr() {
                if (nextToken().value == '(') {
                    matchByValue('(');
                    parseExpr();
                    parseBoolOp();
                    parseExpr();
                    matchByValue(')');
                }
                else {
                    parseBoolVal();
                }
            }
            function parseId() {
                parseChar();
            }
            function parseCharList() {
                if (nextToken().kind.name == 'T_CHAR') {
                    parseChar();
                    parseCharList();
                }
                else if (nextToken().kind.name == 'T_SPACE') {
                    parseSpace();
                    parseCharList();
                }
                else {
                }
            }
            function parseType() {
                if (nextToken().value == 'int') {
                    matchByValue("int");
                }
                else if (nextToken().value == 'string') {
                    matchByValue('string');
                }
                else {
                    matchByValue('boolean');
                }
            }
            function parseChar() {
                matchByType('T_CHAR');
            }
            function parseSpace() {
                matchByValue(' ');
            }
            function parseDigit() {
                matchByType('T_DIGIT');
            }
            function parseBoolOp() {
                if (nextToken().value == '==') {
                    matchByValue('==');
                }
                else {
                    matchByValue('!=');
                }
            }
            function parseBoolVal() {
                if (nextToken().value == 'false') {
                    matchByValue('false');
                }
                else {
                    matchByValue('true');
                }
            }
            function parseIntOp() {
                matchByValue('+');
            }
            //Recurrsive Descent Parser End
            function matchByValue(tmpMatch) {
                if (tmpMatch == "$") {
                    eofReached = true;
                }
                //TODO
                putMessage("Expecting: " + tmpMatch);
                putMessage("Found: " + nextToken().value);
                if (tmpMatch == nextToken().value) {
                    putMessage("Successfully matched, token consumed");
                }
                else {
                    parseError = true;
                    putMessage("Error on line " + nextToken().line + "found token " + nextToken().value);
                }
                //Consume token
                nextTokenIndex++;
            }
            function matchByType(tmpMatch) {
                if (tmpMatch == "$") {
                    eofReached = true;
                }
                //TODO
                putMessage("Expecting: " + tmpMatch);
                putMessage("Found: " + nextToken().value);
                if (tmpMatch == nextToken().kind.name) {
                    putMessage("Successfully matched, token consumed");
                }
                else {
                    parseError = true;
                    putMessage("Error on line " + nextToken().line + "found token " + nextToken().value);
                }
                //Consume token
                nextTokenIndex++;
            }
            function nextToken() {
                //EOF reached early
                if (eofReached && nextTokenIndex < tokenList.length - 1) {
                    //ADD error 
                    var currentToken = tokenList[nextTokenIndex];
                    nextTokenIndex = tokenList.length - 1;
                    //TEMP message
                    putMessage("NextTokenIndex: " + nextTokenIndex);
                    putMessage("tokenList.length: " + tokenList.length);
                    putMessage("Parse Error: EOF marker reached with source code remaining");
                }
                if (nextTokenIndex < tokenList.length) {
                    var currentToken = tokenList[nextTokenIndex];
                }
                //else if {
                //}
                //TODO
                //End of file check
                //EOF token check
                return currentToken;
            }
        };
        return Parser;
    })();
    TSC.Parser = Parser;
})(TSC || (TSC = {}));
