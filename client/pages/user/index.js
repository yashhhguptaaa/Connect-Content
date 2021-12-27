import Layout from "../../components/Layout";
import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import withUser from "../withUser";

const User = ({ user,userLinks, token }) => (
  <Layout>
    <p>{JSON.stringify(userLinks)}</p>
  </Layout>
);


export default withUser(User);
