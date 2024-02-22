import ForceGraph3D from '3d-force-graph'
import * as data from '../../data/new-data.json'
import { updateDendogram } from './dendogram'
import { getNodeColor } from '../utils'

const flatTree = (level = 0) => ({ children = [], ...object }) => [
  { ...object, level }, ...children.flatMap(flatTree(level + 1))
]

const flattenedData = data.default.flatMap(flatTree())

let hoverNodeId = -1

const highlightNodes = new Set()
const highlightLinks = new Set()

let graph

export const codeData = { nodes: flattenedData, links: flattenedData.map(node => node.links).flat() }

export function drawNetwork (d, el, hasDendogram) {
  graph = ForceGraph3D()(el)
    .graphData(d)
    .showNavInfo(false)
    .linkOpacity(0.25)
    .linkCurvature(0.33)
    .linkWidth((link) => highlightLinks.has(link) ? 6 : 2)
    .linkColor((link) => link.ref ? 0xf7b831 : 0xffffff)
    .nodeOpacity(0.75)
    .nodeVal(node => node.type === 'dir' ? 30 : node.type === 'file' ? 20 : 5)
    .nodeResolution(24)
    .nodeColor((node) => getNodeColor(node, hoverNodeId))
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
        if (node.type !== 'dir') {
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
        node.links.forEach(l => highlightLinks.add(l))
      } else {
        hoverNodeId = -1
      }

      if (hasDendogram) {
        updateDendogram(hoverNodeId)
      }

      graph.nodeColor(graph.nodeColor())
    })
    .dagMode('radialin')
    .enableNodeDrag(false)
    .zoomToFit()

  graph.camera().position.z = 5000
  graph.onEngineStop(() => {
    const spinner = document.getElementById('loadingSpinner')
    const button = document.getElementById('loadingButton')

    spinner.classList.add('hidden')
    button.classList.remove('hidden')
  })
}

export function updateNetwork (hoverId) {
  hoverNodeId = hoverId
  graph.nodeColor(graph.nodeColor())
    .linkWidth(graph.linkWidth())

  const hoverNode = flattenedData.find(n => n.id === hoverNodeId)

  if (hoverNodeId !== -1) {
    const distance = 200
    const distRatio = 1 + distance / Math.hypot(hoverNode.x, hoverNode.y, hoverNode.z)

    const newPos = hoverNode.x || hoverNode.y || hoverNode.z
      ? { x: hoverNode.x * distRatio, y: hoverNode.y * distRatio, z: hoverNode.z * distRatio }
      : { x: 0, y: 0, z: distance }

    graph.cameraPosition(
      newPos,
      hoverNode,
      5000
    )

    hoverNodeId = hoverNode.id
    graph.nodeColor(graph.nodeColor())
      .linkWidth(graph.linkWidth())
  }
}

// Code to close the code modal
const tooltipClose = document.getElementById('tooltip-close')
const tooltip = document.getElementById('code-tooltip')
const legendChevron = document.getElementById('simpleChevron')
const legend = document.getElementById('legend')

tooltipClose.onclick = (e) => {
  tooltip.classList.add('hidden')
}

legendChevron.onclick = (e) => {
  if (!legendChevron.classList.contains('legendClick')) {
    legendChevron.classList.add('legendClick')
    legend.classList.add('expand')
  } else {
    legendChevron.classList.remove('legendClick')
    legend.classList.remove('expand')
  }
}
