import React, { useEffect, useState } from "react";
import { TabContainer } from "react-bootstrap";
import { Outlet, useParams } from "react-router-dom";
import { Layout } from "../../../../_metronic/layout";
import apiServiceV2 from "../../../services/v2/apiServiceV2";
import ThresholdPageHeader from "./ThresholdPageHeader";


export function ThresholdsPage() {
    const { id } = useParams()
    console.log(id)
    const [threshold, setThreshold] = useState({})
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        apiServiceV2.get('v2/thresholds/' + id)
            .then((response) => {
                let threshold = response.threshold;
                let rule = JSON.parse(threshold.rule);
                threshold.rule = rule
                setThreshold(threshold)
                setLoading(false)
            });
    }, []);

    const context = { thresholdId: id, thresholdInfo: threshold, isLoading: isLoading, onChange: setThreshold }
    return (
        <Layout>
            <ThresholdPageHeader thresholdId={id} />
            <TabContainer>
                <Outlet context={context} />
            </TabContainer>
        </Layout>
    );
}