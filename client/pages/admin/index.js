import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";

const Admin = ({user}) => <Layout><h1>Admin Page {JSON.stringify(user)}</h1></Layout>
export default withAdmin(Admin);