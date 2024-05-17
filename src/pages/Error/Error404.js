import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = ({ message = 'Sorry, page was not found!' }) => (
    <div style={{padding: '4rem', justifyContent: 'center',alignItems: 'center', flexDirection: 'column', display: 'flex'}}>
        <h1 style={{fontSize: '2.25rem', lineHeight: '2.5rem'}}>Error: Either Page not found or you don't have acess to view this page.</h1>
        {/* <p style={{    paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>{message}</p> */}
        <Link to='/' style={{color:'#2e813e', paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>Go Home</Link>
        <p style={{    paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>
            If you got a mail from your company to join, you can join the company by accepting the invitation by clicking on the invitation icon present at the header. 
        </p>
        <p style={{    paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>
            If you are a new user, and wants to join a company, please click on the "Join Company" button on the top header.
        </p>
       
    </div>
);

export default Error404;