import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const versions = [
    {versionNumber: "V.0.0.4", date: "18/11/2022" ,changes: 
    ["Update for all users with access to Locations and Sublocations - Now you will be able to check all your Locations and Sublocations. Go check it out!"]},
    {versionNumber: "V.0.0.3", date: "18/11/2022" ,changes: 
    ["3D Support for Containers Visualization - BETA Version"]},
    {versionNumber: "V.0.0.2", date: "16/11/2022" ,changes: 
    ["1. Launch of the Page: \"What's New\" - Here you can check the latest news from the Sensefinity Web application! "]},
    {versionNumber: "V.0.0.1", date: "15/11/2022", changes: 
    ["1. We have added reverse GeoCoding - It is now possible in the Assets Dashboard to know its detailed location;",
    "2. Second version of the Dashboard - General interface improvements and new widget for Containers \"In Transit\";",
    "3. General application improvements."]}
]


export function News() {
  return (
    <Box sx={{ minWidth: 275, margin: "40px" }}>
        <h1>What's New?</h1>
        {versions.map((version ) => (
            <Card variant="outlined" sx={{ marginBottom: "1rem"}} >
                        <CardContent>
                        <Typography sx={{ fontSize: 14,  backgroundColor:"#90EE90", display: "inline-block", borderRadius: "5px"}} color="text.secondary" gutterBottom>
                            {version.versionNumber}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {version.date}
                        </Typography>
                        {version.changes.map((change ) => (
                            <Typography variant="h5" component="div">
                                {change}
                            </Typography>
                        ))}
                        </CardContent>
            </Card>))}
    </Box>
  );
}