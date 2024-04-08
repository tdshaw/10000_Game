let storageItems = ["num_players", "player_names", "players"];

for(i = 0; i < storageItems.length; i++)
    localStorage.removeItem(storageItems[i]); // Reset any game values currently in storage
