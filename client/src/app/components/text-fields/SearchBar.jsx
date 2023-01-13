import { createStyles, FormControl, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";

const useStyles = makeStyles(() => {
    return createStyles({
        search: {
            margin: "0"
        }
    });
});

export const SearchBar = ({ query, onQueryChange, clearIcon = false, variant = "standard" }) => {
    const { search } = useStyles();
    const [showClearIcon, setShowClearIcon] = useState("none");

    const handleChange = (event) => {
        setShowClearIcon(event.target.value === "" ? "none" : "flex");
        onQueryChange(event.target.value)
    };

    const handleClick = () => {
        onQueryChange("")
        console.log("clicked the clear icon...");
    };

    const inputProps = {
        startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
        ),
        endAdornment: clearIcon ? (
            <InputAdornment
                position="end"
                style={{ display: showClearIcon }}
                onClick={handleClick}
            >
                <ClearIcon />
            </InputAdornment>
        ) : undefined
    }

    return (
        <FormControl className={search}>
            <TextField
                variant={variant}
                onChange={handleChange}
                value={query}
                InputProps={inputProps}
            />
        </FormControl >
    );
};