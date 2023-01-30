import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { injectIntl } from "react-intl";

const versions = [
    {
        versionNumber: "V.0.3.2 - Latest", date: "27/01/2023", changes:
            ["1. UI Enhancements", "2. New Impacts Lists - Dashboards - List Dashboards"]
    },
    {
        versionNumber: "V.0.3.1", date: "25/01/2023", changes:
            ["1. Multiple fixes on Containers Dashboards",  "2. New Dashboard for Routes", "3. You can now check the Impacts for a single Asset. Go to Assets - Asset - Impacts", "4. Impacts measurement from mg to g", "5. Containers Dashboard only shows Longstandings for Sublocations with Containers"]
    },
    {
        versionNumber: "V.0.3.0", date: "24/01/2023", changes:
            ["1. Improvements on load speed - The website can load faster!"]
    },
    {
        versionNumber: "V.0.2.4", date: "13/01/2023", changes:
            ["1. Access to Threshold unlocked. You can see all Assets and Geofences Associated with one Threshold.", "2. Implementation of Operations on Thresholds. It's now possible to add one Threshold to All Assets", "3. Impact Lists available on Containers Dashboard with new 3D Impact visualization"]
    },
    {
        versionNumber: "V.0.2.3", date: "04/01/2023", changes:
            ["1. It's now possible to check the History for a specific Geofence and also all the assets still inside that geofence. Go to Geofences - Select Geofence - History / Assets"]
    },
    {
        versionNumber: "V.0.2.2", date: "02/01/2023", changes:
            ["1. You can now Download Reports (.csv) from the Container Dashboard.", "2. It's now possible to check the History from an Asset! Go to Assets - Asset - History"]
    },
    {
        versionNumber: "V.0.2.1", date: "26/12/2022", changes:
            ["1. Support for lists on Container Dashboard for Locations and LongStanding!"]
    },
    {
        versionNumber: "V.0.2.0", date: "22/12/2022", changes:
            ["Major Update!", "1. We added support for multiple tenants", "2. You can now create notifications by shape on Geofences"]
    },
    {
        versionNumber: "V.0.1.3", date: "06/12/2022", changes:
            ["1. We added all Dashboards to a single page: 'Dashboards - Containers Dashboards'. Now you can use Tabs to navigate between dashboards"]
    },
    {
        versionNumber: "V.0.1.2", date: "02/12/2022", changes:
            ["1. New General Dashboard",
                "2. Updates to World Dashboard - Now includes Longstanding and reverse geocoding",
                "3. New Continente Dashboard (First Version)"]
    },
    {
        versionNumber: "V.0.1.1", date: "02/12/2022", changes:
            ["1. Increased Size of all Sublocations"]
    },
    {
        versionNumber: "V.0.1.0", date: "24/11/2022", changes:
            ["Major Update!", "1. World Map Available", "2. Reverse Geocoding on Dashboards", "3. Longstanding by coordinates and not by Location/Sublocation", "4. Increased size of PTLIS"]
    },
    {
        versionNumber: "V.0.0.5", date: "24/11/2022", changes:
            ["It's now possible to check the Geofence on the Asset map"]
    },
    {
        versionNumber: "V.0.0.4", date: "18/11/2022", changes:
            ["Update for all users with access to Locations and Sublocations - Now you will be able to check all your Locations and Sublocations. Go check it out!"]
    },
    {
        versionNumber: "V.0.0.3", date: "18/11/2022", changes:
            ["3D Support for Containers Visualization - BETA Version"]
    },
    {
        versionNumber: "V.0.0.2", date: "16/11/2022", changes:
            ["1. Launch of the Page: \"What's New\" - Here you can check the latest news from the Sensefinity Web application! "]
    },
    {
        versionNumber: "V.0.0.1", date: "15/11/2022", changes:
            ["1. We have added reverse GeoCoding - It is now possible in the Assets Dashboard to know its detailed location;",
                "2. Second version of the Dashboard - General interface improvements and new widget for Containers \"In Transit\";",
                "3. General application improvements."]
    }
]

const shadeStyle = {
    "box-shadow": "0px 7px 15px 0px rgba(0,0,0,0.13),0px 1px 4px 0px rgba(0,0,0,0.11)"
}


export function News() {
    return (
        <Box sx={{ minWidth: 275, margin: "40px" }}>
            <h1>What's New?</h1>
            {versions.map((version) => (
                <Card variant="outlined" sx={{ marginBottom: "1rem" }} style={shadeStyle}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14, display: "inline-block", borderRadius: "5px" }} gutterBottom>
                            {version.versionNumber}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {version.date}
                        </Typography>
                        {version.changes.map((change) => (
                            <Typography variant="h5" component="div">
                                {change}
                            </Typography>
                        ))}
                    </CardContent>
                </Card>))}
        </Box>
    );
}

export default injectIntl(News);