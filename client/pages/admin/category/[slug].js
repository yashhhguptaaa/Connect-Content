
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

const Update = ({ oldCategory, token }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: "",
    success: "",
    imagePreview: oldCategory.image.url,
    buttonText: "Update",
    imageUploadText: "Update image",
    image: "",
  });

  const [content, setContent] = useState(oldCategory.content)

  const {
    name,
    error,
    image,
    success,
    buttonText,
    imagePreview,
    imageUploadText,
  } = state;

  const handleChange = (name) => (e) => {

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
    setState({ ...state, buttonText: "Updating" });
    console.table({name, content, image})
    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("CATEGORY UPDATE RESPONSE", response);
      setState({
        ...state,
        name: response.data.name,
        buttonText: "Updated",
        imageUploadText: "Upload image",
        imagePreview: response.data.image.url,
        success: `${response.data.name} is updated`,
      });
      setContent(response.data.content);
    } catch (error) {
      console.log("CATEGORY CREATE ERROR", error);
      setState({
        ...state,
        buttonText: "Create",
        error: error.response.data.error,
      });
    }
  };

  const updateCategoryForm = () => (
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
          {imageUploadText} {'  '}
          <span>
              { imagePreview!='' && <img src={imagePreview} alt="image" style={{height:"30px"}} />}
          </span>
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
          <h1>Update Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({req, query, token}) => {
    const response = await axios.post(`${API}/category/${query.slug}`)
    return {oldCategory: response.data.category, token}
}

export default withAdmin(Update);
