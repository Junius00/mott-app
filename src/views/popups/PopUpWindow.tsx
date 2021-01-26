import { Container, Drawer, Grid, IconButton, List } from "@material-ui/core";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React, { ComponentProps } from "react";
import styles, { nonHookStyles } from "../styles";

interface PopUpProps extends ComponentProps<any> {
    popUpChild: JSX.Element | null,
    open: boolean,
    anchor: 'top' | 'bottom' | 'left' | 'right'
}

export default function PopUpWindow(props: PopUpProps) {
    const anchorIcons: { [key: string]: JSX.Element } = {
        'top': (<ExpandLessIcon />),
        'bottom': (<ExpandMoreIcon />),
        'left': (<ChevronLeftIcon />),
        'right': (<ChevronRightIcon />)
    }
    const button = (<Grid item xs={12} className={styles().centerItems}>
        <IconButton
            edge='end'
            onClick={props.togglePopUp}
            disableRipple
            style={{ backgroundColor: 'transparent' }}
        >
            {anchorIcons[props.anchor]}
        </IconButton>
    </Grid>);
    const child = (<Grid item xs={12} className={styles().centerItems}>
        {props.popUpChild}
    </Grid>);
    
    const anchorDisplay: { [key: string]: JSX.Element } = {
        'top': (
            <Grid container>
                {child}
                {button}
            </Grid>
        ),
        'bottom': (
            <Grid container>
                {button}
                {child}
            </Grid>
        ),
        'left': (
            <List style={nonHookStyles.horizontalList}>
                {child}
                {button}
            </List>
        ),
        'right': (
            <List style={nonHookStyles.horizontalList}>
                {button}
                {child}
            </List>
        )
    }
    return (
        <Drawer open={props.open} anchor={props.anchor}>
            <Container>
                {anchorDisplay[props.anchor]}
            </Container>
        </Drawer>
    );
}