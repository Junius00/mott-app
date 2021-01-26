import { IconButton, List, ListItem, Typography } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { order } from '../../../values/global';
import { nonHookStyles } from '../../styles';
import Set from '../../../models/restaurant/Set';

interface SetRefCounterProps {
    set: Set,
    refreshFunction?: () => Promise<void>
}

interface SetRefCounterState {}

export default class SetRefCounter extends React.Component<SetRefCounterProps, SetRefCounterState> {
    constructor(props: SetRefCounterProps) {
        super(props);
        this.state = {};

        this.modify = this.modify.bind(this);
    }

    async modify(count: number) {
        await order.modifySetQuantityById(this.props.set, count);
        if (this.props.refreshFunction) await this.props.refreshFunction();
        this.setState({});
    }

    render() {
        const setId = this.props.set._id;
        return (
            <List style={nonHookStyles.horizontalList}>
                <ListItem>
                    <IconButton
                        onClick={() => this.modify(-1)}
                    >
                        <RemoveIcon />
                    </IconButton>
                </ListItem>
                <ListItem>
                    <Typography>{order.getSetQuantityById(setId)}</Typography>
                </ListItem>
                <ListItem>
                    <IconButton
                        onClick={() => this.modify(1)}
                    >
                        <AddIcon />
                    </IconButton>
                </ListItem>
            </List>
        );
    }
}