 /* semantic analysis */

module TSC {
    export class SemanticAnalyser {
        public static analyse() {



           

            //Pre-order traversal
            function buildSymbolTable(node: Node) {
                //Current node
                if (node.name=="Block"){
                    symbolTable.addNewScope("Scope_" + scopeCount);
                    scopeCount++;
                }

                if (node.name=="Variable Declaration"){
                    var newId = node.children[1].name;

                    if (symbolTable.current.symbols[newId]==null){
                        symbolTable.addNewSymbol(newId, node.children[0].name, null, node.children[1].token.line);
                    } else {
                        //Error
                        //Tried to declare an existing variable on line ...
                    }
                }

                if (node.name=="Assignment Statement"){

                    var assignId = node.children[0].name;
                    var assignSymbol = symbolTable.current.symbols[assignId];

                    if (assignSymbol == null) {
                        //Error
                        //Tried to assign to an undeclared variable
                    } else {
                        //Check type
                        switch(assignSymbol.type){
                            case 'int':
                                //case
                                break;
                            case 'string':
                                var stringAssign = "";
                                for (var i = 1, len = node.children.length; i < len; i++) {
                                    //if(   node.children[i].name is alpha )
                                    //  stringAssign = stringAssign + name;
                                }
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

                node.children.forEach
                //Recursive call on children
                for (var i = 0, len = node.children.length; i < len; i++) {
                    buildSymbolTable(node.children[i]);
                }
                
                //Clean up / move up scope? 
            }

         buildSymbolTable(ast.root);
            

        }

        

    }


    export class SymbolTable {
        root: ScopeNode;
        current: ScopeNode;

        addNewScope(name: string){
            var newScope = new ScopeNode(name);

            if (this.root == null) {
                this.root = newScope;
            } else {
                newScope.parent = this.current;
                this.current.children.push(newScope);
            }
            this.current = newScope;
        }

        addNewSymbol(name:string, type:string, value:any, line:number){
            this.current.symbols[name] = new Symbol(type, value, line);
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
        value: any;
        line: number;
        initalized: boolean;
        used: boolean;

        constructor(type:string, value:any, line:number){
            this.type = type;
            this.value = value;
            this.line = line;
        }
    }

}