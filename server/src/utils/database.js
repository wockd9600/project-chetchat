import pool from '../sql/index.js';

export const runTransaction = async (callback) => {
    let conn = null;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        await callback(conn);
        await conn.commit();
    } catch (error) {
        if (conn) await conn.rollback();
        // console.log('error)
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

export const runQuery = async (conn, query, values, error_message) => {
    try {
        const [result] = await conn.query(query, values);
        if (result.length === 0) throw new Error('length 0' + ' ' + query);
        return result;
    } catch (error) {
        // console.error('Error in runQuery:', error);
        throw error;
    }
}