# cronkeeper-api

### Requirements to run locally

Install Knex globally:

    sudo npm i -g knex

Have PostgreSQL and MongoDB installed.

On postgres create database `cronkeeper`

    CREATE DATABASE cronkeeper;

On linux make sure MongoDB is running:

    sudo systemctl start mongo

You can check if mongo is running with the following command:

    sudo systemctl status mongo

Install project dependencies, on the root folder of the project run:

    npm i

Set .env file with your credencials

To start the API(with nodemon) use the command:

    npm start