import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { checkAuth } from "../sessionStorage/storageServices";
import MainPage from '../views/pages/main/MainPage';
import OrdersPage from '../views/pages/main/OrdersPage';
import OrderViewPage from '../views/pages/main/OrderViewPage';
import LoginPage from "../views/pages/userEntry/LoginPage";
import RegisterPage from "../views/pages/userEntry/RegisterPage";
import PrivateRoute from './classes/PrivateRoute';

type routesState = {
    refreshAuthCalled: boolean,
    authed: boolean
}
export default class Routes extends React.Component<{}, routesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            refreshAuthCalled: false,
            authed: checkAuth()
        }
        this.refreshAuth = this.refreshAuth.bind(this);
    }

    refreshAuth() {
        this.setState({ authed: checkAuth() });
    }

    render() {
        if (this.state.refreshAuthCalled) this.refreshAuth();
        const authPath = '/login';

        return (
            <BrowserRouter>
                <PrivateRoute exact path='/' authed={this.state.authed} authPath={authPath} component={MainPage} />
                <PrivateRoute path='/restaurants' authed={this.state.authed} authPath={authPath} render={props => <MainPage {...props}/>} />
                <PrivateRoute exact path='/orders' authed={this.state.authed} authPath={authPath} render={props => <OrdersPage />} />
                <PrivateRoute path='/orders/view' authed={this.state.authed} authPath={authPath} render={props => <OrderViewPage {...props} />} />
                <Route path='/login'>
                    <LoginPage refreshAuth={this.refreshAuth} />
                </Route>
                <Route path='/register' refreshAuth={this.refreshAuth}>
                    <RegisterPage refreshAuth={this.refreshAuth} />
                </Route>
            </BrowserRouter>
        );
    }
}