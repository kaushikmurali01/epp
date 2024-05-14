import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = ({ message = 'Sorry, page was not found!' }) => (
    <div style={{padding: '4rem', justifyContent: 'center',alignItems: 'center', flexDirection: 'column', display: 'flex'}}>
        <h1 style={{fontSize: '2.25rem', lineHeight: '2.5rem'}}>Error 404:Page Not Found!</h1>
        <p style={{    paddingTop:' 1.5rem', paddingBottom: '1.5rem'}}>{message}</p>
        <Link to='/' style={{color:'#2e813e'}}>Go Home</Link>
    </div>
);

export default Error404;