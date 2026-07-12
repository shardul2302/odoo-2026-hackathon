
import Badge from "../models/badge.model.js";

const badgeChecker = async (user) => {
    const badges = await Badge.find();

    for (const badge of badges) {
        const { type, threshold } = badge.unlockRule;

        let unlocked = false;

        if (type === "points") {
            unlocked = user.points >= threshold;
        }

        if (type === "xp") {
            unlocked = user.xp >= threshold;
        }

        if (type === "challenges") {
            unlocked =
                user.completedChallenges.length >= threshold;
        }

        const alreadyEarned = user.badges.some(
            (id) => id.toString() === badge._id.toString()
        );

        if (unlocked && !alreadyEarned) {
            user.badges.push(badge._id);
        }
    }

    await user.save();

    return user;
};

export default badgeChecker;