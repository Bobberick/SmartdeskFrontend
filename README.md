The frontend for the UITFarmer's smartdesk project

This frontend use only HTML, CSS and Javascript, with Firebase as the database

For it to work you need to setup Firebase Authentication, Firestore with the structure like the image include in the repo, the Firebase Storage including 3 folders: Labels, where you place all the image for face recognition, with the structure Labels/[Name]/[image], the image must be numbered starting from 1, accept jpg or png. The other 2 folders customProfilePic and defaultProfilePic contain images for profile pictures


This code can be run on Github Page without much setup

Face recognition are done by using Faceapi.js, might have problem loading and running on some hardware and mobilephone

Some of the functions for this project was not finished, namely the function for admin to change/remove users info

Link to try out the Github Page: https://bobberick.github.io/SmartdeskFrontend/