import React from 'react';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchField({ onClickSearch, onChange, value, onClickClear, label, titleClearBtn, titleSearchBtn, size }) {
    return (
        <FormControl size={size} onSubmit={() => {}} fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                value={value}
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end">
                        {value && (
                            <Button title={titleClearBtn} type="submit" variant="text" sx={{ color: 'gray' }} onClick={onClickClear}>
                                Clear
                            </Button>
                        )}

                        <IconButton type="submit" title={titleSearchBtn} onClick={onClickSearch} edge="end">
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
            />
        </FormControl>
    );
}
