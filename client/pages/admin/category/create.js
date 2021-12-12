
import dynamic from 'next/dynamic'
import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import 'react-quill/dist/quill.bubble.css'

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    // formData: process.browser && new FormData(),
    buttonText: "Create",
    imageUploadText: "Upload image",
    image: "",
  });

  const [content, setContent] = useState('')

  const {
    name,
    error,
    image,
    success,
    buttonText,
    imageUploadText,
  } = state;

  const handleChange = (name) => (e) => {
    /* const value = name === "image" ? e.target.files[0] : e.target.value;
    const imageValue =
      name === "image" ? e.target.files[0].name : "Upload image";
    formData.set(name, value); */

    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
    });
  };

  const handleContent = event => {
      console.log("handleContent :",event)
      setContent(event)
      setState({...state, success: '', error: ''})
  }

  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          //   console.log("uri",uri);
          setState({
            ...state,
            image: uri,
            imageUploadText: event.target.files[0].name.split(".")[0],
          });
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });
    console.table({name, content, image})
    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("CATEGORY CREATE RESPONSE", response);
      setState({
        ...state,
        name: "",
        success: `${response.data.name} is created`,
        buttonText: "Created",
        imageUploadText: "Upload image",
      });
      setContent("");
    } catch (error) {
      console.log("CATEGORY CREATE ERROR", error);
      setState({
        ...state,
        buttonText: "Create",
        error: error.response.data.error,
      });
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
        <ReactQuill 
          value={content}
          onChange={handleContent}
          theme="bubble"
          placeholder='Write something....'
          className='pb-5 mb-3'
          style={{border: '1px solid #666'}}
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary mt-2">
          {imageUploadText}
          <input
            onChange={handleImage}
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
