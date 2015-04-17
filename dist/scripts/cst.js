/* cst.ts */
var TSC;
(function (TSC) {
    var ConcreteSyntaxTree = (function () {
        function ConcreteSyntaxTree() {
        }
        ConcreteSyntaxTree.buildCST = function () {
            parseProgram();
            //Builds the CST and the AST 
            function parseProgram() {
                cst.addBranchNode("Program");
                parseBlock();
                matchTerminal();
                cst.returnToParent();
            }
            function parseBlock() {
                cst.addBranchNode("Block");
                ast.addBranchNode("Block");
                matchTerminal();
                parseStatementList();
                matchTerminal();
                cst.returnToParent();
                ast.returnToParent();
            }
            function parseStatementList() {
                cst.addBranchNode("Statement List");
                var tmpNextToken = nextToken().kind.name;
                if (tmpNextToken == 'T_PRINT' || tmpNextToken == 'T_WHILE' || tmpNextToken == 'T_IF' || tmpNextToken == 'T_LBRACE' || tmpNextToken == 'T_INT' || tmpNextToken == 'T_STRING' || tmpNextToken == 'T_BOOLEAN' || tmpNextToken == 'T_CHAR') {
                    parseStatement();
                    parseStatementList();
                }
                else {
                }
                cst.returnToParent();
            }
            function parseStatement() {
                cst.addBranchNode("Statement");
                var switcher = nextToken().value;
                switch (switcher) {
                    case 'print':
                        parsePrintStatement();
                        break;
                    case 'int':
                    case 'string':
                    case 'boolean':
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
                        parseAssignmentStatement();
                }
                cst.returnToParent();
            }
            function parsePrintStatement() {
                cst.addBranchNode("Print Statement");
                ast.addBranchNode("Print Statement");
                matchTerminal();
                matchTerminal();
                parseExpr();
                matchTerminal();
                cst.returnToParent();
                ast.returnToParent();
            }
            function parseAssignmentStatement() {
                cst.addBranchNode("Assignment Statement");
                ast.addBranchNode("Assignment Statement");
                parseId();
                matchTerminal();
                parseExpr();
                cst.returnToParent();
                ast.returnToParent();
            }
            function parseVarDecl() {
                cst.addBranchNode("Variable Declaration");
                ast.addBranchNode("Variable Declaration");
                parseType();
                parseId();
                cst.returnToParent();
                ast.returnToParent();
            }
            function parseWhileStatement() {
                cst.addBranchNode("While Statement");
                ast.addBranchNode("While Statement");
                matchTerminal();
                parseBooleanExpr();
                parseBlock();
                cst.returnToParent();
                ast.returnToParent();
            }
            function parseIfStatement() {
                cst.addBranchNode("If Statement");
                ast.addBranchNode("If Statement");
                matchTerminal();
                parseBooleanExpr();
                parseBlock();
                cst.returnToParent();
                ast.returnToParent();
            }
            function parseExpr() {
                cst.addBranchNode("Expression");
                if (nextToken().kind.name == 'T_DIGIT') {
                    parseIntExpr();
                }
                else if (nextToken().value == '"') {
                    parseStringExpr();
                }
                else if (nextToken().value == '(' || nextToken().value == 'true' || nextToken().value == 'false') {
                    parseBooleanExpr();
                }
                else {
                    parseId();
                }
                cst.returnToParent();
            }
            function parseIntExpr() {
                cst.addBranchNode("Integer Expression");
                ast.addBranchNode("+");
                parseDigit();
                if (nextToken().value == "+") {
                    parseIntOp();
                    parseExpr();
                }
                else {
                }
                cst.returnToParent();
                ast.returnToParent();
            }
            function parseStringExpr() {
                cst.addBranchNode("String Expression");
                buildString();
                matchTerminal();
                parseCharList();
                buildString();
                matchTerminal();
                cst.returnToParent();
            }
            function parseBooleanExpr() {
                cst.addBranchNode("Bool Expression");
                if (nextToken().value == '(') {
                    matchTerminal();
                    parseExpr();
                    parseBoolOp();
                    parseExpr();
                    matchTerminal();
                }
                else {
                    parseBoolVal();
                }
                cst.returnToParent();
            }
            function parseId() {
                cst.addBranchNode("Id");
                addASTLeaf("id");
                parseChar();
                cst.returnToParent();
            }
            function parseCharList() {
                cst.addBranchNode("Char List");
                if (nextToken().kind.name == 'T_CHAR') {
                    buildString();
                    parseChar();
                    parseCharList();
                }
                else if (nextToken().kind.name == 'T_SPACE') {
                    buildString();
                    parseSpace();
                    parseCharList();
                }
                else {
                }
                cst.returnToParent();
            }
            function parseType() {
                cst.addBranchNode("Type");
                if (nextToken().value == 'int') {
                    addASTLeaf("type");
                    matchTerminal();
                }
                else if (nextToken().value == 'string') {
                    addASTLeaf("type");
                    matchTerminal();
                }
                else {
                    addASTLeaf("type");
                    matchTerminal();
                }
                cst.returnToParent();
            }
            function parseChar() {
                cst.addBranchNode("Char");
                //buildString();
                matchTerminal();
                cst.returnToParent();
            }
            function parseSpace() {
                cst.addBranchNode("Space");
                //buildString();
                matchTerminal();
                cst.returnToParent();
            }
            function parseDigit() {
                cst.addBranchNode("Digit");
                addASTLeaf("digit");
                matchTerminal();
                cst.returnToParent();
            }
            function parseBoolOp() {
                cst.addBranchNode("Bool Operation");
                if (nextToken().value == '==') {
                    addASTLeaf("equals");
                    matchTerminal();
                }
                else {
                    addASTLeaf("not equals");
                    matchTerminal();
                }
                cst.returnToParent();
            }
            function parseBoolVal() {
                cst.addBranchNode("Bool Value");
                if (nextToken().value == 'false') {
                    addASTLeaf("boolean");
                    matchTerminal();
                }
                else {
                    addASTLeaf("boolean");
                    matchTerminal();
                }
                cst.returnToParent();
            }
            function parseIntOp() {
                cst.addBranchNode("Integer Operation");
                //addASTLeaf(); 
                matchTerminal();
                cst.returnToParent();
            }
            //Recurrsive Descent Parser End
            //Matches a terminal for CST
            function matchTerminal() {
                var x = nextToken();
                cst.addLeafNode(x.value, x, "");
                nextTokenIndexSem++;
            }
            function addASTLeaf(type) {
                var x = nextToken();
                ast.addLeafNode(x.value, x, type);
            }
            function buildString() {
                var x = nextToken();
                if (!stringMode && x.value == "\"") {
                    stringMode = !stringMode;
                }
                else if (stringMode && x.value == "\"") {
                    ast.addLeafNode(stringBuild, x, "string");
                    stringMode = !stringMode;
                    stringBuild = "";
                }
                else {
                    stringBuild = stringBuild + x.value;
                }
            }
            //Returns the token currently being added to CST
            function nextToken() {
                if (nextTokenIndexSem == tokenList.length - 1 && !eofReached) {
                }
                if (nextTokenIndexSem < tokenList.length) {
                    var currentToken = tokenList[nextTokenIndexSem];
                }
                return currentToken;
            }
        };
        // Return a string representation of the tree.
        ConcreteSyntaxTree.toString = function (tree) {
            console.log("about to to string");
            // Initialize the result string.
            var traversalResult = "";
            // Recursive function to handle the expansion of the nodes.
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    traversalResult += "-";
                }
                // If there are no children (i.e., leaf nodes)...
                if (!node.children || node.children.length === 0) {
                    // ... note the leaf node.
                    traversalResult += "[" + node.name + "]";
                    traversalResult += "\n";
                }
                else {
                    // There are children, so note these interior/branch nodes and ...
                    traversalResult += "<" + node.name + "> \n";
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            // Make the initial call to expand from the root.
            console.log("about to start recursion");
            expand(tree.root, 0);
            // Return the result.
            return traversalResult;
        };
        return ConcreteSyntaxTree;
    })();
    TSC.ConcreteSyntaxTree = ConcreteSyntaxTree;
})(TSC || (TSC = {}));
