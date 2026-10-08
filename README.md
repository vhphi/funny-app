# Funny App

Full-stack mẫu với **React (UI)**, **ASP.NET Core 8 Web API**, **SQL Server**, và các **layer tách biệt**.

## Cấu trúc thư mục

```
funny-app/
├── src/
│   ├── backend/                    # Solution .NET
│   │   ├── FunnyApp.slnx
│   │   ├── FunnyApp.Domain/        # Entity, rule nghiệp vụ thuần (không phụ thuộc framework)
│   │   ├── FunnyApp.Application/   # DTO, service, interface repository
│   │   ├── FunnyApp.Infrastructure/# EF Core, DbContext, triển khai repository
│   │   └── FunnyApp.Api/           # HTTP API, DI, CORS, Swagger
│   └── frontend/
│       └── funny-app-web/          # React + TypeScript (Vite)
│           ├── src/api/            # Gọi REST API
│           └── src/types/          # Kiểu dữ liệu UI
```

### Luồng phụ thuộc (backend)

```
Api → Application + Infrastructure
Infrastructure → Application + Domain
Application → Domain
Domain → (không reference project khác)
```

## Yêu cầu

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server (LocalDB / Express / full instance)

## Cấu hình database

Sửa connection string trong `src/backend/FunnyApp.Api/appsettings.json` (hoặc `appsettings.Development.json`):

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=FunnyAppDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Tạo migration và cập nhật DB (chạy từ `src/backend`):

```powershell
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project FunnyApp.Infrastructure --startup-project FunnyApp.Api
dotnet ef database update --project FunnyApp.Infrastructure --startup-project FunnyApp.Api
```

## Chạy backend

```powershell
cd src/backend/FunnyApp.Api
dotnet run
```

Swagger: `http://localhost:5144/swagger`

## Chạy frontend

```powershell
cd src/frontend/funny-app-web
npm install
npm run dev
```

UI: `http://localhost:5173` — Vite proxy `/api` sang API cổng `5144`.

## API mẫu (Jokes)

| Method | URL | Mô tả |
|--------|-----|--------|
| GET | `/api/jokes` | Lấy danh sách |
| GET | `/api/jokes/{id}` | Chi tiết |
| POST | `/api/jokes` | Tạo mới `{ "setup", "punchline" }` |
| DELETE | `/api/jokes/{id}` | Xóa |

## Nâng cấp lên .NET 9

Đổi `<TargetFramework>net8.0</TargetFramework>` → `net9.0` trong các `.csproj` và cập nhật package EF Core tương ứng.
