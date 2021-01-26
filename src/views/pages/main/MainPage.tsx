import { AppBar, Box, Container, IconButton, List, ListItem, Toolbar, Tooltip, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RestoreIcon from '@material-ui/icons/Restore';
import SelectionPage from './SelectionPage';
import { DaysOfWeek } from '../../../values/DateValues';
import RestaurantsDisplayGrid from '../../blocks/grids/RestaurantsDisplayGrid';
import { nonHookStyles } from '../../styles';
import PopUpWindow from '../../popups/PopUpWindow';
import { initOrder } from '../../../values/global';
import PopUpOrder from '../../blocks/popups/PopUpOrder';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import PopUpOptions from '../../blocks/popups/PopUpOptions';

interface MainPageContentProps extends MainPageProps {
    togglePopUpMenu: () => void,
    setPopUpMenuChild: (Child: JSX.Element) => void
}
interface MainPageContentState {
    
}

class MainPageContent extends Component<MainPageContentProps, MainPageContentState>  {
    constructor(props: MainPageContentProps) {
        super(props);
        this.state = {
            popUpChild: null
        }
    }

    render() {        
    if (!this.props.location.state) {
            return (
                <SelectionPage />
            );
        }

        //get date out of state
        const state: any = this.props.location.state;
        const date: Date = state.date;
        
        //get time and day out of Date
        const minutes: number = date.getMinutes();
        const minutesStr: string = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
        const time: number = parseInt(`${date.getHours()}${minutesStr}`);
        const day: string = DaysOfWeek[date.getDay()];

        return (
            <Container>
                <List>
                    <ListItem
                        style={nonHookStyles.centerItems}
                    >
                        <Typography
                            align='center'
                            variant='h2'
                        >
                            here's what we recommend.
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <RestaurantsDisplayGrid 
                            time={time} 
                            day={day}
                            setPopUpChild={this.props.setPopUpMenuChild}
                            togglePopUp={this.props.togglePopUpMenu}
                        />
                    </ListItem>
                </List>
            </Container>
        );
    }
}

interface MainPageProps extends RouteComponentProps {}
interface MainPageState {
    shouldPopUpMenu: boolean,
    popUpMenuChild: JSX.Element | null,
    shouldPopUpOrder: boolean,
    shouldPopUpOptions: boolean,
    reset: boolean
}
export default class MainPage extends React.Component<MainPageProps, MainPageState> {
    constructor(props: MainPageProps) {
        super(props);
        this.state = {
            shouldPopUpMenu: false,
            popUpMenuChild: null,
            shouldPopUpOrder: false,
            shouldPopUpOptions: false,
            reset: false
        }

        this.toggleReset = this.toggleReset.bind(this);
        this.togglePopUpMenu = this.togglePopUpMenu.bind(this);
        this.setPopUpMenuChild = this.setPopUpMenuChild.bind(this);
        this.togglePopUpOrder = this.togglePopUpOrder.bind(this);
        this.togglePopUpOptions = this.togglePopUpOptions.bind(this);
    }

    componentDidMount() {
        //set global order cart
        initOrder();
    }

    toggleReset() {
        this.setState({ reset: !this.state.reset });
    }
    togglePopUpMenu() {
        this.setState({
            shouldPopUpMenu: !this.state.shouldPopUpMenu
        })
    }

    setPopUpMenuChild(child: JSX.Element) {
        this.setState({ popUpMenuChild: child });
    }

    togglePopUpOrder() {
        this.setState({
            shouldPopUpOrder: !this.state.shouldPopUpOrder
        });
    }

    togglePopUpOptions() {
        this.setState({
            shouldPopUpOptions: !this.state.shouldPopUpOptions
        });
    }

    render() {
        if (this.state.reset) {
            this.toggleReset();
            return (<Redirect to='/' />);
        }
        
        return (
            <React.Fragment>
                <Box>
                    <AppBar
                        position='sticky'
                        color='primary'
                    >
                        <Toolbar>
                            <IconButton
                                edge='start'
                                onClick={this.togglePopUpOptions}
                                color='inherit'
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                align='center'
                                variant='h6'
                            >
                                mott.
                            </Typography>
                            <div style={{ marginLeft: 'auto' }}>
                                <Tooltip title='Choose another time'>
                                    <IconButton
                                        color='inherit'
                                        onClick={this.toggleReset}
                                    >
                                        <RestoreIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='View Receipt'>
                                    <IconButton
                                        color='inherit'
                                        onClick={this.togglePopUpOrder}
                                    >
                                        <ShoppingCartIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                                
                        </Toolbar>
                    </AppBar>
                    {     
                        //this is the pop up menu for restaurants      
                        <PopUpWindow 
                            open={this.state.shouldPopUpMenu}
                            anchor='bottom'
                            popUpChild={this.state.popUpMenuChild} 
                            togglePopUp={this.togglePopUpMenu}
                        />
                    }
                    {
                        //this is the drawer to show your order
                        <PopUpWindow 
                            open={this.state.shouldPopUpOrder}
                            anchor='top'
                            popUpChild={<PopUpOrder />}
                            togglePopUp={this.togglePopUpOrder}
                        />
                    }
                    {
                        //this is the drawer for user options
                        <PopUpWindow 
                            open={this.state.shouldPopUpOptions}
                            anchor='left'
                            popUpChild={<PopUpOptions />}
                            togglePopUp={this.togglePopUpOptions}
                        />
                    }
                    <MainPageContent
                        {...this.props} 
                        togglePopUpMenu={this.togglePopUpMenu}
                        setPopUpMenuChild={this.setPopUpMenuChild}
                    />
                </Box>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.BOTTOM_CENTER}/>
            </React.Fragment>
        );
    }
}