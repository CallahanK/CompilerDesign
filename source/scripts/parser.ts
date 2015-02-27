/* parser.ts  */

module TSC {
    export class Parser {
        public static parse() {

            //Recurrsive Descent Parser

            function parseProgram(){
                //TODO
                parseBlock();
                //match($);
            }

            function parseBlock(){
                //TODO
                //match({);
                parseStatementList();
                //match(});
            }

            function parseStatementList(){
                //TODO
                //if(nextToken is statement){
                    parseStatement();
                //} else {
                    //epsilon production
                //}
            }

            function parseStatement(){
                //TODO
            }

            function parsePrintStatement(){
                //match('print');
                //match('(');
                parseExpr();
                //match(')');
            }

            function parseAssignmentStatement(){
                parseId();
                //match(=);
                parseExpr();
            }
            
            function parseVarDecl(){
                parseType();
                parseId();
            }

            function parseWhileStatement(){
                //match('while');
                parseBooleanExpr();
                parseBlock();
            }

            function parseIfStatement(){
                //match('if');
                parseBooleanExpr();
                parseBlock();
            }

            function parseExpr(){
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

            function parseIntExpr(){
                parseDigit()
                //if(nextToken is + ){
                    parseIntOp();
                    parseExpr();
                //} else {
                    //epsilon production b/c already parsed the digit
                //}
            }

            function parseStringExpr(){
                //match(");
                parseCharList();
                //match(");
            }

            function parseBooleanExpr(){
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

            function parseId(){
                parseChar();
            }

            function parseCharList(){
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

            function parseType(){
                //if(nextToken() is int){
                    //match(int);
                //}
                //else if(nextToken() is string){
                    //match('string');
                //} else {
                    //match('boolean');
                //}
            }

            function parseChar(){
                //match(char/alpha);
            }

            function parseSpace(){
                //match(space);
            }

            function parseDigit(){
                //match(digit);
            }

            function parseBoolOp(){
                //if (nextToken() is ==){
                    //match(==);
                //} else {
                    //match(!=);
                //}
            }

            function parseBoolVal(){
                //if(nextToken() is false){
                    //match('false")
                //} else {
                    //match('true');
                //}
            }

            function parseIntOp(){
                //match(+);
            }

            //Recurrsive Descent Parser End



            function match(){
                //TODO
                //if match true
                //increament nextTokenIndex
            }

            function nextToken(){
                var currentToken = tokenList[nextTokenIndex];
                //TODO
                //End of file check
                //EOF token check


                return currentToken;
            }








        }
    }
} 