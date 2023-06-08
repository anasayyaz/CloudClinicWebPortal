// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

// assets
import FlagUS from 'assets/images/flag/flag-united-state.png';
import FlagFrance from 'assets/images/flag/flag-france.png';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 14,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const LanguageList = () => {
    const theme = useTheme();

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            <LanguageCard language={'English'} flag={FlagUS} />
            <LanguageCard language={'French'} flag={FlagFrance} />
        </List>
    );
};

export default LanguageList;

const LanguageCard = ({ language, flag }) => {
    return (
        <ListItemWrapper>
            <ListItem alignItems="center">
                <ListItemAvatar>
                    <Avatar alt={language} src={flag} variant={'square'} sx={{ width: 24, height: 16 }} />
                </ListItemAvatar>
                <ListItemText primary={language} sx={{ ml: -2 }} />
            </ListItem>
        </ListItemWrapper>
    );
};
