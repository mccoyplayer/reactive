import { Graph } from "./Graph";
import { LTSController } from "./LTSController";
import { SetOps } from "./SetOps";
import { ReactiveBisimilarityGame } from "./ReactiveBisimilarityGameController";
import { Constants } from "./Constants";
import { GamePosition, RestrictedSimulationDefenderNode, SimulationDefenderNode } from "./GamePosition";

export class Tests {

    testReactiveBisimGame() {
        let lts = this.getReactiveBisimLTS();
        const game = new ReactiveBisimilarityGame("0", "0'", lts);
        console.log("currents: " + lts.current);
        lts.graph.print();

        console.log("----------------- TESTS -----------------")
        game.setEnvironment(new Set(["c"]));
        console.log("isMovePossible(0-b->P ): " + game.isMovePossible("b", new SimulationDefenderNode("P", "0'", "b")) + ", expected: false (environment doesn't allow)");
        game.resetEnvironment();
        console.log("isMovePossible(0-b->P ): " + game.isMovePossible("b", new SimulationDefenderNode("P", "0'", "b"), new Set(["c"])) + ", expected: false (custom environment doesn't allow)");
        console.log("isMovePossible(0-b->P ): " + game.isMovePossible("b", new SimulationDefenderNode("P", "0'", "b")) + ", expected: true");
        game.isMovePossible(Constants.TIMEOUT_ACTION, new SimulationDefenderNode("P", "0'", "b"));  //TODO:should be false, wrong arguments
        game.performMove(Constants.TIMEOUT_ACTION, new SimulationDefenderNode("P", "0'", "b"));
        //game.isMovePossible("b", new RestrictedSimulationDefenderNode("P", "0'", "b", game.getEnvironment()));

    }

    /**
     * Constructs the first reactive bisimilar LTS from the van Glabbeek Paper
     * @returns 
     */
    getReactiveBisimLTS(): LTSController {
        const lts = new LTSController();
        lts.addState("0");
        lts.addState("P");
        lts.addState("2");
        lts.addState("3");
        lts.addState("Q");
        lts.addState("5");
        lts.addState("6");
        lts.addState("R");
        lts.addState("S");

        lts.addTransition("0", "P", "b");
        lts.addTransition("0", "2", Constants.TIMEOUT_ACTION);
        lts.addTransition("0", "3", Constants.TIMEOUT_ACTION);
        lts.addTransition("2", "Q", "a");
        lts.addTransition("2", "5", Constants.HIDDEN_ACTION);
        lts.addTransition("3", "6", Constants.HIDDEN_ACTION);
        lts.addTransition("5", "R", "b");
        lts.addTransition("5", "S", "a");
        lts.addTransition("6", "S", "a");

        lts.addState("0'");
        lts.addState("P'");
        lts.addState("2'");
        lts.addState("3'");
        lts.addState("Q'");
        lts.addState("5'");
        lts.addState("6'");
        lts.addState("R'");
        lts.addState("S'");

        lts.addTransition("0'", "P'", "b");
        lts.addTransition("0'", "2'", Constants.TIMEOUT_ACTION);
        lts.addTransition("0'", "3'", Constants.TIMEOUT_ACTION);
        lts.addTransition("2'", "Q'", "a");
        lts.addTransition("2'", "6'", Constants.HIDDEN_ACTION);
        lts.addTransition("3'", "5'", Constants.HIDDEN_ACTION);
        lts.addTransition("5'", "R'", "b");
        lts.addTransition("5'", "S'", "a");
        lts.addTransition("6'", "S'", "a");

        return lts;
    }

    testSetOps() {
        let a = new Set(["1", "2", "3", "4", "5"]);
        let b = new Set(["2", "3", "6", "7", "8"]);
        let c = new Set(["3", "6"]);
        let d = new Set(["3", "6"]);

        console.log("isSubset: " + SetOps.isSubset(c, b) +  ", expected: true");
        console.log("isSubset: " + SetOps.isSubset(c, a) +  ", expected: false");
        console.log("isSubsetEq: " + SetOps.isSubsetEq(c, b) +  ", expected: true");
        console.log("isSubsetEq: " + SetOps.isSubsetEq(c, d) +  ", expected: true");
        console.log("isSubsetEq: " + SetOps.isSubsetEq(c, a) +  ", expected: false");
        console.log("intersect: " + SetOps.toArray(SetOps.intersect(a, b)) + ", expected: [2, 3]");
        console.log("union: " + SetOps.toArray(SetOps.union(a, b)) + ", expected: [1, 2, 3, 4, 5, 6, 7, 8]");
        console.log("difference: " + SetOps.toArray(SetOps.difference(a, b)) + ", expected: [1, 4, 5]");
    }

    testLTSController() {
        const lts = new LTSController();
        lts.addState("0");
        lts.addState("1");
        lts.addState("2");
        lts.addState("3");
        lts.addState("4");
        lts.addTransition("0", "1", 'a');
        lts.addTransition("0", "2", 't');
        lts.addTransition("1", "3", 'tau');
        lts.addTransition("2", "4", "b");
        lts.addTransition("0", "3", 'tau');
        lts.addTransition("0", "4", "b");
        lts.addTransition("1", "3", "t");
        lts.setCurrentState("0");
        console.log("current: " + lts.current);
        lts.graph.print();
        console.log("-------------------------------------------------------");
        console.log("performing actions: 0-a->1 (possible), 1-a->2 (not possible), 1-tau->3 (possible)")
        lts.performAction("0", "1", "a");   //possible
        lts.performAction("1", "2", "a");   //not possible
        lts.performAction("1", "3", "tau"); //possible
        console.log("current: " + lts.current);
        lts.setCurrentState("3", 1);
        console.log("set current to 3: ")
        console.log(lts.current);
        lts.graph.print();
    }

    testGraph() {
        const graph = new Graph(this.comparator0);
        graph.addNode(0);
        graph.addNode(1);
        graph.addNode(2);
        graph.addNode(3);
        graph.addNode(4);
        graph.addEdge(0, 1, 'a');
        graph.addEdge(0, 2, 't');
        graph.addEdge(1, 3, 'tau');
        graph.addEdge(2, 4, "b");
        graph.addEdge(0, 3, 'tau');
        graph.addEdge(0, 4, "b");
        graph.addEdge(1, 3, "t");
        console.log("NodeAmount: " + graph.getNodeAmount(), + ", expected: 5");
        console.log("vertices: " + graph.getNodes().toString()) + "expected: 0, 1, 2, 3, 4";
        console.log("edges: " + graph.getEdgesAsString() );
        graph.print();
        console.log("-------------------------------------------------------");
        graph.removeNode(3);
        graph.removeEdge(0, 4, 'b');
        graph.print();
    }

    comparator0(a: number, b: number) {
        if (a < b) return -1;
      
        if (a > b) return 1;
      
        return 0;
    }
}
    //----------------------------------- Testing -----------------------------------
    const test = new Tests();

    //test.testSetOps();
    test.testReactiveBisimGame();