import { useState, useEffect } from "react";

import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alerts";
import axios from "axios";
import Router, { withRouter } from "next/router";
import { API } from "../../../../config";
import jwt from "jsonwebtoken";
import Layout from "../../../../components/Layout";

const ResetPassword = ({ router}) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
    success: "",
    error: "",
  });

  const { name, token, newPassword, buttonText, success, error } = state;

  useEffect(() => {
      console.log("router.query.id): ",router.query.id)
    const decoded = jwt.decode(router.query.id);
    console.log("decoded token : ", decoded);
    if (decoded) setState({ ...state, name: decoded.name, token: router.query.id });
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Post email to:", email);
    setState({...state, buttonText: 'Sending'});
    try {
      const response = await axios.put(`${API}/reset-password`, { resetPasswordLink :token ,newPassword});
      // console.log("Response after forgot-password : ",response)
      setState({
        ...state,
        newPassword: "",
        buttonText: "Done",
        success: response.data.message,
      });
    } catch (error) {
      console.log("Reset PW Error : ", error);
      setState({
        ...state,
        buttonText: "Reset Password",
        error: error.response.data.error,
      });
    }
  };

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          onChange={handleChange}
          value={newPassword}
          placeholder="Type new password"
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
          <h4>Hi {name}, Here you can change your password.</h4>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordResetForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
