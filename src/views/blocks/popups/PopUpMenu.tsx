import { Grid, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import Restaurant from '../../../models/restaurant/Restaurant';
import Set from '../../../models/restaurant/Set';
import { nonHookStyles } from '../../styles';
import SetRefCounter from './SetRefCounter';

interface PopUpMenuProps {
    restaurant: Restaurant
}

interface PopUpMenuState {

}

interface PopUpMenuListItemProps {
    set: Set,
    refresh: () => void
}

function PopUpMenuListItem(props: PopUpMenuListItemProps) {
    const set = props.set;
    
    return (
        <ListItem>
            <ListItemText 
                primary={set.name}
                secondary={`${set.price.currency} ${set.price.value}`}
            />
            <ListItemSecondaryAction>
                <SetRefCounter set={set} />
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default class PopUpMenu extends React.Component<PopUpMenuProps, PopUpMenuState> {
    constructor(props: PopUpMenuProps) {
        super(props);
        this.state = {};
    
        this.refresh = this.refresh.bind(this);
    }

    refresh() {
        this.setState({});
    }

    render() {
        const restaurant = this.props.restaurant;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <List>
                        <ListItem
                            style={nonHookStyles.centerItems}
                        >
                            <Typography
                                variant='h4'
                            >
                                here's the menu for {restaurant.name}, love.
                            </Typography>
                        </ListItem>
                        {restaurant.sets.map(set => (<PopUpMenuListItem set={set} key={set.name} refresh={this.refresh}/>))}
                    </List>
                </Grid>
            </Grid>
            
        );
    }
}