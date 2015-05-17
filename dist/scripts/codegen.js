/* codegen.ts */
var TSC;
(function (TSC) {
    var CodeGeneration = (function () {
        function CodeGeneration() {
        }
        CodeGeneration.generate = function () {
            initInstructionSet();
            currentScope = symbolTable.root;
            traverse(ast.root);
            backPatch();
            var builtInstructions = "";
            for (var i = 0; i < 256; i++) {
                if (i % 16 == 0) {
                    builtInstructions = builtInstructions + "\n";
                }
                builtInstructions = builtInstructions + assembledInstructions[i];
            }
            return builtInstructions;
            //End of Generate
            function traverse(node) {
                if (node.name == "Block") {
                    openScope();
                }
                for (var i = 0; i < node.children.length; i++) {
                    traverse(node.children[i]);
                }
                generateInstruction(node);
                //console.log(node.name);
            }
            function generateInstruction(node) {
                if (node.name == "Block") {
                    closeScope();
                } //End Block
                if (node.name == "Variable Declaration") {
                    variableDeclaration(node);
                } //End Var Decl
                if (node.name == "Assignment Statement") {
                    assignmentStatement(node);
                } //End Assign
                if (node.name == "Print Statement") {
                    printStatement(node);
                } //End Print
                if (node.name == "If Statement") {
                    ifStatement(node);
                } //End If
                if (node.name == "While Statement") {
                    whileStatement(node);
                } //End While
            }
            function variableDeclaration(node) {
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
                    staticDataTable[tmpAddress] = new staticData(tmpVar.name, currentScope.name, staticDataIndex, "string");
                }
                staticDataIndex++;
            }
            function assignmentStatement(node) {
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
                if (tmpVal.type == "string") {
                    //tmpAddress = addString(tmpVal.name);
                    var tmpHeapAddress = addString(tmpVal.name);
                    addInstruction("A9");
                    addInstruction(intToHex(tmpHeapAddress));
                    addInstruction("8D");
                    addInstruction(tmpAddress);
                    addInstruction("XX");
                }
            }
            function printStatement(node) {
                var tmpPrint = node.children[0];
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
                    if (tmpValue.varType == "int") {
                        //LDX w/ 1 for sysCall
                        addInstruction("A2");
                        addInstruction("01");
                        addInstruction("AC");
                        addInstruction(tmpAddress);
                        addInstruction("XX");
                        addInstruction("FF");
                    }
                }
                //Print int expr
                if (tmpPrint.name == "+") {
                }
                //Print string expr 
                if (tmpPrint.type == "string") {
                    var tmpHeapAddress = addString(tmpPrint.name);
                    var tmpLoc = "T" + staticDataIndex;
                    staticDataTable[tmpLoc] = new staticData("", currentScope.name, staticDataIndex, "string");
                    staticDataIndex++;
                    addInstruction("A9");
                    addInstruction(intToHex(tmpHeapAddress));
                    addInstruction("8D");
                    addInstruction(tmpLoc);
                    addInstruction("XX");
                    //LDX w/ 2 for sysCall
                    addInstruction("A2");
                    addInstruction("02");
                    addInstruction("AC");
                    addInstruction(tmpLoc);
                    addInstruction("XX");
                    addInstruction("FF");
                }
            }
            function whileStatement(node) {
            }
            function ifStatement(node) {
            }
            function backPatch() {
                //Adds a final break instruction
                addInstruction("00");
                for (var i = 0; i < 256; i++) {
                    if (assembledInstructions[i].match(/^T./)) {
                        console.log("matched T : " + assembledInstructions[i]);
                        var offset = staticDataTable[assembledInstructions[i].trim()].offset;
                        assembledInstructions[i] = intToHex(currentStatic + offset, 2) + " ";
                        assembledInstructions[i + 1] = "00 ";
                    }
                }
            }
            function intToHex(d, padding) {
                if (padding === void 0) { padding = 2; }
                var hex = d.toString(16);
                while (hex.length < padding) {
                    hex = "0" + hex;
                }
                return hex.toUpperCase();
            }
            function collapseIntExpr(node) {
                var intBuild = 0;
                var currNode = node;
                while (currNode.children.length > 1) {
                    intBuild = intBuild + parseInt(currNode.children[0].name);
                    currNode = currNode.children[1];
                }
                intBuild = intBuild + parseInt(currNode.children[0].name);
                console.log("int total" + intBuild);
                return intBuild;
            }
            function initInstructionSet() {
                for (var i = 0; i < 256; i++) {
                    assembledInstructions[i] = "00 ";
                }
            }
            function addInstruction(instruction) {
                console.log(instruction + "\n");
                if (currentStatic < currentHeap) {
                    assembledInstructions[currentStatic] = instruction.trim() + " ";
                    currentStatic++;
                }
                else {
                    codeGenError = true;
                    codeGenErrors.push("Static memory overflow");
                }
            }
            function addString(newString) {
                //Move to empty location in heap
                currentHeap--;
                //Allocate space for new string
                currentHeap = currentHeap - newString.length;
                if (currentStatic >= currentHeap) {
                    codeGenError = true;
                    codeGenErrors.push("Static memory overflow");
                }
                else {
                    for (var i = 0; i < newString.length; i++) {
                        assembledInstructions[currentHeap + i] = intToHex(newString.charCodeAt(i)) + " ";
                    }
                    assembledInstructions[currentHeap + newString.length] = "00 ";
                    return currentHeap;
                }
                return 0;
            }
            function openScope() {
                currentScope = currentScope.children[currentScopeIndex[currentScopeIndex.length - 1]];
                //console.log("Opening: " + currentScope.name);
                currentScopeIndex[currentScopeIndex.length - 1]++;
                currentScopeIndex.push(0);
                return null;
            }
            function closeScope() {
                currentScope = currentScope.parent;
                currentScopeIndex.pop();
                //console.log("Returned to: " + currentScope.name);
            }
        };
        return CodeGeneration;
    })();
    TSC.CodeGeneration = CodeGeneration;
    var staticData = (function () {
        function staticData(variable, scope, offset, varType) {
            this.variable = variable;
            this.scope = scope;
            this.offset = offset;
            this.varType = varType;
        }
        return staticData;
    })();
})(TSC || (TSC = {}));
