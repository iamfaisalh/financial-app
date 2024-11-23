# Financial App

## Prerequisites

- [Install Postgres](https://www.postgresql.org/download/)
- [Install Node.js](https://nodejs.org/en/download/)
- [Install Python](https://www.python.org/downloads/)

## Setting Up Your Development Environment

### Backend setup

Make sure Postgres is set up, and create a database for this application (e.g FinancialAppDB)

#### Create a virtual environment:

Open a Terminal/CLI window and `cd` into this project's backend directory. Once you're in the backend directory on the terminal, run these commands:

```bash
python3 -m venv venv # python3 is for Mac/Linux, otherwise python
source venv/bin/activate # On Windows: venv\Scripts\activate
```

Note: you will know your virtual environment is set up correctly if you see `(venv)` on your terminal prompt. For example,`(venv) iamfaisalh@Faisals-MacBook-Pro backend % `

#### Install dependencies:

```bash
pip install -r requirements.txt
```

#### Set up environment variables

Create a `.env` file in the backend directory and paste the following

```
DATABASE_URL="postgresql+psycopg2://username:password@host:port/database_name"
JWT_SECRET_KEY="0c6d1831e42526c29fa244a5950f2ddbd098cf24b87bb839573b24877f707de6"
SECRET_KEY="f33d981a73389f3434bfaa09297e026016f6bee154c8724a22d6f48e3a502f04"
FLASK_APP="app"
FLASK_ENV="development"
ALLOWED_ORIGINS="http://localhost:3000"
```

For `DATABASE_URL` make sure to replace `username` with your postgres user, `password` with your postgres password, `host` with your database's host, `port` with the port at which postgres is running, and `database_name` with the name of the database you created

For example: `"postgresql+psycopg2://postgres:Faisal1234@localhost:5432/FinancialAppDB"`

After you have your `.env` file set up, just to be safe, deactivate the virtual environment and reactivate it to assure your virtual environment has no issues

```bash
deactivate
source venv/bin/activate # On Windows: venv\Scripts\activate
```

#### Run database mirgrations:

IMPORTANT NOTE!!:

After `flask db init`, if it asks you something like `Please edit configuration/connection/logging settings in '/path/to/financial-app-main/backend/migrations/alembic.ini' before proceeding.`, do the following:

- Open the alembic.ini file `nano migrations/alembic.ini` and paste your database url (the one you added in the `.env` file)
- It should look like `sqlalchemy.url = postgresql+psycopg2://postgres:Faisal1234@localhost:5432/FinancialAppDB`
- Then proceed with the migrate and upgrade commands

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

#### Starting the server

```bash
flask run
```

Now your server is running! You should see something like the following:

```bash
 * Serving Flask app 'app'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### Frontend setup

Open a new terminal window and `cd` into this project's frontend directory

#### Install dependencies:

```bash
npm install
```

#### Start the app in development mode on port 3000:

```bash
npm start
```

Open http://localhost:3000 to view the app in your browser, and enjoy the experience!

## Limitations and Future Improvements

Given that this is a project that won't be deployed in production, there are some limitations as well as things I'd do to improve this application.

yfinance does not provide some type of webhook feature, so we can't update stock data (specifically the price) on the front end in real time, unless we frequently make requests to check if the price has changed. The problem here is running into rate limit errors. We could perform a fallback handler that can signal to wait before making another request, and even implement Websocket.

Another limitation is that we would need to connect to implement a real, secure payment system to validate transactions for buying and selling stock shares, and being able to check your account balance or adding funds. This is a significant improvement that would give our application a professional feel.

Other features I would like to add are a Dashboard page where users can see some of their most recently bought shares, or even their most successful stock tickers. Additionally, we could give them suggestions as to which stock tickers they should buy shares for, and even provide thorough insights and analytics using their transaction history.
