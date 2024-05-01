import { Card, CardActions, CardContent, CardMedia, Typography, Link } from '@mui/material';
import useMediaQueries from 'utils/mediaQueries/mediaQueries';

const BlogPost = ({ post }) => {
    const { getTheme,theme_Md } = useMediaQueries();
    const linkStyle = {
        fontSize: '0.875rem',
        fontWeight: '600',
        [getTheme.breakpoints.up('sm')]: {
            fontSize: '1.125rem',
        },
    }
    const headingStyle = {
        color: 'text.secondary2', 
        fontWeight: '500',
    }


    return (
        <Card  sx={{
            borderRadius: 0,
            boxShadow: 'none',
          }}>
            <CardMedia
                sx={{ height: 190, backgroundSize: 'contain' }}
                image={post.image}
                // title={post.title}
                alt={post.title}
            />
            <CardContent sx={{padding: theme_Md ? '0 10% 0 0' : '0', marginTop: theme_Md ? '1.25rem' : '1rem'}}>
                <Typography gutterBottom variant="h4" sx={{...headingStyle }} >
                    {post.title}
                </Typography>
                <Typography variant="span" color="text.secondary2">
                    {post.description}
                </Typography>
            </CardContent>
            <CardActions sx={{...linkStyle, padding: '0', marginTop: theme_Md ? '1.5rem' : '1rem'}}>
                <Link href={post.link} >Lear more</Link>
            </CardActions>
        </Card>
    )
}

export default BlogPost;