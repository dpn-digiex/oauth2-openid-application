# Frontend - OAuth2 & OpenID Connect Application

Frontend application được xây dựng bằng React với TypeScript, hỗ trợ authentication thông qua OAuth2 và OpenID Connect.

## 📋 Mô tả

Ứng dụng frontend được xây dựng để demo các flow xác thực OAuth2 và OpenID Connect, bao gồm:

- Đăng nhập/Đăng ký với email và password
- Xác thực qua các provider bên thứ ba (Google, Facebook)
- Quản lý phiên đăng nhập với refresh token
- Route protection dựa trên role

## 🛠️ Tech Stack

- **React 19.2.0** với TypeScript
- **React Router DOM v7** - Routing và navigation
- **Vite 6** - Build tool và dev server
- **Axios** - HTTP client
- **Zustand 5** - State management
- **React Toastify** - Toast notifications

## 📁 Cấu trúc thư mục

```
src/
├── apis/              # Axios client configuration
├── assets/            # Static assets (images, fonts)
├── components/        # Reusable components
│   └── toast-notify/ # Toast notification wrapper
├── constants/         # Application constants (routes, roles, API endpoints)
├── contexts/          # React contexts (AuthProvider)
├── hooks/             # Custom React hooks
│   ├── useAuth.ts
│   ├── useAxiosPrivate.ts
│   └── useRefreshToken.ts
├── interfaces/        # TypeScript interfaces
├── pages/             # Page components
│   ├── account/       # Account management page (protected)
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   ├── forgot-password/
│   ├── error.tsx
│   ├── home.tsx
│   ├── page-not-found.tsx
│   └── unauthorized.tsx
├── router/            # Routing configuration
│   ├── AppRouter.tsx  # Main router configuration
│   ├── AppLayout.tsx  # Public layout
│   ├── PrivateLayout.tsx # Protected layout
│   └── RoleBasedRoute.tsx # Role-based route protection
├── stores/            # Zustand stores
├── utils/             # Utility functions
└── main.tsx           # Application entry point
```

## 🎨 Layouts

### AppLayout (Public Layout)

Layout chính cho các trang public:

- **Header**: Component header (hiện tại đang empty)
- **Footer**: Component footer (hiện tại đang empty)
- **Outlet**: Render child routes

**Routes sử dụng layout này:**

- `/` - Trang chủ (mặc định hiển thị LoginPage)
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký
- `/forgot-password` - Trang quên mật khẩu
- `/unauthorized` - Trang không có quyền truy cập

### PrivateLayout (Protected Layout)

Layout cho các trang yêu cầu authentication:

- Chỉ accessible khi user đã đăng nhập
- Bảo vệ bởi `RoleBasedRoute` component
- Hiện tại render `<Outlet />` trực tiếp (có thể thêm sidebar, header riêng sau)

**Routes sử dụng layout này:**

- `/account` - Trang quản lý tài khoản (yêu cầu role: ADMIN)

## 🚀 Cách chạy dự án

### Yêu cầu

- Node.js >= 18 (khuyến nghị >= 20)
- Yarn hoặc npm

### Cài đặt dependencies

```bash
yarn install
# hoặc
npm install
```

### Chạy development server

```bash
yarn dev
# hoặc
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng).

### Build cho production

```bash
yarn build
# hoặc
npm run build
```

### Preview production build

```bash
yarn preview
# hoặc
npm run preview
```

### Linting

```bash
# Kiểm tra lỗi
yarn lint

# Tự động fix lỗi
yarn lint:fix
```

### Format code

```bash
yarn format
```

## ⚙️ Cấu hình

### Environment Variables

Tạo file `.env` trong thư mục `frontend/` với các biến sau:

```env
VITE_API_URL=http://localhost:5000
```

- `VITE_API_URL`: URL của backend API (mặc định: `http://localhost:5000`)

### Path Aliases

Dự án sử dụng path aliases để import code dễ dàng hơn:

```typescript
import { ROUTES_APP } from "@constants";
import { AuthProvider } from "@contexts/AuthProvider";
import useAuth from "@hooks/useAuth";
// ... và nhiều alias khác
```

Các alias được cấu hình trong `vite.config.ts`:

- `@apis` → `./src/apis`
- `@assets` → `./src/assets`
- `@components` → `./src/components`
- `@constants` → `./src/constants`
- `@contexts` → `./src/contexts`
- `@hooks` → `./src/hooks`
- `@interfaces` → `./src/interfaces`
- `@pages` → `./src/pages`
- `@router` → `./src/router`
- `@stores` → `./src/stores`
- `@utils` → `./src/utils`

## 🔐 Authentication

Ứng dụng sử dụng:

- **Access Token**: Được lưu trong memory (state)
- **Refresh Token**: Được lưu trong HTTP-only cookie (managed bởi backend)
- **Auto refresh**: Token tự động được refresh khi hết hạn thông qua `useRefreshToken` hook

### Các hooks liên quan

- `useAuth`: Quản lý authentication state và actions
- `useAxiosPrivate`: Axios instance với interceptors để tự động thêm token và refresh khi cần
- `useRefreshToken`: Hook để refresh access token

## 📝 Chú ý

1. **Backend API**: Đảm bảo backend đang chạy tại `VITE_API_URL` trước khi chạy frontend
2. **CORS**: Backend phải được cấu hình CORS để cho phép frontend gọi API
3. **Cookies**: Refresh token được lưu trong HTTP-only cookie, cần đảm bảo backend set cookie với đúng domain
4. **Roles**:
   - ADMIN: 202
   - EDITOR: 203
   - USER: 204
   - ACCESS_ALL: 205
5. **Protected Routes**: Các route trong `PrivateLayout` yêu cầu user đã đăng nhập và có role phù hợp

## 🔄 Scripts có sẵn

- `yarn dev` - Chạy development server
- `yarn build` - Build cho production (compile TypeScript + build với Vite)
- `yarn preview` - Preview production build
- `yarn lint` - Kiểm tra linting errors
- `yarn lint:fix` - Tự động fix linting errors
- `yarn format` - Format code với Prettier

## 📚 Tài liệu thêm

Xem README.md ở root của project để biết thêm về OAuth2 và OpenID Connect flows được implement.
