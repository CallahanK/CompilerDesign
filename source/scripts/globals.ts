
/*
var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
*/
var _Lexer = TSC.Lexer;
var _Parser = TSC.Parser;



//test
// Global variables
    var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
    

// Lexer variables
    var tokenList = [];
    var inString = false;
    var currentLine = 1;
    var errorCount = 0;
    var lexErrors = [];
    //temp
    var lexError = false;  

// Parser variables
    var nextTokenIndex = 0;  