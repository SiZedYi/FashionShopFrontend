# Fashion Shop Frontend - Chức Năng Demo

## 📋 Tổng Quan Project

Đây là một ứng dụng thương mại điện tử (E-commerce) được xây dựng với **Next.js 14**, **Tailwind CSS**, **Stripe Payment**, và có hệ thống **Admin Dashboard** với quản lý quyền hạn (RBAC - Role Based Access Control).

---

## 🎯 Chức Năng Chính Cần Demo

### 1. **Trang Chủ & Duyệt Sản Phẩm**
- **Đường dẫn**: `/` (Homepage)
- **Chức năng**:
  - Hiển thị các banner quảng cáo
  - Hiển thị sản phẩm nổi bật
  - Hiển thị các danh mục sản phẩm (Watches, Headphones, Computers)
  - Testimonial từ khách hàng
  - Newsletter subscription

**Demo Steps**:
1. Vào trang chủ
2. Cuộn xuống xem banner, sản phẩm nổi bật
3. Click vào danh mục để xem sản phẩm theo loại

---

### 2. **Cửa Hàng & Bộ Lọc Sản Phẩm**
- **Đường dẫn**: `/shop`
- **Chức năng**:
  - Hiển thị danh sách sản phẩm dưới dạng lưới (3 cột) hoặc danh sách
  - **Bộ lọc nâng cao**:
    - Lọc theo danh mục (Category)
    - Lọc theo thương hiệu (Brand)
    - Lọc theo màu sắc (Color)
    - Lọc theo khoảng giá (Min - Max Price)
  - Phân trang sản phẩm (10 sản phẩm/trang)
  - Chuyển đổi view: Lưới ↔ Danh sách

**Demo Steps**:
1. Vào `/shop`
2. Click nút "Filter" để mở bảng lọc
3. Chọn danh mục (ví dụ: "Watches")
4. Chọn khoảng giá ($100 - $500)
5. Chọn màu sắc (ví dụ: "Black")
6. Xem kết quả lọc được cập nhật
7. Click icon lưới/danh sách để đổi view
8. Click số trang để phân trang

---

### 3. **Tìm Kiếm Sản Phẩm**
- **Đường dẫn**: Header SearchBox, `/search?query=...`
- **Chức năng**:
  - Tìm kiếm sản phẩm theo từ khóa (real-time suggestions)
  - Hiển thị kết quả tìm kiếm

**Demo Steps**:
1. Click vào ô tìm kiếm ở header
2. Nhập từ khóa (ví dụ: "watch", "phone")
3. Xem gợi ý sản phẩm xuất hiện
4. Click vào sản phẩm hoặc nhấn Enter để xem kết quả đầy đủ

---

### 4. **Chi Tiết Sản Phẩm**
- **Đường dẫn**: `/shop/[id]`
- **Chức năng**:
  - Hiển thị hình ảnh sản phẩm (có thể chọn theo màu sắc)
  - Hiển thị giá, chiết khấu, giá sau chiết khấu
  - Hiển thị đánh giá & số lượt đánh giá
  - Chọn màu sắc sản phẩm
  - Nhập số lượng
  - Button "Add to Cart" & "Buy Now"
  - Button "Add to Wishlist"
  - Tab thông tin chi tiết, đánh giá, bình luận
  - Các sản phẩm liên quan

**Demo Steps**:
1. Click vào 1 sản phẩm bất kỳ trên `/shop`
2. Xem hình ảnh sản phẩm (click để thay đổi)
3. Chọn màu sắc (nếu có nhiều màu)
4. Thay đổi số lượng
5. Click "Add to Cart" hoặc "Buy Now"
6. Click biểu tượng tim để thêm vào wishlist

---

### 5. **Giỏ Hàng (Shopping Cart)**
- **Chức năng**:
  - Icon giỏ hàng trên header hiển thị số lượng sản phẩm
  - Click để mở drawer (popup) giỏ hàng
  - Xem danh sách sản phẩm trong giỏ
  - Cộng/trừ số lượng sản phẩm
  - Xóa sản phẩm khỏi giỏ
  - Xem tổng giá sản phẩm
  - Button "View Cart" để xem trang giỏ hàng đầy đủ

**Demo Steps**:
1. Thêm vài sản phẩm vào giỏ hàng
2. Click icon giỏ hàng ở header
3. Xem popup hiển thị sản phẩm
4. Tăng/giảm số lượng
5. Click "View Cart" để xem trang giỏ hàng đầy đủ
6. Xem "Order Summary" (Subtotal, Shipping, Tax, Total)

---

### 6. **Wishlist (Danh Sách Yêu Thích)**
- **Đường dẫn**: `/wishlist`
- **Chức năng**:
  - Xem danh sách sản phẩm đã thêm vào wishlist
  - Xóa sản phẩm khỏi wishlist
  - Thêm sản phẩm từ wishlist vào giỏ hàng

**Demo Steps**:
1. Từ chi tiết sản phẩm, click biểu tượng tim để thêm vào wishlist
2. Vào `/wishlist`
3. Xem danh sách sản phẩm đã lưu
4. Click nút "Add to Cart" để thêm vào giỏ
5. Click "X" để xóa khỏi wishlist

---

### 7. **Thanh Toán (Checkout)**
- **Đường dẫn**: `/checkout`
- **Chức năng**:
  - Nhập thông tin giao hàng:
    - Họ tên
    - Địa chỉ
    - Số điện thoại
    - Thành phố, Zip Code, Quốc gia
  - Hiển thị tóm tắt đơn hàng
  - **Hai phương thức thanh toán**:
    1. **Stripe Payment** (Thẻ tín dụng)
    2. **Cash on Delivery (COD)** (Thanh toán khi nhận hàng)
  - Áp dụng mã giảm giá (nếu có)

**Demo Steps**:
1. Từ trang cart, click "Checkout"
2. Nhập thông tin giao hàng
3. Xem "Order Summary" bên phải
4. Chọn phương thức thanh toán:
   - **Stripe**: Nhập thẻ test `4242 4242 4242 4242` (hoặc any expiry/CVC)
   - **COD**: Thanh toán khi nhận hàng

---

### 8. **Thanh Toán Stripe (Payment Flow)**
- **Quy trình Stripe Payment**:
  1. Click "Pay with Stripe"
  2. Order được tạo trên backend
  3. Modal Stripe xuất hiện
  4. Nhập thông tin thẻ
  5. Click "Pay"
  6. Backend xác minh payment
  7. Redirect đến `/order-success`

**Demo Steps**:
1. Ở trang checkout, click "Pay with Stripe"
2. Modal Stripe xuất hiện
3. Nhập thẻ test: `4242 4242 4242 4242`
4. Nhập expiry: `12/25`
5. Nhập CVC: `123`
6. Click "Pay"
7. Chờ xác minh
8. Redirect đến trang thành công

---

### 9. **Đơn Hàng & Lịch Sử Mua**
- **Đường dẫn**: `/my-orders`
- **Chức năng**:
  - Xem danh sách đơn hàng của người dùng
  - Xem chi tiết từng đơn hàng
  - Trạng thái đơn hàng (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
  - Phương thức thanh toán (STRIPE, COD)
  - Tổng tiền, ngày đặt hàng, ngày thanh toán

**Demo Steps**:
1. Đăng nhập tài khoản
2. Vào `/my-orders`
3. Xem danh sách đơn hàng
4. Click vào 1 đơn hàng để xem chi tiết
5. Xem trạng thái đơn hàng, sản phẩm, địa chỉ giao hàng

---

### 10. **Tài Khoản Người Dùng**
- **Đường dẫn**: `/my-account`
- **Chức năng**:
  - Xem & chỉnh sửa thông tin cá nhân
  - Thay đổi mật khẩu
  - Xem avatar người dùng

**Demo Steps**:
1. Đăng nhập
2. Vào `/my-account`
3. Xem thông tin cá nhân
4. Click "Edit" để cập nhật thông tin
5. Vào tab "Security" để đổi mật khẩu

---

### 11. **Dashboard Admin (RBAC - Role Based Access Control)**
- **Đường dẫn**: `/dashboard`
- **Yêu cầu**: Đăng nhập với tài khoản Admin

#### 11.1. **Quản Lý Quyền Hạn (Permissions)**
- **Đường dẫn**: `/dashboard/permissions`
- **Chức năng**:
  - Xem danh sách permissions (quyền hạn)
  - Tạo permission mới
  - Chỉnh sửa permission
  - Xóa permission
  - Phân trang

**Demo Steps**:
1. Vào `/dashboard/permissions`
2. Xem danh sách permissions hiện có
3. Click "Add Permission" để tạo mới
4. Nhập Name (ví dụ: "VIEW_PRODUCTS")
5. Nhập Description
6. Click "Create"
7. Click "Edit" để chỉnh sửa
8. Click "Delete" để xóa

---

#### 11.2. **Quản Lý Vai Trò (Roles)**
- **Đường dẫn**: `/dashboard/roles`
- **Chức năng**:
  - Xem danh sách roles (vai trò)
  - Tạo role mới với các quyền hạn
  - Chỉnh sửa role & gán quyền hạn
  - Xóa role
  - Xem số lượng quyền hạn của mỗi role

**Demo Steps**:
1. Vào `/dashboard/roles`
2. Xem danh sách roles hiện có
3. Click "Add Role" để tạo mới
4. Nhập Name (ví dụ: "Product Manager")
5. Nhập Description
6. Chọn các permissions cần gán
7. Click "Create"
8. Edit role để thay đổi permissions
9. Delete role

---

#### 11.3. **Quản Lý Người Dùng Admin**
- **Đường dẫn**: `/dashboard/users`
- **Chức năng**:
  - Xem danh sách admin users
  - Tạo admin user mới
  - Gán vai trò (roles) cho user
  - Xem quyền hạn của mỗi user
  - Xóa user
  - Tìm kiếm user theo email

**Demo Steps**:
1. Vào `/dashboard/users`
2. Xem danh sách admin users
3. Tìm kiếm user theo email
4. Click "Create User" để thêm admin mới
5. Nhập thông tin (Email, Password, Full Name)
6. Gán roles cho user
7. Click "Create"
8. Edit user để thay đổi roles

---

#### 11.4. **Quản Lý Sản Phẩm (Admin)**
- **Đường dẫn**: `/dashboard/products`
- **Chức năng**:
  - Xem danh sách tất cả sản phẩm
  - Tạo sản phẩm mới
  - Chỉnh sửa sản phẩm
  - Xóa sản phẩm
  - Tìm kiếm sản phẩm
  - Phân trang
  - Thay đổi số lượng hiển thị per page

**Demo Steps**:
1. Vào `/dashboard/products`
2. Xem danh sách sản phẩm
3. Tìm kiếm sản phẩm theo tên
4. Click "Add Product" để tạo mới
5. Nhập chi tiết: Tên, Mô tả, Giá, Discount, Kho
6. Chọn danh mục, thương hiệu, màu sắc
7. Upload hình ảnh
8. Click "Create"
9. Edit hoặc delete sản phẩm

---

#### 11.5. **Quản Lý Danh Mục (Categories)**
- **Đường dẫn**: `/dashboard/categories`
- **Chức năng**:
  - Xem danh sách danh mục sản phẩm
  - Tạo danh mục mới
  - Chỉnh sửa danh mục
  - Xóa danh mục
  - Upload ảnh đại diện danh mục

---

#### 11.6. **Quản Lý Đơn Hàng (Orders)**
- **Đường dẫn**: `/dashboard/orders`
- **Chức năng**:
  - Xem danh sách tất cả đơn hàng
  - Xem chi tiết đơn hàng
  - Cập nhật trạng thái đơn hàng
  - Tìm kiếm đơn hàng (theo số đơn, trạng thái, thành phố)
  - Phân trang

**Demo Steps**:
1. Vào `/dashboard/orders`
2. Xem danh sách đơn hàng
3. Tìm kiếm đơn hàng
4. Click vào đơn hàng để xem chi tiết
5. Cập nhật trạng thái (PENDING → PROCESSING → SHIPPED → DELIVERED)

---

#### 11.7. **Quản Lý Khách Hàng (Customers)**
- **Đường dẫn**: `/dashboard/customers`
- **Chức năng**:
  - Xem danh sách khách hàng
  - Xem thông tin chi tiết khách hàng
  - Xem lịch sử mua hàng của khách
  - Xóa khách hàng

---

#### 11.8. **Quản Lý Blog (Blogs)**
- **Đường dẫn**: `/dashboard/blogs`
- **Chức năng**:
  - Xem danh sách bài viết blog
  - Tạo bài viết blog mới
  - Chỉnh sửa bài viết
  - Xóa bài viết

---

#### 11.9. **Quản Lý Slider (Quảng Cáo)**
- **Đường dẫn**: `/dashboard/sliders`
- **Chức năng**:
  - Quản lý ảnh banner/slider trên homepage
  - Tạo slider mới
  - Chỉnh sửa slider
  - Xóa slider

---

### 12. **Hệ Thống Xác Thực (Authentication)**
- **Trang Đăng Nhập**: `/login`
- **Trang Đăng Ký**: `/register`
- **Chức năng**:
  - Đăng ký tài khoản khách hàng
  - Đăng nhập
  - Đăng xuất
  - JWT Token lưu trong cookies
  - Permission Guard (chỉ user có quyền mới truy cập certain pages)

**Demo Steps**:
1. Vào `/register` để đăng ký tài khoản
2. Nhập email, password
3. Click "Sign Up"
4. Vào `/login` để đăng nhập
5. Xem user info ở header avatar dropdown
6. Click logout để đăng xuất

---

### 13. **Dark Mode / Theme**
- **Chức năng**:
  - Chuyển đổi giữa Light & Dark mode
  - Toggle ở header
  - Lưu preference vào localStorage

**Demo Steps**:
1. Click icon moon/sun ở header
2. Xem giao diện chuyển đổi

---

### 14. **Responsive Design**
- **Chức năng**:
  - Mobile-friendly (điều hòa layout cho mobile, tablet, desktop)
  - Navigation menu responsive
  - Sidebar dashboard responsive

**Demo Steps**:
1. Mở DevTools (F12) → Toggle Device Toolbar
2. Xem layout trên mobile (375px), tablet (768px), desktop (1920px)
3. Click menu hamburger trên mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Shadcn/ui |
| State Management | Zustand |
| Form Validation | React Hook Form, Zod |
| Payment | Stripe |
| Icons | Lucide React, React Icons |
| Charts | Recharts |
| Animations | Framer Motion |
| API Calls | Fetch API |

---

## 📌 Các Trang Chính

### Customer Pages
- `/` - Homepage
- `/shop` - Cửa hàng
- `/shop/[id]` - Chi tiết sản phẩm
- `/cart` - Giỏ hàng (view đầy đủ)
- `/wishlist` - Danh sách yêu thích
- `/checkout` - Thanh toán
- `/order-success` - Thanh toán thành công
- `/my-orders` - Lịch sử đơn hàng
- `/my-account` - Thông tin tài khoản
- `/search?query=...` - Tìm kiếm
- `/about` - Giới thiệu
- `/blog` - Danh sách blog
- `/contact` - Liên hệ

### Admin Dashboard
- `/dashboard` - Trang chủ dashboard
- `/dashboard/permissions` - Quản lý quyền hạn
- `/dashboard/roles` - Quản lý vai trò
- `/dashboard/users` - Quản lý admin users
- `/dashboard/products` - Quản lý sản phẩm
- `/dashboard/categories` - Quản lý danh mục
- `/dashboard/orders` - Quản lý đơn hàng
- `/dashboard/customers` - Quản lý khách hàng
- `/dashboard/blogs` - Quản lý blog
- `/dashboard/sliders` - Quản lý slider

---

## 🔐 Permission System

### Các Permissions Chính

```
PRODUCTS:
- READ_PRODUCTS / WRITE_PRODUCTS / DELETE_PRODUCTS / MANAGE_PRODUCTS

ORDERS:
- READ_ORDERS / UPDATE_ORDERS / CANCEL_ORDERS / MANAGE_ORDERS

CUSTOMERS:
- READ_CUSTOMERS / WRITE_CUSTOMERS / DELETE_CUSTOMERS / MANAGE_CUSTOMERS

CATEGORIES:
- READ_CATEGORIES / WRITE_CATEGORIES / DELETE_CATEGORIES / MANAGE_CATEGORIES

BLOGS:
- READ_BLOGS / WRITE_BLOGS / DELETE_BLOGS / MANAGE_BLOGS

SLIDERS:
- READ_SLIDERS / WRITE_SLIDERS / DELETE_SLIDERS / MANAGE_SLIDERS

ROLES:
- READ_ROLES / WRITE_ROLES / DELETE_ROLES / MANAGE_ROLES

PERMISSIONS:
- READ_PERMISSIONS / WRITE_PERMISSIONS / DELETE_PERMISSIONS / MANAGE_PERMISSIONS

USERS:
- READ_USERS / WRITE_USERS / DELETE_USERS / MANAGE_USERS

ANALYTICS:
- VIEW_REPORTS / VIEW_STATISTICS / MANAGE_REPORTS
```

---

## 💳 Payment Flow (Stripe)

```
User clicks "Pay with Stripe"
    ↓
Frontend → createOrder() → Backend creates order
    ↓
Frontend → createStripePaymentIntent() → Stripe returns clientSecret
    ↓
Frontend → Show Stripe Modal with PaymentElement
    ↓
User enters card: 4242 4242 4242 4242 → Click Pay
    ↓
Frontend → stripe.confirmPayment()
    ↓
Backend → Verify payment with Stripe → Update order status to PAID
    ↓
Frontend → Clear cart → Redirect to /order-success
```

---

## 🎬 Demo Flow Recommendations

1. **Bắt đầu**: Vào homepage, xem các sản phẩm nổi bật
2. **Tìm kiếm**: Dùng search box tìm sản phẩm
3. **Lọc**: Vào `/shop` dùng filter tìm sản phẩm cụ thể
4. **Mua hàng**: Thêm sản phẩm vào giỏ → checkout → thanh toán
5. **Dashboard Admin**: Đăng nhập admin → quản lý products, orders, permissions, roles, users

---

## 📝 Ghi Chú

- **Test Stripe Card**: `4242 4242 4242 4242` (expiry: any future date, CVC: any 3 digits)
- **Admin Access**: Cần có quyền "MANAGE_*" để truy cập từng section
- **Responsive**: Project hỗ trợ Mobile, Tablet, Desktop
- **Dark Mode**: Support dark theme trên toàn bộ ứng dụng
