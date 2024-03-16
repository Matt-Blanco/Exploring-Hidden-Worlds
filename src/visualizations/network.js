import ForceGraph3D from '3d-force-graph'
import { updateDendogram } from './dendogram'
import { examples, filterData, getNodeColor } from '../utils'

let hoverNodeId = -1

const highlightNodes = new Set()
const highlightLinks = new Set()

let graph

export function drawNetwork (d, el, hasDendogram, options) {
  const copy = { nodes: d, links: d.map(node => node.links).flat() }
  const nd = { nodes: [], links: [] }

  graph = ForceGraph3D()(el)
    .graphData(filterData(copy, nd, options))
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

  graph.onEngineStop(() => {
    const spinner = document.getElementById('loadingSpinner')
    const button = document.getElementById('loadingButton')

    spinner.classList.add('hidden')
    button.classList.remove('hidden')
  })
  return graph
}

export function updateNetwork (hoverId) {
  hoverNodeId = hoverId
  graph.nodeColor(graph.nodeColor())
    .linkWidth(graph.linkWidth())

  const hoverNode = examples[0].network.find(n => n.id === hoverNodeId)

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

tooltipClose.onclick = (e) => {
  tooltip.classList.add('hidden')
}

const projectTitle = document.getElementById('projectTitle')
const projectDescr = document.getElementById('projectDescription')

projectTitle.innerText = `Visualized Project: ${examples[0].title}`
projectDescr.innerText = examples[0].descr
