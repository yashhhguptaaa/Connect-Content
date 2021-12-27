import axios from "axios";
import {API} from '../config';
import { getCookie } from "../helpers/auth";

const withUser = Page => {
    const withAuthUser = props => <Page {...props} />
    withAuthUser.getInitialProps = async context => {
        const token = getCookie('token',context.req);
        let user= null, userLinks = null

        if(token) {
            try {
                const response = await axios.get(`${API}/user`,{
                    headers : {
                        authorization : `Bearer ${token}`,
                        contentType : 'application/json'
                    }
                })
                user = response.data.user
                userLinks = response.data.links
            } catch (error) {
                if(error.response.status === 401) {
                    user = null;
                }
            }
        }

        if(user === null) {
            // redirect
            context.res.writeHead(302, {
                Location : '/'
            });
            context.res.end()
        }
        else {
            return {
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user,
                userLinks,
                token
            };
        }
    }
    return withAuthUser;
};

export default withUser;