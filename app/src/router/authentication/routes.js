import Login from '../../views/authentication/Login';
import Logout from "../../components/authentication/Logout";

export default [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/logout',
        name: 'Logout',
        component: Logout
    },
]