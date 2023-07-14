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
    MenuItem,
    OutlinedInput,
    InputAdornment
} from '@mui/material';

// -----------------  Importing Icons
import { IconPlus } from '@tabler/icons';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

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

export default function Nurse() {
    const { user } = useSelector((state) => state?.user);

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: nurseList,
        loading: loadingNurseList,
        error: errorNurseList,
        refetch: refetchNurseList
    } = useFetch(`${BASE_URL}api/physician/NurseList?pageNumber=1&pageSize=100&QuerySearch=`);

    const filteredNurses = nurseList?.items?.filter((nurse) => nurse?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Nurse
                </Typography>

                <Grid item sx={{ ml: 'auto' }}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button
                                onClick={() => navigate('add')}
                                variant="contained"
                                startIcon={<IconPlus size={17} />}
                                sx={{ backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                            >
                                New Nurse
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* -------------------------------  Search Layout button */}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container alignItems="center" p={2} rowGap={2}>
                    <Grid item sx={{ display: 'flex', flex: 1 }}>
                        <Grid container gap={2}>
                            <Grid item lg={4} xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Search</InputLabel>
                                    <OutlinedInput
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {searchQuery?.length > 0 ? (
                                                    <IconButton
                                                        type="submit"
                                                        title="End Searching"
                                                        onClick={() => setSearchQuery('')}
                                                        edge="end"
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton type="submit" title="Search Nurse" edge="end">
                                                        <SearchIcon />
                                                    </IconButton>
                                                )}
                                            </InputAdornment>
                                        }
                                        label="Search"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print Nurse List">
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <TableContainer sx={{ maxHeight: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow
                                sx={{
                                    '& th': {
                                        color: '#fff',
                                        backgroundColor: COLORS.secondory
                                    }
                                }}
                            >
                                <TableCell align={'left'}>Profile Picture</TableCell>

                                <TableCell align={'left'}>Name</TableCell>

                                <TableCell align={'left'}>NIC</TableCell>

                                <TableCell align={'left'}>Phone Number</TableCell>

                                <TableCell align={'left'}>Location</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!filteredNurses &&
                                filteredNurses?.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.nationalID}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                            onClick={() => navigate(`edit/${row?.nationalID}`, { state: row })}
                                        >
                                            <TableCell align={'left'} alignItems={'center'}>
                                                <img alt={'Profile'} src={profileImage(row?.profileImage)} style={styles.profilePicture} />
                                            </TableCell>

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.name?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.identificationNo}</TableCell>

                                            <TableCell align={'left'}>{row?.phone}</TableCell>

                                            <TableCell align={'left'}>{row?.address}</TableCell>
                                        </TableRow>
                                    );
                                })}

                            {loadingNurseList && (
                                <TableRow sx={{ height: 400 }}>
                                    <TableCell align="center" colSpan={6}>
                                        <CircularProgress size={35} color="inherit" />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!!errorNurseList && (
                                <TableRow sx={{ height: 400 }}>
                                    <TableCell align="center" colSpan={6}>
                                        <Typography>{error?.response?.data?.message ?? error?.response?.data ?? error?.message}</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
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
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: -20,
        marginBottom: -15,
        position: 'relative'
    }
};
