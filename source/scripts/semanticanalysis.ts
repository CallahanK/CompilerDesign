 /* semantic analysis */

module TSC {
    export class SemanticAnalyser {
        public static analyse() {

           //Checks for id in all accessable scopes
           function existsInScope(varName: string, scope: ScopeNode) {
                if (scope.name=="root"){
                    return false;
                }
                if (scope.symbols[varName] != null) {
                    return true;
                }
                existsInScope(varName, scope.parent);
            }

           //Returns symbol by id from nearest scope
           function getSymbol(varName: string, scope: ScopeNode) {
               if (scope.name == "root") {
                   return null;
               }
               if (scope.symbols[varName] != null) {
                   return scope.symbols[varName];
               }
               existsInScope(varName, scope.parent);
           }

            //Pre-order traversal
            function buildSymbolTable(node: Node) {
                //Current node
                if (node.name == "root") {
                    buildSymbolTable(node.children[0]);
                }

                if (node.name=="Block"){
                    symbolTable.openScope("Scope_" + scopeCount);
                    scopeCount++;


                    //Recursive call on children
                    for (var i = 0, len = node.children.length; i < len; i++) {
                        buildSymbolTable(node.children[i]);
                    }
                
                    //Clean up / move up scope? 
                    //TODO - check for unused 
                    //before closing scope
                    console.log(symbolTable.current);
                    symbolTable.closeScope();
                }

                if (node.name=="Variable Declaration"){
                    var newId = node.children[1].name;

                    //Checks just the current scope
                    if (symbolTable.current.symbols[newId]==null){
                        symbolTable.addNewSymbol(newId, node.children[0].name, node.children[1].line);
                    } else {
                        //Error
                        //Tried to declare an existing variable on line ...
                    }
                }

                if (node.name=="Assignment Statement"){

                    var assignId = node.children[0].name;
                    var assignExpr = node.children[1].name;
                    

                    //Checks all accessable scopes
                    if ( !existsInScope(assignId,symbolTable.current) ) {
                        //Error
                        //Tried to assign to an undeclared variable
                    } else {
                        //Check type


                        //Checks if assigning an id to an id
                        if (node.children[1].type=="id"){
                            //Check if id being assign has been declared
                            if ( !existsInScope(assignExpr,symbolTable.current) ){
                                //Error 
                                //Tried to assign from an undeclared variable
                            } 
                            else {

                                if (!getSymbol(assignExpr, symbolTable.current).initialized) {
                                    //Warning 
                                    //Tried to assign from an uninitialized variable
                                }

                                //Check if types match 
                                if (getSymbol(assignId, symbolTable.current).type == getSymbol(assignExpr, symbolTable.current).type){
                                    //Successful Check - No Error
                                    //The assignment is good
                                    //assignId is initialized 
                                    //assignExpr is used

                                } else {
                                    //Error
                                    //type mismatch error 
                                }
                            }


                        } else {
                            var assignSymbol = getSymbol(assignId, symbolTable.current);
                            switch (assignSymbol.type) {
                                case 'int':
                                    //case
                                    break;
                                case 'string':
                                    var stringAssign = "";



                                    break;
                                case 'boolean':
                                    //case
                                    break;
                                default:
                                //Error should not happen 
                                //Type error in var declaration
                            }
                        }
                    }
                }

                
                
            }

         buildSymbolTable(ast.current);
            

        }

        

    }


    export class SymbolTable {
        root: ScopeNode;
        current: ScopeNode;

        openScope(name: string){
            var newScope = new ScopeNode(name);

            if (this.root == null) {
                this.root = new ScopeNode("root");
                newScope.parent = this.root;
                this.root.children.push(newScope);
            } else {
                newScope.parent = this.current;
                this.current.children.push(newScope);
            }
            this.current = newScope;
        }

        closeScope(){
            //Checks for uninitialized vars and reports 
            //Checks for unused vars and reports  


            this.current = this.current.parent;
        }

        addNewSymbol(name:string, type:string, line:number){
            this.current.symbols[name] = new Symbol(type, line);
        }

    }

    class ScopeNode {
        name: string;
        parent: ScopeNode;
        children: ScopeNode[];
        symbols: { [name: string]: Symbol } = {};

        constructor(name: string){
            this.name = name;
            this.children = [];
        }
    }

    class Symbol {
        type: string;
        line: number;
        initialized: boolean;
        used: boolean;

        constructor(type:string, line:number){
            this.type = type;
            this.line = line;
        }
    }

}