import store from '../../../store/store'
import MercureSubscriber from '../../mercure/subscriber'

class AuthenticationSubscriber {
    userAuthenticatedTopic
    tokenExpiredTopic
    invalidCredentialsTopic

    constructor() {
        this.userAuthenticatedTopic = 'user_authenticated'
        this.tokenExpiredTopic = 'tokenExpired'
        this.invalidCredentialsTopic = 'invalid_credentials'
    }

    tokenExpired() {
        const eventSource = MercureSubscriber.subscribe(this.tokenExpiredTopic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (Object.prototype.hasOwnProperty.call(data,'token')) {
                this.overlay = true
                this.$store.commit('authentication/loginExpiredDialog', true)

                this.delay(5000)
                    .then(() => {
                        store.commit('authentication/loginExpiredDialog', false)
                        store.dispatch('authentication/logout')
                    })
            }
        }
    }

    authenticated() {
        const eventSource = MercureSubscriber.subscribe(this.userAuthenticatedTopic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (Object.prototype.hasOwnProperty.call(data, 'token')) {
                store.dispatch('authentication/login', data.token)
            }

            store.commit('authentication/showOverlay', false)
        }
    }

    invalidCredentials() {
        const eventSource = MercureSubscriber.subscribe(this.invalidCredentialsTopic)

        if (null === eventSource) {
            return
        }

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (Object.prototype.hasOwnProperty.call(data, 'errors')) {
                data.errors.forEach((error) => {
                    if ("" === error.propertyPath) {
                        store.commit('authentication/globalError', error.message)
                        store.commit(
                            'authentication/snackbar',
                            {
                                title: 'Validation error',
                                text: 'The form contains validation errors',
                                color: 'error',
                                icon: 'alert-circle',
                                show: true
                            }
                        )
                    }
                });
            }

            store.commit('authentication/showOverlay', false)
        }
    }

    delay(timer, value) {
        return new Promise((resolve) => {
            setTimeout(resolve.bind(null, value), timer)
        });
    }
}

export default new AuthenticationSubscriber()