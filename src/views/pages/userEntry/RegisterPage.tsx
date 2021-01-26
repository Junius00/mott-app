import React from 'react';
import { Box, Container, Paper, Typography } from "@material-ui/core";
import RegisterForm from '../../blocks/forms/RegisterForm';
import styles from '../../styles';

export default function RegisterPage({ refreshAuth } : { refreshAuth: () => void }) {
    return (
        <Box
            className={styles().boxCenter}
        >
            <Paper
                elevation={3}
                className={styles().padContent}
            >
                <Typography
                    align='center'
                    variant='h2'
                >
                    welcome to mott.
                </Typography>
                <Typography
                    align='center'
                    variant='subtitle1'
                    color='textSecondary'
                    paragraph
                >
                    fresh blood!
                </Typography>
                <Container
                    maxWidth='sm'
                >
                    <RegisterForm refreshAuth={refreshAuth} />
                </Container>
            </Paper>
        </Box>
    );
}