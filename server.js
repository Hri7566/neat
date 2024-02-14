const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Person = require("./models/person");
const fs = require("fs");
const router = express.Router();
const https = require("https");

const MPP = require("mpp-client-net");
const client = new MPP(
  "wss://mppclone.com:8443",
  "ead940199c7d9717e5149919.96bb4d39-781a-4167-b0f9-b65b26d6421f",
);

var whitelist = [
  "5ce52c6017d5e600cc9e100a",
  "e687a73935e2e3fa9380fce6",
  "9e2fd179578865f3d96d5d29",
  "3d34d4352eca294aa727412c",
  "76421bd39ea277d5e3c1d3f8",
  "431f6bd12dfb988061b6d44d",
];

mongoose.connect("mongodb://127.0.0.1:27017/mpp-people", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;

let pcount = 0;

db.on("error", (err) => {
  console.log(err);
});

async function renderNames() {
  // client.setChannel("✧𝓡𝓟 𝓡𝓸𝓸𝓶✧");
  pcount = 0;

  for (const p of Object.values(client.ppl)) {
    let existing = await Person.find({ _id: p._id }).exec();
    if (existing.length > 0) {
      for (const ex of existing) {
        ex.name = p.name;
        ex.color = p.color;

        if (whitelist.indexOf(p._id) !== -1) {
          p.owner = true;
        } else {
          p.owner = false;
        }

        ex.save();
      }
    } else {
      let person = new Person();

    person._id = p._id;
      person.name = p.name;
      person.color = p.color;

      if (whitelist.indexOf(p._id) !== -1) {
        p.owner = true;
      } else {
        p.owner = false;
      }

      person.save();
    }
  }
  /*
  for (const index in client.ppl) {
    pcount++;
    let p = client.ppl[index];
    Person.find({}, (err, people) => {
      if (err) {
        console.error(err);
      }
      for (const i in people) {
        let p2 = people[i];
        if (p2._id == p._id) {
          p2.color = p.color;
          p2.name = p.name;
          if (whitelist.indexOf(p2._id) !== -1) {
            p2.owner = true;
          } else {
            p2.owner = false;
          }
          p2.save((err) => {
            if (err) {
              console.log(err);
              return;
            }
          });
        } else {
          let person = new Person();
          person.name = p.name;
          person._id = p._id;
          person.color = p.color;
          person.owner = false;
          person.save((err) => {
            if (err) {
              return;
            }
          });
        }
      }
    });
  }
  */
}

db.once("open", () => {
  console.log("Conncted to MongoDB");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static("public"));

client.start();
client.setChannel("✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧");

client.on("hi", (msg) => {
  renderNames();
});

app.get("/mpp", async function (req, res) {
  let NewPerson = require("./models/person");
  let people = await NewPerson.find({}).exec();

  res.render("mpp/index", {
    title: "People of ✧𝓡𝓟 𝓡𝓸𝓸𝓶✧",
    people: people,
    pcount: pcount,
  });
});

console.log("Storing names from room...");
var repeat = setInterval(() => {
  renderNames();
}, 10000);

app.get("/test", (req, res) => {
  res.render("test/index", {
    title: "test",
  });
});

app.get("*", (req, res) => {
  res.redirect("/mpp");
});

const port = "8443";
app.listen(port, function () {
  console.log("Server started on port", port);
});

/*
https
  .createServer(
    {
      key: fs.readFileSync("private.key"),
      cert: fs.readFileSync("certificate.crt"),
    },
    app,
  )
  .listen(443);
*/
