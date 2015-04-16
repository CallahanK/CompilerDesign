/* semantic analysis */
var TSC;
(function (TSC) {
    var SemanticAnalyser = (function () {
        function SemanticAnalyser() {
        }
        SemanticAnalyser.analyse = function () {
            //Pre-order traversal
            function buildSymbolTable(node) {
                //Current node
                if (node.name == "Block") {
                    symbolTable.addNewScope("Scope_" + scopeCount);
                    scopeCount++;
                }
                if (node.name == "Variable Declaration") {
                    var newId = node.children[1].name;
                    if (symbolTable.current.symbols[newId] == null) {
                        symbolTable.addNewSymbol(newId, node.children[0].name, null, node.children[1].token.line);
                    }
                    else {
                    }
                }
                node.children.forEach;
                for (var i = 0, len = node.children.length; i < len; i++) {
                    buildSymbolTable(node.children[i]);
                }
                //Clean up / move up scope? 
            }
            buildSymbolTable(ast.root);
        };
        return SemanticAnalyser;
    })();
    TSC.SemanticAnalyser = SemanticAnalyser;
    var SymbolTable = (function () {
        function SymbolTable() {
        }
        SymbolTable.prototype.addNewScope = function (name) {
            var newScope = new ScopeNode(name);
            if (this.root == null) {
                this.root = newScope;
            }
            else {
                newScope.parent = this.current;
                this.current.children.push(newScope);
            }
            this.current = newScope;
        };
        SymbolTable.prototype.addNewSymbol = function (name, type, value, line) {
            this.current.symbols[name] = new Symbol(type, value, line);
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
        function Symbol(type, value, line) {
            this.type = type;
            this.value = value;
            this.line = line;
        }
        return Symbol;
    })();
})(TSC || (TSC = {}));
