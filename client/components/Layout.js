import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { isAuth, logout } from '../helpers/auth';
import usePageScrollHook from '../customHooks/usePageScrollHook';
import useDeviceType from '../customHooks/useDeviceType';
import Image from 'next/image';
import 'nprogress/nprogress.css';

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
	const scrolled = usePageScrollHook();
	const { isMobile, isTabletOrDesktop } = useDeviceType();
	const head = () => (
		<React.Fragment>
			<link
				href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
				rel="stylesheet"
				integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
				crossOrigin="anonymous"
			/>
			<link rel="stylesheet" href="/static/css/styles.css" />
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
			<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500&display=swap" rel="stylesheet" />
			<link rel="stylesheet" href="/static/css/globals.css" />
		</React.Fragment>
	);

	const nav = () => (
		<div
			style={{
				backgroundColor: '#FFFFFF',
				boxShadow: scrolled ? '0px 0px 11px -2px black' : 'none',
			}}
			className={`fixed-top  ${(() => {
				if (isMobile) {
					if (scrolled) {
						return 'px-1 py-1';
					}
					return 'px-1 py-2';
				} else {
					if (scrolled) {
						return 'px-5 py-1';
					}
					return 'px-5 py-3';
				}
			})()}`}
		>
			<ul className="nav">
				<li className="d-flex align-items-center">
					<Link href="/">
						<a className="nav-link border-0">
							<Image
								// src="/static/images/connect-content-home-icon.svg"
								src="/static/images/old-paper.png"
								height={isMobile ? 30 : 50}
								width={isMobile ? 30 : 50}
							/>
						</a>
					</Link>
				</li>
				{!scrolled &&
				isTabletOrDesktop && (
					<li className="d-flex align-items-center">
						<Link href="/">
							<a className="nav-link border-0 text-dark">CONNECT-CONTENT</a>
						</Link>
					</li>
				)}

				<li className="d-flex align-items-center">
					<Link href="/user/link/create">
						<a className="nav-link text-dark border-0">{isMobile ? 'Submit' : 'Submit a Link'}</a>
					</Link>
				</li>

				{process.browser &&
				!isAuth() && (
					<React.Fragment>
						<li className="d-flex align-items-center">
							<Link href="/login">
								<a className="nav-link text-dark border-0">Login</a>
							</Link>
						</li>
						<li className="d-flex align-items-center">
							<Link href="/register">
								<a className="nav-link text-dark border-0">Register</a>
							</Link>
						</li>
					</React.Fragment>
				)}

				{process.browser &&
				isAuth() &&
				isAuth().role === 'admin' && (
					<li className="ms-auto d-flex align-items-center">
						<Link href="/admin">
							<a className="nav-link text-dark border-0">
								{isMobile ? isAuth().name.substring(0, 4) + '..' : isAuth().name}
							</a>
						</Link>
					</li>
				)}
				{process.browser &&
				isAuth() &&
				isAuth().role === 'subscriber' && (
					<li className="ms-auto d-flex align-items-center">
						<Link href="/user">
							<a className="nav-link text-dark border-0">{isAuth().name}</a>
						</Link>
					</li>
				)}
				{process.browser &&
				isAuth() && (
					<li className="d-flex align-items-center">
						<a className="nav-link text-dark border-0" onClick={logout}>
							Logout
						</a>
					</li>
				)}
			</ul>
		</div>
	);
	return (
		<React.Fragment>
			{head()}
			{nav()}
			<div className="container pt-5 pb-5">{children}</div>
		</React.Fragment>
	);
};

export default Layout;
