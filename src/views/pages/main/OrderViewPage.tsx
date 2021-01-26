import { RouteComponentProps } from 'react-router-dom';
import { Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import Order from '../../../models/order/Order';
import { getRestaurantNameById } from '../../../services/api/restaurantsServices';
import { getAuthTokenFromStorage } from '../../../sessionStorage/storageServices';
import BoxWithAppBar from '../../blocks/general/BoxWithAppBar';
import CenteredPaper from '../../blocks/general/CenteredPaper';
import React from 'react';

interface OrderViewPageProps extends RouteComponentProps {}
interface OrderViewPageState {
    listChildren: JSX.Element[],
    loading: boolean
}
export default class OrderViewPage extends React.Component<OrderViewPageProps, OrderViewPageState> {
    constructor(props: OrderViewPageProps) {
        super(props);
        this.state = {
            listChildren: [],
            loading: false
        }

        this.getListChildren = this.getListChildren.bind(this);
    }

    componentDidMount() {
        console.log('mount');
        this.getListChildren();
    }
    
    async getListChildren() {
        const state: any = this.props.location.state;
        if (!state) return;
        const order: Order = new Order(state.order);

        const orderById = order.getOrderByRestaurantIds();
        let listChildren: Array<JSX.Element> = [];

        this.setState({ loading: true });
        for (let restaurantId in orderById) {
            const sets = orderById[restaurantId];

            const apiResponse = await getRestaurantNameById(getAuthTokenFromStorage()!, restaurantId);
            if (!apiResponse.success) continue;
            const restaurantName = apiResponse.body!.restaurantId.name;
            if (!restaurantName) continue;

            const element = (
                <Grid item xs={12} key={restaurantId}>
                    <List>
                        <ListItem>
                            <Typography variant='h6'>from {restaurantName}</Typography>
                        </ListItem>
                        {sets.map(setQ => {
                            const set = setQ.set;

                            return (
                                <ListItem key={set.name}>
                                    <ListItemText primary={set.name} secondary={`${set.price.currency} ${set.price.value}`}/>
                                    <ListItemAvatar>
                                        <Typography>{setQ.quantity}</Typography>
                                    </ListItemAvatar>
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
            );

            listChildren.push(element);
        }

        this.setState({
            listChildren: listChildren,
            loading: false
        });
    }

    render() {
        return (
            <BoxWithAppBar backPath='/orders'>
                <CenteredPaper>
                    <Container>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant='h4'>here's that order you made.</Typography>
                            </Grid>
                            {
                                this.state.listChildren.length > 0 
                                ? this.state.listChildren 
                                : <Typography>
                                    {
                                        this.state.loading
                                        ? 'making it pretty for you to admire.'
                                        : "couldn't get anything. try again later?"
                                    }
                                </Typography>
                            }
                        </Grid>
                    </Container>
                </CenteredPaper>
            </BoxWithAppBar>
        );
    }
        
}