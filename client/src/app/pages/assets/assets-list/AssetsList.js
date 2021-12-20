import React, {useEffect, useState} from 'react';

import moment from 'moment';
import history from '../../../history';
import {Button, Card, CardContent} from '@material-ui/core';
import Form from 'react-bootstrap/Form';
import notificationService from "../../../services/notificationService";

import EditIcon from '@material-ui/icons/Edit';
import TableGrid from '../../../components/table-grid/table-grid.component';
import { useLang } from '../../../../_metronic/i18n/Metronici18n';
import {Link} from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import {makeStyles} from "@material-ui/core/styles";

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
export function AssetsList() {
    const classes = useStyles();
    const locale = useLang();

    const columns = [
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'description',
            title: 'Description',
        },
    ];

    useEffect(() => {

    }, []);

    return (
        <Card>
            <CardContent>
                <Link to='/assets/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New Asset
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit asset',
                            onClick: (event, rowData) => {
                                history.push(`/assets/edit/${rowData.id}`);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'asset'}
                    dataField='assets'
                />
            </CardContent>
        </Card>
    );
}
