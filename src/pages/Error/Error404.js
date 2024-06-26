import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Error404 = (props) => {
    const navigate = useNavigate(); 
    navigate("/")

   return ( <div style={{padding: '4rem', justifyContent: 'center',alignItems: 'center', flexDirection: 'column', display: 'flex'}}>
        <h1 style={{fontSize: '2.25rem', lineHeight: '2.5rem', textAlign:'center'}}>Welcome to the EPP Program Portal! You don’t have access to view this page. Administrators will give you access to see the dashboard.</h1>
        {props?.userDetails?.type ==2 ?<Link to='/' style={{color:'#2e813e', paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>Go Home</Link> : null}
        {/* <p style={{    paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>{message}</p> */}
        {props?.userDetails?.type == 3 ? <>
            
            <p style={{    paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>
            If you have received an email from a company to join, you can join that company by accepting the invitation by clicking on the notification icon in the header in the top right.
            </p>
            <p style={{    paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>
            If you are a new user, and want to join a company, please click on “Request to join company” on the header. 
            </p>
        </> : null}
       
    </div>
   )
}

export default Error404;