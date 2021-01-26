import { Button, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { ToastsStore } from 'react-toasts';
import Price from '../../../models/restaurant/Price';
import { getRestaurantNameById } from '../../../services/api/restaurantsServices';
import { getAuthTokenFromStorage } from '../../../sessionStorage/storageServices';
import { order } from '../../../values/global';
import SetRefCounter from './SetRefCounter';

interface PopUpOrderState {
    listChildren: Array<JSX.Element>,
    priceTotal: number,
    priceCurrency: string
};

export default class PopUpOrder extends React.Component<{}, PopUpOrderState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            listChildren: [],
            priceTotal: 0,
            priceCurrency: ''
        };

        this.setListChildren = this.setListChildren.bind(this);
    }

    componentDidMount() {
        this.setListChildren();
    }

    async setListChildren() {
        const orderById = order.getOrderByRestaurantIds();
        let listChildren: Array<JSX.Element> = [];
        let total = 0;
        let currency = '';

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
                            total = total + setQ.set.price.value * setQ.quantity;
                            currency = setQ.set.price.currency;

                            return (
                                <ListItem>
                                    <ListItemText primary={setQ.set.name} secondary={`${setQ.set.price.currency} ${setQ.set.price.value}`}/>
                                    <ListItemSecondaryAction>
                                        <SetRefCounter set={setQ.set} refreshFunction={this.setListChildren}/>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
            );

            listChildren.push(element);
        }
        order.setTotal(new Price({
            currency: currency,
            value: total
        }));

        this.setState({ listChildren: listChildren, priceTotal: total, priceCurrency: currency });

    }

    async submitOrder() {
        const response = await order.commit();
        if (response.success) {
            this.setListChildren();
            ToastsStore.info('order has been sent. hurrah!');

            return;
        }

        ToastsStore.error('failed. try again?');
        return;
    }

    render() {
        const listChildren = this.state.listChildren;
        const confirmOrderRow = (<Grid item xs={12} container sm={12}>
            <Grid item sm={3}>
                <Typography>satisfied?</Typography>
            </Grid>
            <Grid item sm={9}>
                <Button 
                    variant='outlined' 
                    fullWidth
                    onClick={async () => await this.submitOrder()}
                >
                    pay a fat total of {this.state.priceCurrency} {this.state.priceTotal}
                </Button>
            </Grid>
        </Grid>);

        const orderExists = listChildren.length > 0;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='h4' align='center'>here's your receipt.</Typography>
                </Grid>
                {orderExists ? listChildren : <Grid item xs={12}>
                        <ListItemText primary='nothing ordered yet.' secondary='how sad.' />
                    </Grid>}
                {orderExists ? confirmOrderRow : null}
            </Grid>
        );
    }
}
