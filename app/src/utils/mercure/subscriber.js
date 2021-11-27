import store from '../../store/store';

class Subscriber {
  constructor() {
    this.url = new URL('http://127.0.0.1:3000/.well-known/mercure')
  }

  subscribe(newTopic) {
    const hasTopic = store.getters.hasTopic(newTopic)

    if (hasTopic) {
      return null
    }

    this.url.searchParams.append('topic', `http://127.0.0.1:3000/.well-known/mercure/${newTopic}`)

    const topics = store.getters.topics
    for (let topic of topics) {
      this.url.searchParams.append('topic', `http://127.0.0.1:3000/.well-known/mercure/${topic}`)
    }

    store.dispatch('addTopic', newTopic)

    return new EventSource(this.url)
  }
}

export default new Subscriber()