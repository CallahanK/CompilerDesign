﻿ /* token.ts */




class Token {
    kind: TokenType;
    value: string;
    line: number; 
    constructor(kind: TokenType, value: string, line: number){
        this.kind = kind;
        this.value = value;
        this.line = line;
    }

}
//REGEXs

//Single Symbols
var R_EOF = new RegExp('^[$]');
var R_LBRACE = new RegExp('^[{]');
var R_RBRACE = new RegExp('^[}]');
var R_LPAREN = new RegExp('^[(]');
var R_RPAREN = new RegExp('^[)]');
var R_QUOTE = new RegExp('^["]');
var R_BOOLEQ = new RegExp('^[==]');
var R_ASSIGN = new RegExp('^[=]');
var R_NTBOOLEQ = new RegExp('^[!=]');
var R_INTOP = new RegExp('^[+]');
var R_SPACE = new RegExp('^\\s');
//Keywords
var R_PRINT = new RegExp('^[print]');
var R_WHILE = new RegExp('^[while]');
var R_IF = new RegExp('^[int]');
var R_INT = new RegExp('^[if]');
var R_STRING = new RegExp('^[string]');
var R_BOOLEAN = new RegExp('^[boolean]');
var R_BOOLTRUE = new RegExp('^[true]');
var R_BOOLFALSE = new RegExp('^[false]');

var R_CHAR = new RegExp('^[a-z]');
var R_DIGIT = new RegExp('^[0-9]');

var R_NEWLINE = new RegExp('^[\n|\r]');

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

var tokentypes = [];
//test
tokentypes.push(new TokenType(R_CHAR, "T_CHAR", 1));     //[a-z]

//Keywords
tokentypes.push(new TokenType(R_PRINT, "T_PRINT", 5));    //print
tokentypes.push(new TokenType(R_WHILE, "T_WHILE", 5));  //while
tokentypes.push(new TokenType(R_IF, "T_IF",  2));         //if
tokentypes.push(new TokenType(R_INT, "T_INT", 3));  //int
tokentypes.push(new TokenType(R_STRING, "T_STRING", 5));  //string
tokentypes.push(new TokenType(R_BOOLEAN, "T_BOOLEAN", 7));  //boolean
tokentypes.push(new TokenType(R_BOOLTRUE, "T_BOOLTRUE", 4));  //true
tokentypes.push(new TokenType(R_BOOLFALSE, "T_BOOLFALSE", 5));  //false
//Single Symbols
tokentypes.push(new TokenType(R_EOF, "T_EOF", 1)); //$
tokentypes.push(new TokenType(R_LBRACE, "T_LBRACE", 1));  //{
tokentypes.push(new TokenType(R_RBRACE, "T_RBRACE", 1));  //}
tokentypes.push(new TokenType(R_LPAREN, "T_LPAREN", 1));  //(
tokentypes.push(new TokenType(R_RPAREN, "T_RPAREN", 1));  //)
tokentypes.push(new TokenType(R_QUOTE, "T_QUOTE", 1));    //"
tokentypes.push(new TokenType(R_BOOLEQ, "T_BOOLEQ", 2));  //==
tokentypes.push(new TokenType(R_ASSIGN, "T_ASSIGN", 1));  //=
tokentypes.push(new TokenType(R_NTBOOLEQ, "T_NTBOOLEQ", 2));  //!=
tokentypes.push(new TokenType(R_INTOP, "T_INTOP", 1));  //+
tokentypes.push(new TokenType(R_SPACE, "T_SPACE", 1));  //' '

tokentypes.push(new TokenType(R_CHAR, "T_CHAR", 1));     //[a-z]
tokentypes.push(new TokenType(R_DIGIT, "T_DIGIT", 1));    //[0-9]
    
tokentypes.push(new TokenType(R_NEWLINE, "T_NEWLINE", 1)); // \n | \r



function matchToken(src) {
    console.log('try to match token');
    for (var tokenType in tokentypes ){

        try{
            if (tokentypes[tokenType].regex.test(src)) {
                console.log("matchedToken");
                return tokentypes[tokenType];
            }
            console.log("mismatched token" + tokentypes[tokenType].regex);
        }
        catch (er) {
            console.log("caught error");
            return null;
        } 
    }
    return null;
}


function getTokenLength(token){
    if (token instanceof TokenType){
        return token.matchLen;
    }
    else{
        //Error
        return 1;
    }
}