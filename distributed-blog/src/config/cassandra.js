const { Client } = require('cassandra-driver');
const logger = require('../utils/logger');

const contactPoints = process.env.CASSANDRA_CONTACT_POINTS 
  ? process.env.CASSANDRA_CONTACT_POINTS.split(',') 
  : ['localhost'];

const client = new Client({
  contactPoints,
  localDataCenter: 'datacenter1',
  keyspace: 'blog_demo'
});

const initCassandra = async () => {
  try {
    await client.connect();
    logger.info('Connected to Cassandra cluster');

    // Create keyspace if not exists
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS blog_demo 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 2}
    `);

    // Create posts table if not exists
    await client.execute(`
      CREATE TABLE IF NOT EXISTS blog_demo.posts (
        post_id UUID PRIMARY KEY,
        title TEXT,
        content TEXT,
        created_at TIMESTAMP
      )
    `);

    logger.info('Cassandra schema initialized');
  } catch (error) {
    logger.error('Error initializing Cassandra:', error);
    throw error;
  }
};

module.exports = {
  client,
  initCassandra
}; 