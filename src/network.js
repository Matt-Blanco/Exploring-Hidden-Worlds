import ForceGraph3D from '3d-force-graph'
import * as data from './data/data.json'
import './public/style.css'
import { updateDendogram } from './dendogram'

const flatTree = (level = 0) => ({ children = [], ...object }) => [
  { ...object, level }, ...children.flatMap(flatTree(level + 1))
]

const flattenedData = data.default.flatMap(flatTree())

let hoverNodeId = -1

const highlightNodes = new Set()
const highlightLinks = new Set()

let graph

export function drawNetwork () {
  const visualizationElement = document.getElementById('main-graph')

  graph = ForceGraph3D()(visualizationElement)
    .graphData({ nodes: flattenedData, links: flattenedData.map(node => node.links).flat() })
    .showNavInfo(false)
    .linkOpacity(0.3)
    .linkCurvature(0.33)
    // .linkDirectionalParticles(1)
    // .linkDirectionalParticleWidth(1.5)
    .linkWidth((link) => highlightLinks.has(link) ? 3 : 1)
    .linkColor((link) => link.ref ? 0xf7b831 : 0xffffff)
    .nodeOpacity(0.5)
    .nodeVal(node => node.type === 'dir' ? 18 : node.type === 'file' ? 8 : 1)
    .nodeResolution(32)
    .nodeColor(node => node.id === hoverNodeId
      ? 0xffffff
      : node.type === 'dir'
        ? 0x5ffcab
        : node.type === 'file' ? 0x32fcee : node.type === 'class' ? 0xd14ee8 : 0xfc8a32)
    .onNodeClick((node, e) => {
      if (e.shiftKey) {
        const distance = 80
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)

        const newPos = node.x || node.y || node.z
          ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
          : { x: 0, y: 0, z: distance }

        graph.cameraPosition(
          newPos,
          node,
          3000
        )
      } else {
        if (node.type === 'file' ||
        node.type === 'class' ||
        node.type === 'cond' ||
        node.type === 'for' ||
        node.type === 'while' ||
        node.type === 'switch' ||
        node.type === 'obj' ||
        node.type === 'func') {
          const tooltip = document.getElementById('code-tooltip')
          tooltip.classList.remove('hidden')
          const tooltipContents = document.getElementById('code-tooltip-contents')
          tooltipContents.innerText = node.contents
        }
      }
    })
    .onNodeHover((node, previousNode) => {
      highlightNodes.clear()
      highlightLinks.clear()

      if (node !== null) {
        hoverNodeId = node.id
        highlightNodes.add(node)
        console.log(node)
        // node.neighbors.forEach(n => highlightNodes.add(n))
        node.links.forEach(l => highlightLinks.add(l))
      } else {
        hoverNodeId = -1
      }

      console.log(highlightNodes, highlightLinks)

      graph.nodeColor(graph.nodeColor())
        .linkWidth(graph.linkWidth())

      updateDendogram(hoverNodeId)
    })
    .dagMode('radialin')
    .enableNodeDrag(false)

  graph.onEngineStop(() => {
    const spinner = document.getElementById('loadingSpinner')
    const button = document.getElementById('loadingButton')

    spinner.classList.add('hidden')
    button.classList.remove('hidden')
  })
}

export function updateNetwork (hoverId) {
  graph.nodeColor(graph.nodeColor())
    .linkWidth(graph.linkWidth())
}
