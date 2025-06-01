const axios = require('axios');

async function createPost() {
  try {
    const response = await axios.post('http://localhost/posts', {
      title: `Test Post ${Date.now()}`,
      content: 'This is a test post for stress testing'
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.message);
    return null;
  }
}

async function getPosts() {
  try {
    const response = await axios.get('http://localhost/posts');
    return response.data;
  } catch (error) {
    console.error('Error getting posts:', error.message);
    return null;
  }
}

async function stressTest() {
  console.log('Starting stress test...');
  const startTime = Date.now();
  const numRequests = 100;
  const results = {
    successful: 0,
    failed: 0,
    totalTime: 0
  };

  // Tạo nhiều bài viết
  console.log('Creating posts...');
  for (let i = 0; i < numRequests; i++) {
    const result = await createPost();
    if (result) {
      results.successful++;
    } else {
      results.failed++;
    }
  }

  // Đọc tất cả bài viết
  console.log('Reading posts...');
  const posts = await getPosts();
  if (posts) {
    console.log(`Total posts in database: ${posts.length}`);
  }

  results.totalTime = Date.now() - startTime;
  console.log('Stress test results:', {
    ...results,
    averageTimePerRequest: results.totalTime / numRequests
  });
}

stressTest(); 