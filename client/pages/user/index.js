import Layout from "../../components/Layout";
import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import withUser from "../withUser";
import Link from "next/link";
import moment from "moment";

const User = ({ user, userLinks, token }) => {
  const listOfLinks = () =>
    userLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8">
          <a href={l.url} target="_blank" className="text-decoration-none">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
          <span className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
        <div className="col-md-12">
          <div className="badge text-dark">
            {l.type} / {l.medium}
            {l.categories.map((c, i) => (
              <Link href={`/links/${c.slug}`}>
                <a target="_blank">
                  <span
                    key={i}
                    className="badge btn btn-success ms-3"
                    style={{ fontSize: "12px", borderRadius: "12px" }}
                  >
                    {c.name}
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    ));
  return (
    <Layout>
      <h1>
        {user.name}'s Dashboard{" "}
        <span className="text-danger">-/{user.role}</span>
      </h1>
      <br />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user/link/create">
                <a className="nav link">Submit a link</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav link">Update Profile</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Your Links</h2>
          <hr />
          <p>Show all links</p>
          {listOfLinks()}
        </div>
      </div>
    </Layout>
  );
};

export default withUser(User);
