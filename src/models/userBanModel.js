const db = require('../config/database');

const UserBan = {
    banUser: async ({ userId, bannedBy, banDurationInSeconds = 0, reason = null }) => {
        if (!userId || !bannedBy) {
            throw new Error('Missing required parameters: userId or bannedBy.');
        }

        const banEnd = banDurationInSeconds === 0 ? null : new Date(Date.now() + (banDurationInSeconds * 1000)).toISOString();

        const query = `
            INSERT INTO user_bans (user_id, banned_by, ban_start, ban_end, reason, is_active, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, TRUE, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const values = [userId, bannedBy, banEnd, reason];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error banning user:', { userId, bannedBy, banDurationInSeconds, reason, error: error.message });
            throw new Error('Database query failed while banning user.');
        }
    },

    getActiveBanByUserId: async (userId) => {
        await UserBan.updateExpiredBans(); 

        const query = `
            SELECT * FROM user_bans
            WHERE user_id = $1 AND is_active = TRUE
            LIMIT 1;
        `;
        const values = [userId];
        
        try {
            const result = await db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching active ban for user ID ${userId}:`, error.message);
            throw new Error('Database query failed while fetching active ban.');
        }
    },

    updateExpiredBans: async () => {
        const query = `
            UPDATE user_bans
            SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
            WHERE ban_end IS NOT NULL
            AND ban_end < CURRENT_TIMESTAMP
            AND is_active = TRUE
            RETURNING *;
        `;
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error updating expired bans:', error.message);
            throw new Error('Failed to update expired bans.');
        }
    },

    unbanUser: async (userId) => {
        const query = `
            UPDATE user_bans
            SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND is_active = TRUE
            RETURNING *;
        `;
        const values = [userId];

        try {
            const result = await db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error unbanning user ID ${userId}:`, error.message);
            throw new Error('Database query failed while unbanning user.');
        }
    },
};

module.exports = UserBan;
