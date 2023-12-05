# Encrypted Images Sharing System

This is a web-based system that allows users to store their images in encrypted form. These images can be shared with other users.

## Basic Features

- Sign up/Login via email and password.
- Upload PNG/JPG files.
- Show images in decrypted form.
- Filter images based on Your own/Shared with you images.
- Share one or many images with other users.
- Download one or many images.
- Delete one or many images.

## Technologies

- [CoreUI](https://coreui.io/) (React component library) for the frontend.
- Node/Express for creating API endpoints.
- JWT for Authentication and Authorization.
- MongoDB for storing users, images information and JWT tokens.
- Cloudinary for storing encrypted images.
- RSA algorithm for encrypting/decrypting images.

## Installation

To run this project locally, follow these steps:

1. Clone the repository.
2. Install the dependencies:
   - Navigate to the `server` directory and run `npm install`.
   - Navigate to the `client` directory and run `npm install`.
3. Set up Cloudinary:
   - Go to the [Cloudinary](https://cloudinary.com/) website.
   - Login/Sign up and then copy the `cloud_name`, `api_key` and `api_secret` for the next step.
   - Create a folder named `Encrypted Images Sharing` in Cloudinary's Media Library. If you'd like to set another name, you have to assign that name to `FOLDER_NAME` variable in the server/src/utils/cloudinary.js file.
4. Set up Environment Variables:
   - In the `server` and `client` directory, create a new file named `.env` based on the `.env.example` file.
   - Update the values of the environment variables in the `.env` file according to your preferences. Don't forget to:
     - Assign your `cloud_name` to the `CLOUDINARY_NAME` variable.
     - Assign your `api_key` to the `CLOUDINARY_KEY` variable.
     - Assign your `api_secret` to the `CLOUDINARY_SECRET` variable.
5. Run development server:
   - Navigate to the `server` directory and run `npm start`.
   - Navigate to the `client` directory and run `npm start`.
