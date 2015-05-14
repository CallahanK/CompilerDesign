 /* codegen.ts */


module TSC {
    export class CodeGeneration {
        public static generate() {

            initInstructionSet();

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

                for (var i = 0; i < node.children.length; i++){
                    traverse(node.children[i]);


                }

                generateInstruction(node);
                console.log(node.name);

            }

            

            function generateInstruction(node:Node ) {



                if (node.name == "Block") {
                    
                    //move down scope

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
                var tmptype = node.children[0];

                if (tmptype.name == "int") {

                    var tmpAddress = "T" + staticDataIndex;

                    staticDataTable['tmpAddress'] = new staticData(tmpVar.name, null, staticDataIndex);

                    addInstruction("A9");
                    addInstruction("00");
                    addInstruction("8D");
                    addInstruction(tmpAddress);
                    addInstruction("XX");


                    staticDataIndex++;
                }




                
            }

            function assignmentStatement(node: Node ) {

            }


            function printStatement(node: Node ) {

            }


            function whileStatement(node: Node ) {

            }

            function ifStatement(node: Node ) {

            }

            function backPatch() {
                
                for (var i = 0; i < 256; i++) {

                    if (assembledInstructions[i].match(/^T./)){
                        assembledInstructions[i] = intToHex(currentStatic, 2) + " ";
                        assembledInstructions[i+1] = "00 ";
                    }

                }


            }

            function intToHex(d:number, padding:number) {
                var hex: String = d.toString(16);

                while (hex.length < padding) {
                    hex = "0" + hex;
                }
                return hex;
            }

            function initInstructionSet() {

                for (var i = 0; i < 256; i++) {
                    assembledInstructions[i] = "00 ";
                }
            }

            function addInstruction(instruction: String) {

                if (currentStatic < currentHeap) {
                    assembledInstructions[currentStatic] = instruction.trim() + " ";
                    currentStatic++;

                } else {
                    codeGenError = true;
                    codeGenErrors.push("Static memory overflow");
                }

            }

        }
    }

    class staticData {
        variable: String;
        scope: ScopeNode;
        offset: number;

        constructor(variable: String, scope: ScopeNode, offset: number) {
            this.variable = variable;
            this.scope = scope;
            this.offset = offset;
        }





    }


}