const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
const { redErrorlogging } = require("../libs/utils/error.logging.util");

/**
 * Represents a PostgreSQL database driver.
 * @class
 */
class PostgresDriver {
  /**
   * Creates a new instance of the PostgresDriver.
   * @constructor
   * @param {Object} config - The configuration object for the database connection.
   */
  constructor(config) {
    this.pool = new Pool(config);
    this.debug = config?.opts?.debug || false;
  }

  /**
   * Connects to the PostgreSQL database.
   * @async
   * @returns {Promise<import('pg').Client>} A database client instance.
   * @throws {Error} Throws an error if the connection fails.
   */
  async connect() {
    try {
      const client = await this.pool.connect();
      return client;
    } catch (error) {
      throw new Error(`Failed to connect to Postgres: ${error}`);
    }
  }

  /**
   * Disconnects from the PostgreSQL database.
   * @async
   * @param {import('pg').Client} client - The database client instance to disconnect.
   * @throws {Error} Throws an error if disconnection fails.
   */
  async disconnect(client) {
    try {
      await client.release();
    } catch (error) {
      throw new Error(`Failed to disconnect from Postgres: ${error}`);
    }
  }

  /**
   * Inserts a record into a table.
   * @async
   * @param {Object} options - Options for the insertion.
   * @param {string} options.table - The name of the table to insert into.
   * @param {Object} options.data - The data to insert as a new record.
   * @returns {Promise<void>} Resolves when the insertion is successful.
   * @throws {Error} Throws an error if the insertion fails.
   */
  async insertOne({ table, data }) {
    const client = await this.pool.connect();
    try {
      if (!table || !data || Object.keys(data).length === 0) {
        throw new Error("`table` and `data` are required");
      }

      if (data.id === undefined || data.id === null) {
        data.id = uuidv4();
      }

      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = Array.from({ length: keys.length }, (_, i) => `$${i + 1}`);

      const queryText = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;
      if (this.debug) console.log(`\x1b[2m${queryText}\x1b[0m`);

      const result = await client.query(queryText, values);
      return result.rows[0];
    } catch (error) {
      redErrorlogging(error, __filename);
      throw new Error(`Error inserting record: ${error}`);
    } finally {
      client.release();
    }
  }

  /**
   * Finds a record in a table based on a specified column and value.
   * @async
   * @param {Object} options - Options for the search.
   * @param {string} options.table - The name of the table to search in.
   * @param {string} options.col - The name of the column to match for the search.
   * @param {any} options.value - The value to match in the specified column.
   * @returns {Promise<Object|null>} Resolves with the found record if it exists, or null if not found.
   * @throws {Error} Throws an error if the search fails.
   */
  async findOne({ table, col, value }) {
    const client = await this.pool.connect();
    try {
      if (!table || !col || !value) {
        throw new Error("`table`, `col`, and `value` are required");
      }

      const queryText = `SELECT * FROM ${table} WHERE ${col} = $1 LIMIT 1`;
      if (this.debug) console.log(`\x1b[2m${queryText}\x1b[0m`);

      const result = await client.query(queryText, [value]);
      return result.rows[0] || null;
    } catch (error) {
      redErrorlogging(error, __filename);
      throw new Error(`Error finding record: ${error}`);
    } finally {
      client.release();
    }
  }

  /**
   * Deletes a record from a table based on a specified column and value.
   * @async
   * @param {Object} options - Options for the deletion.
   * @param {string} options.table - The name of the table to delete from.
   * @param {string} options.col - The name of the column to match for deletion.
   * @param {any} options.value - The value to match in the specified column.
   * @returns {Promise<Object|null>} Resolves with the deleted record if found, or null if not found.
   * @throws {Error} Throws an error if the deletion fails.
   */
  async deleteOne({ table, col, value }) {
    const client = await this.pool.connect();
    try {
      if (!table || !col || !value) {
        throw new Error("`table`, `col`, and `value` are required");
      }

      const queryText = `DELETE FROM ${table} WHERE ${col} = $1 RETURNING *`;
      if (this.debug) console.log(`\x1b[2m${queryText}\x1b[0m`);

      const result = await client.query(queryText, [value]);
      return result.rows[0];
    } catch (error) {
      redErrorlogging(error, __filename);
    } finally {
      client.release();
    }
  }

  /**
   * Executes a SQL query on the database.
   * @async
   * @param {string} queryText - The SQL query text.
   * @param {Array} [params=[]] - Optional query parameters.
   * @returns {Promise<Array>} An array of query results.
   * @throws {Error} Throws an error if the query fails.
   */
  async query(queryText, params = []) {
    const client = await this.pool.connect();
    try {
      // if (this.debug) console.log(`\x1b[2m${queryText}\x1b[0m`);
      const result = await client.query(queryText, params);
      return result.rows;
    } catch (error) {
      redErrorlogging(error, __filename);
      return [];
    } finally {
      client.release();
    }
  }

  /**
   * Checks if a record with a specified value exists in a table and column.
   * @async
   * @param {Object} options - Options for the existence check.
   * @param {string} options.table - The name of the table to check.
   * @param {string} options.col - The name of the column to check.
   * @param {any} options.value - The value to check for existence.
   * @returns {Promise<boolean>} True if the record exists, false otherwise.
   */
  async exists({ table, col, value }) {
    try {
      if (!table || !col || !value) {
        throw new Error("`table`, `col`, and `value` are required");
      }

      const queryText = `SELECT EXISTS (SELECT 1 FROM ${table} WHERE ${col} = $1) AS exists`;
      if (this.debug) console.log(`\x1b[2m${queryText}\x1b[0m`);

      const result = await this.query(queryText, [value]);
      return !!result[0].exists;
    } catch (error) {
      redErrorlogging(error, __filename);
      return false;
    }
  }
}

module.exports = PostgresDriver;
