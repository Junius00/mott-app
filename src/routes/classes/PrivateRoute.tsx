import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export interface PrivateRouteProps extends RouteProps {
    authed: boolean,
    authPath: string
};

export default class PrivateRoute extends Route<PrivateRouteProps> {
    render() {
        if (!this.props.authed) {
            const renderComponent = () => (<Redirect to={{pathname: this.props.authPath}} />);
            return <Route {...this.props} component={renderComponent} render={undefined} />;
        }

        return <Route {...this.props} />;
    }
}