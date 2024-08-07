<template>
  <div class="w-screen h-screen" v-if="character">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      :default-zoom="0.5"
      :min-zoom="0.2"
      :max-zoom="4"
      @nodes-initialized="layoutGraph"
    >
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { fetchPeople } from '@/api/apiFetchPeople'
import { fetchMovie } from '@/api/apiFetchMovie'
import { fetchStarships } from '@/api/apiFetchStarships'
import type { EntityAPIResult, APIResult } from '@/api/types'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { people, starships, movies } from '@/tests/mocks'
import { useLayout } from '@/composables/useLayout'
import { useNode } from '@/composables/useNode'

const { fitView } = useVueFlow()

const route = useRoute()

const { layout } = useLayout()
const { createNode } = useNode()


const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

const character = ref<EntityAPIResult | null>(null)

async function layoutGraph() {
  nodes.value = layout(nodes.value, edges.value)

  nextTick(() => {
    fitView()
  })
}
function initNodes() {
  // char root node
  const charNode = createNode(
    {
      label: character.value!.name,
      type: 'character',
      id: character.value!.id
    },
    1
  )
  nodes.value.push(charNode)

  // films nodes
  movies.forEach((f) => {
    const filmNode = createNode({
      label: f.title,
      type: 'film',
      id: f.id
    })
    nodes.value.push(filmNode)

    edges.value.push({
      id: `film_link_1-${filmNode.id}`,
      source: '1',
      target: filmNode.id
    })
  })

  // starship nodes
  starships.forEach((s) => {
    const films = s.films
    films.forEach((f: number) => {
      // find node
      const filmNode = nodes.value.find((n) => n.data.id === f && n.data.type === 'film')
      if (!filmNode) {
        return
      }

      const shipNode = createNode({
        label: s.name,
        type: 'spaceship',
        id: s.id
      })
      nodes.value.push(shipNode)

      edges.value.push({
        id: `starship_link_${filmNode.id}-${shipNode.id}`,
        source: filmNode.id,
        target: shipNode.id
      })
    })
  })
}

function fetchData() {
  // fetch character
  character.value = people

  // fetch movies
  // fetch starships
}

fetchData()
initNodes()

// function init() {
//   fetchPeople({ id: Number(route.params.id) })
//     .then((res) => res.json())
//     .then((data: EntityAPIResult) => {
//       character.value = data

//       addNode({
//         id: '1',
//         position: { x: 250, y: 5 },
//         data: {
//           label: data.name,
//           type: 'character',
//           id: character.value.id
//         }
//       })

//       return Promise.all(character.value.films.map((id: number) => fetchMovie({ id })))
//     })
//     .then((res) => {
//       return Promise.all(res.map((r) => r.json()))
//     })
//     .then((data) => {
//       data.forEach((d, i) => {
//         const id = addNode({
//           id: String(nodeIdCounter.value),
//           position: {
//             x: 100 + i * 50,
//             y: 0 + i * 50
//           },
//           data: {
//             label: d.title,
//             type: 'film',
//             id: d.id
//           }
//         })
//         edges.value.push({
//           id: `film_link_1-${id}`,
//           source: '1',
//           target: id
//         })
//       })

//       return Promise.all(character.value!.starships.map((id: number) => fetchStarships({ id })))
//     })
//     .then((res) =>
//       Promise.all(res.map((r) => r.json())).then((data) => {
//         data.forEach((d, i) => {
//           const films = d.films
//           films.forEach((f: number) => {
//             // find node
//             const filmNode = nodes.value.find((n) => n.data.id === f && n.data.type === 'film')
//             if (!filmNode) {
//               return
//             }

//             const id = addNode({
//               id: String(nodeIdCounter.value),
//               position: {
//                 x: 500 + i * 50,
//                 y: 0
//               },
//               data: {
//                 label: d.name,
//                 type: 'spaceship',
//                 id: d.id
//               }
//             })
//             edges.value.push({
//               id: `starship_link_${filmNode.id}-${id}`,
//               source: filmNode.id,
//               target: id
//             })
//           })
//         })
//       })
//     )
// }
</script>

<style>
@import '@vue-flow/core/dist/style.css';
</style>
