import { AppBar, Box, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { ComponentProps } from "react";
import { Redirect } from "react-router-dom";

interface BoxWithAppBarProps extends ComponentProps<any> {
    backPath: string
}

interface BoxWithAppBarState {
    redirect: boolean,
    redirectPath: string
}

export default class BoxWithAppBar extends React.Component<BoxWithAppBarProps, BoxWithAppBarState> {
    constructor(props: BoxWithAppBarProps) {
        super(props);
        this.state = {
            redirect: false,
            redirectPath: ''
        };
        this.redirect = this.redirect.bind(this);
    }

    redirect(path: string) {
        this.setState({
            redirect: true,
            redirectPath: path
        });
    }

    render() {
        if (this.state.redirect) return (<Redirect to={this.state.redirectPath} />);
        
        return (
            <Box>
                <AppBar
                    color='primary'
                >
                    <Toolbar>
                        <IconButton
                            color='inherit'
                            edge='start'
                            onClick={() => this.redirect(this.props.backPath)}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography variant='h6'>
                            mott.
                        </Typography>
                    </Toolbar>
                </AppBar>
                {this.props.children}
            </Box>
        );
    }
}