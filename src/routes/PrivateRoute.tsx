import {Route, Redirect} from 'react-router';

export default function PrivateRoute(props:any){
    const isLogged = !!localStorage.getItem('user')
    return isLogged ? <Route {...props}/> : <Redirect to="/login"/>
}   
