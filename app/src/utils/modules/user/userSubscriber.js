import store from '../../../store/store';
import MercureSubscriber from '../../mercure/subscriber'
import UserData from './userData'
import {setDefaultFavicon, setFavicon} from "../../helpers/favicon";

class UserSubscriber {
    getUsersResultTopic
    userCreatedTopic
    userDeletedTopic

    constructor() {
        this.getUsersResultTopic = 'get_users_result'
        this.userCreatedTopic = 'user_created'
        this.userDeletedTopic = 'user_deleted'
    }

    getUsers() {
        const eventSource = MercureSubscriber.subscribe(this.getUsersResultTopic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.channel !== this.getUsersResultTopic) {
                return
            }

            if (Object.prototype.hasOwnProperty.call(data,'users')) {
                store.commit('user/loading', false)
                store.commit('user/totalItems', data.users.totalHits)
                store.commit('user/items', data.users.items)

                setDefaultFavicon()
                document.title = 'User Management'
            }
        }
    }
    userCreated() {
        const eventSource = MercureSubscriber.subscribe(this.userCreatedTopic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.channel !== this.userCreatedTopic) {
                return
            }

            UserData.getData()

            store.commit('user/setSnackbar', {
                title: 'User created',
                text: 'A new user has been created',
                color: 'success',
                icon: 'check-bold',
                show: true
            })

            setFavicon('user_checked')
            setTimeout(() => {
                setDefaultFavicon()
                document.title = 'User Management'
            }, store.getters['user/snackbar'].timeout)
        }
    }
    userDeleted() {
        const eventSource = MercureSubscriber.subscribe(this.userDeletedTopic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.channel !== this.userDeletedTopic) {
                return
            }

            UserData.getData()

            store.commit('user/setSnackbar', {
                title: 'User deleted',
                text: 'A user has been deleted',
                color: 'success',
                icon: 'check-bold',
                show: true
            })

            setDefaultFavicon()
            document.title = 'User Management'
        }
    }
}

export default new UserSubscriber()