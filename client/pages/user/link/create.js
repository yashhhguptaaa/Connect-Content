import {useState, useEffect} from "react";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

import axios from 'axios'
import {API} from '../../../config'

const Create = () => {

    const [state, setState] = useState({
        title : '',
        url : '',
        categories : [],
        loadedCategories : [],
        success : '',
        error : '',
        type : '',
        medium : ''
    })

    const {title, url, categories, loadedCategories, success, error, type, medium} = state;

    // load categories when component mounts using useEffect
    useEffect(() => {
        loadCategories()
    },[success])

    const loadCategories = async () => {
        const response = await axios.get(`${API}/categories`);
        setState({...state, loadedCategories: response.data})
    };

    

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1>Submit Link/URL</h1>
                    <br />
                    {JSON.stringify(loadedCategories)}
                </div>
            </div>
        </Layout>
    )
}

export default Create;