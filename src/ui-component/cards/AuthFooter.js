// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://cloudclinic.ai" target="_blank" underline="hover">
            cloudclinic.ai
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://cloudclinic.ai" target="_blank" underline="hover">
            Copyright &copy; 2021 All rights reserved.
        </Typography>
    </Stack>
);

export default AuthFooter;
