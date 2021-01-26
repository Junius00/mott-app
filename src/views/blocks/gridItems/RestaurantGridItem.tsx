import { Grid, Typography, Button, Paper } from "@material-ui/core";
import { isMobile } from "react-device-detect";
import Restaurant from "../../../models/restaurant/Restaurant";
import styles from "../../styles";
import PopUpMenu from "../popups/PopUpMenu";

type RestaurantGridItemProps = {
    restaurant: Restaurant,
    setPopUpChild: (child: JSX.Element) => void,
    togglePopUp: () => void
}
export default function RestaurantGridItem(props: RestaurantGridItemProps) {
    function displayMenu() {
        props.setPopUpChild((<PopUpMenu restaurant={props.restaurant} />));
        props.togglePopUp();
    }
    return (
        //3 columns if desktop, single column if mobile
        <Grid
            item
            xs={isMobile ? 12 : 4}
            container
            direction='column'
        >
            <Paper
                elevation={1}
                className={styles().padContent}
                style={
                    {
                        minHeight: '14vh',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'column'
                    }
                }
            >
                <Grid
                    item
                >
                    <Typography 
                        variant='h6'
                    >
                        {props.restaurant.name}
                    </Typography>
                    <Typography
                        variant='subtitle2'
                    >
                        closes at {props.restaurant.closingTime}
                    </Typography>
                </Grid>
                <Grid
                    item
                >
                    <Button
                        variant='outlined'
                        fullWidth
                        onClick={displayMenu}
                    >
                        where's the menu at?
                    </Button>
                </Grid>
            </Paper>
        </Grid>
    );
}