import { makeStyles } from "@material-ui/core";

export const nonHookStyles = {
    boxCenter: {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        spacing: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerItems: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    padContent: {
        padding: '20px'
    },
    horizontalList: {
        display: 'flex',
        flexDirection: 'row' as const,
        padding: '0px',
    }
};

const styles = makeStyles(nonHookStyles);

export default styles;