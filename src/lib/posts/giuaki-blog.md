---
title: "Apache Cassandra"
date: "2025-11-05"
updated: "2025-11-05"
categories:
  - "Distributed Systems"
  - "Technology"
  - "DB"
coverImage: "/images/cassandra.png"
coverWidth: 16
coverHeight: 9
excerpt: Giới thiệu về Apache Cassandra 
---

## Apache Cassandra và Ứng dụng trong Hệ thống Blog Phân tán

### Phần 1: Tổng quan về Apache Cassandra

#### 1. Mục đích của thư viện Apache Cassandra

##### Mục đích chính

Apache Cassandra là một hệ quản trị cơ sở dữ liệu phân tán (NoSQL) mã nguồn mở, được thiết kế để xử lý lượng lớn dữ liệu trên nhiều máy chủ, đảm bảo **tính sẵn sàng cao** mà không có **điểm lỗi duy nhất (SPOF - Single Point of Failure)**.

#### Các vấn đề mà Cassandra giải quyết

- **Khả năng mở rộng theo chiều ngang (Horizontal Scalability):** Dễ dàng thêm node mới để tăng hiệu năng xử lý.
- **Tính sẵn sàng cao (High Availability):** Dữ liệu được sao chép trên nhiều node để đảm bảo hệ thống luôn hoạt động.
- **Hiệu suất ghi cao:** Tối ưu hóa cho các thao tác ghi – phù hợp với các ứng dụng có lượng ghi lớn.
- **Phân tán địa lý (Geo-distribution):** Cho phép triển khai trên nhiều trung tâm dữ liệu nhằm giảm độ trễ.
- **Xử lý lượng dữ liệu lớn:** Hỗ trợ quản lý dữ liệu ở quy mô terabyte đến petabyte.

---

### 2. Điểm mạnh của Apache Cassandra

- **Không có điểm lỗi duy nhất (No SPOF):** Kiến trúc phi tập trung, không có master node.
- **Tuyến tính mở rộng:** Hiệu suất tăng gần như tuyến tính theo số lượng node.
- **Bền bỉ (Durability):** Dữ liệu được sao lưu và có thể backup dễ dàng.
- **Tunable consistency:** Cho phép tùy chỉnh giữa Consistency, Availability, và Partition tolerance theo CAP theorem.
- **Ngôn ngữ truy vấn CQL:** Dễ làm quen vì cú pháp tương tự SQL.
- **Hiệu suất cao:** Nhờ mô hình lưu trữ dựa trên LSM-tree.

---

### 3. Điểm yếu của Apache Cassandra

- **Hạn chế trong truy vấn phức tạp:** Không hỗ trợ JOIN, GROUP BY như các hệ quản trị RDBMS.
- **Mô hình dữ liệu cần thiết kế trước:** Cần xác định trước các pattern truy vấn để tối ưu schema.
- **ACID chưa đầy đủ:** Chỉ đảm bảo ACID ở cấp độ hàng (row-level).
- **Cập nhật và xóa dữ liệu tốn tài nguyên:** Do sử dụng mô hình append-only.
- **Tiêu thụ bộ nhớ lớn:** Cần nhiều RAM để hoạt động hiệu quả.
- **Chi phí vận hành:** Quản lý và bảo trì cluster phức tạp, yêu cầu kỹ năng chuyên sâu.

---

### 4. So sánh với các hệ thống cơ sở dữ liệu khác

| Đặc điểm               | Apache Cassandra    | MongoDB             | Redis               | MySQL               |
|------------------------|---------------------|----------------------|---------------------|---------------------|
| Mô hình dữ liệu        | Column-family store | Document store       | Key-value store     | Relational          |
| Mở rộng                | Horizontal          | Horizontal (sharding)| Cluster (Redis)     | Chủ yếu Vertical    |
| Tính nhất quán         | Tunable             | Tunable              | Strong              | Strong              |
| Truy vấn phức tạp      | Hạn chế              | Hỗ trợ tốt           | Rất hạn chế         | Hỗ trợ đầy đủ       |
| Hiệu suất ghi          | Rất cao              | Cao                  | Cực cao             | Trung bình          |
| Khả năng phân tán      | Rất tốt              | Tốt                  | Trung bình          | Hạn chế              |
| Transaction            | Row-level           | Document-level       | Không đầy đủ        | Đầy đủ              |

---

### 5. Ứng dụng phổ biến của Apache Cassandra

- Hệ thống lưu trữ **tin nhắn và log** thời gian thực
- Hệ thống lưu trữ dữ liệu **IoT**
- **Hệ thống đề xuất sản phẩm**
- Hệ thống phân tích thời gian thực (real-time analytics)
- Các ứng dụng xã hội quy mô lớn như **Netflix**, **Twitter**, **Facebook**
- Hệ thống lưu trữ và phân tích dữ liệu **thời tiết**
- Các hệ thống cần khả năng mở rộng và tính sẵn sàng cao

---

## Phần 2: Kế hoạch dự án

### 📝 Kế hoạch dự án: Xây dựng hệ thống blog phân tán sử dụng Apache Cassandra

#### 🎯 Mục tiêu

Dự án này nhằm xây dựng một hệ thống blog đơn giản cho phép người dùng tạo và xem bài viết, đồng thời áp dụng các khái niệm đã học trong môn **hệ thống phân tán**, bao gồm:

- **Phân mảnh (Sharding)** và/hoặc **Sao chép dữ liệu (Replication)**
- **Khả năng chịu lỗi (Fault Tolerance)**
- **Giao tiếp phân tán (Distributed Communication)**
- **Giám sát và kiểm thử tải đơn giản**

---

#### ⚙️ Kiến trúc hệ thống

##### Các thành phần chính

- **API Server (Node.js hoặc Java)**: Cung cấp REST API cho CRUD bài viết.
- **Cassandra Cluster (2 node)**: Lưu trữ dữ liệu bài viết.
- **Frontend (tùy chọn)**: Sử dụng blog hiện có ([nhatqwe.netlify.app/blog](https://nhatqwe.netlify.app/blog))

##### Mô hình triển khai

- **2 máy Docker hoặc VM**:
  - Mỗi máy chạy 1 node Cassandra và/hoặc 1 API Server.
  - Giao tiếp phân tán qua HTTP và Cassandra Driver (TCP).

---

#### 🗃️ Mô hình dữ liệu Cassandra

```sql
CREATE KEYSPACE blog_demo 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 2};

CREATE TABLE blog_demo.posts (
  post_id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP
);
```

Sử dụng replication_factor = 2 để sao chép dữ liệu sang ≥ 2 node.

---

#### 🔁 Luồng hoạt động

1. Người dùng gửi yêu cầu tạo bài viết (POST /posts) → API Server
2. API Server gửi dữ liệu đến Cassandra → Lưu trữ ở nhiều node
3. Người dùng gửi yêu cầu xem bài viết (GET /posts) → API Server đọc từ Cassandra

---

#### ✅ Đáp ứng các tiêu chí bắt buộc

| Tiêu chí | Cách thực hiện |
|----------|----------------|
| Fault Tolerance | Cassandra có replication_factor = 2, tiếp tục hoạt động khi 1 node lỗi |
| Distributed Communication | Giao tiếp HTTP (REST API) + Cassandra Driver (TCP), triển khai đa máy |
| Sharding hoặc Replication | Cassandra tự phân mảnh dữ liệu theo partition key post_id, có replication |
| Simple Monitoring/Logging | Ghi log trên API Server, CLI nodetool status, API /health trả trạng thái |
| Basic Stress Test | Viết script mô phỏng nhiều POST/GET, đo thời gian phản hồi và log kết quả |

---

#### 🧰 Công nghệ sử dụng

- **Backend**: Node.js + Express
- **Database**: Apache Cassandra (2 nodes)
- **Triển khai**: Docker

---

#### 📦 Kết quả kỳ vọng

- Hệ thống hoạt động ổn định khi 1 node Cassandra lỗi
- Các bài viết được sao lưu và phân phối trên nhiều node
- Giao tiếp phân tán thông suốt giữa các thành phần
- Có thể kiểm tra, log, và test hiệu năng đơn giản
