class DataHelper {
  constructor (data) {
    this.data = data
  }

  _createChildren (data) {
    data.map(obj => {
      if (obj.type === 'Folder') {
        obj['children'] = []
      }
      return obj
    })
  }

  _mountFolder (data) {
    const newData = []
    data.map(obj => {
      if (obj.parentFolder === '/') {
        newData.push(obj)
      }
      data.map(newObj => {
        if (obj.parentFolder === newObj.key) {
          newObj.children.push(obj)
        }
        return newObj
      })
      return obj
    })
    return newData
  }

  mountData = () => {

    this.data.push({
      key:'Documents',
      label: 'Documents',
      type: 'Folder',
      parentFolder: '/',
    })

    this._createChildren(this.data)
    const newData = this._mountFolder(this.data)

    return newData
  }
}

export default DataHelper
