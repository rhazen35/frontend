import store from '../../../store/store'

class UserData {
    getData() {
        store.commit('loading', true);

        const { sortBy, sortDesc, page, itemsPerPage } = store.getters.table.options

        let sortOrder = [];
        if (0 !== sortDesc.length) {
            for (const sort of sortDesc) {
                sortOrder.push(sort ? 'desc': 'asc')
            }
        }

        store.dispatch(
            'getUsers',
            {
                sortBy: sortBy,
                sortOrder: sortOrder,
                page: page,
                itemsPerPage: itemsPerPage,
                search: store.getters.table.search
            }
        )
    }
}

export default new UserData()