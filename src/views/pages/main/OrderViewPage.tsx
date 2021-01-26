import { useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { CircularProgress, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import Order from '../../../models/order/Order';
import { getRestaurantNameById } from '../../../services/api/restaurantsServices';
import { getAuthTokenFromStorage } from '../../../sessionStorage/storageServices';
import BoxWithAppBar from '../../blocks/general/BoxWithAppBar';
import CenteredPaper from '../../blocks/general/CenteredPaper';

interface OrderViewPageProps extends RouteComponentProps {}

export default function OrderViewPage(props: OrderViewPageProps) {
    const [ listChildren, setListChildren ] = useState<JSX.Element[]>([]);

    const state: any = props.location.state;
    if (!state) return (<Redirect to='/orders' />);
    const order: Order = new Order(state.order);

    async function getListChildren() {
        const orderById = order.getOrderByRestaurantIds();
        let listChildren: Array<JSX.Element> = [];

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

        setListChildren(listChildren);
    }

    getListChildren();

    return (
        <BoxWithAppBar backPath='/orders'>
            <CenteredPaper>
                <Container>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant='h4'>here's that order you made.</Typography>
                        </Grid>
                        {
                            listChildren.length > 0 
                            ? listChildren 
                            : <Typography>making it pretty for you to admire.</Typography>
                        }
                    </Grid>
                </Container>
            </CenteredPaper>
        </BoxWithAppBar>
    );
}