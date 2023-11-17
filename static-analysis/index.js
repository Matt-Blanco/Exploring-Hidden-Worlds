import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { checkForClass, extractImport, findScopeContexts, getName, hasScopeType } from './utils.js'

let idCount = 0
const RootPath = "C:\\Users\\Matt's PC\\Documents\\Code\\Leaflet\\src"

export const analyze = (path) => {
  const schema = {
    path,
    type: 'dir',
    name: getName(path),
    id: idCount++,
    children: [],
    collapsed: false
  }
  schema.children = readDirContents(schema.path, 0)
  schema.links = schema.children.map(child => { return { target: schema.id, source: child.id, ref: false } })
  console.log(schema)

  linkReferences(schema, schema)

  writeFileSync('./data/data.json', JSON.stringify([schema]))
}

const readDirContents = (path, depth) => {
  const contents = readdirSync(path)
  const children = []
  contents.forEach((item, index) => {
    const fullPath = `${path}\\${item}`
    const stat = statSync(fullPath)

    if (stat.isFile()) {
      if (item.split('.').some(str => str === 'js')) {
        const contents = readFileSync(fullPath).toString()

        const child = {
          path: fullPath,
          name: getName(fullPath),
          id: idCount++,
          collapsed: false
        }
        child.type = 'file'
        child.contents = contents
        child.children = readFileContents(fullPath, depth + 1, child.contents.split('\n'))
        child.links = child.children.map(ch => { return { target: child.id, source: ch.id, ref: false } })
        children.push(child)
      }
    } else {
      const child = {
        path: fullPath,
        name: getName(fullPath),
        id: idCount++,
        collapsed: false
      }
      child.type = 'dir'
      child.children = readDirContents(fullPath, depth + 1)
      child.links = child.children.map(ch => { return { target: child.id, source: ch.id, ref: false } })
      children.push(child)
    }
  })
  return children
}

const readFileContents = (path, depth, contents) => {
  const startIndexes = []
  let importRefs = []

  return contents.filter((line, index) => {
    const isClass = checkForClass(line)
    if (isClass) startIndexes.push(index)
    if (line.includes('import')) importRefs = importRefs.concat(extractImport(line))
    return isClass
  }).map((line, index, arr) => {
    const start = startIndexes[index]
    const fileContents = findScopeContexts(contents, (start + 1), 'class', importRefs)
    const nameIndex = line.split(' ').findIndex((w) => w === '=')

    const obj = {
      path,
      type: 'class',
      name: line.split(' ')[nameIndex - 1],
      id: idCount++,
      children: [],
      links: [],
      contents: [...contents.slice(fileContents.start - 1, fileContents.end + 1)].join(''),
      collapsed: false,
      lines: [fileContents.start, fileContents.end],
      references: fileContents.references
    }

    obj.children = fileContents.children.map(f => {
      return readScopeContents(
        path,
        depth + 1,
        f,
        contents
      )
    })
    obj.links = obj.children.map(ch => { return { target: obj.id, source: ch.id, ref: false } })
    return obj
  })
}

const readScopeContents = (path, depth, scope, contents) => {
  return {
    path,
    type: scope.type,
    name: scope.name,
    id: idCount++,
    collapsed: false,
    links: [],
    children: [],
    lines: [scope.start, scope.end],
    contents: [...contents.slice(scope.start - 1, scope.end + 1)].join(''),
    references: scope.references
  }
}

const linkReferences = (schema, root) => {
  if (schema.type === 'dir' || schema.type === 'file' || schema.type === 'class') {
    schema.children.forEach((child) => {
      linkReferences(child, root)
    })
  } else if (hasScopeType(schema.type)) {
    schema.references.forEach((ref) => {
      const sourceId = searchForFileId(root, ref.path)
      schema.links.push({ target: schema.id, source: sourceId, ref: true })
    })
  }
}

const searchForFileId = (schema, path) => {
  const splitPath = path.split('/')
  const fileName = splitPath[splitPath.length - 1]

  if (schema.type === 'file' && schema.name === fileName) {
    return schema.id
  } else if (schema.type === 'dir' && schema.children !== null) {
    let id = null
    for (let i = 0; id === null && i < schema.children.length; i++) {
      id = searchForFileId(schema.children[i], path)
    }
    return id
  }
  return null
}

analyze(RootPath)
