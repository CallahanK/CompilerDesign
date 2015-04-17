/* semantic analysis */
var TSC;
(function (TSC) {
    var SemanticAnalyser = (function () {
        function SemanticAnalyser() {
        }
        SemanticAnalyser.analyse = function () {
            //Checks for id in all accessable scopes
            function existsInScope(varName, scope) {
                if (scope.name == "root") {
                    return false;
                }
                if (scope.symbols[varName] != null) {
                    return true;
                }
                existsInScope(varName, scope.parent);
            }
            //Returns symbol by id from nearest scope
            function getSymbol(varName, scope) {
                if (scope.name == "root") {
                    return null;
                }
                if (scope.symbols[varName] != null) {
                    return scope.symbols[varName];
                }
                existsInScope(varName, scope.parent);
            }
            function isIntExpr(node) {
                if (node.children.length < 2 && node.name == "+" && node.children[0].type == "digit") {
                    return true;
                }
                if (node.name == "+" && node.children[0].type == "digit") {
                    isIntExpr(node.children[1]);
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
                            //Variable does not exist in scope
                            return false;
                        }
                        if (node.children[1].type == "id") {
                            if (!existsInScope(node.children[1].name, symbolTable.current)) {
                                //Error
                                //Variable does not exist in scope
                                return false;
                            }
                            if (getSymbol(node.children[0].name, symbolTable.current).type == getSymbol(node.children[1].name, symbolTable.current).type) {
                                //Successful Check - No Error
                                //node.children[0] is used 
                                //node.children[1] is used
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
                                    if (isIntExpr(node.children[1])) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                case 'string':
                                    if (node.children[1].type == "string") {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                    break;
                                case 'boolean':
                                    if (isBoolExpr(node.children[1])) {
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
                            //Variable does not exist in scope
                            return false;
                        }
                        else {
                            var compSymbol = getSymbol(node.children[1].name, symbolTable.current);
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
                        if (isIntExpr(node.children[1])) {
                            return true;
                        }
                        return false;
                    }
                    if (node.children[0].type == "string") {
                        if (node.children[1].type == "string") {
                            return true;
                        }
                        return false;
                    }
                    if (isBoolExpr(node.children[0])) {
                        if (isBoolExpr(node.children[1])) {
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
                    //Not a boolean
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
                    //Clean up / move up scope? 
                    //TODO - check for unused 
                    //before closing scope
                    console.log(symbolTable.current);
                    symbolTable.closeScope();
                } //End Block
                if (node.name == "Variable Declaration") {
                    var newId = node.children[1].name;
                    //Checks just the current scope
                    if (symbolTable.current.symbols[newId] == null) {
                        symbolTable.addNewSymbol(newId, node.children[0].name, node.children[1].line);
                    }
                    else {
                    }
                } //End Var Decl
                if (node.name == "Assignment Statement") {
                    var assignId = node.children[0].name;
                    var assignExpr = node.children[1].name;
                    //Checks all accessable scopes
                    if (!existsInScope(assignId, symbolTable.current)) {
                    }
                    else {
                        //Check type
                        //Checks if assigning an id to an id
                        if (node.children[1].type == "id") {
                            //Check if id being assign has been declared
                            if (!existsInScope(assignExpr, symbolTable.current)) {
                            }
                            else {
                                if (!getSymbol(assignExpr, symbolTable.current).initialized) {
                                }
                                //Check if types match 
                                if (getSymbol(assignId, symbolTable.current).type == getSymbol(assignExpr, symbolTable.current).type) {
                                }
                                else {
                                }
                            }
                        }
                        else {
                            var assignSymbol = getSymbol(assignId, symbolTable.current);
                            switch (assignSymbol.type) {
                                case 'int':
                                    if (isIntExpr(node.children[1])) {
                                    }
                                    else {
                                    }
                                    break;
                                case 'string':
                                    if (node.children[1].type == "string") {
                                    }
                                    else {
                                    }
                                    break;
                                case 'boolean':
                                    if (isBoolExpr(node.children[1])) {
                                    }
                                    else {
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
                        }
                        else {
                            if (!getSymbol(node.children[0].name, symbolTable.current).initialized) {
                            }
                        }
                    }
                    else if (node.children[0].name == "+") {
                        if (isIntExpr(node.children[0])) {
                        }
                        else {
                        }
                    }
                    else if (node.children[0].type == "string") {
                    }
                    else {
                        if (isBoolExpr(node.children[0])) {
                        }
                        else {
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
                    }
                } //End If
                if (node.name == "While Statement") {
                    if (isBoolExpr(node.children[0])) {
                        //Good Bool
                        //Check the block
                        buildSymbolTable(node.children[1]);
                    }
                    else {
                    }
                } //End While
                buildSymbolTable(ast.current);
            }
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
    var Symbol = (function () {
        function Symbol(type, line) {
            this.type = type;
            this.line = line;
        }
        return Symbol;
    })();
})(TSC || (TSC = {}));
