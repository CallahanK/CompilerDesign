 /* token.ts */



//Token class for individual, unique tokens built by the lexer
class Token {
    kind: TokenType;
    value: string;
    line: number; 


    /* not needed
    constructor(kind: TokenType, value: string, line: number){
        this.kind = kind;
        this.value = value;
        this.line = line;
    }
    */
}
//REGEXs

//Single Symbols
var R_EOF = new RegExp('^[$]');
var R_LBRACE = new RegExp('^[{]');
var R_RBRACE = new RegExp('^[}]');
var R_LPAREN = new RegExp('^[\(]');
var R_RPAREN = new RegExp('^[\)]');
var R_QUOTE = new RegExp('^["]');
var R_BOOLEQ = new RegExp('^==');
var R_ASSIGN = new RegExp('^[=]');
var R_NTBOOLEQ = new RegExp('^!=');
var R_INTOP = new RegExp('^[+]');
var R_SPACE = new RegExp('^[^\\S\\r\\n]');
//Keywords
var R_PRINT = new RegExp('^print');
var R_WHILE = new RegExp('^while');
var R_IF = new RegExp('^if');
var R_INT = new RegExp('^int');
var R_STRING = new RegExp('^string');
var R_BOOLEAN = new RegExp('^boolean');
var R_BOOLTRUE = new RegExp('^true');
var R_BOOLFALSE = new RegExp('^false');

var R_CHAR = new RegExp('^[a-z]');
var R_DIGIT = new RegExp('^[0-9]');

var R_NEWLINE = new RegExp('^[\\n\\r]');

//Class for token kinds, also used as an element of a token
class TokenType {
    regex: RegExp;
    name: string;
    matchLen: number;
    constructor(regex: RegExp, name: string, matchLen: number){
        this.regex = regex;
        this.name = name;
        this.matchLen = matchLen;
    }
}

//Collection of token kinds in significant order
var tokentypes = [];
//test
//tokentypes.push(new TokenType(R_CHAR, "T_CHAR", 1));       //[a-z]

//Keywords
tokentypes.push(new TokenType(R_PRINT, "T_PRINT", 5));          //print
tokentypes.push(new TokenType(R_WHILE, "T_WHILE", 5));          //while
tokentypes.push(new TokenType(R_IF, "T_IF",  2));               //if
tokentypes.push(new TokenType(R_INT, "T_INT", 3));              //int
tokentypes.push(new TokenType(R_STRING, "T_STRING", 5));        //string
tokentypes.push(new TokenType(R_BOOLEAN, "T_BOOLEAN", 7));      //boolean
tokentypes.push(new TokenType(R_BOOLTRUE, "T_BOOLTRUE", 4));    //true
tokentypes.push(new TokenType(R_BOOLFALSE, "T_BOOLFALSE", 5));  //false
//Char | ID
tokentypes.push(new TokenType(R_CHAR, "T_CHAR", 1));            //[a-z]

//Digits
tokentypes.push(new TokenType(R_DIGIT, "T_DIGIT", 1));          //[0-9]

//Single Symbols
tokentypes.push(new TokenType(R_EOF, "T_EOF", 1)); //$
tokentypes.push(new TokenType(R_LBRACE, "T_LBRACE", 1));        //{
tokentypes.push(new TokenType(R_RBRACE, "T_RBRACE", 1));        //}
tokentypes.push(new TokenType(R_LPAREN, "T_LPAREN", 1));        //(
tokentypes.push(new TokenType(R_RPAREN, "T_RPAREN", 1));        //)
tokentypes.push(new TokenType(R_QUOTE, "T_QUOTE", 1));          //"
tokentypes.push(new TokenType(R_BOOLEQ, "T_BOOLEQ", 2));        //==
tokentypes.push(new TokenType(R_ASSIGN, "T_ASSIGN", 1));        //=
tokentypes.push(new TokenType(R_NTBOOLEQ, "T_NTBOOLEQ", 2));    //!=
tokentypes.push(new TokenType(R_INTOP, "T_INTOP", 1));          //+

//NewLine must be before space, as whitespace also captures newline
//A better regex was implemented to fix this but it was inconsistent 
//so ordering was a better solution
tokentypes.push(new TokenType(R_NEWLINE, "T_NEWLINE", 1));   // \n | \r
tokentypes.push(new TokenType(R_SPACE, "T_SPACE", 1));       //' '


    



//Takes in the current src code and finds the longest token kind match
//at the front of the string
function matchToken(src) {
    console.log('try to match token');
    for (var tokenType in tokentypes ){

        if (inString && tokentypes[tokenType].matchLen>1){
            continue;
        }
        //if regex does not find a match to the valid token kinds
        //then the src contains an invalid char and an error was found
        try{
            if (tokentypes[tokenType].regex.test(src)) {
                console.log("matchedToken" + tokentypes[tokenType].regex);
                return tokentypes[tokenType];
            }
        }
        catch (erTEST) {
            console.log("caught error");
            return null;
        } 
    }
    return null;
}

//Returns the length of a token
//if token is not a valid token
//returns 1 to skip it and continue lexing 
//to find any further invalid chars
function getTokenLength(token){
    if (token instanceof TokenType){
        return token.matchLen;
    }
    else{
        //Error
        return 1;
    }
}