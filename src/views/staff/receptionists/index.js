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

export default function Receptionists() {
    const { user } = useSelector((state) => state?.user);

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');

    const {
        data: receptionistList,
        loading: loadingReceptionistList,
        error: errorReceptionistList,
        refetch: refetchReceptionistList
    } = useFetch(`${BASE_URL}api/accounts/usersInRole?pageNumber=1&pageSize=100&QuerySearch=`);

    const filteredReceptionists = receptionistList?.items?.filter((nurse) => {
        let fullName = `${nurse?.firstName} ${nurse?.lastName}`;
        return fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    });
    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Receptionists
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
                                New Receptionist
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* -------------------------------  Search Layout button */}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container alignItems="center" p={2}>
                    <Grid item sx={{ display: 'flex', flex: 1 }} spacing={2}>
                        <Grid container>
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
                                                    <IconButton type="submit" title="Search Receptionist" edge="end">
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
                        <IconButton title="Print Receptionist List">
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
                                <TableCell align={'left'}>Name</TableCell>

                                <TableCell align={'left'}>Email</TableCell>

                                <TableCell align={'left'}>Phone Number</TableCell>

                                <TableCell align={'left'}>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!filteredReceptionists &&
                                filteredReceptionists?.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                            onClick={() => navigate(`edit/${row?.id}`, { state: row })}
                                        >
                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.firstName?.toLowerCase()} {row?.lastName?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.email}</TableCell>

                                            <TableCell align={'left'}>{row?.phoneNumber}</TableCell>

                                            <TableCell align={'left'}>{row?.address}</TableCell>
                                        </TableRow>
                                    );
                                })}

                            {loadingReceptionistList && (
                                <TableRow sx={{ height: 400 }}>
                                    <TableCell align="center" colSpan={6}>
                                        <CircularProgress size={35} color="inherit" />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!!errorReceptionistList && (
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
