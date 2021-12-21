import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

const Admin = ({ user }) => (
  <Layout>
    <h1>Admin Dashboard</h1>
    <br />
    <div className="row">
      <div className="col-md-4">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/admin/category/create">
              <a>Create Category</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/category/read">
              <a>All Categories</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-md-8"></div>
    </div>
  </Layout>
);
export default withAdmin(Admin);
