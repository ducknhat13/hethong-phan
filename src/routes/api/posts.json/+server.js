import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
    const postsDirectory = path.join(process.cwd(), 'src/lib/posts');
    const files = fs.readdirSync(postsDirectory);
    
    const posts = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const filePath = path.join(postsDirectory, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data: frontmatter, content } = matter(fileContents);
            
            // Kiểm tra nếu file trống hoặc không có nội dung
            if (!content.trim() || !frontmatter.title) {
                return null;
            }
            
            return {
                title: frontmatter.title,
                excerpt: frontmatter.excerpt || '',
                date: frontmatter.date || new Date().toISOString(),
                updated: frontmatter.updated || frontmatter.date || new Date().toISOString(),
                coverImage: frontmatter.coverImage || '',
                coverWidth: frontmatter.coverWidth || 1200,
                coverHeight: frontmatter.coverHeight || 630,
                categories: frontmatter.categories || [],
                slug: file.replace('.md', '')
            };
        })
        .filter(post => post !== null) // Lọc bỏ các bài viết null
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return json(posts);
}