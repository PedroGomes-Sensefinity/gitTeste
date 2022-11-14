import React from 'react';
import Modal, { Body, Header, Title } from "react-bootstrap/cjs/Modal";
import { injectIntl } from "react-intl";

function GenericModalComponent(props) {
    const title = props.title
    const content = props.content

    return (
        <Modal
            {...props}
            size="lg"
            centered
            backdrop="static"
            keyboard={false}
        >
            <Header closeButton>
                <Title id="contained-modal-title-vcenter">
                    {title}
                </Title>
            </Header>
            <Body>
                {content}
            </Body>
        </Modal>
    );
}

export default injectIntl(GenericModalComponent);