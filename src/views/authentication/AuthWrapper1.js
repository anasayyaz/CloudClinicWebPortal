// material-ui
import { styled } from '@mui/material/styles';
import BackgroundImage from '../../assets/images/dna.jpeg';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(() => ({
    // backgroundColor: theme.palette.primary.light,
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    minHeight: '100vh'
}));

export default AuthWrapper1;
