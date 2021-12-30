exports.registerEmailParams = (email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: { 
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                        <html>
                            <h1>Verify your account</h1>
                            <p>Please use the following link to complete your registration</p>
                            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                        </html>
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration'
            }
        }
    };
}

exports.forgotPasswordEmailParams = (email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: { 
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                        <html>
                            <h1><b>Reset Password Link</b></h1>
                            <p>Please use the following link to reset your password: </p>
                            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                        </html>
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Password Reset Link'
            }
        }
    };
}

exports.linkPublishedParams = (email, data) => {
    return {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: [email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: { 
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `
                        <html>
                            <h1>New Link Published</h1>
                            <p>A new link titled to <b>${data.title}</b> has been published in your favourite categories.</p>
                            ${
                                data.categories.map(c => {
                                    return `
                                       <div>
                                            <h2>${c.name}</h2>
                                            <img src="${c.image.url}" alt="${c.name}" style="height:50px;" />
                                            <h3><a href="${process.env.CLIENT_URL}/links/${c.slug}">Check it Out😉</a></h3>
                                       </div> 
                                       <br/>
                                    `
                                }).join('--------------------------------------')
                            }

                            <p>Do not like to receive notifications ?</p>
                            <p><b><i>Don't worry</i></b></p>
                            <p>Turn off notification by going to your <b>dashboard</b> ➡️ <b>Update profile</b> and ✅ uncheck the categories.</p>
                            <p><a href="${process.env.CLIENT_URL}/user/profile/update">Click here😉</a></p>
                        </html>
                    `
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'New link published'
            }
        }
    };
}