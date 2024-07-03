import React from 'react';
import { Grid, Typography } from '@mui/material';

const DeletePopUpContent = ({modalContent}) => {
  return (
    <Grid container alignItems='center' flexDirection="column" textAlign='center'  >
            <Grid item sx={{textAlign:'center'}}>
                <figure>
                    <img src="/images/icons/deleteIcon.svg" alt="" />
                </figure>
            </Grid>
            <Grid item>
                <Typography variant="h4">
                    {/* Are you sure you would like to Delete
                    the user Details */}
                    {modalContent?.title}
                </Typography>
            </Grid>
            <Grid item>
                <FormGroup sx={{display: 'block',}}>
                 <Checkbox id="receiveCopy" onChange={(e)=> setIsChecked(e.target.checked) } />
                <FormLabel htmlFor="receiveCopy">Check if you want to receive a copy of the delete confirmation email</FormLabel>
                </FormGroup>
            </Grid>
        </Grid>
  )
}

export default DeletePopUpContent
