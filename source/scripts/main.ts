 /* main.ts */


    function init() {
        // Clear the message box. 
        (<HTMLInputElement>document.getElementById("taOutput")).value = "";
        // Set the initial values for our globals. 
        tokenList = [];
        inString = false;
        currentLine = 1;
        errorCount = 0;
        lexError = false;
        lexErrors = [];

        //Parser var
        nextTokenIndex = 0;
        parseError = false;
        eofReached = false;
        parseMessages = [];
        parseWarnings = [];
        parseErrors = [];

        // Semantic variables
        cst = new TSC.Tree;
        ast = new TSC.Tree;
        nextTokenIndexSem = 0;
        stringMode = false;
        stringBuild = "";
        scopeCount = 0;
        symbolTable = new TSC.SymbolTable;
        semanticError = false;
        semanticMessages = [];
        semanticWarnings = [];
        semanticErrors = [];

        //Code Gen variables
        codeGenError = false;
        codeGenMessages = [];
        codeGenWarnings = [];
        codeGenErrors = [];
        staticDataTable = {};
        staticDataIndex = 0;

        jumpTable = {};
        assembledInstructions = [];
        currentStatic = 0;
        currentHeap = 256;
        currentScope = null;
        currentScopeIndex = [0];

    } 

    function btnCompile_click() {        
        // This is executed as a result of the user pressing the 
        // "compile" button between the two text areas, above.  
        // Note the <input> element's event handler: onclick="btnCompile_click();
        init(); 
         
        // Grab the tokens from the lexer . . .     
        //tokenList = _Lexer.lex(); 
        
        sourceCode = (<HTMLInputElement>document.getElementById("taSourceCode")).value;
        putMessage("Source:" + sourceCode);
        //Tests if src exists
        if (!(sourceCode.trim() == "")) {
            putMessage("Lexing Started");
            tokenList = _Lexer.lex();
            if (!lexError) {
                putMessage("Lex Successful");
                for (var token in tokenList) {
                    putMessage(tokenList[token].line + "  |  " + tokenList[token].kind.name + "  |  \'" + tokenList[token].value + "\'");
                }
                putMessage(" ");
                putMessage("Parsing Started");
                _Parser.parse();

                if (!parseError) {
                    putMessage("Parse Successful");
                    for (var warning in parseWarnings) {
                        putMessage(parseWarnings[warning]);
                    }
                    for (var message in parseMessages) {
                        putMessage(parseMessages[message]);
                    }

                    //Start Semantic Analysis  
                    console.log("SemAnalysis"); 
                    putMessage(" ");
                    putMessage("Semantic Analysis Started");
                    putMessage("Building CST");
                    _CST.buildCST();
                    putMessage("CST Built");
                    putMessage("Building AST");
                    putMessage("AST Built");
                    putMessage("Building Symbol Table");

                    console.log(ast);

                    _Analyser.analyse();
                    if (!semanticError) {
                        
                        putMessage("Symbol Table Built");

                        putMessage("Semantic Analysis Successful");
                        for (var warning in semanticWarnings) {
                            putMessage(semanticWarnings[warning]);
                        }
                        for (var message in semanticMessages) {
                            putMessage(semanticMessages[message]);
                        }

                        putMessage(" ");
                        putMessage("Displaying CST");
                        var cstString = _CST.toString(cst);
                        putMessage(cstString);
                        putMessage("Displaying AST");
                        var astString = _CST.toString(ast);
                        putMessage(astString);
                        putMessage("Displaying Symbol Table");
                        var symbolString = _Analyser.toString(symbolTable);
                        putMessage(symbolString);


                        //Start Code Generation
                        var instructionSet = _Generator.generate(); 

                        if(!codeGenError){
                            //Completed Instruction Set Output 
                            this.$('#myModal .modal-body').html('<pre>' + instructionSet + '</pre>');
                            this.$("#myModal").modal({ backdrop:"static"});
                        } else {
                            putMessage("Code Generation ERROR");
                            for (var error in codeGenErrors) {
                                putMessage(codeGenErrors[error]);
                            }   
                        }


                            

                    } else {
                        putMessage("Semantic Analysis ERROR");
                        for (var error in semanticErrors) {
                            putMessage(semanticErrors[error]);                             
                        }                        
                    }

                    
                    

                    
                } else {
                    putMessage("Parse  ERROR");
                    for (var error in parseErrors) {
                        putMessage(parseErrors[error]);
                    }
                }
            } else {
                putMessage("Lex ERROR, Parse CANCELLED");
                for (var error in lexErrors) {
                    putMessage(lexErrors[error]);
                }
            }
        } else {
            putMessage("There is no source code to compile");
        }
    }

    function putMessage(msg) {
        (<HTMLInputElement>document.getElementById("taOutput")).value += msg + "\n";
    }
    
    /*
	// PARSE STUFF
    //       
    function parse() {
        putMessage("Parsing [" + tokenList + "]");
        // Grab the next token.
        currentToken = getNextToken();
        // A valid parse derives the G(oal) production, so begin there.
        parseG();
        // Report the results.
        putMessage("Parsing found " + errorCount + " error(s).");
    }

    function parseG() {
        // A G(oal) production can only be an E(xpression), so parse the E production.
        parseE();
    }

    function parseE() {
        // All E productions begin with a digit, so make sure that we have one.
        checkToken("digit");
        // Look ahead 1 char (which is now in currentToken because checkToken 
        // consumes another one) and see which E production to follow.
        if (currentToken != EOF) {
            // We're not done, we expect to have an op.
            checkToken("op");
            parseE();
        } else {
            // There is nothing else in the token stream, 
            // and that's cool since E --> digit is valid.
            putMessage("EOF reached");
        }
    }

    function checkToken(expectedKind) {
        // Validate that we have the expected token kind and et the next token.
        switch (expectedKind) {
            case "digit": putMessage("Expecting a digit");
                if (currentToken == "0" || currentToken == "1" || currentToken == "2" ||
                    currentToken == "3" || currentToken == "4" || currentToken == "5" ||
                    currentToken == "6" || currentToken == "7" || currentToken == "8" ||
                    currentToken == "9") {
                    putMessage("Got a digit!");
                }
                else {
                    errorCount++;
                    putMessage("NOT a digit.  Error at position " + tokenIndex + ".");
                }
                break;
            case "op": putMessage("Expecting an operator");
                if (currentToken == "+" || currentToken == "-") {
                    putMessage("Got an operator!");
                }
                else {
                    errorCount++;
                    putMessage("NOT an operator.  Error at position " + tokenIndex + ".");
                }
                break;
            default: putMessage("Parse Error: Invalid Token Type at position " + tokenIndex + ".");
                break;
        }
        // Consume another token, having just checked this one, because that 
        // will allow the code to see what's coming next... a sort of "look-ahead".
        currentToken = getNextToken();
    }

    function getNextToken() {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length) {
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            putMessage("Current token:" + thisToken);
            tokenIndex++;
        }
        return thisToken;
    }

*/




