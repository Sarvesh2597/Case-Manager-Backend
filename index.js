const express = require("express");
const app = express();
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/user");
var database = require("./config/database");
const multer = require("multer");
mongoose.connect(database.url, { useNewUrlParser: true });
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
var methodOverride = require("method-override");
// Schema
var Insurer = require("./models/insurer");
var Provider = require("./models/provider");
var Admin = require("./models/admin");
const Case = require("./models/case");
var cors = require("cors");
const { secret, validateToken } = require("./auth/auth");
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
const port = 5000;
app.use(cors());

app.post("/api/insurer", validateToken, function (req, res) {
  // console.log(req);
  // use mongoose to get all todos in the database
  Insurer.create(
    {
      nameOfEntity: req.body.nameOfEntity,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email
    },
    function (err, insurer) {
      if (err)
        // console.log(err);
        res.send(err);

      // get and return all the employees after newly created employe record
      // Insurer.find(function(err, insurers) {
      // 	if (err)
      // 		res.send(err)
      res.json(insurer);
      // });
    }
  );
});

app.get("/api/insurer", validateToken, function (req, res) {
  Insurer.find(function (err, insurers) {
    if (err) res.send(err);
    res.json(insurers);
  });
});

app.post("/api/provider", validateToken, function (req, res) {
  // console.log(req);
  // use mongoose to get all todos in the database
  Provider.create(
    {
      nameOfProvider: req.body.nameOfProvider,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email
    },
    function (err, provider) {
      if (err)
        // console.log(err);
        res.send(err);

      // get and return all the employees after newly created employe record
      // Insurer.find(function(err, insurers) {
      // 	if (err)
      // 		res.send(err)
      res.json(provider);
      // });
    }
  );
});

app.get("/api/provider", validateToken, function (req, res) {
  Provider.find(function (err, provider) {
    if (err) res.send(err);
    res.json(provider);
  });
});

app.post("/api/admin", validateToken, function (req, res) {
  // console.log(req);
  // use mongoose to get all todos in the database
  Admin.create(
    {
      nameOfEntity: req.body.nameOfEntity,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      contact: req.body.contact,
      email: req.body.email
    },
    function (err, admin) {
      if (err)
        // console.log(err);
        res.send(err);

      // get and return all the employees after newly created employe record
      // Insurer.find(function(err, insurers) {
      // 	if (err)
      // 		res.send(err)
      res.json(admin);
      // });
    }
  );
});

app.get("/api/admin", validateToken, function (req, res) {
  Admin.find(function (err, admin) {
    if (err) res.send(err);
    res.json(admin);
  });
});

app.post("/api/case", validateToken, (req, res) => {
  Case.create(req.body)
    .then(caseResponse => res.json(caseResponse))
    .catch(err => res.send(err));
});

app.get("/api/case", validateToken, (req, res) => {
  const searchQuery = req.query;
  const queryArray = [];
  if (searchQuery) {
    Object.keys(searchQuery).forEach(key => {
      let queryObj = {};
      queryObj[key] = { $regex: searchQuery[key], $options: "$i" };
      queryArray.push(queryObj);
    });
  }
  const query = queryArray.length > 0 ? { $and: queryArray } : {};
  Case.find(query)
    .then(caseResponse => res.json(caseResponse.reverse()))
    .catch(err => res.send(err));
});

app.get('/api/case/:caseId', validateToken, (req, res) => {
  Case.findOne({ caseId: req.params.caseId })
    .then(caseResponse => res.json(caseResponse))
    .catch(err => res.send(err));
})

app.put("/api/case/:caseId", validateToken, (req, res) => {
  req.body.caseId = req.params.caseId;

  Case.findOneAndUpdate({ caseId: req.params.caseId }, req.body, { new: true })
    .then(dbCase => {
      res.json({ success: true, case: dbCase });
    })
    .catch(err => res.status(500).send({ message: "Something went wrong" }));
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  }
});

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1600000000, files: 10 },
  fileFilter: (req, file, callback) => {
    console.log(file)
    callback(null, true);
  }
}).array('files', 10);

app.post(
  "/api/upload",
  validateToken,
  (req, res) => {
    upload(req, res, function (err) {

      if (err) {
        console.log(err);
        res.status(500).error({ message: err });
      } else {
        const files = req.files;
        if (!files) {
          const error = new Error("Please choose files");
          error.httpStatusCode = 400;
          console.log(error)
          res.status(400).send('File error');
        }
        console.log(files)
        res.json({ success: true, files: files })
      }
    });
  }
);

app.get('/api/download/:filename', (req, res, next) => {

});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return res.json({ success: false, message: "Auth error" });
        }
        const token = jwt.sign({ email: user.email, name: user.name }, secret);
        res.send({
          user: { email: user.email, name: user.name },
          token: token
        });
      });
    })
    .catch(err => console.log(err));
});

app.post("/api/signup", (req, res) => {
  const saltRounds = 10;
  try {
    if (req.body.email && req.body.password) {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) throw err;
        User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name
        })
          .then(user => {
            const token = jwt.sign(
              { email: user.email, name: user.name },
              secret
            );
            res.send({
              user: { email: user.email, name: user.name },
              token: token
            });
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      });
    } else {
      res.status(400).json({ message: "Bad request!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get('/api/dropdownfields', validateToken, async (req, res) => {
  try{
    const providers = await Provider.find({});
    const insurers = await Insurer.find({});
    const admins = await Admin.find({});

    const responseObject = {
      providers: providers.map(provider => provider.nameOfProvider),
      insurers: insurers.map(insurer => insurer.nameOfEntity),
      admins: admins.map(admin => admin.nameOfEntity),
    }

    res.json(responseObject);
  } catch(err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
