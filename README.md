# chatchat

UET Codecamp project

AE clone repo về rồi code trong ấy nhé

-   client: frontend
-   server: backend

HTTP:

-   POST /api/signup { username, password } -> JWT token | null
-   POST /api/login { username, password } -> JWT token | null
-   GET /api/users/{id} -> User (ko co password)
-   GET /api/groups/{id}/messages ->

/api -> /fakeapi/

async/await

Socket IO:

-   khi nguoi dung chat:
    -> emit event "new_message" { content: "<message>" }
    -> gọi createMessage lưu vào db
    -> server sẽ emit lại 1 event cx "new_message" { sender_id: <>, content: "<message>" }

-   khi them ban bè:
    -> emit event "friend" { sender_id, friend_id }
    -> gọi addFriend(user1, user2)
    -> server emit "friend" tới 2 thằng { sender_id, friend_id }

Database: 

Lưu ý: Các hàm dưới đây đều là hàm bất đồng bộ; nên trong trường hợp cần getMessages hoặc getUser, mọi người vui lòng chờ bằng cách dùng promise hoặc async/await

-   user:
    -   async getUserById(id) -> User
    -   async getUserByUsername(userName) -> User
    -   async createUser(username, md5(password))
    -   async addFriend(user1, user2) (them vao nhom + them vao danh sach ban be)
-   messages:
    -   async getMessages(group_id, offset, limit)
    -   async createMessage(sender_id, group_id, content)
