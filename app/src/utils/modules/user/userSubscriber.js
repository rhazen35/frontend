import store from '../../../store/store';
import MercureSubscriber from '../../mercure/subscriber'

class UserSubscriber {
    getUsers() {
        const hasTopic = store.getters.hasTopic('get_users_result')
        const eventSource = !hasTopic
            ? MercureSubscriber.subscribe(['get_users_result'])
            : store.getters['getEventSource']

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (Object.prototype.hasOwnProperty.call(data,'users')) {
                store.commit('loading', false)
                store.commit('totalItems', data.users.totalHits)
                store.commit('items', data.users.items)
            }
        }
    }
}

export default new UserSubscriber()