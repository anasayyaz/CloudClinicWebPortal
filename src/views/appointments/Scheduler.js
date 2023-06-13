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
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);
export default function Scheduler() {
    const { user } = useSelector((state) => state?.user);

    const navigate = useNavigate();

    const [visitList, setVisitList] = useState(null);
    const [calendarEvent, setCalendarEvent] = useState({
        Id: '',
        Title: '',
        SummaryNotes: '',
        StartDate: '',
        EndDate: '',
        consultant_NationalID: '',
        patient_NationalID: '',
        calendarID: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addEvent = (event, start, end, allDay) => {};
    const getVisitList = async () => {
        try {
            setLoading(true);
            setError(null);
            setVisitList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/primaryCareVisitsList/ada6189b-3222-4f0a-aae5-0409096dde03?pageNumber=1&pageSize=1000&QuerySearch=&IsConfirm=`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            console.log('Res  ', res?.data);
            let newArr = [];
            res.data.items.map((item) => {
                console.log(item);
                let visitObj = {};
                visitObj.id = item.id;
                visitObj.start = new Date(item.startDateTime);
                visitObj.end = new Date(item.endDateTime);
                visitObj.title = item.title;
                visitObj.nationalID = item.consultant_NationalID;
                visitObj.hexColor = item.colorCode;
                visitObj.physician = item.consultantFirstName;
                if (item.isDeleted === false) {
                    newArr.push(visitObj);
                }
            });

            console.log('New Arr ', newArr);

            setVisitList(newArr);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    // eventStyleGetter = () => {
    //     var backgroundColor = '#' + event.hexColor;
    //     var style = {
    //         backgroundColor: backgroundColor,
    //         borderRadius: '0px',
    //         opacity: 0.8,
    //         color: 'white',
    //         border: '0px',
    //         display: 'block'
    //     };
    //     return {
    //         style: style
    //     };
    // };
    useEffect(() => {
        getVisitList();
    }, []);

    return (
        <div style={{ margin: '5px' }}>
            {!!visitList && (
                <Calendar
                    selectable
                    toolbar
                    defaultView="day"
                    views={['month', 'week', 'day']}
                    events={visitList}
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectSlot={(e) => addEvent(e, e.start, e.end)}
                    // resizable
                    style={{ height: '100vh', backgroundColor: '#ffffff' }}
                    // eventPropGetter={eventStyleGetter}
                />
            )}
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
