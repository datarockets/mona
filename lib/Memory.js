const handle = (resolve, reject) => (error, value) => {
  if (error) {
    reject(error)
  } else {
    resolve(value)
  }
}

class Memory {
  constructor(controller) {
    this.memory = controller.storage.brain
  }

  get = (key) => new Promise((resolve, reject) => {
    this.memory.get(key, handle(resolve, reject))
  })

  set = (key, value) => new Promise((resolve, reject) => {
    this.memory.save(
      { id: key, value },
      handle(resolve, reject)
    )
  })
}