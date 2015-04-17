 /* tree.ts */ 

module TSC {
    export class Tree {

        root: Node;
        current: Node;

        addBranchNode(name:string) {
            var tmpNode = new BranchNode(name);
            if (this.root == null) {
                this.root = new BranchNode("root");
                tmpNode.parent = this.root;
                this.root.children.push(tmpNode);
            } else {
                tmpNode.parent = this.current;
                this.current.children.push(tmpNode);
            }
            this.current = tmpNode;
        }
        addLeafNode(name:string, token:Token, type:string) {
            var tmpNode = new LeafNode(name, token.line, type);
            if (this.root == null) {
                //Error leaf node shouldnt be root 
            } else {
                tmpNode.parent = this.current;
                this.current.children.push(tmpNode);
            }
        }
        returnToParent() {
            this.current = this.current.parent;
        }

    }

    

    export interface Node {
        name: string;
        parent: Node;
        children: Node[];
        line?: number;
        type?: string;
    }

    class BranchNode implements Node {
        name: string;
        parent: Node;
        children: Node[];

        constructor(name: string) {
            this.name = name;
            this.children = [];
        }

    }

    export class LeafNode implements Node {
        name: string;
        line: number;
        type: string;
        parent: Node;
        children: Node[];

        constructor(name: string, line: number, type: string) {
            this.name = name;
            this.line = line;
            this.type = type;
            this.children = [];
        }

    }

}
