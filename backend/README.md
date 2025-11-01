# Backend API Documentation

## 📋 Summary

Backend API được xây dựng bằng **Express.js** với **TypeScript**, cung cấp RESTful API với các tính năng:

- 🔒 **Security**: Helmet.js, CORS, Rate Limiting
- 📝 **Validation**: Zod schema validation với OpenAPI integration
- 📊 **Documentation**: Swagger/OpenAPI tự động
- 🏗️ **Architecture**: Layered architecture (Controller → Service → Repository)
- 🧪 **Testing**: Vitest test framework
- 📦 **Type Safety**: Full TypeScript với strict mode
- 🚀 **Production Ready**: Docker support, error handling, logging

## 📁 Project Layout

```
backend/
├── src/
│   ├── api/                    # API modules (theo domain)
│   │   ├── healthCheck/        # Health check endpoint
│   │   │   ├── __tests__/      # Unit tests
│   │   │   └── healthCheckRouter.ts
│   │   └── user/               # User module
│   │       ├── __tests__/      # Unit tests
│   │       ├── userController.ts   # Request handlers
│   │       ├── userModel.ts        # Zod schemas & types
│   │       ├── userRepository.ts  # Data access layer
│   │       ├── userRouter.ts      # Route definitions
│   │       └── userService.ts     # Business logic
│   │
│   ├── api-docs/               # OpenAPI/Swagger documentation
│   │   ├── __tests__/
│   │   ├── openAPIDocumentGenerator.ts
│   │   ├── openAPIResponseBuilders.ts
│   │   └── openAPIRouter.ts
│   │
│   ├── common/                 # Shared utilities
│   │   ├── __tests__/
│   │   ├── middleware/         # Express middlewares
│   │   │   ├── errorHandler.ts    # Global error handler
│   │   │   ├── rateLimiter.ts     # Rate limiting
│   │   │   └── requestLogger.ts   # Request logging (Pino)
│   │   ├── models/              # Shared data models
│   │   │   └── serviceResponse.ts  # Standard API response
│   │   └── utils/               # Utility functions
│   │       ├── commonValidation.ts  # Common Zod validations
│   │       ├── envConfig.ts         # Environment config (Envalid)
│   │       ├── httpHandlers.ts      # HTTP response helpers
│   │       └── zodExtension.ts      # Zod OpenAPI extension
│   │
│   └── index.ts                # Application entry point & server setup (includes Express app config, middleware, routes, and server startup)
│
├── dist/                       # Compiled JavaScript (generated)
├── node_modules/               # Dependencies
├── .env.example                # Environment variables template
├── .gitignore
├── Dockerfile                  # Docker configuration
├── eslint.config.mjs           # ESLint configuration
├── package.json
├── prettierrc                  # Prettier configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.mts            # Build configuration (TSUP)
└── yarn.lock

```

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Router Layer                │
│  (Request validation, OpenAPI docs)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Controller Layer             │
│    (HTTP request/response handling) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer               │
│      (Business logic)               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Repository Layer             │
│    (Data access, database queries)   │
└─────────────────────────────────────┘
```

### Request Flow

1. **Request** → Express Router
2. **Middleware** → Rate limiting, CORS, Helmet, Logging
3. **Router** → Route handler với Zod validation
4. **Controller** → Process request, call service
5. **Service** → Business logic
6. **Repository** → Data access
7. **Response** → ServiceResponse → HTTP response

### Entry Point (`index.ts`)

File `index.ts` là entry point duy nhất của ứng dụng, bao gồm:

1. **Zod Extension**: Import và extend Zod với OpenAPI support
2. **Express App Setup**: Tạo Express app instance
3. **Middleware Configuration**: CORS, Helmet, Rate Limiting, Request Logging
4. **Route Registration**: Đăng ký tất cả routes
5. **Error Handler**: Global error handling middleware
6. **Server Startup**: Khởi động HTTP server
7. **Graceful Shutdown**: Xử lý SIGINT/SIGTERM signals

**Exports**: `app` và `logger` được export để sử dụng trong tests và các modules khác.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 22.11.0
- **Yarn**: Package manager
- **TypeScript**: ^5.9.3

### Installation

```bash
# Install dependencies
yarn install
```

### Environment Configuration

Cấu hình các biến môi trường:

```env
NODE_ENV=development
HOST=localhost
PORT=5000
CORS_ORIGIN=http://localhost:3000
COMMON_RATE_LIMIT_MAX_REQUESTS=1000
COMMON_RATE_LIMIT_WINDOW_MS=1000
```

### Development

```bash
# Run development server với hot reload
yarn dev

# Server sẽ chạy tại http://localhost:5000
```

### Production Build

```bash
# Build TypeScript to JavaScript
yarn build

# Start production server
yarn start
```

### Testing

```bash
# Run tests
yarn test

# Run tests với coverage
yarn test -- --coverage
```

### Code Quality

```bash
# Lint code
yarn lint

# Fix linting errors
yarn lint:fix

# Format code (Prettier)
yarn format
```

## 📡 API Endpoints

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: (configure theo environment)

### Health Check

```
GET /health-check
```

Kiểm tra trạng thái server.

**Response:**

```json
{
  "success": true,
  "message": "Service is healthy",
  "responseObject": null,
  "statusCode": 200
}
```

### User Endpoints

#### Get All Users

```
GET /users
```

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "responseObject": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "statusCode": 200
}
```

#### Get User by ID

```
GET /users/{id}
```

**Parameters:**

- `id` (string, required): User ID

**Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "responseObject": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "statusCode": 200
}
```

### API Documentation

Swagger UI có sẵn tại:

- **Swagger UI**: `http://localhost:5000/`
- **OpenAPI JSON**: `http://localhost:5000/swagger.json`

## 🔧 Configuration

### Environment Variables

| Variable                         | Description                               | Default                 | Required |
| -------------------------------- | ----------------------------------------- | ----------------------- | -------- |
| `NODE_ENV`                       | Environment (development/production/test) | `development`           | No       |
| `HOST`                           | Server host                               | `localhost`             | No       |
| `PORT`                           | Server port                               | `3000`                  | No       |
| `CORS_ORIGIN`                    | CORS allowed origin                       | `http://localhost:3000` | No       |
| `COMMON_RATE_LIMIT_MAX_REQUESTS` | Max requests per window                   | `1000`                  | No       |
| `COMMON_RATE_LIMIT_WINDOW_MS`    | Rate limit window (ms)                    | `1000`                  | No       |

### Path Aliases

Dự án sử dụng path aliases để import dễ dàng hơn:

```typescript
// Thay vì
import { userService } from "../../../api/user/userService";

// Dùng
import { userService } from "@/api/user/userService";
```

Path alias được cấu hình trong `tsconfig.json`:

- `@/*` → `src/*`

## 🛡️ Security Features

### 1. Helmet.js

- Set security HTTP headers
- Prevent XSS, clickjacking, etc.

### 2. CORS

- Cấu hình cross-origin requests
- Chỉ cho phép origin được chỉ định

### 3. Rate Limiting

- Giới hạn số request từ một IP
- Sử dụng `ipKeyGenerator` để hỗ trợ IPv6
- Cấu hình: `COMMON_RATE_LIMIT_MAX_REQUESTS` requests trong `COMMON_RATE_LIMIT_WINDOW_MS` ms

### 4. Input Validation

- Tất cả input được validate bằng Zod schemas
- Automatic validation errors handling

## 📝 Code Patterns

### Service Response Pattern

Tất cả API responses sử dụng `ServiceResponse` class:

```typescript
// Success response
const response = ServiceResponse.success("Data retrieved", data, StatusCodes.OK);

// Failure response
const response = ServiceResponse.failure("Error message", null, StatusCodes.BAD_REQUEST);
```

### Request Validation

Sử dụng Zod schemas với `validateRequest` middleware:

```typescript
// Define schema
const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

// Use in router
userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);
```

### OpenAPI Documentation

Tự động generate OpenAPI docs từ Zod schemas:

```typescript
userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    params: z.object({
      id: z.string().describe("User ID"),
    }),
  },
  responses: createApiResponse(UserSchema, "Success"),
});
```

## 🐳 Docker

### Build Image

```bash
docker build -t backend-api .
```

### Run Container

```bash
docker run -p 8081:8081 \
  -e NODE_ENV=production \
  -e PORT=8081 \
  -e CORS_ORIGIN=http://localhost:3000 \
  backend-api
```

### Dockerfile

- Base image: `node:22.11.0-slim`
- Build command: `npm run build`
- Exposed port: `8081`
- Start command: `npm run start`

## ⚠️ Important Notes

### 1. Zod OpenAPI Extension

**⚠️ CRITICAL**: `extendZodWithOpenApi` phải được gọi **trước khi** bất kỳ Zod schema nào được tạo.

File `src/common/utils/zodExtension.ts` phải được import ở đầu `index.ts`:

```typescript
import "@/common/utils/zodExtension"; // Must be first!
```

**Không** extract nested schemas từ parent schema (như `GetUserSchema.shape.params`), vì sẽ mất OpenAPI extensions.

**Lưu ý**: Toàn bộ server setup (Express app configuration, middleware, routes, và server startup) được tích hợp trong file `index.ts`. File `app` và `logger` được export để có thể import trong tests hoặc các modules khác.

### 2. Rate Limiter

Sử dụng `ipKeyGenerator` từ `express-rate-limit` để xử lý IPv6:

```typescript
import { ipKeyGenerator } from "express-rate-limit";

keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown");
```

### 3. Environment Variables

Sử dụng `envalid` để validate environment variables. Tất cả env vars phải được định nghĩa trong `envConfig.ts`.

### 4. Error Handling

Tất cả errors được handle bởi global error handler middleware ở cuối middleware stack. Đảm bảo error handler được đặt **sau** tất cả routes.

### 5. Request Logging

Pino logger được sử dụng cho request logging. Logs được format bằng `pino-pretty` trong development.

### 6. Type Safety

- Sử dụng TypeScript strict mode
- Tất cả API responses được type-safe với Zod schemas
- ServiceResponse pattern đảm bảo consistent response structure

### 7. Testing

- Unit tests được đặt trong `__tests__/` folders
- Sử dụng Vitest framework
- Test files có pattern `*.test.ts`

### 8. Build Process

- TypeScript được compile bằng `tsup`
- Source maps được generate cho debugging
- Test files được exclude khỏi build

## 📚 Tech Stack

- **Runtime**: Node.js 22.11.0
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.9.3
- **Validation**: Zod 4.1.12
- **API Docs**: @asteasolutions/zod-to-openapi 8.1.0
- **Security**: Helmet 8.1.0
- **Rate Limiting**: express-rate-limit 8.2.1
- **Logging**: Pino 10.1.0
- **Testing**: Vitest 4.0.6
- **Build**: TSUP 8.5.0

## 📄 License

MIT

## 👤 Author

Phong Nguyen
