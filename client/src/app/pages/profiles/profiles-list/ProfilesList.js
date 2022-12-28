import React, { useMemo } from 'react';

import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useSelector } from 'react-redux';
import TableGrid from '../../../components/table-grid/TableGrid';
import templates from '../../../utils/links';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));

export function ProfilesList() {
    const classes = useStyles();
    const history = useHistory()

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditProfiles) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit profile',
                onClick: (_event, rowData) => {
                    const url = templates.profilesEdit.templateObj.expand({ id: rowData.id })
                    history.push(url);
                },
            })
        }
        return acts
    }, [permissions])

    const columns = [
        {
            field: 'id',
            title: 'ID',
        },
        {
            field: 'name',
            title: 'Name',
        }
    ];

    return (
        <Card>
            <CardContent>
                {permissions.canCreateProfiles ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            const url = templates.profilesCreate.templateString
                            history.push(url)
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New Profile
                    </Button> : <></>}
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'profile'}
                    dataField='profiles'
                />
            </CardContent>
        </Card>
    );
}