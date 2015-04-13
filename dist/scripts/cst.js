/* cst.ts */
var TSC;
(function (TSC) {
    var ConcreteSyntaxTree = (function () {
        function ConcreteSyntaxTree() {
        }
        ConcreteSyntaxTree.buildCST = function () {
            parseProgram();
            //Recurrsive Descent Parser 
            function parseProgram() {
                cst.addBranchNode("Program");
                parseBlock();
                matchTerminal();
                cst.returnToParent();
            }
            function parseBlock() {
                cst.addBranchNode("Block");
                matchTerminal();
                parseStatementList();
                matchTerminal();
                cst.returnToParent();
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
                matchTerminal();
                matchTerminal();
                parseExpr();
                matchTerminal();
                cst.returnToParent();
            }
            function parseAssignmentStatement() {
                cst.addBranchNode("Assignment Statement");
                parseId();
                matchTerminal();
                parseExpr();
                cst.returnToParent();
            }
            function parseVarDecl() {
                cst.addBranchNode("Variable Declaration");
                parseType();
                parseId();
                cst.returnToParent();
            }
            function parseWhileStatement() {
                cst.addBranchNode("While Statement");
                matchTerminal();
                parseBooleanExpr();
                parseBlock();
                cst.returnToParent();
            }
            function parseIfStatement() {
                cst.addBranchNode("If Statement");
                matchTerminal();
                parseBooleanExpr();
                parseBlock();
                cst.returnToParent();
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
                parseDigit();
                if (nextToken().value == "+") {
                    parseIntOp();
                    parseExpr();
                }
                else {
                }
                cst.returnToParent();
            }
            function parseStringExpr() {
                cst.addBranchNode("String Expression");
                matchTerminal();
                parseCharList();
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
                parseChar();
                cst.returnToParent();
            }
            function parseCharList() {
                cst.addBranchNode("Char List");
                if (nextToken().kind.name == 'T_CHAR') {
                    parseChar();
                    parseCharList();
                }
                else if (nextToken().kind.name == 'T_SPACE') {
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
                    matchTerminal();
                }
                else if (nextToken().value == 'string') {
                    matchTerminal();
                }
                else {
                    matchTerminal();
                }
                cst.returnToParent();
            }
            function parseChar() {
                cst.addBranchNode("Char");
                matchTerminal();
                cst.returnToParent();
            }
            function parseSpace() {
                cst.addBranchNode("Space");
                matchTerminal();
                cst.returnToParent();
            }
            function parseDigit() {
                cst.addBranchNode("Digit");
                matchTerminal();
                cst.returnToParent();
            }
            function parseBoolOp() {
                cst.addBranchNode("Bool Operation");
                if (nextToken().value == '==') {
                    matchTerminal();
                }
                else {
                    matchTerminal();
                }
                cst.returnToParent();
            }
            function parseBoolVal() {
                cst.addBranchNode("Bool Value");
                if (nextToken().value == 'false') {
                    matchTerminal();
                }
                else {
                    matchTerminal();
                }
                cst.returnToParent();
            }
            function parseIntOp() {
                cst.addBranchNode("Integer Operation");
                matchTerminal();
                cst.returnToParent();
            }
            //Recurrsive Descent Parser End
            //Matches a terminal by the char in the src code
            function matchTerminal() {
                var x = nextToken();
                cst.addLeafNode(x.value, x);
                nextTokenIndexSem++;
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
