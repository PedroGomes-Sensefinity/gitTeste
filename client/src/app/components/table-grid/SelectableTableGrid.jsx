import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import apiServiceV2 from '../../services/v2/apiServiceV2';
import { SearchBar } from '../text-fields/SearchBar';

function SelectableTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount, columns, actions } = props;

    return <TableHead>
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

}


export function SelectableTableGrid(props) {

    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const { endpoint, dataField, actions, columns } = props
    const [query, setQuery] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [count, setCount] = useState(0)

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [refetch, setRefetch] = useState(true);
    const toolbar = props.toolbar

    useEffect(() => {
        setLoading(true)
        let method = 'getByLimitOffsetSearch'
        let params = [endpoint, rowsPerPage, page * rowsPerPage, searchQuery]
        apiServiceV2[method](...params)
            .then((result) => {

                const newData = result[dataField] || []
                const newCount = result.total || 0
                setRows(newData)
                setCount(newCount)
                setLoading(false)
            });
    }, [rowsPerPage, page, refetch, searchQuery])


    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setSearchQuery(query)
        }, 500)

        return () => {
            clearTimeout(timer)
        }
    }, [query])

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(rows);
        } else {
            setSelected([]);
        }
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

    const onQueryChange = (newText) => {
        setQuery(newText)
    }
    const isSelected = (row) => selected.find(elem => elem.id === row.id) !== undefined;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = Math.max(0, rowsPerPage - rows.length);

    return (
        <>
            <div className="d-flex flex-row-reverse">
                <SearchBar query={query} onQueryChange={onQueryChange} clearIcon />
            </div>
            <props.toolbar selected={selected} triggerRefetch={triggerRefetch} />
            <BlockUi blocking={isLoading}>
                <TableContainer>
                    <Table>
                        <SelectableTableHead
                            actions={actions}
                            columns={columns}
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rows.length}
                            query={query}
                            onQueryChange={onQueryChange}
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
                                                <Tooltip key={idx} title={action.tooltip}>
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
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </BlockUi >
        </>
    );
}