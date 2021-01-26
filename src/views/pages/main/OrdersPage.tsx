import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import CenteredPaper from "../../blocks/general/CenteredPaper";
import ApiResponse from '../../../services/classes/ApiResponse';
import { getUserOrders } from '../../../services/api/usersServices';
import Order from '../../../models/order/Order';
import { nonHookStyles } from '../../styles';
import { ChevronRight } from '@material-ui/icons';
import BoxWithAppBar from '../../blocks/general/BoxWithAppBar';
import { Redirect } from 'react-router-dom';

interface OrdersPageContentProps {

}

interface OrdersPageContentState {
    orders: Order[],
    redirect: boolean,
    redirectOrder: Order | null
}

class OrdersPageContent extends React.Component<OrdersPageContentProps, OrdersPageContentState> {
    constructor(props: OrdersPageContentProps) {
        super(props);
        this.state = {
            orders: [],
            redirect: false,
            redirectOrder: null
        }

        this.redirect = this.redirect.bind(this);
        this.fetchOrders = this.fetchOrders.bind(this);
    }

    componentDidMount() {
        this.fetchOrders();
    }

    componentDidUpdate() {
        this.fetchOrders();
    }

    redirect(order: Order) {
        this.setState({
            redirect: true,
            redirectOrder: order
        });
    }

    async fetchOrders() {        
        const apiResponse: ApiResponse = await getUserOrders();
        if (!apiResponse.success) return;

        const orders = apiResponse.body!.orderByIds as Order[];
        this.setState({ orders: orders });
    }

    render() {
        if (this.state.redirect) return (<Redirect to={{
            pathname: '/orders/view',
            state: { order: this.state.redirectOrder }
        }} />);

        return (
            <CenteredPaper>
                <List>
                    <ListItem style={nonHookStyles.centerItems}>
                        <Typography variant='h4'>
                            fancy reminiscing the past?
                        </Typography>
                    </ListItem>
                    {   
                        this.state.orders.length > 0
                        ? this.state.orders.map(order => {
                            return (
                                <ListItem
                                    key={order._id}
                                    button
                                    onClick={() => this.redirect(order)}
                                >
                                    <ListItemText 
                                        primary={`Order #${order._id}`} 
                                        secondary={`you paid a total of ${order.total.currency} ${order.total.value}`}
                                    />
                                    <ListItemAvatar>
                                        <ChevronRight />
                                    </ListItemAvatar>
                                </ListItem>
                            );
                        })
                        : <ListItem><ListItemText primary="wait, i'm not getting anything..." /></ListItem>
                    }
                </List>
            </CenteredPaper>
        );
    }
}

interface OrdersPageProps {}

export default function OrdersPage (props: OrdersPageProps) {
    return (
        <BoxWithAppBar backPath='/'>
            <OrdersPageContent />
        </BoxWithAppBar>
    );
}