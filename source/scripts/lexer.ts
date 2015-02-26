/* lexer.ts  */

module TSC {
	export class Lexer {
        public static lex() {
		    
            // Trim the leading and trailing spaces.
            sourceCode = TSC.Utils.trim(sourceCode);

            return tokenize(sourceCode);


            function tokenize(tmpSrc: string) {

                var currentTokenType = matchToken(tmpSrc);
                var currentLength = getTokenLength(currentTokenType);

                var srcTokenizing = tmpSrc.substring(currentLength);

                var currentToken = new Token();
                

                try {
                    console.log("null try");
                    var switcher = currentTokenType.name;
                }
                catch (tmpEr) {
                    var switcher = null;
                }

                switch(switcher){

                    case 'T_NEWLINE':
                        currentLine++;
                        break;
                    case 'T_SPACE':
                        if(inString){
                            currentToken.kind = currentTokenType;
                            currentToken.line = currentLine;
                            currentToken.value = tmpSrc.substring(0,currentLength);
                        }
                        else{
                            //next token
                            return tokenize(srcTokenizing);
                        }
                        break;
                    case null:
                        //Lexing error
                        //Don't add token
                        //Continue to next token
                        console.log("Null case: error");
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
                    console.log("adding first token");
                    return new Array(currentToken);
                }


            }
        }
    }
}       





