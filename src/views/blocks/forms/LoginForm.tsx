import React from 'react';
import { Button, List, ListItem, TextField, Typography } from "@material-ui/core";
import { loginFormState } from '../../../types';
import ApiResponse from '../../../services/classes/ApiResponse';
import { userEntry } from '../../../services/api/usersServices';
import { authComplete } from '../../../sessionStorage/storageServices';
import { Redirect } from 'react-router-dom';

export default class LoginForm extends React.Component<{ refreshAuth: () => void }, loginFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            redirect: false,
            redirectPath: '',
            hasError: false,
            errorMsg: '',
            username: '',
            password: ''
        };

        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onUsernameChange(event: any) {
        this.setState({username: event.target.value});
    }

    onPasswordChange(event: any) {
        this.setState({password: event.target.value});
    }

    clearForm() {
        this.setState({username: '', password: ''});
    }

    async onSubmit(event: any) {
        event.preventDefault();

        const apiResponse: ApiResponse = await userEntry(
            this.state.username,
            this.state.password,
            'login'
        );

        const username = this.state.username;

        this.clearForm();
        
        if (!apiResponse.success) {
            this.setState({
                hasError: true,
                errorMsg: apiResponse.error
            });
            return;
        }

        const body = apiResponse.body!;

        const loginResponse = {
            username: username,
            userId: body.userId,
            accessToken: body.accessToken,
            refreshToken: body.refreshToken
        }
        //store JWT and set isAuthed to true in session storage
        authComplete(loginResponse);
        
        //force Routes to check whether authentication is complete
        this.props.refreshAuth();
        this.setState({ redirect: true, redirectPath: '/' });
    }

    render() {
        //redirect upon successful login or register button is clicked
        const { redirect, redirectPath } = this.state;
        if (redirect) return (<Redirect to={redirectPath} />);

        const errorTypography = <Typography
            align='center'
            variant='subtitle2'
            color='secondary'
        >
            {this.state.errorMsg}
        </Typography>;
        
        return (
            <form onSubmit={this.onSubmit}>
                <List>
                    <ListItem>
                        <TextField
                            fullWidth
                            required
                            id='login-username'
                            variant='outlined'
                            label='username'
                            value={this.state.username}
                            onChange={this.onUsernameChange}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            fullWidth
                            required
                            id='login-password'
                            variant='outlined'
                            type='password'
                            label='password'
                            value={this.state.password}
                            onChange={this.onPasswordChange}
                        />
                    </ListItem>
                    <ListItem>
                        {this.state.hasError ? errorTypography : null}
                    </ListItem>
                    <ListItem>
                        <Button
                            variant='outlined'
                            id='login-submit'
                            type='submit'
                            fullWidth
                            color='primary'
                        >
                            log me in
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            variant='outlined'
                            id='login-register'
                            fullWidth
                            color='secondary'
                            onClick={() => {
                                this.setState({
                                    redirect: true,
                                    redirectPath: '/register'
                                })
                            }}
                        >
                            wait, i'm new!
                        </Button>
                    </ListItem>
                </List>
            </form>
        );
    }
}
