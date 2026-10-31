'use client';
import {useEffect} from 'react';
import App from '../../legacy/App.jsx';
export default function Legacy(){useEffect(()=>{const l=document.createElement('link');l.rel='stylesheet';l.href='/legacy.css';document.head.appendChild(l);return()=>l.remove()},[]);return <App/>}
