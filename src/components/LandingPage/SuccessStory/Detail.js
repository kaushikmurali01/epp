import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import useMediaQueries from 'utils/mediaQueries/mediaQueries';

const Detail = ({ post }) => {
    const { getTheme, theme_Md } = useMediaQueries();
    const cardMediaStyle = {
        position: 'absolute',
        left: '0',
        right: '0',
        margin: 'auto',
        top: '-3rem',
        width: '80px',
        height: '80px',
        [getTheme.breakpoints.up('md')]: {
            width: '100px',
            height: '100px',
        },
    }


    return (
        <Card sx={{
            borderRadius: '10px',
            boxShadow: 'none',
            overflow: 'visible',
            position: 'relative',
            padding: theme_Md ? '1.875rem' : '1rem',
            // marginRight: "3rem"
        }}>
            <CardMedia
                sx={{ ...cardMediaStyle }}
                image={post.image}
                // title={post.title}
                alt={post.title}
            />
            <CardContent sx={{ padding: 0, marginTop: theme_Md ? '3.25rem' : '2rem' }}>
                <Typography gutterBottom variant="h5" sx={{ marginBottom: theme_Md ? '1rem' : '0.75rem' }} >
                    {post.title}
                </Typography>
                <Typography variant="small" component="small" color="primary_2.gray">
                    {post.body}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Detail;