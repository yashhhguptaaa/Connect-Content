import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import axios from "axios";
import { API } from "../config";
import { isAuth } from "../helpers/auth";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Register",
    loadedCategories: [],
    categories: [],
  });

  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    loadedCategories,
    categories
  } = state;

  useEffect(() => {
    isAuth() && Router.push("/");
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
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

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Registering" });

    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        categories
      });

      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        categories: [],
        buttonText: "Submitted",
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Register",
        error: error.response.data.error,
      });
    }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange("name")}
          type="text"
          className="form-control mb-3"
          placeholder="Type your name"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          className="form-control mb-3"
          placeholder="Type your email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange("password")}
          type="password"
          className="form-control mb-3"
          placeholder="Type your password"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted ms-4">Select Categories , you are interested in</label>
        <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
          {showCategories()}
        </ul>
      </div>
      <div className="form-group">
        <button className="btn btn-outline-danger">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <br />
        {registerForm()}
      </div>
    </Layout>
  );
};

export default Register;
