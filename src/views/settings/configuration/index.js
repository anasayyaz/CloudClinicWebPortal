// material-ui
import { Button, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { addData, getData } from 'utils/indexedDB';
import syncListToLS from 'utils/syncListToLS';

// ==============================|| SAMPLE PAGE ||============================== //

const Configuration = () => {
    const handleAdd = () => {
        syncListToLS();
    };

    const handleGet = async () => {
        const res = await getData('medicine');

        console.log('Datat   ', res);
    };

    return (
        <MainCard title="Configuration">
            <Button onClick={handleAdd} variant="contained">
                Add Data
            </Button>
            <Button onClick={() => handleGet()} variant="contained">
                Get Data
            </Button>
        </MainCard>
    );
};

export default Configuration;
