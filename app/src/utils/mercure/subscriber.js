import store from '../../store/store';

class Subscriber {
  constructor() {
    this.url = new URL('http://127.0.0.1:3000/.well-known/mercure')
  }

  subscribe(topics) {
    this.registerTopics(topics)

    const eventSource = new EventSource(this.url)
    store.dispatch('setEventSource', eventSource)

    return eventSource
  }

  registerTopics(topics) {

    for (let topic of topics) {
      this.url.searchParams.append('topic', `http://127.0.0.1:3000/.well-known/mercure/${topic}`)
      store.dispatch('addToTopics', topic)
    }
  }
}

export default new Subscriber()