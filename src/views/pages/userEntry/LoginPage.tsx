import { Container, Typography } from "@material-ui/core";
import React from "react";
import LoginForm from "../../blocks/forms/LoginForm";
import CenteredPaper from "../../blocks/general/CenteredPaper";


export default function LoginPage({ refreshAuth } : { refreshAuth: () => void }) {
    return (
        <CenteredPaper>
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
                let's see who you are.
            </Typography>
            <Container
                maxWidth='sm'
            >
                <LoginForm refreshAuth={refreshAuth} />
            </Container>
        </CenteredPaper>
        
    );
}