import { ref } from "vue"
import type { Node } from "@vue-flow/core"

const position = { x: 0, y: 0 }
export function useNode() {
    const nodeIdCounter = ref(1)

    function createNode(data: { [key: string]: any }, id?: number): Node {
        const node = {
            id: String(id ?? nodeIdCounter.value),
            position,
            data,
        }
        nodeIdCounter.value++;
        return node
    }



    return { createNode }
}




