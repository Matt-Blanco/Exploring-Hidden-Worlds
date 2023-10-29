export const findScopeContexts = (arr, start, type, importRefs) => {
  const data = {
    name: arr[start],
    start,
    end: 0,
    children: [],
    type,
    references: []
  }

  const getScopeType = (line) => {
    const isCond = line.includes('if') || line.includes('else if') || line.includes('else')
    const isSwitch = line.includes('switch')
    const isFunction = line.includes(') {')
    const isFor = line.includes('for ')
    const isWhile = line.includes('while ')
    const isObj = line.includes(': {')

    if (isCond) {
      return 'cond'
    } else if (isSwitch) {
      return 'switch'
    } else if (isFunction) {
      return 'func'
    } else if (isFor) {
      return 'for'
    } else if (isWhile) {
      return 'while'
    } else if (isObj) {
      return 'obj'
    } else {
      return 'na'
    }
  }

  for (let i = start + 1; i < arr.length; i++) {
    const line = arr[i]
    const hasOpening = line.includes('{')
    const hasClosing = line.includes('}')

    importRefs.forEach((ref) => {
      const externalRef = ref.alias ? ref.alias : ref.name
      if (line.includes(externalRef)) {
        data.references.push({ path: ref.path, name: ref.name })
      }
    })

    if (getScopeType(line) !== 'na' && hasOpening) {
      data.children.push(findScopeContexts(arr, i, getScopeType(line), importRefs))
      const lastChild = data.children[data.children.length - 1]
      i = lastChild.end
    }

    if (hasClosing && !line.includes('*')) {
      data.end = i
      return data
    }
  }
}

export const checkForClass = (line) => {
  const hasClass = line.includes('export Class')
  const extendsClass = line.includes('.extend(')
  return (hasClass || extendsClass) && !line.includes('*') && line.includes('{')
}

export const getName = (path) => {
  const split = path.split('\\')
  return split[split.length - 1]
}

export const extractImport = (line) => {
  const imports = []
  const words = line.split(' ')
  const path = sanitizeString(words[words.length - 1], ['\r', ';', "'", "'"])

  if (line.includes('{')) {
    let index = 0

    words.forEach((w, i) => {
      if (w.includes('{')) index = i
    })

    while (index < words.length && !words[index].includes('from')) {
      if (words[index + 1] !== 'as') {
        const newImport = {
          path,
          isModule: true,
          name: sanitizeString(words[index], ['{', '}'])
        }
        imports.push(newImport)
        index++
        if (newImport.name.includes('}')) break
        if (words[index].includes('}')) {
          imports.push({
            path,
            isModule: true,
            name: sanitizeString(words[index], ['{', '}'])
          })
          break
        }
      } else {
        imports.push({
          path,
          isModule: true,
          name: sanitizeString(words[index], ['{', '}']),
          alias: sanitizeString(words[index + 2], ['{', '}'])
        })
        index += 2
        if (words[index].includes('}')) break
      }
    }
  }

  if (line.includes('*')) {
    const aliasIndex = words.indexOf('as') + 1
    imports.push({
      path,
      isModule: false,
      name: sanitizeString(words[aliasIndex], ['{', '}']),
      alias: sanitizeString(words[aliasIndex], ['{', '}'])
    })
  }

  return imports.filter((im) => im.name !== '' || (im.alias && im.alias !== ''))
}

const sanitizeString = (str, charsToRemove) => {
  charsToRemove.forEach((char) => {
    str = str.replace(char, '')
  })

  return str
}

export const hasScopeType = (type) => {
  return type === 'for' ||
  type === 'cond' ||
  type === 'switch' ||
  type === 'while' ||
  type === 'obj' ||
  type === 'func'
}

export const mergeContentArray = (contents) => {
  return contents.reduce((line, string) => {
    return string + line
  }, '')
}
