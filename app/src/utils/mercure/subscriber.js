import store from '../../store/store';

class Subscriber {
  constructor() {
    this.url = new URL('http://127.0.0.1:3000/.well-known/mercure')
  }

  subscribe(newTopic) {
    if (this.hasTopic(newTopic)) {
      return null
    }

    this.url.searchParams.append('topic', `http://127.0.0.1:3000/.well-known/mercure/${newTopic}`)

    const topics = store.getters['mercureSubscriber/topics']
    for (let topic of topics) {
      this.url.searchParams.append('topic', `http://127.0.0.1:3000/.well-known/mercure/${topic}`)
    }

    store.dispatch('mercureSubscriber/addTopic', newTopic)

    return new EventSource(this.url)
  }

  hasTopic(topic) {
    return store.getters['mercureSubscriber/hasTopic'](topic)
  }
}

export default new Subscriber()