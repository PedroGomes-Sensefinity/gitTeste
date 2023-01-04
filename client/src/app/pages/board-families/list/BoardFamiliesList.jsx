import React, { useMemo } from 'react';

import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { generatePath, useNavigate } from 'react-router-dom';
import TableGrid from '../../../components/table-grid/TableGrid';
import { useSelector } from 'react-redux';
import templates from '../../../utils/links'
import { Layout } from '../../../../_metronic/layout';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));

export function BoardFamiliesList() {
    const classes = useStyles();
    const navigate = useNavigate()

    const columns = [
        {
            field: 'name',
            title: 'Name',
        }
    ];

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditBoardFamilies) {
            acts.push(
                {
                    icon: EditIcon,
                    tooltip: 'Edit board family',
                    onClick: (_event, rowData) => {
                        const url = generatePath(templates.boardFamilyEdit, { id: rowData.id })
                        console.log(url)
                        navigate(url);
                    },
                })
        }
        return acts
    }, [permissions])

    return (
        <Layout>
            <Card>
                <CardContent>
                    {permissions.canCreateBoardFamilies ?
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}
                            onClick={() => {
                                navigate(templates.boardFamilyCreate)
                            }}>
                            <AddIcon className={classes.leftIcon} />
                            New board family
                        </Button> : <></>
                    }
                    <TableGrid
                        actions={actions}
                        title=''
                        columns={columns}
                        endpoint={'board_families'}
                        dataField='board_families'
                    />
                </CardContent>
            </Card>
        </Layout>
    );
}
