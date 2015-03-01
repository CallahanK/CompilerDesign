/* parser.ts  */

module TSC {
    export class Parser {
        public static parse() {
            
            parseProgram(); 

            //Recurrsive Descent Parser 

            function parseProgram(){
                parseBlock();
                matchByValue("$");
                if(nextToken()){
                    parseWarnings.push("Warning: EOF marker reached with source code remaining, remaining code ignored ");
                }

            }

            function parseBlock(){
                matchByValue("{");
                parseStatementList();
                matchByValue("}");
            }

            function parseStatementList(){
                var tmpNextToken = nextToken().kind.name;
                if (tmpNextToken == 'T_PRINT' || tmpNextToken == 'T_WHILE' || tmpNextToken == 'T_IF' || tmpNextToken == 'T_LBRACE' || tmpNextToken == 'T_INT' || tmpNextToken == 'T_STRING' || tmpNextToken == 'T_BOOLEAN' || tmpNextToken == 'T_CHAR'){
                    parseStatement();
                    parseStatementList();
                } else {
                    //epsilon production
                }
            }

            function parseStatement(){
                var switcher = nextToken().value;
                switch (switcher) {

                    case 'print':
                        parsePrintStatement();
                        break;
                    //case 'alpha':
                     //   parseAssignmentStatement();  
                     //   break;
                    case 'int': case 'string': case 'boolean':
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
                        console.log('case assign');
                        parseAssignmentStatement();

                }


            }

            function parsePrintStatement(){
                matchByValue("print");
                matchByValue("(");
                parseExpr();
                matchByValue(")");
            }

            function parseAssignmentStatement() {
                console.log('trying id');
                parseId();
                console.log('parsed id');
                matchByValue("=");
                console.log('parse =');
                parseExpr();
                console.log('pasrsed ecpr');
            }
            
            function parseVarDecl(){
                parseType();
                parseId();
            }

            function parseWhileStatement(){
                matchByValue("while");
                parseBooleanExpr();
                parseBlock();
            }

            function parseIfStatement(){
                matchByValue("if");
                parseBooleanExpr();
                parseBlock();
            }

            function parseExpr(){
                if(nextToken().kind.name == 'T_DIGIT'){
                    parseIntExpr();
                }
                else if(nextToken().value == '"'){
                    parseStringExpr();
                    
                }
                else if(nextToken().value == '(' || nextToken().value == 'true' || nextToken().value == 'false' ){
                    parseBooleanExpr();
                } else {
                    parseId();
                } 
            }

            function parseIntExpr(){
                parseDigit()
                if(nextToken().value == "+" ){
                    parseIntOp();
                    parseExpr();
                } else {
                    //epsilon production b/c already parsed the digit
                }
            }

            function parseStringExpr(){
                matchByValue('"');
                parseCharList();
                matchByValue('"');
            }

            function parseBooleanExpr(){
                if(nextToken().value == '(' ){
                    matchByValue('(');
                    parseExpr();
                    parseBoolOp();
                    parseExpr();
                    matchByValue(')');
                } else {
                    parseBoolVal();
                }
            }

            function parseId(){
                parseChar();
            }

            function parseCharList(){
                if(nextToken().kind.name == 'T_CHAR'){
                    parseChar();
                    parseCharList();
                }
                else if(nextToken().kind.name == 'T_SPACE'){
                    parseSpace();
                    parseCharList();
                } else {
                    //epsilon production
                }
            }

            function parseType(){
                if(nextToken().value == 'int'){
                    matchByValue("int");
                }
                else if(nextToken().value == 'string'){
                    matchByValue('string');
                } else {
                    matchByValue('boolean');
                }
            }

            function parseChar(){
                matchByType('T_CHAR');
            }

            function parseSpace(){
                matchByValue(' ');
            }

            function parseDigit(){
                matchByType('T_DIGIT');
            }

            function parseBoolOp(){
                if (nextToken().value == '=='){
                    matchByValue('==');
                } else {
                    matchByValue('!=');
                }
            }

            function parseBoolVal(){
                if (nextToken().value == 'false') {
                    matchByValue('false');
                } else {
                    matchByValue('true');
                }
            }

            function parseIntOp(){
                matchByValue('+');
            }

            //Recurrsive Descent Parser End

            //Matches a terminal by the char in the src code
            function matchByValue(tmpMatch: string) {
                if (tmpMatch == "$") {
                    eofReached = true;
                }
                
                parseMessages.push("Expecting: " + tmpMatch);
                parseMessages.push("Found: " + nextToken().value);
                if(tmpMatch == nextToken().value){
                    parseMessages.push("Successfully matched, token consumed");
                    
                } else {
                    parseError = true;
                    parseErrors.push("Error on line: " + nextToken().line + " found unexpected token \'" + nextToken().value + "\'");
                }
                //Consume token
                nextTokenIndex++;
            }
            //Matches a terminal by its type
            //Useful for digit and char, as it limits the number of 
            //comparisons needed
            function matchByType(tmpMatch: string) {
                if (nextToken().value == "$") {
                    eofReached = true;
                }
                //TODO
                parseMessages.push("Expecting: " + tmpMatch);
                parseMessages.push("Found: " + nextToken().value);
                if (tmpMatch == nextToken().kind.name) {
                    parseMessages.push("Successfully matched, token consumed");
                    //Consume token
                    nextTokenIndex++;
                } else {
                    parseError = true;
                    parseErrors.push("Error on line: " + nextToken().line + " found unexpected token \'" + nextToken().value + "\'");
                }
                //Consume token 
                //nextTokenIndex++;
            }

            //Returns the token currently being parsed
            //Also checks and handles early or missing eof marker
            function nextToken() {
                //EOF reached early
              /*  if (eofReached && nextTokenIndex < tokenList.length-1 ){
                    //ADD error 
                    var currentToken = tokenList[nextTokenIndex];
                    nextTokenIndex = tokenList.length - 1
                    //TEMP message 
                    parseErrors.push("Error on line: " + currentToken.line + " EOF marker reached with source code remaining ");
                } */

                if (nextTokenIndex == tokenList.length - 1 && !eofReached) {
                    //Warning
                    var eofToken = new Token();
                    eofToken.kind = new TokenType(R_EOF, "T_EOF", 1);
                    eofToken.line = currentLine;
                    eofToken.value = "$";
                    tokenList.push(eofToken);
                    parseWarnings.push("Warning: EOF reached without EOF marker, EOF marker added");
                }

                if( nextTokenIndex < tokenList.length ){
                    var currentToken = tokenList[nextTokenIndex];
                }
                
                return currentToken;
            }








        }
    }
} 