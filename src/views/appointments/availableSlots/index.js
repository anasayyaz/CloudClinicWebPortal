// material-ui
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useState } from 'react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ModalCustom from 'ui-component/modals/ModalCustom';

// ==============================|| SAMPLE PAGE ||============================== //

const AvailableSlots = () => {
    const visit = [
        { id: 1, name: 'visit 1', patient: '3928494' },
        { id: 2, name: 'visit 2', patient: '2342343' },
        { id: 3, name: 'visit 3', patient: '3545454' },
        { id: 4, name: 'visit 4', patient: '23545' },
        { id: 5, name: 'visit 5', patient: '64534' },
        { id: 6, name: 'visit 6', patient: '46454565' }
    ];

    const [formOpen, setFormOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const handleFormClose = () => {
        setFormOpen(false);
    };

    return (
        <Box>
            {visit?.map((item) => (
                <Box key={item?.id} sx={{ backgroundColor: 'green', m: 1 }}>
                    <Typography>{item?.name}</Typography>
                    <Button
                        onClick={() => {
                            setFormOpen(true);
                            setSelectedVisit(item);
                        }}
                    >
                        Open Intake Form
                    </Button>
                </Box>
            ))}

            {formOpen && <IntakeForm open={formOpen} onClose={handleFormClose} visit={selectedVisit} />}
        </Box>
    );
};

const IntakeForm = ({ visit, open, onClose }) => {
    let data = {
        checkBox1: true,
        checkBox3: false,
        field1: 'hhhh',
        field2: ''
    };

    // console.log('visit ', visit);
    console.log('data ', data);
    return (
        <ModalCustom open={open} title="Intake Form">
            <Form
                data={data}
                onChange={(val) => {
                    data = val;
                }}
            />

            <Button onClick={onClose}>Close</Button>
            <Button onClick={() => console.log('data    12321c ', data)}>Close</Button>
        </ModalCustom>
    );
};

const Form = ({ data, onChange }) => {
    const [values, setValues] = useState({
        checkBox1: data?.checkBox1,
        checkBox2: data?.checkBox2,
        checkBox3: data?.checkBox3,
        checkBox4: data?.checkBox4,
        field1: data?.field1,
        field2: data?.field2
    });

    const handleState = (key, value) => {
        setValues((prevState) => ({ ...prevState, [key]: value }));
    };

    onChange(values);

    return (
        <Box>
            <FormControlLabel
                control={<Checkbox checked={values.checkBox1} onChange={(e) => handleState('checkBox1', e.target.checked)} />}
                label="CheckBox 1"
            />

            <FormControlLabel
                control={<Checkbox checked={values.checkBox2} onChange={(e) => handleState('checkBox2', e.target.checked)} />}
                label="CheckBox 1"
            />

            <FormControlLabel
                control={<Checkbox checked={values.checkBox3} onChange={(e) => handleState('checkBox3', e.target.checked)} />}
                label="CheckBox 1"
            />

            <FormControlLabel
                control={<Checkbox checked={values.checkBox4} onChange={(e) => handleState('checkBox4', e.target.checked)} />}
                label="CheckBox 1"
            />

            <TextField
                value={values?.field1}
                onChange={(e) => handleState('field1', e.target.value)}
                fullWidth
                label="Field 1"
                variant="standard"
            />

            <TextField
                value={values?.field2}
                onChange={(e) => handleState('field2', e.target.value)}
                fullWidth
                label="Field 2"
                variant="standard"
            />
        </Box>
    );
};

export default AvailableSlots;
