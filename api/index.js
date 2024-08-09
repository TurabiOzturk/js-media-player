import express from "express";
import { data } from "./data.js";
import bodyParser from 'body-parser';
import cors  from 'cors';
const app = express();

app.use(bodyParser.json())
app.use(cors())

// app.post("/playlists", function (req, res) {
//     // todo: save to db
//     console.log(req.body);
//     console.log('listName', req.body.listName);
//     console.log('listDescription', req.body.listDescription);

//     /*
//     savetoDb
//         db.listName = req.body.listName;
//     */
//     res.sendStatus(201);
// });

app.get("/playlists", function (req, res) {
  const playlists = [];

  for (const p of data.playlists) {
    playlists.push({
      listId: p.listId,
      listName: p.listName,
      coverImage: p.playlistCoverImage,
    });
  }

  res.send(playlists);

});

app.get("/playlists/:listId", function (req, res) {
  const listId = parseInt(req.params.listId);

  if (isNaN(listId)) {
    res.sendStatus(400);
    return;
  }

  for (const p of data.playlists) {
    if (p.listId === listId) {
      res.send(p);
      return;
    }
  }

  res.sendStatus(404);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});