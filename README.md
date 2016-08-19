#QBank Admin
-----------------------
This is a admin tool for the QBank project created by MIT.

#Live Demo
-----------------------
http://d3rqboxx1s9wkd.cloudfront.net
http://www.qbankadmin.com.s3-website-us-east-1.amazonaws.com

#Getting Started:
-----------------------

Make sure to install git and npm before you start then:

1. git clone https://github.com/atomicjolt/react_client_starter_app.git my_project_name
2. Rename .env.example to .env. This file contains the port the server will use. The default 8080 should be fine, but you can also use a local domain or ngrok if you wish.
3. npm install
4. Start server with:

  `npm run hot`

then visit http://localhost:8080

# Google OAuth setup
-----------------------
1. Create a new project in the Google console (we call ours qbank-admin):
https://console.developers.google.com

2. On the project overview page be sure to enable the "Google+ API"

3. Get the OAuth id and secret for the project from the 'credentials' section of the console. Put the values
into _meta/variables/s-variables-dev.json (replace dev with whatever stage you are deploying).
"providerGoogleId"
"providerGoogleSecret"


# Using the QBank Admin
-----------------------
Source code lives in the client directory. Modify html and js files in that directory to build your application.


## React.js
-----------
React code can be found in client/js. We use Redux and the React-Router.


## Html
-----------
All html files live in client/html. The build process will properly process ejs in any html files as well as process markdown for files that end in .md. All front matter in .md files will be available to the ejs templates. See about.md for an example.


#Tests
-----------
Karma and Jasmine are used for testing. To run tests run:

  `npm run test`


#Check for updates
-----------
Inside the client directory run:

  `npm-check-updates`


#Production
-----------------------
If you want to see what your application will look like in production run

  `npm run live`

This will serve files from the build/prod directory.

#Deploy:
-----------------------

##Setup Client Deploy:
-----------------------

  1. Install the s3_website gem:

    `gem install s3_website`

  2. Create s3_website.yml:

    `s3_website cfg create`

  3. Setup and AWS user:

    1. Login to your AWS console
    2. Find Identity & Access Management (IAM)
    3. Click 'Users'
    4. Click 'Create New Users'
    5. Save the user's credentials
    6. Click on the user
    7. Click the permissions tab.
    8. Under 'Inline Policies' create a new custom policy and paste in the policy below. Be sure to change the domains:

    For more details see the [s3_website gem instructions](https://github.com/laurilehmijoki/s3_website).

    ###IAM Policy:
    ```json

      {
        "Statement": [
            {
                "Action": [
                    "s3:ListBucket"
                ],
                "Effect": "Allow",
                "Resource": "arn:aws:s3:::www.reactclientstarterapp.com"
            },
            {
                "Action": "s3:*",
                "Effect": "Allow",
                "Resource": [
                    "arn:aws:s3:::www.reactclientstarterapp.com",
                    "arn:aws:s3:::www.reactclientstarterapp.com/*"
                ]
            }
        ]
      }
    ```

  4. Configure bucket as website:

    `s3_website cfg apply`
  5. Allow cloudfront to be used as CDN.


##Deploy Client:
-----------------------

  Build a development release without deploying:

  `npm run build_dev`


  Build a release without deploying:

  `npm run build`


  Build a release and deploy:

  `npm run release`


##Setup Serverless Function Deployment:
-----------------------

  1. Install the serverless package:

    `npm install serverless`

  2. Deploy functions

    `sls dash deploy`

##Deploy Serverless Functions:
-----------------------


## Deploying Lambda functions ##

Make sure that `npm install` has run successfully.  Then, execute `sls
dash deploy`, select all functions and endpoints, then select
"deploy".

##App Settings:
-----------------------
assessmentPlayerUrl: The URL for where the assessment player is located. This
                     is the URL that is always used for the assessment preview.

localPlayerUrl: The URL for the assessment player location in the iframe code
                that is generated for the user to copy and paste. Defaults
                to be the same as assessmentPlayerUrl.

localQbankUrl:  The URL for the QBank location in the iframe code that is
                generated for the user to copy and paste. Defaults to be the
                the same as qBankHost.

rootEndpoint: The URL for the lambda api.                
qBankHost: The URL for qbank. This URL is always used for the assessment preview.

License and attribution
-----------------------
MIT
