import React from 'react';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Button, Divider, List, ListItem, Typography } from '@material-ui/core';
import CenteredPaper from '../../blocks/general/CenteredPaper';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Redirect } from 'react-router-dom';
import { nonHookStyles } from '../../styles';

type selectionPageState = {
    redirect: boolean,
    date: Date | null
}

export default class SelectionPage extends React.Component<{}, selectionPageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            redirect: false,
            date: new Date()
        };

        this.redirect = this.redirect.bind(this);
        this.getNow = this.getNow.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
    }
    
    redirect() {
        this.setState({ redirect: true });
    }
    
    getNow() {
        this.setState({ date: new Date() });
        this.redirect();
    }
    
    onDateChange(date: MaterialUiPickersDate) {
        this.setState({ date: date });
    }
    render() {
        if (this.state.redirect) {
            return (<Redirect to={{
                pathname: '/',
                state: { date: this.state.date }
            }} /> );
        }
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <CenteredPaper>
                    <List>
                        <ListItem
                            style={nonHookStyles.centerItems}
                        >
                            <Typography
                                align='center'
                                variant='h2'
                            >
                                get your fix now.
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Button
                                variant='outlined'
                                color='primary'
                                onClick={this.getNow}
                                fullWidth
                            >
                                NOW!
                            </Button>
                        </ListItem>
                        <ListItem
                            style={nonHookStyles.centerItems}
                        >
                            <Typography
                                variant='subtitle2'
                            >
                                (or later, we won't judge)
                            </Typography>   
                        </ListItem>
                        <ListItem>
                            <DateTimePicker
                                value={this.state.date}
                                onChange={this.onDateChange}
                                style={
                                    { 
                                        marginRight: '20px',
                                        width: '380px'
                                    }
                                }
                                allowKeyboardControl={false}
                            />
                            <Divider 
                                orientation='vertical'
                            />
                            <Button
                                variant='outlined'
                                color='secondary'
                                fullWidth
                                onClick={this.redirect}
                            >
                                LATER!
                            </Button>
                        </ListItem>
                    </List>            
                </CenteredPaper>
            </MuiPickersUtilsProvider>
        );
    }
}