import {Router, Switch, Route} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import LandingPage from '../pages/LandingPage';
import AssetsPage from '../pages/AssetsPage';

import PrivateRoute from './PrivateRoute';
import {history} from '../services/history';
function Routes(){



    return(
        <Router history={history}>
            <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <PrivateRoute exact path="/" component={LandingPage}/>
                <PrivateRoute exact path="/assets" component={AssetsPage}/>
            </Switch>
        </Router>
    );
}


export default Routes;