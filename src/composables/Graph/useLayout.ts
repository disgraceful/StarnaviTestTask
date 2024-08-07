import dagre from '@dagrejs/dagre'
import { Position, useVueFlow } from '@vue-flow/core'
import type { Node, Edge } from '@vue-flow/core'
import { ref } from 'vue'


export function useLayout() {
    const { findNode } = useVueFlow()

    const graph = ref(new dagre.graphlib.Graph())


    function layout(nodes: Node[], edges: Edge[]) {
        const dagreGraph = new dagre.graphlib.Graph()

        graph.value = dagreGraph

        dagreGraph.setDefaultEdgeLabel(() => ({}))

        dagreGraph.setGraph({ rankdir: 'LR' })


        for (const node of nodes) {
            const graphNode = findNode(node.id)!

            dagreGraph.setNode(node.id, { width: graphNode.dimensions.width || 150, height: graphNode.dimensions.height || 50 })
        }

        for (const edge of edges) {
            dagreGraph.setEdge(edge.source, edge.target)
        }

        dagre.layout(dagreGraph)

        return nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id)

            return {
                ...node,
                targetPosition: Position.Left,
                sourcePosition: Position.Right,
                position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
            }
        })
    }

    return { graph, layout }
}