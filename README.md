# Practum

# Requierements

Make sure to install the following dependencies needed to run the project locally

* Docker (for mysql and prod)
* Primsa CLI (should be downloaded automatically with npm install)
* Node 16+
* ReactJS

# Installation

 Simply run ```npm install``` and wait for it to be done. If given any errors try using ```npm install --force```

To start the local database run `docker compose up -d`

To perform database migrations run `npx prisma db push`


# Running the local server

Note: Auth will not work locally without https url

To run the local server, run `npm run dev`

For more commands, check the scripts section inside `package.json` in the root directory

#Deployment

Go to the client directory and run npm build

This will build the production frontend

We can then run the backend and frontend together
