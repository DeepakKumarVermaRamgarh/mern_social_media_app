
# Social Media App

The Social App is a web application that allows users to make post, like post, comment on post and put a reply for comment, user can also share any post.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
## Features

- Secure login using jwt access token
- User can create post with or without image
- User can like or dislike any post
- Can comment on post
- Add a reply on comment
- Delete post
- Share post
- Get analytics of last 12 months
- Realtime notifications


## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- MongoDB set up and running.
- API keys for external services (e.g., Cloudinary).

## Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/DeepakKumarVermaRamgarh/mern_social_media_app.git
   cd mern_social_media_app
   ```

2. Install dependencies:

    `npm install` Or `yarn`

    3. Configure environment variables:

Create a .env file in the project root and set the following variables:
```shell
PORT
JWT_ACCESS_TOKEN_SECRET
JWT_REFRESH_TOKEN_SECRET
JWT_RESET_PASSWORD_SECRET
JWT_ACCESS_TOKEN_EXPIRE
JWT_REFRESH_TOKEN_EXPIRE
NODE_ENV
MONGO_URI
SMTP_HOST
SMTP_PORT
SMTP_SERVICE
SMTP_EMAIL
SMTP_PASSWORD
FROM_NAME
FROM_EMAIL
CLOUDINARY_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_SECRET
```

3. Start the server: 

`npm start`




    
## Usage

Access the web interface at http://localhost:3000 (or your configured backend URL).


## API Endpoints
### User API Endpoints
```shell
// route to register
/api/v1/register
// route to login user
/api/v1/login
// route to update access token
/api/v1/update-token
// route to logout
/api/v1/logout
// route to get profile
/api/v1/me
// route to forgot password
/api/v1/password/forgot
// route to reset password
/api/v1/password/reset/:token
// route to update password
/api/v1/password/update-password
// route to get all users
/api/v1/all-users
// route to get post analytics data
/api/v1/posts-analytics
// route to get comments analytics data
/api/v1/comments-analytics
```

### Post API Endpoints
```shell
// route to create new post
/api/v1/create-post
// route to delete a post
/api/v1/delete-post/:postId
// route to get all posts
/api/v1/get-all-posts
// route to like a post
/api/v1/like-post/:postId
// route to dislike a post
/api/v1/dislike-post/:postId
// route to get my posts
/api/v1/my-posts
```

### Comment API Endpoints
```shell
// route to create a comment on a post
/api/v1//create-comment/:postId
// route to add reply on a comment
/api/v1/add-reply/:commentId
// route to get all comments on a post
/api/v1/get-comments/:postId
```## Contributing
Contributions are welcome! If you find any issues or want to add enhancements, feel free to open a pull request. Please ensure you follow the existing code style and guidelines.



## Technologies Used
- Vite
- React
- Node
- Express
- MongoDB
- Cloudinary
- WebSocket
- Cookie-parser
- JsonWebToken
- BcryptJS
- Nodemailer

## License
This project is licensed under the [MIT License](LICENSE).


## Authors

*This file sharing app website was developed by* **Deepak Kumar Verma**.
- [@Deepak Kumar Verma](https://github.com/DeepakKumarVermaRamgarh)

