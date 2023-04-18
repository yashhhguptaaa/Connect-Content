import React, { useState, useEffect, Fragment } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { API, APP_NAME } from '../config';
import Link from 'next/link';
import moment from 'moment';
import Head from 'next/head';

const Home = ({ categories }) => {
	const [ popular, setPopular ] = useState([]);

	const head = () => (
		<Head>
			<link rel="shortcut icon" href="/static/images/connect-content-web-icon.svg" />
			<title>{APP_NAME}</title>
			<meta name="description" content="all tech categories and popular links" />
		</Head>
	);

	useEffect(() => {
		loadPopular();
	}, []);

	const loadPopular = async () => {
		const response = await axios.get(`${API}/link/popular`);
		setPopular(response.data);
	};

	const handleClick = async (linkId) => {
		const response = await axios.put(`${API}/click-count`, { linkId });
		loadPopular();
	};

	const listOfLinks = () =>
		popular &&
		popular.map((l, i) => (
			<div key={i} className="row alert alert-secondary p-2">
				<div className="col-md-8" onClick={() => handleClick(l._id)}>
					<a className="nav-link" href={l.url} target="_blank">
						<h5 className="pt-2">{l.title}</h5>
						<h6 className="pt-2 text-danger" style={{ fontSize: '12px' }}>
							{l.url}
						</h6>
					</a>
				</div>
				<div className="col-md-4 pt-2">
					<span className="pull-right">{moment(l.createdAt).fromNow()}</span>
					<br />
					<span className="pull-right">-By {l.postedBy.name}</span>
					<span className="badge text-secondary pull-right">{l.clicks} clicks</span>
				</div>
				<div className="col-md-12">
					<div className="badge text-dark">
						{l.type} / {l.medium}
						{l.categories.map((c, i) => (
							<span
								key={i}
								className="badge btn btn-success ms-3"
								style={{ fontSize: '12px', borderRadius: '12px' }}
							>
								{c.name}
							</span>
						))}
					</div>
				</div>
			</div>
		));

	const listCategories = () =>
		categories.map((c, i) => (
			<Link href={`/links/${c.slug}`}>
				<a style={{ border: '1px solid red' }} className="bg-light p-3 col-md-4 text-decoration-none">
					<div>
						<div className="d-flex row">
							<div className="col-md-4">
								<img
									src={c.image && c.image.url}
									alt={c.name}
									style={{ width: '100px', height: 'auto' }}
									className="px-3"
								/>
							</div>
							<div className="col-md-8 ">
								<h3>{c.name}</h3>
							</div>
						</div>
					</div>
				</a>
			</Link>
		));
	return (
		<Fragment>
			{head()}
			<Layout>
				<div className="row">
					<div className="col-md-12">
						<h1 className="font-weight-bold">Browse Tutorials/Courses</h1>
						<br />
					</div>
				</div>

				<div className="row">{listCategories()}</div>

				<div className="row pt-5">
					<h2 className="font-weight-bold pb-3">Trending</h2>
					<div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
				</div>
			</Layout>
		</Fragment>
	);
};

Home.getInitialProps = async () => {
	const response = await axios.get(`${API}/categories`);
	return {
		categories: response.data,
	};
};

export default Home;
