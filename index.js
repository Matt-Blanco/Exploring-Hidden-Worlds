import ForceGraph3D from '3d-force-graph'
import * as d3 from 'd3'
import * as data from './data/data.json'
import * as heirarchyData from './data/data-original.json'
import './public/style.css'
import 'utils.js'

const flatTree = (level = 0) => ({ children = [], ...object }) => [
  { ...object, level }, ...children.flatMap(flatTree(level + 1))
]

let Graph
let Dendogram

const flattenedData = data.default.flatMap(flatTree())

let hoverNodeId = -1

const highlightNodes = new Set()
const highlightLinks = new Set()

function draw3D () {
  const visualizationElement = document.getElementById('main-graph')

  Graph = ForceGraph3D()(visualizationElement)
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

        Graph.cameraPosition(
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

      Graph.nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())

      Dendogram.selectAll('.d3Data').style('fill', (node) => {
        const color = node.data.id === hoverNodeId
          ? '#ffffff'
          : node.data.type === 'dir'
            ? '#5ffcab'
            : node.data.type === 'file' ? '#32fcee' : node.data.type === 'class' ? '#d14ee8' : '#fc8a32'
        return color
      })
    })
    .dagMode('radialin')
    .enableNodeDrag(false)

  Graph.onEngineStop(() => {
    const spinner = document.getElementById('loadingSpinner')
    const button = document.getElementById('loadingButton')

    spinner.classList.add('hidden')
    button.classList.remove('hidden')
  })
}

function draw2D () {
  const width = window.innerWidth * 0.25
  const height = window.innerHeight * 1.3

  Dendogram = d3.select('#dendogram')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(40,0)')
    .attr('opacity', '70%')

  const cluster = d3.cluster()
    .size([height * 0.95, width - 100])

  const root = d3.hierarchy(heirarchyData.default[0], d => d.children)

  cluster(root)

  const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background', '#000')
    .text('a simple tooltip')

  // Add the links between nodes:
  Dendogram.selectAll('path')
    .data(root.descendants().slice(1))
    .enter()
    .append('path')
    .attr('d', function (d) {
      return 'M' + d.y + ',' + d.x +
                'C' + (d.parent.y + 50) + ',' + d.x +
                ' ' + (d.parent.y + 150) + ',' + d.parent.x + // 50 and 150 are coordinates of inflexion, play with it to change links shape
                ' ' + d.parent.y + ',' + d.parent.x
    })
    .style('fill', 'none')
    .attr('stroke', '#ccc')

  // Add a circle for each node.
  Dendogram.selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')'
    })
    .append('circle')
    .attr('class', 'd3Data')
    .attr('r', 3)
    .style('fill', (node) => {
      const color = node.data.id === hoverNodeId
        ? '#ffffff'
        : node.data.type === 'dir'
          ? '#5ffcab'
          : node.data.type === 'file' ? '#32fcee' : node.data.type === 'class' ? '#d14ee8' : '#fc8a32'
      return color
    })
    .on('mouseover', (d) => {
      d3.select(d.target)
        .style('fill', '#ffffff')
      tooltip.text(d.target.__data__.data.name)
      hoverNodeId = d.target.__data__.data.id
      Graph.nodeColor(Graph.nodeColor())
      return tooltip.style('visibility', 'visible')
    })
    .on('mousemove', (e) => {
      console.log(tooltip._groups[0][0].clientWidth, tooltip)
      const tooltipWidth = tooltip._groups[0][0].clientWidth
      return tooltip.style('top', (e.pageY - 10) + 'px').style('left', (e.pageX - (tooltipWidth - 30)) + 'px')
    })
    .on('mouseout', (e) => {
      hoverNodeId = -1
      d3.select(e.target)
        .style('fill', (node) => {
          const color = node.data.id === hoverNodeId
            ? '#ffffff'
            : node.data.type === 'dir'
              ? '#5ffcab'
              : node.data.type === 'file' ? '#32fcee' : node.data.type === 'class' ? '#d14ee8' : '#fc8a32'
          return color
        })
      Graph.nodeColor(Graph.nodeColor())
      return tooltip.style('visibility', 'hidden')
    })
    .on('click', (d) => {
      const tooltip = document.getElementById('code-tooltip')
      tooltip.classList.remove('hidden')
      const tooltipContents = document.getElementById('code-tooltip-contents')
      tooltipContents.innerText = d.target.__data__.contents
    })
}

draw3D()
draw2D()
