import { useState, useEffect } from "react";

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import axios from "axios";
import Router from "next/router";
import { API } from "../../../config";
import Layout from "../../../components/Layout";

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Forgot Password",
    success: "",
    error: "",
  });

  const { email, buttonText, success, error } = state;

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, success:'',error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Post email to:", email);
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      // console.log("Response after forgot-password : ",response)
      setState({
        ...state,
        email: "",
        buttonText: "Done",
        success: response.data.message,
      });
    } catch (error) {
      console.log("FORGOT PW Error : ", error);
      setState({
        ...state,
        buttonText: "Forgot Password",
        error: error.response.data.error,
      });
    }
  };

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          onChange={handleChange}
          value={email}
          placeholder="Type your email"
          required
        />
      </div>
      <button className="btn btn-outline-warning mt-4">{buttonText}</button>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Forgot Password</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
