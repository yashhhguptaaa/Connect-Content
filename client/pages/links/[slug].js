import React, { useState, useEffect, Fragment } from "react";
import Layout from "../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../helpers/alerts";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { API, APP_NAME } from "../../config";
import renderHTML from "react-render-html";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);

  // function to remove all HTML
  const stripHTML = data => data.replace( /<\/?[^>]+(>|$)/g, '')

  const head = () => (
    <Head>
      <title>
        {category.name} | {APP_NAME}
      </title>
      <meta name="description" content={stripHTML(category.content.substring(0,160))} />
      <meta property="og:title" content={category.name} />
      <meta property="og:description" content={stripHTML(category.content.substring(0,160))} />
      <meta property="og:image" content={category.image.url} />
      <meta property="og:image:secure_url" content={category.image.url} />
    </Head>
  );

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
    loadPopular();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const listOfLinks = (mapLinks) =>
    mapLinks.map((l, i) => (
      <div
        key={i}
        className={
          mapLinks == allLinks
            ? "row alert alert-primary p-2"
            : "row alert alert-success p-2"
        }
      >
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a className="nav-link" href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">{moment(l.createdAt).fromNow()}</span>
          <br />
          <span className="pull-right">-By {l.postedBy.name}</span>
          <span className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
        <div className="col-md-12">
          <div className="badge text-dark">
            {l.type} / {l.medium}
            {l.categories.map((c, i) => (
              <span
                key={i}
                className="badge btn btn-success ms-3"
                style={{ fontSize: "12px", borderRadius: "12px" }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    ));

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    console.log("allLinks", allLinks);
    console.log("response.data.links.length", response.data.links.length);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  // const loadMoreButton = () => {
  //   return (
  //     size > 0 &&
  //     size >= limit && (
  //       <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
  //         Load More
  //       </button>
  //     )
  //   );
  // };

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-8">
            <h1 className="display-4 font-weight-bold">{category.name}</h1>
            <div className="lead alert alert-danger pt-4">
              {renderHTML(category.content)}
            </div>
          </div>
          <div className="col-md-4">
            <img
              src={category.image.url}
              alt={category.name}
              style={{ width: "auto", maxHeight: "200px", marginTop: "10vh" }}
            />
          </div>
        </div>
        <br />

        {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}

        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={size > 0 && size >= limit}
          loader={
            <img
              key={0}
              style={{ height: "40px" }}
              src="/static/images/loading.gif"
              alt="loading"
            />
          }
        >
          <div className="row">
            <div className="col-md-8">{listOfLinks(allLinks)}</div>
            <div className="col-md-4 text-center">
              <h2 className="lead font-weight-bold">
                <b>Most popular in {category.name}</b>
              </h2>
              <div className="col-md-12 ms-4">{listOfLinks(popular)}</div>
            </div>
          </div>
        </InfiniteScroll>
      </Layout>
    </Fragment>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 1;
  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });
  console.log("response: ", response);
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default Links;
