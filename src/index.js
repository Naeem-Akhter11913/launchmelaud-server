const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config()
const app = express();
const Port = 8080;

/* DB */
require("./DB_Connection/connection");

app.use(bodyParser.json())
app.use(cookieParser("abcd-1234"));
app.use(express.json());


app.use(
  cors({
    origin: [
      'http://localhost:3030',
      'http://localhost:3000',
      'https://launchmeloud-client.vercel.app',
      'https://app.launchmeloud.com',
      'https://www.launchmeloud.com',
      "https://launchmeloud-admin.vercel.app",
      "https://launchmeloud-server-1.onrender.com",
      "https://launchmeloud-server-1b2a.onrender.com",
      "https://launchmeloud-server.vercel.app",
      "https://launchmeloud-admin2.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: 'Content-Type, Authorization , Origin, Access-Control-Allow-Origin, Access-Control-Allow-Credentials ,Set-Cookie ,Vary'
  })
)

app.use(bodyParser.json());



app.use(session({
  secret: '@33fdsf@A',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 3600000
  }
}));

/* importing all routes here */
const user_route = require("./Routes/user_route");
const project_route = require("./Routes/project_route");
const lead_route = require("./Routes/lead_route");
const company_route = require("./Routes/company_route");
const client_route = require("./Routes/client_route");
const filled_percentage = require("./Routes/user_filled_percentage");
const { errorLog } = require("./middleware/errorLog");


app.use("/api/v1/user", user_route);
app.use("/api/v1/project", project_route);
app.use("/api/v1/project-lead", lead_route);
app.use("/api/v1/company-route", company_route);
app.use("/api/v1/client-route", client_route);
app.use("/api/v1/filled-route", filled_percentage);
app.use(errorLog);

/* connection building */

app.listen(Port, () => {
  console.log("Your server is running on port no ----> " + Port)
});
