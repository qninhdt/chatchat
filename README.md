# chatchat

UET Codecamp project

AE clone repo về rồi code trong ấy nhé

-   client: frontend
-   server: backend

HTTP:

-   POST /api/signup { username, password } -> JWT token | null
-   POST /api/login { username, password } -> JWT token | null
-   GET /api/users/{id} -> User (ko co password)
-   GET /api/groups/{id}/messages -> danh sach tin nhan
-   POST /api/friends { friend_id } -> send friend request to <friend_id>

Socket IO:

-   client to server:

    -   "new_message"

-   server to client:
    -   "new_message"
    -   "new_friend"
    -   "online"
    -   "offline"

Database: 

<h3>DATABASE<h3>
User Model:
- _id
- username
- password
- display_name
- friendList: Danh sách id của bạn bè
- group_ids: Danh sách id của group chat
Group Model:
- _id
- members: Danh sách thành viên
Message Model:
- _id
- createdAt
- updatedAt
- groupId
- senderId
- content

Lưu ý: Các hàm dưới đây đều là hàm bất đồng bộ; nên trong trường hợp cần lấy giá trị trả về, mọi người vui lòng chờ bằng cách dùng promise hoặc async/await

-   user:
    -   async getUserById(id) -> User
    -   async getUserByUsername(userName) -> User
    -   async createUser(username, md5(password)) -> User
    -   async addFriend(user1, user2) (them vao nhom + them vao danh sach ban be) -> True/False
-   messages:
    -   async getMessages(group_id, offset, limit) -> list of message
    -   async createMessage(sender_id, group_id, content) -> True/False
-   group:
    - async createGroup(listmember) -> True/Falses
