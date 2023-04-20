import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { injectIntl } from "react-intl";
import Pagination from '@mui/material/Pagination';
import apiServiceV2 from '../../services/v2/apiServiceV2';


export function Videos() {

    const [videos, setVideos] = React.useState([])
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    let COUNT = 8

    function getVideos(e, v) {
        
        apiServiceV2.get(`v2/videos?limit=` + COUNT + `&offset=` + COUNT * (v - 1)).then(r => {
            const videosR = []
            
            if (r.videos !== undefined) {
                for (const video of r.videos) {
                    
                    videosR.push(<div className={"col-lg-3 col-xxl-3"}>
                        <Card sx={{ maxWidth: 345, margin: "10px" }}>
                            <iframe
                                width="345"
                                height="245"
                                src={video.url}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {video.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Open Video On Youtube!</Button>
                            </CardActions>
                        </Card>
                    </div>)
                }
            }
            setVideos(videosR)
        })
        setPage(v)
    }

    React.useEffect(() => {
        apiServiceV2.get(`v2/videos?limit=` + COUNT).then(r => {
            const videosR = []
            setTotal(Math.ceil(r.total / COUNT))
            for (const video of r.videos) {
                
                videosR.push(<div className={"col-lg-3 col-xxl-3"}>
                    <Card sx={{ maxWidth: 345, margin: "10px" }}>
                        <iframe
                            width="345"
                            height="245"
                            src={video.url}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded youtube"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {video.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {video.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button target="_blank" href={video.url} size="small">Open Video On Youtube!</Button>
                        </CardActions>
                    </Card>
                </div>)
            }
            setVideos(videosR)
        })
    }, []);
    return (
        <>
            <div className={"row"} style={{ marginBottom: "1rem" }}>
                {videos}
            </div>

            <Pagination style={{
                margin: "auto",
                padding: "20px",
            }} onChange={getVideos} page={page} count={total} variant="outlined" color="primary" />
        </>
    );
}
export default injectIntl(Videos);