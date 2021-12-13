import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

import axios from "axios";
import { API } from "../../../config";

const Create = () => {
  const [state, setState] = useState({
    title: "",
    url: "",
    categories: [],
    loadedCategories: [],
    success: "",
    error: "",
    type: "",
    medium: "",
  });

  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;

  // load categories when component mounts using useEffect
  useEffect(() => {
    loadCategories();
  }, [success]);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleSubmit = async (e) => {
      e.preventDefault()
      console.table({title, url, categories, type, medium})
  };
  const handleTitleChange = async (e) => {
    setState({ ...state, title: e.target.value, error: "", success: "" });
  };
  const handleURLChange = async (e) => {
    setState({ ...state, url: e.target.value, error: "", success: "" });
  };
  const handleToogle = (c) => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setState({ ...state, categories: all, success: "", error: "" });
  };
  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: "", error: "" });
  };
  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: "", error: "" });
  };

  //show categories > checkbox
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToogle(c._id)}
            className="me-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTypes = () => (
    <React.Fragment>
      <div className="form-check ms-4">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleTypeClick}
            checked={type === "free"}
            value="free"
            className="form-check-input"
            name="type"
          />
          Free
        </label>
        <label className="form-check-label col-md-12">
          <input
            type="radio"
            onChange={handleTypeClick}
            checked={type === "paid"}
            value="paid"
            className="form-check-input"
            name="type"
          />
          Paid
        </label>
      </div>
    </React.Fragment>
  );

  const showMedium = () => (
    <React.Fragment>
      <div className="form-check ms-4 ps-4">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "video"}
            value="video"
            className="form-check-input"
            name="medium"
          />
          Video
        </label>
        <label className="form-check-label col-md-11">
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "book"}
            value="book"
            className="form-check-input"
            name="medium"
          />
          Book
        </label>
      </div>
    </React.Fragment>
  );

  //link create form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          type="url"
          className="form-control"
          onChange={handleURLChange}
          value={url}
          required
        />
      </div>
      <div>
        <button className="btn btn-outline-warning mt-2" type="submit">
          Post
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>Submit Link/URL</h1>
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">
          <div className="form-group">
            <label className="text-muted ms-4">Category</label>
            <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div className="form-group">
            <label className="text-muted ms-4">Type</label>
            {showTypes()}
          </div>
          <div className="form-group">
            <label className="text-muted ms-4 mt-4">Medium</label>
            {showMedium()}
          </div>
        </div>
        <div className="col-md-7">{submitLinkForm()}</div>
      </div>
    </Layout>
  );
};

export default Create;
