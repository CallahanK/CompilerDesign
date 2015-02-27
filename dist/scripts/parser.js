/* parser.ts  */
var TSC;
(function (TSC) {
    var Parser = (function () {
        function Parser() {
        }
        Parser.parse = function () {
            parseProgram();
            //Recurrsive Descent Parser
            return parseError;
            function parseProgram() {
                parseBlock();
                match("$");
            }
            function parseBlock() {
                //TODO
                match("{");
                parseStatementList();
                match("}");
            }
            function parseStatementList() {
                //TODO
                //if(nextToken is statement){
                if (false) {
                    parseStatement();
                }
                else {
                }
            }
            function parseStatement() {
                //TODO
            }
            function parsePrintStatement() {
                //match('print');
                //match('(');
                parseExpr();
                //match(')');
            }
            function parseAssignmentStatement() {
                parseId();
                //match(=);
                parseExpr();
            }
            function parseVarDecl() {
                parseType();
                parseId();
            }
            function parseWhileStatement() {
                //match('while');
                parseBooleanExpr();
                parseBlock();
            }
            function parseIfStatement() {
                //match('if');
                parseBooleanExpr();
                parseBlock();
            }
            function parseExpr() {
                //if(nextToken is [0-9]){
                parseDigit();
                parseIntExpr();
                //}
                //else if(nextToken is "){
                parseStringExpr();
                //}
                //else if(nextToken is ( ){
                parseBooleanExpr();
                //} else {
                parseId();
                //} 
            }
            function parseIntExpr() {
                parseDigit();
                //if(nextToken is + ){
                parseIntOp();
                parseExpr();
                //} else {
                //epsilon production b/c already parsed the digit
                //}
            }
            function parseStringExpr() {
                //match(");
                parseCharList();
                //match(");
            }
            function parseBooleanExpr() {
                //if(nextToken() is ( ){
                //match('(');
                parseExpr();
                parseBoolOp();
                parseExpr();
                //match(')');
                //} else {
                parseBoolVal();
                //}
            }
            function parseId() {
                parseChar();
            }
            function parseCharList() {
                //if(nextToken() is alpha){
                parseChar();
                parseCharList();
                //}
                //else if(nextToken() is space){
                parseSpace();
                parseCharList();
                //} else {
                //epsilon production
                //}
            }
            function parseType() {
                //if(nextToken() is int){
                //match(int);
                //}
                //else if(nextToken() is string){
                //match('string');
                //} else {
                //match('boolean');
                //}
            }
            function parseChar() {
                //match(char/alpha);
            }
            function parseSpace() {
                //match(space);
            }
            function parseDigit() {
                //match(digit);
            }
            function parseBoolOp() {
                //if (nextToken() is ==){
                //match(==);
                //} else {
                //match(!=);
                //}
            }
            function parseBoolVal() {
                //if(nextToken() is false){
                //match('false")
                //} else {
                //match('true');
                //}
            }
            function parseIntOp() {
                //match(+);
            }
            //Recurrsive Descent Parser End
            function match(tmpMatch) {
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
