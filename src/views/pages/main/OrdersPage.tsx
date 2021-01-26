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
    redirectOrder: Order | null,
    loading: boolean
}

class OrdersPageContent extends React.Component<OrdersPageContentProps, OrdersPageContentState> {
    //componentDidUpdate checks this to prevent over-requesting
    loading: boolean;

    constructor(props: OrdersPageContentProps) {
        super(props);
        this.state = {
            orders: [],
            redirect: false,
            redirectOrder: null,
            loading: false
        }

        this.loading = false;
        this.redirect = this.redirect.bind(this);
        this.fetchOrders = this.fetchOrders.bind(this);
    }

    componentDidMount() {
        this.fetchOrders();
    }

    componentDidUpdate() {
        if (!this.loading) this.fetchOrders();
    }

    redirect(order: Order) {
        this.setState({
            redirect: true,
            redirectOrder: order
        });
    }

    async fetchOrders() {
        this.loading = true;
        this.setState({ loading: true });
        const apiResponse: ApiResponse = await getUserOrders();
        if (!apiResponse.success) {
            this.setState({ loading: false });
            this.loading = false;
            return;
        }

        const orders = apiResponse.body!.orderByIds as Order[];
        this.setState({ orders: orders, loading: false });
        this.loading = false;
    }

    render() {
        if (this.state.redirect) return (<Redirect to={{
            pathname: '/orders/view',
            state: { order: this.state.redirectOrder }
        }} />);

        const waitingText = this.state.loading ? 'grabbing the details real quick...' : "can't seem to find anything. try again later maybe?";
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
                        : <ListItem><ListItemText primary={waitingText} /></ListItem>
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