import React from 'react';

import Modal from "react-bootstrap/cjs/Modal";
import {Button} from "react-bootstrap";
import {injectIntl} from "react-intl";


class GenericModalComponent extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            intl: props.intl,
            id: props.entity,
            blocking: false,
        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        { this.props.title }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { this.props.content }
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button onClick={this.props.handleClose}>
                        {this.state.intl.formatMessage({id: 'MODAL.PASSWORD.BUTTON.CLOSE'})}
                    </Button>
                </Modal.Footer> */}
            </Modal>
        );
    }
}

export default injectIntl(GenericModalComponent);