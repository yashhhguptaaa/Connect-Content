import { useState, useEffect } from "react";
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

  const handleSubmit = async (e) => {};
  const handleTitleChange = async (e) => {
    setState({ ...state, title: e.target.value, error: "", success: "" });
  };
  const handleURLChange = async (e) => {
    setState({ ...state, url: e.target.url, error: "", success: "" });
  };

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
        <div className="col-md-4">xxxxxxx</div>
        <div className="col-md-8">{submitLinkForm()}</div>
      </div>
    </Layout>
  );
};

export default Create;
