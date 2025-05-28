import draftData from '../../intern_project_data.json';

export const processData = () => {
    const { bio, scoutRankings } = draftData;

    const players = bio.map(player => {
        const scoutData = scoutRankings.find(
            scout => scout.playerId === player.playerId
        );

        const rankingsArray = scoutData ? [
            scoutData["ESPN Rank"],
            scoutData["Sam Vecenie Rank"],
            scoutData["Kevin O'Connor Rank"],
            scoutData["Kyle Boone Rank"],
            scoutData["Gary Parrish Rank"]
        ].filter(rank => rank !== null) : [];

        const avgRanking = rankingsArray.length > 0
            ? rankingsArray.reduce((sum, rank) => sum + rank, 0) / rankingsArray.length
            : null;

        return {
            ...player,
            scoutRankings: scoutData || {},
            avgRanking
        };
    });

    const sortedPlayers = [...players].sort((a, b) => {
        if (a.avgRanking === null) return 1;
        if (b.avgRanking === null) return -1;
        return a.avgRanking - b.avgRanking;
    });

    return {
        players: sortedPlayers,
        stats: draftData.stats || [],
    };
};

export const getScouts = () => {
    return [
        "ESPN Rank",
        "Sam Vecenie Rank",
        "Kevin O'Connor Rank",
        "Kyle Boone Rank",
        "Gary Parrish Rank"
    ];
};

export const getRankingStatus = (playerRanking, scoutRanking, scoutName) => {
    if (!playerRanking || scoutRanking === null) return "neutral";

    const diff = playerRanking[scoutName] - playerRanking.avgRanking;
    if (diff < -3) return "high";
    if (diff > 3) return "low";
    return "neutral";
};

export default {
    processData,
    getScouts,
    getRankingStatus
}; 