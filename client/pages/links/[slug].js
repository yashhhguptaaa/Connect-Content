import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../helpers/alerts";

import Link from "next/link";
import axios from "axios";
import { API } from "../../config";
import renderHTML from "react-render-html";
import moment from "moment";

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

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a href={l.url} target="_blank">
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

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load More
        </button>
      )
    );
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold">{category.name}</h1>
          <div className="lead alert alert-secondary pt-4">
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
      <div className="row">
        <div className="col-md-8">{listOfLinks()}</div>
        <div className="col-md-4">
          <h2 className="lead">Most popular in {category.name}</h2>
        </div>
      </div>

      <div className="text-center pt-4 pb-5">{loadMoreButton()}</div>
    </Layout>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;
  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });
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
