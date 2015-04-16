/* tree.ts */
var TSC;
(function (TSC) {
    var Tree = (function () {
        function Tree() {
        }
        Tree.prototype.addBranchNode = function (name) {
            var tmpNode = new BranchNode(name);
            if (this.root == null) {
                this.root = new BranchNode("root");
                tmpNode.parent = this.root;
                this.root.children.push(tmpNode);
            }
            else {
                tmpNode.parent = this.current;
                this.current.children.push(tmpNode);
            }
            this.current = tmpNode;
        };
        Tree.prototype.addLeafNode = function (name, token) {
            var tmpNode = new LeafNode(name, token);
            if (this.root == null) {
            }
            else {
                tmpNode.parent = this.current;
                this.current.children.push(tmpNode);
            }
        };
        Tree.prototype.returnToParent = function () {
            this.current = this.current.parent;
        };
        return Tree;
    })();
    TSC.Tree = Tree;
    var BranchNode = (function () {
        function BranchNode(name) {
            this.name = name;
            this.children = [];
        }
        return BranchNode;
    })();
    var LeafNode = (function () {
        function LeafNode(name, token) {
            this.name = name;
            this.token = token;
            this.children = [];
        }
        return LeafNode;
    })();
    TSC.LeafNode = LeafNode;
})(TSC || (TSC = {}));
