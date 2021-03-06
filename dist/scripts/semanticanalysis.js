/* semantic analysis */
var TSC;
(function (TSC) {
    var SemanticAnalyser = (function () {
        function SemanticAnalyser() {
        }
        SemanticAnalyser.analyse = function () {
            //Checks for id in all accessable scopes
            function existsInScope(varName, scope) {
                //console.log("checking in scope");
                if (scope.name == "root") {
                    return false;
                }
                if (scope.symbols[varName] != null) {
                    console.log(scope.symbols[varName]);
                    return true;
                }
                return existsInScope(varName, scope.parent);
            }
            //Returns symbol by id from nearest scope
            function getSymbol(varName, scope) {
                if (scope.name == "root") {
                    return new Symbol("null", -1);
                }
                if (scope.symbols[varName] != null) {
                    return scope.symbols[varName];
                }
                return getSymbol(varName, scope.parent);
            }
            function isIntExpr(node) {
                if (node.children.length < 2 && node.name == "+" && node.children[0].type == "digit") {
                    return true;
                }
                if (node.name == "+" && node.children[0].type == "digit") {
                    return isIntExpr(node.children[1]);
                }
                else {
                    return false;
                }
            }
            function isBoolExpr(node) {
                if (node.name == "Compare") {
                    //expr boolOp expr
                    if (node.children[0].type == "id") {
                        if (!existsInScope(node.children[0].name, symbolTable.current)) {
                            //Error
                            semanticErrors.push("Error: Variable: " + node.children[0].name + " undeclared in scope on line: " + node.children[0].line);
                            semanticError = true;
                            return false;
                        }
                        if (node.children[1].type == "id") {
                            if (!existsInScope(node.children[2].name, symbolTable.current)) {
                                //Error
                                semanticErrors.push("Error: Variable: " + node.children[2].name + " undeclared in scope on line: " + node.children[1].line);
                                semanticError = true;
                                return false;
                            }
                            if (getSymbol(node.children[0].name, symbolTable.current).type == getSymbol(node.children[2].name, symbolTable.current).type) {
                                //Successful Check - No Error
                                //node.children[0] is used 
                                getSymbol(node.children[0].name, symbolTable.current).used = true;
                                //node.children[1] is used
                                getSymbol(node.children[2].name, symbolTable.current).used = true;
                                return true;
                            }
                            else {
                                //Not comparable
                                return false;
                            }
                        }
                        else {
                            var compSymbol = getSymbol(node.children[0].name, symbolTable.current);
                            switch (compSymbol.type) {
                                case 'int':
                                    if (isIntExpr(node.children[2])) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                case 'string':
                                    if (node.children[2].type == "string") {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                case 'boolean':
                                    if (isBoolExpr(node.children[2])) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                default:
                            }
                        }
                    }
                    if (node.children[1].type == "id") {
                        if (!existsInScope(node.children[1].name, symbolTable.current)) {
                            //Error
                            semanticErrors.push("Error: Variable: " + node.children[2].name + " undeclared in scope");
                            semanticError = true;
                            return false;
                        }
                        else {
                            var compSymbol = getSymbol(node.children[2].name, symbolTable.current);
                            switch (compSymbol.type) {
                                case 'int':
                                    if (isIntExpr(node.children[0])) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                case 'string':
                                    if (node.children[0].type == "string") {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                case 'boolean':
                                    if (isBoolExpr(node.children[0])) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                default:
                            }
                        }
                    }
                    if (isIntExpr(node.children[0])) {
                        if (isIntExpr(node.children[2])) {
                            return true;
                        }
                        return false;
                    }
                    if (node.children[0].type == "string") {
                        if (node.children[2].type == "string") {
                            return true;
                        }
                        return false;
                    }
                    if (isBoolExpr(node.children[0])) {
                        if (isBoolExpr(node.children[2])) {
                            return true;
                        }
                        return false;
                    }
                }
                else if (node.type == "boolean") {
                    //boolval
                    return true;
                }
                else {
                    //Error 
                    semanticErrors.push("Error: bad boolean expression on line " + node.line);
                    semanticError = true;
                    return false;
                }
            }
            //Pre-order traversal 
            function buildSymbolTable(node) {
                //Current node
                if (node.name == "root") {
                    buildSymbolTable(node.children[0]);
                }
                if (node.name == "Block") {
                    symbolTable.openScope("Scope_" + scopeCount);
                    scopeCount++;
                    for (var i = 0, len = node.children.length; i < len; i++) {
                        buildSymbolTable(node.children[i]);
                    }
                    //Clean up / move up scope
                    symbolTable.closeScope();
                } //End Block
                if (node.name == "Variable Declaration") {
                    var newId = node.children[1].name;
                    //Checks just the current scope
                    if (symbolTable.current.symbols[newId] == null) {
                        symbolTable.addNewSymbol(newId, node.children[0].name, node.children[1].line);
                    }
                    else {
                        //Error
                        semanticErrors.push("Error: Redeclared Variable: " + node.children[1].name + " on line: " + node.children[1].line);
                        semanticError = true;
                    }
                } //End Var Decl
                if (node.name == "Assignment Statement") {
                    //console.log("Assignemnt statement");
                    var assignId = node.children[0].name;
                    var assignExpr = node.children[1].name;
                    //Checks all accessable scopes
                    if (!existsInScope(assignId, symbolTable.current)) {
                        //Error
                        semanticErrors.push("Error: Variable: " + assignId + " undeclared in scope on line: " + node.children[0].line);
                        semanticError = true;
                    }
                    else {
                        //Check type
                        //Checks if assigning an id to an id
                        if (node.children[1].type == "id") {
                            //Check if id being assign has been declared
                            if (!existsInScope(assignExpr, symbolTable.current)) {
                                //Error 
                                semanticErrors.push("Error: Variable: " + assignExpr + " undeclared in scope on line: " + node.children[1].line);
                                semanticError = true;
                            }
                            else {
                                if (!getSymbol(assignExpr, symbolTable.current).initialized) {
                                    //Warning 
                                    semanticWarnings.push("Warning: Assigned from uninitialized variable: " + assignExpr + " on line: " + node.children[1].line);
                                }
                                //Check if types match 
                                if (getSymbol(assignId, symbolTable.current).type == getSymbol(assignExpr, symbolTable.current).type) {
                                    //Successful Check - No Error
                                    //The assignment is good
                                    //assignId is initialized 
                                    getSymbol(node.children[0].name, symbolTable.current).initialized = true;
                                    //assignExpr is used
                                    getSymbol(node.children[1].name, symbolTable.current).used = true;
                                }
                                else {
                                    //Error
                                    semanticErrors.push("Error: Type Mismatch on variables: " + assignId + " and " + assignExpr + " on line: " + node.children[0].line);
                                    semanticError = true;
                                }
                            }
                        }
                        else {
                            var assignSymbol = getSymbol(assignId, symbolTable.current);
                            switch (assignSymbol.type) {
                                case 'int':
                                    if (isIntExpr(node.children[1])) {
                                        //Sucessful Check no Error
                                        assignSymbol.initialized = true;
                                    }
                                    else {
                                        //Error
                                        semanticErrors.push("Error: Type Mismatch on variables: " + assignSymbol + " and digit on line: " + node.children[0].line);
                                        semanticError = true;
                                    }
                                    break;
                                case 'string':
                                    if (node.children[1].type == "string") {
                                        //Sucessful Check no Error 
                                        assignSymbol.initialized = true;
                                    }
                                    else {
                                        //Error
                                        semanticErrors.push("Error: Type Mismatch on variables: " + assignSymbol + " and string on line: " + node.children[0].line);
                                        semanticError = true;
                                    }
                                    break;
                                case 'boolean':
                                    if (isBoolExpr(node.children[1])) {
                                        //Sucessful Check no Error
                                        assignSymbol.initialized = true;
                                    }
                                    else {
                                        //Error
                                        semanticErrors.push("Error: Type Mismatch on variables: " + assignSymbol + " and boolean on line: " + node.children[0].line);
                                        semanticError = true;
                                    }
                                    break;
                                default:
                            }
                        }
                    }
                } //End Assign
                if (node.name == "Print Statement") {
                    if (node.children[0].type == "id") {
                        if (!existsInScope(node.children[0].name, symbolTable.current)) {
                            //Error 
                            semanticErrors.push("Error: Variable: " + node.children[0].name + " undeclared in scope on line: " + node.children[0].line);
                            semanticError = true;
                        }
                        else {
                            if (!getSymbol(node.children[0].name, symbolTable.current).initialized) {
                                //Warning 
                                semanticWarnings.push("Warning: Printing uninitialized variable: " + node.children[0].name + " on line: " + node.children[1].line);
                            }
                            //Print successful check
                            //id is used
                            getSymbol(node.children[0].name, symbolTable.current).used = true;
                        }
                    }
                    else if (node.children[0].name == "+") {
                        if (isIntExpr(node.children[0])) {
                        }
                        else {
                            //Error
                            semanticErrors.push("Error: Invalid Integer Expression: " + node.children[0].name + " on line: " + node.children[0].line);
                            semanticError = true;
                        }
                    }
                    else if (node.children[0].type == "string") {
                    }
                    else {
                        if (isBoolExpr(node.children[0])) {
                        }
                        else {
                            //Error 
                            semanticErrors.push("Error: Invalid Boolean Expression: " + node.children[0].name + " on line: " + node.children[0].line);
                            semanticError = true;
                        }
                    }
                } //End Print
                if (node.name == "If Statement") {
                    if (isBoolExpr(node.children[0])) {
                        //Good Bool
                        //Check the block
                        buildSymbolTable(node.children[1]);
                    }
                    else {
                        //Error
                        semanticErrors.push("Error: Invalid Boolean Expression: " + node.children[0].name + " on line: " + node.children[0].line);
                        semanticError = true;
                    }
                } //End If
                if (node.name == "While Statement") {
                    if (isBoolExpr(node.children[0])) {
                        //Good Bool
                        //Check the block
                        buildSymbolTable(node.children[1]);
                    }
                    else {
                        //Error
                        semanticErrors.push("Error: Invalid Boolean Expression: " + node.children[0].name + " on line: " + node.children[0].line);
                        semanticError = true;
                    }
                } //End While
            }
            buildSymbolTable(ast.root);
        };
        //Return a string representation of the tree. 
        SemanticAnalyser.toString = function (table) {
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
                    traversalResult += "<" + node.name + ">";
                    traversalResult += "\n";
                    for (var key in node.symbols) {
                        for (var i = 0; i < depth; i++) {
                            traversalResult += "-";
                        }
                        var value = node.symbols[key];
                        traversalResult += "-[" + key + " | " + value.type + "]";
                        traversalResult += "\n";
                    }
                }
                else {
                    // There are children, so note these interior/branch nodes and ...
                    traversalResult += "<" + node.name + "> \n";
                    for (var key in node.symbols) {
                        for (var i = 0; i < depth; i++) {
                            traversalResult += "-";
                        }
                        var value = node.symbols[key];
                        traversalResult += "-[" + key + " | " + value.type + "]";
                        traversalResult += "\n";
                    }
                    for (var i = 0; i < node.children.length; i++) {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
            // Make the initial call to expand from the root.
            expand(table.root, 0);
            // Return the result.
            return traversalResult;
        };
        return SemanticAnalyser;
    })();
    TSC.SemanticAnalyser = SemanticAnalyser;
    var SymbolTable = (function () {
        function SymbolTable() {
        }
        SymbolTable.prototype.openScope = function (name) {
            var newScope = new ScopeNode(name);
            if (this.root == null) {
                this.root = new ScopeNode("root");
                newScope.parent = this.root;
                this.root.children.push(newScope);
            }
            else {
                newScope.parent = this.current;
                this.current.children.push(newScope);
            }
            this.current = newScope;
        };
        SymbolTable.prototype.closeScope = function () {
            //Checks for uninitialized vars and reports 
            //Checks for unused vars and reports  
            for (var key in this.current.symbols) {
                var value = this.current.symbols[key];
                if (!value.used) {
                    //Warning 
                    semanticWarnings.push("Warning: Unused variable : " + key + " on line: " + value.line);
                }
            }
            this.current = this.current.parent;
        };
        SymbolTable.prototype.addNewSymbol = function (name, type, line) {
            this.current.symbols[name] = new Symbol(type, line);
        };
        return SymbolTable;
    })();
    TSC.SymbolTable = SymbolTable;
    var ScopeNode = (function () {
        function ScopeNode(name) {
            this.symbols = {};
            this.name = name;
            this.children = [];
        }
        return ScopeNode;
    })();
    TSC.ScopeNode = ScopeNode;
    var Symbol = (function () {
        function Symbol(type, line) {
            this.initialized = false;
            this.used = false;
            this.type = type;
            this.line = line;
        }
        return Symbol;
    })();
})(TSC || (TSC = {}));
