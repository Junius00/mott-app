import { Button, List, ListItem, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Redirect } from "react-router-dom";
import { userEntry } from "../../../services/api/usersServices";
import ApiResponse from "../../../services/classes/ApiResponse";
import { authComplete } from "../../../sessionStorage/storageServices";
import { registerFormState } from "../../../types";

export default class RegisterForm extends React.Component<{ refreshAuth: () => void }, registerFormState> {
    constructor(props: any) {
        super(props);
        this.state = {
            redirect: false,
            redirectPath: '',
            hasError: false,
            errorMsg: '',
            username: '',
            password: '',
            confirmPassword: '',
            loading: false
        };

        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onUsernameChange(event: any) {
        this.setState({username: event.target.value});
    }

    onPasswordChange(event: any) {
        this.setState({password: event.target.value});
    }

    onConfirmPasswordChange(event: any) {
        this.setState({confirmPassword: event.target.value});
    }

    clearForm() {
        this.setState({username: '', password: '', confirmPassword: ''});
    }

    throwError(errorMsg: string) {
        this.setState({
            hasError: true,
            errorMsg: errorMsg,
            loading: false
        });
    }

    async onSubmit(event: any) {
        event.preventDefault();

        if (this.state.confirmPassword !== this.state.password) {
            this.throwError('passwords should match, man.');
            return;
        }

        this.setState({ loading: true });
        const apiResponse: ApiResponse = await userEntry(
            this.state.username,
            this.state.password,
            'register'
        );
        
        const username = this.state.username;
        this.clearForm();

        if (!apiResponse.success) {
            this.throwError(apiResponse.error!);
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
        this.setState({ redirect: true, redirectPath: '/', loading: false });
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
        
        const loadingTypography = <Typography
            align='center'
            variant='subtitle2'
        >
            checking with our bosses...
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
                        <TextField
                            fullWidth
                            required
                            id='login-password'
                            variant='outlined'
                            type='password'
                            label='confirm password'
                            value={this.state.confirmPassword}
                            onChange={this.onConfirmPasswordChange}
                        />
                    </ListItem>
                    <ListItem>
                        {this.state.hasError ? errorTypography : null}
                        {this.state.loading ? loadingTypography : null}
                    </ListItem>
                    <ListItem>
                        <Button
                            variant='outlined'
                            id='login-submit'
                            type='submit'
                            fullWidth
                            color='primary'
                        >
                            sign me up
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
                                    redirectPath: '/login'
                                })
                            }}
                        >
                            wait, i'm old!
                        </Button>
                    </ListItem>
                </List>
            </form>
        );
    }
}
