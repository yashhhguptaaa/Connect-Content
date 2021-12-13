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
  const handleToogle = c => () => {
      // return the first index or -1
      const clickedCategory = categories.indexOf(c)
      const all = [...categories]

      if(clickedCategory === -1){
          all.push(c)
      } else {
          all.splice(clickedCategory,1)
      }
      setState({...state, categories : all, success: '',error: ''})

  };

  //show categories > checkbox
  const showCategories = () => {
      return loadedCategories && loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}> 
            <input type = "checkbox" onChange={handleToogle(c._id)} className="mr-2"/>
            <label className="form-check-label">{c.name}</label>
        </li>
      ))
  }  

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
            <label className="text-muted ml-4">Category</label>
            <ul style={{maxHeight: '100px', overflowY: 'scroll'}}>{showCategories()}</ul>
        </div>
        <div className="col-md-7">{submitLinkForm()}</div>
      </div>
      {JSON.stringify(categories)}
    </Layout>
  );
};

export default Create;
