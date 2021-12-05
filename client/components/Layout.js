import Head from 'next/head';
import Link from 'next/link';
import React from 'react'
import Router from 'next/router';
import NProgress from 'nprogress';
import {isAuth, logout} from '../helpers/auth';
import 'nprogress/nprogress.css'

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()

const Layout = ({ children }) => {
    const head = () => (
        
        <React.Fragment>
            <link 
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" 
                rel="stylesheet" 
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" 
                crossOrigin="anonymous" 
            />
            <link rel="stylesheet" href="/static/css/styles.css" />
            
        </React.Fragment>

    );


    const nav = () => (
        <ul className="nav nav-tabs bg-warning">
            <li className="nav-item ">
                <Link  href="/">
                    <a className="nav-link text-dark">Home</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/login">
                    <a className="nav-link text-dark" >Login</a>
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/register">
                    <a className="nav-link text-dark" >Register</a>
                </Link>
            </li>
            <li className="nav-item">
                <a className="nav-link text-dark" onClick={logout}>Logout</a>
            </li>
        </ul>
    )
    return <React.Fragment>
        {head()}{nav()}
        <div className="container pt-5 pb-5">
        {children}
        </div>
    </React.Fragment>
}

export default Layout
