let storageItems = ["num_players", "player_names", "players", "index", "rolls", "indices", "roll_num", "clicked", "roll_check", "dupe_check", "reroll_check"];

for(i = 0; i < storageItems.length; i++)
    localStorage.removeItem(storageItems[i]); // Reset any game values currently in storage
