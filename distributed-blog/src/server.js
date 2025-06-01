const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cassandra = require('cassandra-driver');
const winston = require('winston');
const cors = require('cors');

// Cấu hình logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối Cassandra
const cassandraHosts = process.env.CASSANDRA_HOSTS ? process.env.CASSANDRA_HOSTS.split(',') : ['localhost'];
const client = new cassandra.Client({
  contactPoints: cassandraHosts,
  localDataCenter: 'datacenter1'
});

// Khởi tạo keyspace và table
async function initializeDatabase() {
  try {
    // Kết nối với Cassandra
    await client.connect();
    
    // Tạo keyspace
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS blog_demo 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 2}
    `);

    // Sử dụng keyspace
    await client.execute('USE blog_demo');

    // Tạo table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        post_id UUID PRIMARY KEY,
        title TEXT,
        content TEXT,
        created_at TIMESTAMP,
        slug TEXT
      )
    `);

    // Tạo index cho slug
    await client.execute(`
      CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts (slug)
    `);

    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'UP',
    nodeId: process.env.NODE_ID,
    timestamp: new Date().toISOString()
  };
  res.json(health);
});

// Tạo bài viết mới
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = uuidv4();
    const createdAt = new Date();
    
    // Tạo slug từ title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + postId.slice(0, 8);

    const query = 'INSERT INTO posts (post_id, title, content, created_at, slug) VALUES (?, ?, ?, ?, ?)';
    await client.execute(query, [postId, title, content, createdAt, slug], { prepare: true });

    logger.info(`Created new post with ID: ${postId} and slug: ${slug}`);
    res.status(201).json({ 
      id: postId, 
      title, 
      content, 
      created_at: createdAt,
      slug,
      url: `/posts/${slug}`
    });
  } catch (error) {
    logger.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Lấy danh sách bài viết
app.get('/posts', async (req, res) => {
  try {
    const query = 'SELECT * FROM posts';
    const result = await client.execute(query);
    
    logger.info(`Retrieved ${result.rowLength} posts`);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Lấy bài viết theo slug
app.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const query = 'SELECT * FROM posts WHERE slug = ?';
    const result = await client.execute(query, [slug], { prepare: true });

    if (result.rowLength === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    logger.info(`Retrieved post with slug: ${slug}`);
    res.json(result.first());
  } catch (error) {
    logger.error('Error retrieving post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;

// Khởi động server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}); 