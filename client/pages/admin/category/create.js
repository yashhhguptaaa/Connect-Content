import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Create = ({user, token}) => {
  const [state, setState] = useState({
    name: "",
    content: "",
    error: "",
    success: "",
    formData: process.browser && new FormData(),
    buttonText: "Create",
    imageUploadText: "Upload image",
  });

  const {
    name,
    content,
    error,
    success,
    formData,
    buttonText,
    imageUploadText,
  } = state;

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    const imageValue =
      name === "image" ? e.target.files[0].name : "Upload image";
    formData.set(name, value);
    setState({
      ...state,
      [name]: value,
      error: "",
      success: "",
      imageUploadText: imageValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    console.log(...formData);
    try {
        const response = await axios.post(`${API}/category`, formData, {
            headers : {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('CATEGORY CREATE RESPONSE',response)
        setState({...state, name: '',content:'',success: `${response.data.name} is created`, formData: '', buttonText:'Created',imageUploadText:'Upload image' })
    } catch (error) {
        console.log('CATEGORY CREATE ERROR',error)
        setState({...state, buttonText:'Create', error: error.response.data.error })
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        <textarea
          onChange={handleChange("content")}
          value={content}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary mt-2">
            {imageUploadText}
            <input
            onChange={handleChange("image")}
            type="file"
            accept="image/*"
            className="form-control"
            hidden
            />
        </label>
      </div>
      <div>
          <button className="btn btn-outline-warning mt-2">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Create Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);

/* FormData() :- It is a browser API which we can use in Client Side. 
We cannot use in server side because it's a browser api. */
