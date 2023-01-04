import { Button, MenuItem, Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import BlockUi from "react-block-ui";
import React, { useCallback, useEffect, useState } from 'react';
import apiServiceV2 from '../../services/v2/apiServiceV2';
import toaster from '../../utils/toaster';

const alert_modes = ["None", "In", "In/Out"]

function SelectableTableToolbar(props) {
    const { selected, triggerRefetch } = props;
    const [value, setValue] = useState(0)

    const onSelectChange = (e) => {
        setValue(e.target.value)
    }

    const bulkEditGeofences = useCallback(() => {
        const fields = {
            geofence_ids: selected.map(geofence => geofence.id),
            alert_mode: alert_modes[value]
        }

        console.log(fields)

        apiServiceV2.post("v2/operations/geofences-alarm-types", fields)
            .then(response => {
                console.log(response)
                const affected = response.affected
                toaster.notify('success', `Updated ${affected} geofences`);
                triggerRefetch()
            })

    }, [selected, value])

    return (
        <Toolbar>
            {selected.length > 0 && (
                <>
                    <Typography
                        style={{ margin: "0px 10px 10px 0px" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {selected.length} selected
                    </Typography>

                    <Select style={{ margin: "0px 10px 10px 10px" }} value={value} onChange={onSelectChange}>
                        {alert_modes.map((value, idx) => (<MenuItem key={idx} value={idx}>{value}</MenuItem>))}
                    </Select>

                    <Button variant='contained' color='primary' style={{ margin: "0px 10px 10px 10px" }} onClick={bulkEditGeofences}>Save</Button>
                </>
            )
            }
        </Toolbar >
    );
}

function SelectableTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount, columns, actions } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {actions.length > 0 &&
                    <TableCell key='actions'> Actions </TableCell>}
                {columns.map((headCell, idx) => (
                    <TableCell
                        key={headCell.field}
                    >
                        {headCell.title}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function SelectableTableGrid(props) {

    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const { endpoint, dataField, actions, columns } = props

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [refetch, setRefetch] = useState(true);

    useEffect(() => {
        setLoading(true)
        let method = 'getByLimitOffset'
        let params = [endpoint, rowsPerPage, page * rowsPerPage]
        apiServiceV2[method](...params)
            .then((result) => {
                const newData = result[dataField] || []
                setRows(newData)
                setLoading(false)
            });
    }, [rowsPerPage, page, refetch])

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(rows);
            return;
        }
        setSelected([]);
    };

    const triggerRefetch = () => {
        setRefetch(state => !state)
    }

    const handleClick = (_event, row) => {
        const selectedIndex = selected.indexOf(row);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (row) => selected.find(elem => elem.id === row.id) !== undefined;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <BlockUi blocking={isLoading}>
            <SelectableTableToolbar selected={selected} triggerRefetch={triggerRefetch} />
            <TableContainer>
                <Table>
                    <SelectableTableHead
                        actions={actions}
                        columns={columns}
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {rows.map((row) => {
                            const isItemSelected = isSelected(row);

                            return (
                                <TableRow
                                    key={`${row.id}${isItemSelected ? '-selected' : ''}`}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                >
                                    <TableCell key={`${row.id}-checkbox`} padding="checkbox">
                                        <Checkbox
                                            onClick={(event) => handleClick(event, row)}
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>

                                    {/* Actions table cell*/}
                                    <TableCell key={`${row.id}`}>
                                    {actions.map((action, idx) => (
                                            <Tooltip title={action.tooltip}>
                                                <IconButton onClick={e => action.onClick(e, row)}>
                                                    {React.createElement(action.icon)}
                                                </IconButton>
                                            </Tooltip>
                                    ))}
                                    </TableCell>

                                    {columns.map((column, id) => {
                                        //handle nested fields
                                        const fieldValue = column.field.split('.').reduce((prev, curr) => {
                                            return prev[curr]
                                        }, row)

                                        return <TableCell
                                            key={id}
                                            component="th"
                                            scope="row">
                                            {fieldValue}
                                        </TableCell>
                                    })}

                                </TableRow>
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (53) * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </BlockUi >
    );
}