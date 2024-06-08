import data from "./data.json";

export const playlistMenuUIObjects = {
  playlistList: document.getElementById("playlistList"),
};

export const playlistMenu = {
  playlists: [],
  createplaylistArray: (val, array) => {
    for (let i = 0; i <= val; i++) {
      array.push(player.tracks[i].name);
    }
  },
  addPlaylistToUI: (playlistName, playlistImage) => {
    const listItem = document.createElement("li");
    listItem.classList.add("playlist-menu-item");

    const playlistTitleObj = document.createElement("h3");
    playlistTitleObj.textContent = playlistName;
    const playlistImageObj = document.createElement("img");
    playlistImageObj.src = playlistImage;

    listItem.append(playlistImageObj, playlistTitleObj);

    playlistMenuUIObjects.playlistList.appendChild(listItem);
  },
  generatePlaylistMenu: () => {
    if (playlistMenu.playlists.length === 0) {
      playlistMenu.playlists = data.playlists;

      for (let i = 0; i < playlistMenu.playlists.length; i++) {
        playlistMenu.addPlaylistToUI(
          playlistMenu.playlists[i].listName,
          playlistMenu.playlists[i].playlistCoverImage,
        );
      }
    } else {
      console.log(
        "There is already a list of " +
          playlistMenu.playlists.length +
          " songs!"
      );
      return false;
    }
  },

};


playlistMenu.generatePlaylistMenu();


