<template>
    <div class="w-screen h-screen" v-if="character">
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init :default-zoom="0.5" :min-zoom="0.2"
            :max-zoom="4">
        </VueFlow>
    </div>
</template>

<script setup lang="ts">


import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPeople } from '@/api/apiFetchPeople'
import { fetchMovie } from '@/api/apiFetchMovie'
import { fetchStarships } from '@/api/apiFetchStarships'
import type { EntityAPIResult, APIResult } from '@/api/types'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { people, starships, movies } from "@/tests/mocks"

const { onConnect, addEdges, updateNodeData, findNode } = useVueFlow()

const route = useRoute()
const character = ref<EntityAPIResult | null>(null)


const nodes = ref<Node[]>([])
const nodeIdCounter = ref(1)

const edges = ref<Edge[]>([])

function addNode(node: Node) {
    nodes.value.push(node)
    nodeIdCounter.value++
    return node.id
}



function fetchData() {
    // fetch character
    character.value = people;

    // fetch movies
    // fetch starships

    // draw nodes
    addNode({
        id: '1',
        position: { x: 250, y: 5 },
        data: {
            label: character.value.name,
            type: 'character',
            id: character.value.id
        }
    })

    movies.forEach((d, i) => {
        const id = addNode({
            id: String(nodeIdCounter.value),
            position: {
                x: 100 + i * 50,
                y: 0 + i * 50
            },
            data: {
                label: d.title,
                type: 'film',
                id: d.id
            }
        })
        edges.value.push({
            id: `film_link_1-${id}`,
            source: '1',
            target: id
        })
    })

    starships.forEach((d, i) => {
        const films = d.films
        films.forEach((f: number) => {
            // find node
            const filmNode = nodes.value.find((n) => n.data.id === f && n.data.type === 'film')
            if (!filmNode) {
                return
            }

            const id = addNode({
                id: String(nodeIdCounter.value),
                position: {
                    x: 500 + i * 50,
                    y: 0
                },
                data: {
                    label: d.name,
                    type: 'spaceship',
                    id: d.id
                }
            })
            edges.value.push({
                id: `starship_link_${filmNode.id}-${id}`,
                source: filmNode.id,
                target: id
            })
        })
    })
}

fetchData()

function init() {
    fetchPeople({ id: Number(route.params.id) })
        .then((res) => res.json())
        .then((data: EntityAPIResult) => {
            character.value = data

            addNode({
                id: '1',
                position: { x: 250, y: 5 },
                data: {
                    label: data.name,
                    type: 'character',
                    id: character.value.id
                }
            })

            return Promise.all(character.value.films.map((id: number) => fetchMovie({ id })))
        })
        .then((res) => {
            return Promise.all(res.map((r) => r.json()))
        })
        .then((data) => {
            data.forEach((d, i) => {
                const id = addNode({
                    id: String(nodeIdCounter.value),
                    position: {
                        x: 100 + i * 50,
                        y: 0 + i * 50
                    },
                    data: {
                        label: d.title,
                        type: 'film',
                        id: d.id
                    }
                })
                edges.value.push({
                    id: `film_link_1-${id}`,
                    source: '1',
                    target: id
                })
            })

            return Promise.all(character.value!.starships.map((id: number) => fetchStarships({ id })))
        })
        .then((res) =>
            Promise.all(res.map((r) => r.json()))
                .then((data) => {
                    data.forEach((d, i) => {
                        const films = d.films
                        films.forEach((f: number) => {
                            // find node
                            const filmNode = nodes.value.find((n) => n.data.id === f && n.data.type === 'film')
                            if (!filmNode) {
                                return
                            }

                            const id = addNode({
                                id: String(nodeIdCounter.value),
                                position: {
                                    x: 500 + i * 50,
                                    y: 0
                                },
                                data: {
                                    label: d.name,
                                    type: 'spaceship',
                                    id: d.id
                                }
                            })
                            edges.value.push({
                                id: `starship_link_${filmNode.id}-${id}`,
                                source: filmNode.id,
                                target: id
                            })
                        })
                    })
                })
        )
}
</script>

<style>
@import '@vue-flow/core/dist/style.css';
</style>
