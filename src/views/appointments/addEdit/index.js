import React, { useState, useEffect } from 'react';

import {
    TableRow,
    TablePagination,
    TableHead,
    TableContainer,
    TableBody,
    TableCell,
    Table,
    Paper,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Typography,
    Select,
    MenuItem
} from '@mui/material';

// -----------------  Importing Icons
import { IconPlus } from '@tabler/icons';
import PrintIcon from '@mui/icons-material/Print';

// -----------------  Importing Constants
import { COLORS } from 'constants/colors';
import { BASE_URL } from 'constants/baseUrl';

// -----------------  Utilis
import { profileImage } from 'utils/fetchImage';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchField from 'ui-component/FormUI/SearchField.js';
import useFetch from 'hooks/useFetch';
import Scheduler from '../Scheduler';

export default function AddEdit() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const navigate = useNavigate();

    const {
        data: patientDataList,
        loading: loadingpatientDataList,
        error: errorpatientDataList,
        refetch: refetchpatientDataList
    } = useFetch(`${BASE_URL}api/patient/patientSelectList?pageNumber=1&pageSize=100&QuerySearch=`);

    const {
        data: physicianDataList,
        loading: loadingphysicianDataList,
        error: errorphysicianDataList,
        refetch: refetchphysicianDataList
    } = useFetch(`${BASE_URL}api/physician/physicianSelectList?pageNumber=1&pageSize=100&QuerySearch=`);

    return (
        <div>
            <Scheduler patientData={patientDataList} physicianData={physicianDataList} />
        </div>
    );
}

const styles = {
    loadingContainer: {
        height: 400,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};
