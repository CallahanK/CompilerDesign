/*
var onDocumentLoad = function() {
    TSOS.Control.hostInit();
};
*/
var _Lexer = TSC.Lexer;
var _Parser = TSC.Parser;
var _CST = TSC.ConcreteSyntaxTree;
var _Analyser = TSC.SemanticAnalyser;
//test 
// Global variables
var sourceCode = document.getElementById("taSourceCode").value;
// Lexer variables
var tokenList = [];
var inString = false;
var currentLine = 1;
var errorCount = 0;
var lexErrors = [];
var lexError = false;
// Parser variables
var nextTokenIndex = 0;
var parseError = false;
var eofReached = false;
var parseMessages = [];
var parseWarnings = [];
var parseErrors = [];
// Semantic variables
var cst = new TSC.Tree;
var ast = new TSC.Tree;
var nextTokenIndexSem = 0;
var stringMode = false;
var stringBuild = "";
var scopeCount = 0;
var symbolTable = new TSC.SymbolTable;
var semanticError = false;
var semanticMessages = [];
var semanticWarnings = [];
var semanticErrors = [];
