<template>
    <div class="w-screen h-screen" v-if="character">

        <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init :default-zoom="0.5" :min-zoom="0.2"
            :max-zoom="4">
            <!-- <Background pattern-color="#aaa" :gap="8" />

            <MiniMap />

            <Controls /> -->

            <!-- <template #node-custom="nodeProps">
                <CustomNode v-bind="nodeProps" />
            </template>

            <template #edge-custom="edgeProps">
                <CustomEdge v-bind="edgeProps" />
            </template> -->
        </VueFlow>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { fetchPeople } from "@/api/apiFetchPeople"
import { fetchMovie } from "@/api/apiFetchMovie"
import { fetchStarships } from "@/api/apiFetchStarships"
import type { EntityAPIResult, APIResult } from '@/api/types'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'


const { onConnect, addEdges, updateNodeData, findNode } = useVueFlow();

const route = useRoute();
const character = ref<EntityAPIResult | null>(null);
const charFilms = ref<EntityAPIResult[]>([])

const nodes = ref<Node[]>([]);
const nodeIdCounter = ref(1);

const edges = ref<Edge[]>([]);

function addNode(node: Node) {
    nodes.value.push(node)
    nodeIdCounter.value++;
    return node.id
}

fetchPeople({ id: Number(route.params.id) })
    .then((res) => res.json())
    .then((data: EntityAPIResult) => {
        character.value = data;

        addNode({
            id: '1',
            position: { x: 250, y: 5 },
            data: {
                label: data.name
            }
        })

        return Promise.all(character.value.films.map((id: number) => fetchMovie({ id })));
    })
    .then((res) => {
        return Promise.all(res.map(r => r.json()))
    }).then((data) => {
        charFilms.value = data;
        data.forEach((d, i) => {
            const id = addNode({
                id: String(nodeIdCounter.value),
                position: {
                    x: 100 + i * 50,
                    y: 0 + i * 50
                },
                data: {
                    label: d.title
                }
            })
            edges.value.push({
                id: `film_link_1-${id}`,
                source: "1",
                target: id,
            })
        })

        console.log(character.value!.starships)
        return Promise.all(character.value!.starships.map((id: number) => fetchStarships({ id })))

    })
</script>
  
<style>
@import '@vue-flow/core/dist/style.css';
</style>
  