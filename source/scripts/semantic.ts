 /* semantic.ts */ 

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
        addLeafNode(name:string, token:Token) {
            var tmpNode = new LeafNode(name, token);
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

    

    interface Node {
        name: string;
        parent: Node;
        children: Node[];
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

    class LeafNode implements Node {
        name: string;
        token: Token
        parent: Node;
        children: Node[];

        constructor(name: string, token: Token) {
            this.name = name;
            this.token = token;
            this.children = [];
        }

    }

}
