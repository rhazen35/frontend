import store from '../../../store/store';
import MercureSubscriber from '../../mercure/subscriber'
import UserData from './userData'

class UserSubscriber {
    getUsers() {
        const topic = 'get_users_result';
        const hasTopic = store.getters.hasTopic(topic)

        if (hasTopic) {
            return
        }

        const eventSource = MercureSubscriber.subscribe(topic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (topic !== data.channel) {
                return
            }

            if (Object.prototype.hasOwnProperty.call(data,'users')) {
                store.commit('loading', false)
                store.commit('totalItems', data.users.totalHits)
                store.commit('items', data.users.items)
            }
        }
    }
    userCreated() {
        const topic = 'user_created';
        const hasTopic = store.getters.hasTopic('user_created')

        if (hasTopic) {
            return
        }

        const eventSource = MercureSubscriber.subscribe(topic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (topic !== data.channel) {
                return
            }

            UserData.getData()

            store.commit('setSnackbar', {
                title: 'User created',
                text: 'A new user has been created',
                color: 'success',
                icon: 'check-bold',
                show: true
            })
        }
    }
    userDeleted() {
        const topic = 'user_deleted';
        const hasTopic = store.getters.hasTopic('user_deleted')

        if (hasTopic) {
            return
        }

        const eventSource = MercureSubscriber.subscribe(topic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (topic !== data.channel) {
                return
            }

            UserData.getData()

            store.commit('setSnackbar', {
                title: 'User deleted',
                text: 'A user has been deleted',
                color: 'success',
                icon: 'check-bold',
                show: true
            })
        }
    }
}

export default new UserSubscriber()