import store from '../../../store/store'
import {setFavicon} from "../../helpers/favicon";

class UserData {
    getData() {
        setFavicon('get_users')
        document.title = 'User Management | Loading...'
        store.commit('user/loading', true);

        const { sortBy, sortDesc, page, itemsPerPage } = store.getters['user/options']

        let sortOrder = [];
        if (0 !== sortDesc.length) {
            for (const sort of sortDesc) {
                sortOrder.push(sort ? 'desc': 'asc')
            }
        }

        store.dispatch(
            'user/getUsers',
            {
                sortBy: sortBy,
                sortOrder: sortOrder,
                page: page,
                itemsPerPage: itemsPerPage,
                search: store.getters['user/table'].search
            }
        )
    }
}

export default new UserData()