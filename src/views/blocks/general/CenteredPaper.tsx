import { Box, Paper } from '@material-ui/core';
import React from 'react';
import styles from '../../styles';

export default function CenteredPaper(props: any) {
    return (
    <Box
        className={styles().boxCenter}
    >
        <Paper
            elevation={3}
            className={styles().padContent}
        >
            {props.children}
        </Paper>
    </Box>
    );
}