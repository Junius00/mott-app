import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { userExit } from '../../../services/api/usersServices';
import { SessionStorageKeys } from '../../../sessionStorage/storageKeys';
import { getFromSessionStorage, getRefreshTokenFromStorage, logoutComplete } from '../../../sessionStorage/storageServices';

interface PopUpOptionsProps {

}

interface PopUpOptionsState {
    redirect: boolean,
    redirectPath: string
}


export default class PopUpOptions extends React.Component<PopUpOptionsProps, PopUpOptionsState> {
    constructor(props: PopUpOptionsProps) {
        super(props);
        this.state = {
            redirect: false,
            redirectPath: '/'
        };

        this.redirect = this.redirect.bind(this);
        this.logout = this.logout.bind(this);
    }

    redirect(path: string) {
        this.setState({
            redirect: true,
            redirectPath: path
        });
    }

    async logout() {
        await userExit(getRefreshTokenFromStorage()!);
        logoutComplete();
        this.redirect('/login');
    }

    render() {
        const username = getFromSessionStorage(SessionStorageKeys.username);
        
        if (this.state.redirect) return (<Redirect to={this.state.redirectPath} />);
        return (
            <List>
                <ListItem>
                    <Typography
                        variant='h4'
                    >
                        hello, {username}!
                    </Typography>
                </ListItem>
                <ListItem
                    button
                    onClick={() => this.redirect('/orders')}
                >

                    <ListItemText primary='view past orders' />
                </ListItem>
                <ListItem
                    button
                    onClick={this.logout}
                >

                    <ListItemText primary='log out :(' />
                </ListItem>
            </List>
        );
    }
}
