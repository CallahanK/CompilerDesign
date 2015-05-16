 /* codegen.ts */


module TSC {
    export class CodeGeneration {
        public static generate() {

            initInstructionSet();
            currentScope = symbolTable.root;

            traverse(ast.root);

            backPatch();


            var builtInstructions: string = "";
            for (var i = 0; i < 256; i++) {

                if (i % 16 == 0) {
                    builtInstructions = builtInstructions + "\n";
                }
                builtInstructions = builtInstructions + assembledInstructions[i];
            }

            return builtInstructions;

            //End of Generate

            function traverse(node: Node) {

                if(node.name == "Block"){
                    openScope();
                }

                for (var i = 0; i < node.children.length; i++){
                    traverse(node.children[i]);


                }

                generateInstruction(node);
                //console.log(node.name);

            }

            

            function generateInstruction(node:Node ) {



                if (node.name == "Block") {
                    
                    closeScope();

                } //End Block


                if (node.name == "Variable Declaration") {
                    variableDeclaration(node);

                } //End Var Decl


                if (node.name == "Assignment Statement") {
                    assignmentStatement(node );
                }//End Assign


                if (node.name == "Print Statement") {
                    printStatement(node );
                }//End Print


                if (node.name == "If Statement") {
                    ifStatement(node);
                }//End If


                if (node.name == "While Statement") {
                    whileStatement(node );
                }//End While




            }

            function variableDeclaration(node: Node ) {


                var tmpVar = node.children[1];
                var tmpType = node.children[0];
                var tmpAddress = "T" + staticDataIndex;

                if (tmpType.name == "int") {

                    

                    staticDataTable[tmpAddress] = new staticData(tmpVar.name, currentScope.name, staticDataIndex, "int");


                    //Possibly optional as each byte initized to 00
                    addInstruction("A9");
                    addInstruction("00");
                    addInstruction("8D");
                    addInstruction(tmpAddress);
                    addInstruction("XX");


                    
                }

                if (tmpType.name == "string") {

                    staticDataTable[tmpAddress] = new staticData(tmpVar.name, currentScope.name, staticDataIndex,"string");


                }


                staticDataIndex++;

            }

            function assignmentStatement(node: Node ) {
                var tmpVar = node.children[0];
                var tmpVal = node.children[1];
                var tmpAddress = "";

                for (var key in staticDataTable) {
                    var value = staticDataTable[key];
                    console.log("key " + key);
                    if (value.variable == tmpVar.name && value.scope == currentScope.name) {
                        tmpAddress = key + " ";
                    }

                }

                //Int Assign
                if (tmpVal.name == "+") {

                    


                    console.log("Assigning to int");

                    addInstruction("A9");
                    addInstruction(intToHex(collapseIntExpr(tmpVal)));
                    addInstruction("8D");
                    addInstruction(tmpAddress);
                    addInstruction("XX");
                }

                //String Assign
                if(tmpVal.type == "string"){

                    //tmpAddress = addString(tmpVal.name);

                    var tmpHeapAddress = addString(tmpVal.name);

                    addInstruction("A9");
                    addInstruction(intToHex(tmpHeapAddress));
                    addInstruction("8D");
                    addInstruction(tmpAddress);
                    addInstruction("XX");
                }
            }


            function printStatement(node: Node ) {

                var tmpPrint = node.children[0]


                //Print an id
                if (tmpPrint.type == "id") {
                    var tmpValue;
                    var tmpAddress;

                    for (var key in staticDataTable) {
                        var value = staticDataTable[key];
                        console.log("key " + key);
                        if (value.variable == tmpPrint.name && value.scope == currentScope.name) {
                            tmpValue = value;
                            tmpAddress = key;
                        }

                    }

                    if (tmpValue.varType == "string") {
                        //LDX w/ 2 for sysCall
                        addInstruction("A2");
                        addInstruction("02");

                        addInstruction("AC");

                        addInstruction(tmpAddress);
                        addInstruction("XX");

                        addInstruction("FF");
                    }

                    if(tmpValue.varType == "int"){

                    }


                }
                //Print int expr
                if(tmpPrint.name=="+"){

                }



            }


            function whileStatement(node: Node ) {

            }

            function ifStatement(node: Node ) {

            }

            function backPatch() {
                //Adds a final break instruction
                addInstruction("00");
                

                //Replaces temp addresses
                for (var i = 0; i < 256; i++) {

                    if (assembledInstructions[i].match(/^T./)) {
                        console.log("matched T : " + assembledInstructions[i]);
                        var offset = staticDataTable[assembledInstructions[i].trim()].offset;
                        
                        assembledInstructions[i] = intToHex(currentStatic+offset, 2) + " ";
                        assembledInstructions[i+1] = "00 ";
                    }

                }


            }


            function intToHex(d:number, padding:number = 2) {
                var hex: string = d.toString(16);

                while (hex.length < padding) {
                    hex = "0" + hex;
                }
                return hex.toUpperCase();
            }

            function collapseIntExpr(node: Node){

                var intBuild = 0;
                var currNode = node;

                while(currNode.children.length > 2){
                    intBuild += parseInt(node.children[0].name);
                    currNode = currNode.children[1];
                }
                intBuild += parseInt(node.children[0].name);
                console.log("int total" + intBuild);
                return intBuild;
            }

            function initInstructionSet() {

                for (var i = 0; i < 256; i++) {
                    assembledInstructions[i] = "00 ";
                }
            }

            function addInstruction(instruction: String) {
                console.log(instruction + "\n");
                if (currentStatic < currentHeap) {
                    assembledInstructions[currentStatic] = instruction.trim() + " ";
                    currentStatic++;

                } else {
                    codeGenError = true;
                    codeGenErrors.push("Static memory overflow");
                }

            }

            function addString(newString: string){
                //Move to empty location in heap
                currentHeap--;
                //Allocate space for new string
                currentHeap = currentHeap - newString.length;

                if (currentStatic >= currentHeap) {
                    codeGenError = true;
                    codeGenErrors.push("Static memory overflow");

                } else {
                    for (var i = 0; i < newString.length; i++){
                        assembledInstructions[currentHeap + i] = intToHex(newString.charCodeAt(i)) + " ";
                    }
                    assembledInstructions[currentHeap + newString.length] = "00 ";
                    return currentHeap;
                }

            }

            function openScope() {

                currentScope = currentScope.children[currentScopeIndex[currentScopeIndex.length-1]];

                //console.log("Opening: " + currentScope.name);

                currentScopeIndex[currentScopeIndex.length - 1]++;

                currentScopeIndex.push(0);



                return null;
            }

            function closeScope(){
                currentScope = currentScope.parent;
                currentScopeIndex.pop();
                //console.log("Returned to: " + currentScope.name);
            }



        }
    }

    class staticData {
        variable: string;
        scope: string;
        offset: number;
        varType: string;

        constructor(variable: string, scope: string, offset: number, varType: string) {
            this.variable = variable;
            this.scope = scope;
            this.offset = offset;
            this.varType = varType;
        }





    }


}