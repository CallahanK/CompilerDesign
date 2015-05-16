/* lexer.ts  */

module TSC {
	export class Lexer {
        public static lex() {
		    
            // Trim the leading and trailing spaces.
            sourceCode = TSC.Utils.trim(sourceCode);
            //Returns an array of tokens
            return tokenize(sourceCode);


            function tokenize(tmpSrc: string) {
                //Gets information on the current match
                var currentTokenType = matchToken(tmpSrc);
                var currentLength = getTokenLength(currentTokenType);
                //Removes the current match from the begin of the src
                var srcTokenizing = tmpSrc.substring(currentLength);
                //Creates a new, empty token object
                var currentToken = new Token();
                
                //Gets the name of the current match
                //returns null if the match was a null
                try {
                    var switcher = currentTokenType.name;
                }
                catch (tmpEr) {
                    var switcher = null;
                }
                
                //Switches based on the current match
                switch(switcher){
                    //Increaments the line counter
                    case 'T_NEWLINE':
                        currentLine++;
                        if (inString) {
                            lexErrors.push("New line symbol found in string on line: " + (currentLine-1));
                        }
                    //Checks if in a string, and only makes a space type
                    //token if we are in string mode
                    case 'T_SPACE':
                        //console.log("SPACE");
                        if(inString){
                            currentToken.kind = currentTokenType;
                            currentToken.line = currentLine;
                            currentToken.value = tmpSrc.substring(0,currentLength);
                        }
                        else{
                            //Returns the next match instead of 
                            //Adding a space type token
                            return tokenize(srcTokenizing);
                        }
                        break;
                    case null:
                        //Lexing error
                        //Don't add token
                        //Continue to next token
                        lexErrors.push("Invalid symbol: \'" + tmpSrc.substring(0, currentLength) +"\' found on line: " + currentLine);
                        errorCount++;
                        lexError = true;
                        break;
                    case 'T_QUOTE':
                        //Toggle in string
                        inString = !inString;

                    case 'T_CHAR':
                        if(inString){
                            currentToken.kind = currentTokenType;
                            currentToken.line = currentLine;
                            currentToken.value = tmpSrc.substring(0, currentLength);
                            break;
                        }
                    default:
                        //Sets the value of the initized token to the
                        //matched token values
                        if(inString){
                            lexErrors.push("Invalid symbol: \'" + tmpSrc.substring(0, currentLength) + "\' found in CharList on line: " + currentLine);
                            errorCount++;
                            lexError = true;
                            break;
                        }
                        //console.log("default");
                        currentToken.kind = currentTokenType;
                        currentToken.line = currentLine;
                        currentToken.value = tmpSrc.substring(0, currentLength);
                        break;
                }

                //Adds the new token to the tokenList array
                if (srcTokenizing.length > 0) {
                    //console.log("adding token");
                    return new Array(currentToken).concat(tokenize(srcTokenizing));
                }
                else {
                    //console.log("adding last token");
                    return new Array(currentToken);
                }


            }
        }
    }
}       





