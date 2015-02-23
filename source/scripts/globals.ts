
/*
var onDocumentLoad = function() {
	TSOS.Control.hostInit();
};
*/
var _Lexer = TSC.Lexer;
//test
// Global variables
    var sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
    

// Lexer variables
    var tokenList = [];
    var inString = false;
    var currentLine = 1;
    var errorCount = 0;