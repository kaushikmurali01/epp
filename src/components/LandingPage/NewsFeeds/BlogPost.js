import { Card, CardActions, CardContent, CardMedia, Typography, Link } from '@mui/material';

const BlogPost = ({ post }) => {

    return (
        <Card  sx={{
            borderRadius: 0,
            boxShadow: 'none',
          }}>
            <CardMedia
                sx={{ height: 190 }}
                image={post.image}
                // title={post.title}
                alt={post.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.body}
                </Typography>
            </CardContent>
            <CardActions>
                <Link href="#"  >Link</Link>
            </CardActions>
        </Card>
    )
}

export default BlogPost;