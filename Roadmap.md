# 🗺️ Roadmap: OAuth2 & OIDC Side Project

Đây là một side project rất hay và thực tế. Dưới đây là một roadmap chi tiết, chia thành các giai đoạn (Phase) để bạn có thể hoàn thành dự án một cách có hệ thống.

---

## Phase 1: Foundation & Setup (Nền tảng)

_Mục tiêu: Có một client React và một server Node.js "nói chuyện" được với nhau và đăng ký ứng dụng với một Identity Provider (IdP) bên ngoài._

1.  **Khởi tạo Project:**
    - Tạo một project React (ví dụ: dùng `vite` hoặc `create-react-app`).
    - Tạo một project Node.js/Express (ví dụ: `npm init -y`, `npm install express cors`).
2.  **Kết nối Client-Server (Hello World):**
    - **Backend:** Tạo một endpoint API đơn giản, ví dụ `GET /api/health` trả về `{ status: 'ok' }`.
    - **Backend:** Cài đặt `cors` để React app (chạy ở port khác) có thể gọi API.
    - **Frontend:** Dùng `fetch` hoặc `axios` để gọi `GET /api/health` và hiển thị kết quả. _Mục tiêu: Đảm bảo client và server kết nối được, CORS hoạt động._
3.  **Chọn và Đăng ký IdP:**
    - Chọn một IdP bên ngoài để bắt đầu. **Khuyến nghị: Google**.
    - Truy cập Google Cloud Console, tạo một project mới.
    - Vào mục "APIs & Services" -> "Credentials".
    - Tạo một "OAuth client ID" (chọn "Web application").
    - **Quan trọng:** Cấu hình "Authorized JavaScript origins" (ví dụ: `http://localhost:5173`) và "Authorized redirect URIs" (ví dụ: `http://localhost:3000/api/auth/google/callback`).
    - Lưu lại **Client ID** và **Client Secret** của bạn. Đặt chúng vào file `.env` của server Node.js.

---

## Phase 2: Core User Auth (Authorization Code Flow + OIDC)

_Mục tiêu: Hoàn thành flow quan trọng nhất. User nhấn "Login", được đưa đến Google, đăng nhập, và server của bạn nhận được thông tin._

1.  **Frontend: Bắt đầu Flow:**
    - Tạo một nút "Login with Google".
    - Khi nhấn vào, **KHÔNG** gọi API. Thay vào đó, redirect trình duyệt của user đến **Authorization Endpoint** của Google.
    - URL sẽ có các query params:
      - `client_id`: (Client ID của bạn)
      - `redirect_uri`: (URI bạn đã đăng ký, ví dụ: `http://localhost:3000/api/auth/google/callback`)
      - `response_type=code`
      - `scope`: **`openid email profile`** (Đây là phần OIDC, yêu cầu ID Token và thông tin user)
      - `state`: (Một chuỗi ngẫu nhiên, bí mật để chống CSRF)
2.  **Backend: Xử lý Callback (Nhận Code):**
    - User đăng nhập ở Google, Google sẽ redirect về `redirect_uri` của bạn (ví dụ: `http://localhost:3000/api/auth/google/callback`) kèm theo `code` và `state` trong URL.
    - Tạo endpoint `GET /api/auth/google/callback` trong Express.
    - **Bảo mật:** Kiểm tra xem `state` trả về có khớp với `state` bạn đã tạo ban đầu không.
3.  **Backend: Đổi Code lấy Token:**
    - Từ trong endpoint callback, server Node.js của bạn (ở phía backend) thực hiện một request `POST` đến **Token Endpoint** của Google.
    - Request này phải bảo mật (server-to-server) và bao gồm:
      - `code`: (Code bạn vừa nhận được)
      - `client_id` và `client_secret`
      - `grant_type=authorization_code`
      - `redirect_uri`: (Phải khớp với URI đã dùng)
4.  **Backend: Nhận và Xử lý Token:**
    - Google sẽ trả về một JSON chứa: `access_token`, `refresh_token`, và quan trọng nhất là `id_token`.
    - **OIDC Step 1 (Validate ID Token):** Giải mã `id_token` (là một JWT). Bạn **PHẢI** validate nó (kiểm tra signature, `iss` - issuer, `aud` - audience, `exp` - expiry). Dùng thư viện như `google-auth-library` để làm việc này.
    - **OIDC Step 2 (Lấy User Info):**
      - Sau khi validate, `id_token` đã chứa thông tin user (email, name, `sub` - subject ID).
      - Bạn cũng có thể dùng `access_token` để gọi **UserInfo Endpoint** của Google (để thực hành).
    - **Tạo Session/JWT:** Từ thông tin user, tạo một JWT _của riêng bạn_ (dùng thư viện `jsonwebtoken`) và gửi nó về cho client React.

---

## Phase 3: Client-Side Token Management (React)

_Mục tiêu: Biến React app thành một "Single Page Application" có ý thức về trạng thái đăng nhập._

1.  **Secure Token Storage:**
    - Nhận JWT _của riêng bạn_ từ Phase 2 (Bước 4).
    - Lưu nó vào `localStorage` hoặc `sessionStorage`.
    - **Nâng cao (Khuyến nghị):** Cách tốt nhất là backend set một `HttpOnly` cookie. Đây chính là mục "Stateful Sessions" bạn ghi. Nếu dùng cookie, client không cần lưu gì cả.
2.  **Tạo API Interceptor (với `axios`):**
    - Tạo một "instance" của `axios`.
    - Viết một "request interceptor" để tự động đính kèm JWT vào header `Authorization: Bearer <token>` cho _mọi_ request gửi đến API của bạn.
    - (Nếu dùng `HttpOnly` cookie, cấu hình `axios` với `withCredentials: true`).
3.  **Backend: Tạo Middleware Bảo vệ:**
    - Tạo một Express middleware (ví dụ: `isAuthenticated`).
    - Middleware này sẽ đọc header `Authorization`, lấy JWT, và _verify_ nó (dùng `jsonwebtoken.verify`).
    - Nếu token hợp lệ, gán `req.user` và gọi `next()`. Nếu không, trả về lỗi 401.
4.  **Tạo Protected Routes:**
    - **Backend:** Áp dụng middleware `isAuthenticated` cho các API nhạy cảm (ví dụ: `GET /api/profile`).
    - **Frontend:** Tạo một component `<ProtectedRoute>` trong React. Component này kiểm tra xem user đã đăng nhập chưa (có token không). Nếu chưa, redirect về trang `/login`.
5.  **Xử lý Logout:**
    - Tạo nút Logout.
    - Khi nhấn:
      1.  Xóa token khỏi `localStorage`.
      2.  (Nếu dùng cookie) Gọi API `POST /api/logout` để backend xóa `HttpOnly` cookie.
      3.  Redirect user về trang chủ/login.

---

## Phase 4: Handling Expiry (Refresh Token Flow)

_Mục tiêu: Tự động làm mới token mà user không cần đăng nhập lại._

1.  **Backend: Lưu Refresh Token:**
    - Ở **Phase 2 (Bước 4)**, khi bạn nhận `refresh_token` từ Google, hãy lưu nó vào CSDL (PostgreSQL, MongoDB...) một cách an toàn, gắn với user ID. **Không bao giờ gửi Refresh Token cho client.**
2.  **Backend: Tạo Endpoint `POST /api/auth/refresh`:**
    - Endpoint này sẽ (một cách an toàn) tìm `refresh_token` của user trong CSDL.
    - Gửi `refresh_token` đó đến **Token Endpoint** của Google với `grant_type=refresh_token`.
    - Google sẽ trả về một `access_token` MỚI.
    - Backend của bạn tạo một JWT MỚI (cho app của bạn) và gửi nó về cho client.
3.  **Frontend: Xử lý Tự động Refresh:**
    - Viết một "response interceptor" cho `axios`.
    - Nếu một API request (ví dụ: `GET /api/profile`) thất bại với lỗi 401 (token hết hạn):
      1.  Tự động gọi `POST /api/auth/refresh` để lấy JWT mới.
      2.  Lưu lại JWT mới này.
      3.  **Tự động thực hiện lại** request ban đầu (`GET /api/profile`) với token mới.
    - _Kết quả: User không hề biết token vừa được làm mới._

---

## Phase 5: Implement Các Flow Khác

_Mục tiêu: Hoàn thành các flow OAuth2 còn lại trong mô tả._

1.  **Client Credentials Flow (Server-to-Server):**
    - Đây là flow đơn giản nhất. Không cần React.
    - Tạo một file script Node.js (ví dụ: `test_client_credentials.js`).
    - Từ script này, gọi thẳng đến **Token Endpoint** của Google (hoặc IdP của bạn).
    - Request body: `grant_type=client_credentials`, `client_id`, `client_secret`.
    - IdP sẽ trả về một `access_token`. Bạn có thể dùng token này để gọi các API "resource server".
2.  **Authorization Code Flow _with PKCE_** (Thay thế cho Implicit Flow):
    - **Lưu ý:** Flow **Implicit** đã lỗi thời và không an toàn. Flow hiện đại cho SPA (kể cả khi không có backend) là **Authorization Code Flow + PKCE**. Bạn nên làm flow này.
    - **Client (React):**
      1.  _Trước khi_ redirect (Phase 2, Bước 1), tạo một `code_verifier` (chuỗi ngẫu nhiên).
      2.  Tạo `code_challenge` (băm `code_verifier` bằng SHA256).
      3.  Gửi `code_challenge` và `code_challenge_method=S256` trong request đến Authorization Endpoint.
    - **Backend (Node):**
      1.  Ở bước đổi code lấy token (Phase 2, Bước 3), gửi thêm `code_verifier` (mà client gửi cho bạn) trong request.

---

## Phase 6: Future Enhancements (Nâng cao)

_Mục tiêu: Xây dựng IdP của riêng bạn và thêm các tính năng bảo mật._

1.  **Setup Custom Authorization Server:**
    - Đây là phần "khó nhằn" nhất. Bạn sẽ không dùng Google nữa mà _tự mình làm Google_.
    - Cài một thư viện chuyên dụng: **`node-oidc-provider`** (rất mạnh mẽ) hoặc `oauth2-server`.
    - Cấu hình provider của bạn:
      - Tạo các endpoint: `/authorize`, `/token`, `/userinfo`, `/jwks.json`.
      - Định nghĩa user của bạn (ví dụ: tạo CSDL user/password đơn giản).
      - Định nghĩa "client" (React app của bạn) trong config của provider.
    - Trỏ React app của bạn để "Login" với _chính server của bạn_ thay vì Google.
2.  **Custom Scopes & Claims:**
    - Trong config của Custom Authorization Server, định nghĩa các scope mới (ví dụ: `read:profile`, `write:settings`).
    - Điều chỉnh logic để khi client yêu cầu scope `read:profile`, ID Token/UserInfo sẽ trả về các "claim" (thông tin) tương ứng.
3.  **Multi-Factor Authentication (MFA):**
    - Tích hợp thư viện như `speakeasy` (cho TOTP - Google Authenticator).
    - Điều chỉnh flow đăng nhập của _Custom Authorization Server_ để sau khi nhập password, user phải nhập thêm mã TOTP.

---
