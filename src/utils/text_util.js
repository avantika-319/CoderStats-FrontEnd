export const COLORS = {
    NEWBIE: "#8b898b",
    PUPIL: "#0fdb0f",
    SPECIALIST: "#55d3ab",
    EXPERT: "#2e2eff",
    CANDIDATE_MASTER: "#fc3dff",
    MASTER: "#ffbd66",
    INTERNATIONAL_MASTER: "#ffaf38",
    GRANDMASTER: "#fe5858",
    INTERNATIONAL_GRANDMASTER: "#ff0000",
};

export function get_color(rank){
    if (rank < 1200) {
        return COLORS.NEWBIE;
    } else if (rank < 1400) {
        return COLORS.PUPIL;
    } else if (rank < 1600) {
        return COLORS.SPECIALIST;
    } else if (rank < 1900) {
        return COLORS.EXPERT;
    } else if (rank < 2100) {
        return COLORS.CANDIDATE_MASTER;
    } else if (rank < 2300) {
        return COLORS.MASTER;
    } else if (rank < 2400) {
        return COLORS.INTERNATIONAL_MASTER;
    } else if (rank < 2600) {
        return COLORS.GRANDMASTER;
    } else {
        return COLORS.INTERNATIONAL_GRANDMASTER;
    }
};