"use client";

export class Gameservice {
  static getPlayersByKills(playerDataList: PlayerData[]): PlayerKillsSummary[] {
    return playerDataList
      .filter((playerData) => Object.keys(playerData.champions).length > 0)
      .map((playerData) => {
        const totalKills = Object.values(playerData.champions)
          .flat()
          .reduce((sum, game) => sum + game.kills, 0);
        const totalGames = Object.values(playerData.champions).flat().length;
        return {
          user_id: playerData.user_id,
          user_name: playerData.user_name,
          nationality: playerData.nationality,
          totalKills,
          killsPerGame: totalKills / totalGames,
          gameCount: totalGames,
          nickname: playerData.nickname,
          team_name: playerData.team_name,
        };
      })
      .sort((a, b) => b.killsPerGame - a.killsPerGame);
  }

  static getPlayersByDeaths(
    playerDataList: PlayerData[]
  ): PlayerDeathsSummary[] {
    return playerDataList
      .filter((playerData) => Object.keys(playerData.champions).length > 0)
      .map((playerData) => {
        const totalDeaths = Object.values(playerData.champions)
          .flat()
          .reduce((sum, game) => sum + game.deaths, 0);
        const totalGames = Object.values(playerData.champions).flat().length;
        return {
          user_id: playerData.user_id,
          user_name: playerData.user_name,
          nationality: playerData.nationality,
          totalDeaths,
          deathsPerGame: totalDeaths / totalGames,
          gameCount: totalGames,
          nickname: playerData.nickname,
          team_name: playerData.team_name,
        };
      })
      .sort((a, b) => a.totalDeaths - b.totalDeaths);
  }

  static getPlayersByAssists(
    playerDataList: PlayerData[]
  ): PlayerAssistsSummary[] {
    return playerDataList
      .filter((playerData) => Object.keys(playerData.champions).length > 0)
      .map((playerData) => {
        const totalAssists = Object.values(playerData.champions)
          .flat()
          .reduce((sum, game) => sum + game.assists, 0);
        const totalGames = Object.values(playerData.champions).flat().length;
        return {
          user_id: playerData.user_id,
          user_name: playerData.user_name,
          nationality: playerData.nationality,
          totalAssists,
          assistsPerGame: totalAssists / totalGames,
          gameCount: totalGames,
          nickname: playerData.nickname,
          team_name: playerData.team_name,
        };
      })
      .sort((a, b) => b.assistsPerGame - a.assistsPerGame);
  }

  static getChampionsByKills(
    playerDataList: PlayerData[]
  ): ChampionKillsSummary[] {
    console.log("playerdtalist", playerDataList);

    const championStats = this.aggregateChampionStats(playerDataList);
    return Object.entries(championStats)
      .map(([champion, stats]) => ({
        champion,
        totalKills: stats.kills,
        killsPerGame: stats.kills / stats.gameCount,
        gameCount: stats.gameCount,
        topPlayer: stats.topPlayer, // This might need further adjustments if you want to implement it again
      }))
      .sort((a, b) => b.totalKills - a.totalKills);
  }

  private static aggregateChampionStats(playerDataList: PlayerData[]) {
    const championStats: Record<string, any> = {};

    playerDataList.forEach((playerData) => {
      Object.entries(playerData.champions).forEach(([champion, games]) => {
        if (!championStats[champion]) {
          championStats[champion] = {
            kills: 0,
            deaths: 0,
            assists: 0,
            wins: 0, // Added this line for wins
            gameCount: 0,
          };
        }
        games.forEach((game: any) => {
          championStats[champion].kills += game.kills;
          championStats[champion].deaths += game.deaths;
          championStats[champion].assists += game.assists;
          championStats[champion].wins += game.win ? 1 : 0; // Update this line to increment wins if a game is won
          championStats[champion].gameCount += 1;
        });
      });
    });

    return championStats;
  }

  static getPlayersByKDA(playerDataList: PlayerData[]): PlayerKDAStats[] {
    return playerDataList
      .filter((playerData) => Object.keys(playerData.champions).length > 0)
      .map((playerData) => {
        let totalKills = 0;
        let totalAssists = 0;
        let totalDeaths = 0;
        let totalGames = 0;

        Object.values(playerData.champions).forEach((championGames) => {
          championGames.forEach((game) => {
            totalKills += game.kills;
            totalAssists += game.assists;
            totalDeaths += game.deaths;
            totalGames += 1;
          });
        });

        const kdaValue =
          totalDeaths === 0
            ? "Perfect"
            : ((totalKills + totalAssists) / totalDeaths).toFixed(2);

        // Calculate team average KDA
        const teamPlayers = playerDataList.filter(
          (p) => p.team_name === playerData.team_name
        );
        const teamTotalKDA = teamPlayers.reduce((sum, p) => {
          let pTotalKills = 0;
          let pTotalAssists = 0;
          let pTotalDeaths = 0;

          Object.values(p.champions).forEach((championGames) => {
            championGames.forEach((game) => {
              pTotalKills += game.kills;
              pTotalAssists += game.assists;
              pTotalDeaths += game.deaths;
            });
          });

          return (
            sum + (pTotalKills + pTotalAssists) / Math.max(pTotalDeaths, 1)
          );
        }, 0);

        const teamAverageKDA = teamTotalKDA / teamPlayers.length;

        const betterThanTeamAvg =
          ((parseFloat(kdaValue) - teamAverageKDA) / teamAverageKDA) * 100;

        // Round the percentage to two decimal places
        const roundedBetterThanTeamAvg =
          Math.round(betterThanTeamAvg * 100) / 100;

        return {
          user_id: playerData.user_id,
          user_name: playerData.user_name,
          nationality: playerData.nationality,
          kda: kdaValue,
          gameCount: totalGames,
          nickname: playerData.nickname,
          team_name: playerData.team_name,
          teamAverageKDA,
          betterThanTeamAvg: roundedBetterThanTeamAvg,
        };
      })
      .sort((a, b) => {
        if (a.kda === "Perfect") return -1;
        if (b.kda === "Perfect") return 1;
        return parseFloat(b.kda.toString()) - parseFloat(a.kda.toString());
      });
  }

  static getChampionKDAGames(playerDataList: PlayerData[]): any[] {
    const championStats = this.aggregateChampionStats(playerDataList);
    return Object.entries(championStats)
      .map(([champion, stats]) => ({
        champion,
        kda: (stats.kills + stats.assists) / Math.max(stats.deaths, 1),
        totalGames: stats.gameCount,
      }))
      .sort((a, b) => b.kda - a.kda);
  }

  static getChampionWinrate(playerDataList: PlayerData[]): any[] {
    const championStats = this.aggregateChampionStats(playerDataList);
    return Object.entries(championStats)
      .map(([champion, stats]) => {
        const winrate =
          stats.gameCount === 0 ? 0 : (stats.wins / stats.gameCount) * 100;
        return {
          champion,
          games: stats.gameCount,
          winrate: winrate,
        };
      })
      .sort((a, b) => b.winrate - a.winrate);
  }

  static getChampionsByGamesPlayed(playerDataList: PlayerData[]): any[] {
    const championStats = this.aggregateChampionStats(playerDataList);
    return Object.entries(championStats)
      .map(([champion, stats]) => ({
        champion,
        totalGames: stats.gameCount,
      }))
      .sort((a, b) => b.totalGames - a.totalGames);
  }

  static getGamesForChampion(
    playerDataList: PlayerData[],
    championName: string
  ): any[] {
    const gamesWithKDA: any[] = [];

    playerDataList.forEach((playerData) => {
      Object.entries(playerData.champions).forEach(([champion, games]) => {
        if (champion === championName) {
          games.forEach((game: any) => {
            const kda = (game.kills + game.assists) / Math.max(game.deaths, 1);
            gamesWithKDA.push({
              user_name: playerData.user_name,
              champion: championName,
              kda: kda.toFixed(2),
              ...game, // Include other game data if needed
            });
          });
        }
      });
    });

    return gamesWithKDA;
  }
}
