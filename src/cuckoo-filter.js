const BaseFilter = require('./base-filter')

class CuckooFilter extends BaseFilter {
  constructor(name, options = {}) {
    super(name, options)
  }

  async reserve() {
    try {
      await this.client.call('CF.RESERVE', this.name, this.options.minCapacity)
    } catch (err) {
      if (err.message === 'ERR item exists') return // ignore the error if the filter is already created
      throw err
    }
  }

  async add(item, notExistsOnly = true) {
    const command = notExistsOnly ? 'CF.ADDNX' : 'CF.ADD'
    return this.client.call(command, this.name, item)
  }

  async exists(item) {
    return this.client.call('CF.EXISTS', this.name, item)
  }

  async count(item) {
    return this.client.call('CF.COUNT', this.name, item)
  }

  async remove(item) {
    return this.client.call('CF.DEL', this.name, item)
  }
}

module.exports = CuckooFilter