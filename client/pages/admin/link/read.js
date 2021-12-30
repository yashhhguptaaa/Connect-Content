import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Link from "next/link";
import axios from "axios";
import { API } from "../../../config";
import renderHTML from "react-render-html";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import withAdmin from "../../withAdmin";
import { getCookie } from "../../../helpers/auth";
import { Router } from "next/router";

const Links = ({ links, totalLinks, linksLimit, linkSkip, token }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [size, setSize] = useState(totalLinks);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete > ',slug);
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LINK DELETE SUCCESS", response);
      process.browser && window.location.reload();
    } catch (error) {
      console.log("Link delete error: ", error);
    }
  };

  const listOfLinks = () =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
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
          <br />
          <div className="ms-5">
            <span
              onClick={(e) => confirmDelete(e, l._id)}
              className="badge btn-danger text-dark pull-right"
            >
              {" "}
              Delete
            </span>
            <br />
            <Link href={`/user/link/${l._id}`}>
              <span className="badge btn-warning text-dark pull-right">
                Edit
              </span>
            </Link>
          </div>
        </div>
        <div className="col-md-12">
          <div className="badge text-dark">
            {l.type} / {l.medium}
          </div>
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
    ));

  const loadMore = async () => {
    let toSkip = skip + limit;

    const response = await axios.post(
      `${API}/links`,
      {
        skip: toSkip,
        limit,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAllLinks([...allLinks, ...response.data]);
    // console.log("allLinks", allLinks);
    // console.log("response.data.links.length", response.data.length);
    setSize(response.data.length);
    setSkip(toSkip);
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold"></h1>
          <div className="text-bold pt-4">All Links</div>
        </div>
      </div>
      <br />

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={size > 0 && size >= limit}
        loader={
          <img
            key={0}
            style={{ height: "80px" }}
            src="/static/images/loading.gif"
            alt="loading"
          />
        }
      >
        <div className="row">
          <div className="col-md-12">{listOfLinks()}</div>
        </div>
      </InfiniteScroll>
    </Layout>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;
  const token = getCookie("token", req);
  console.log("token", token);
  const response = await axios.post(
    `${API}/links`,
    {
      skip,
      limit,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    links: response.data,
    totalLinks: response.data.length,
    linksLimit: limit,
    linkSkip: skip,
    token,
  };
};

export default withAdmin(Links);
