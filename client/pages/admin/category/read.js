
import dynamic from 'next/dynamic'
import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})
import Link from 'next/link';
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import 'react-quill/dist/quill.bubble.css'

const Read = ({user, token}) => {
    const [state, setState] = useState({
        error: '',
        success: '',
        categories: []
    })

    const {error, success, categories} = state;

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async() =>   {
        const response = await axios.get(`${API}/categories`)
        setState({...state, categories: response.data})
    }

    const listCategories = () =>(
        categories.map((c, i) => (
            <Link href={`/links/${c.slug}`} key={c._id}>
                <a
                style={{ border: "1px solid red" }}
                className="bg-light p-3 col-md-6 text-decoration-none"
                >
                <div>
                    <div className="d-flex row">
                    <div className="col-md-6">
                        <img
                        src={c.image && c.image.url}
                        alt={c.name}
                        style={{ width: "100px", height: "auto" }}
                        className="px-3"
                        />
                    </div>
                    <div className="col-md-12 ">
                        <h3>{c.name}</h3>
                    </div>
                    </div>
                </div>
                </a>
            </Link>
    )));

    return (
        <Layout>
            <div className='row'>
                <div className='col'>
                    <h1>List of categories</h1>
                    <br />
                </div>
            </div>

            <div className='row'>
                {listCategories()} 
            </div>
        </Layout>
    )
}

export default withAdmin(Read);

