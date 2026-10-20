# 🌸 Website Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10

Ứng dụng web lãng mạn, tinh tế được xây dựng bằng **Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion**, hoạt động hoàn toàn ở phía client (Static HTML Export) và tối ưu hóa sẵn sàng để deploy lên **GitHub Pages** hoặc **Vercel**.

---

## 💖 Luồng Trải Nghiệm 3 Bước (User Flow)

1. **Màn hình 1: Tải ảnh kỷ niệm (`UploadScreen.tsx`)**
   - Giao diện chào đón ngọt ngào với tông hồng pastel, trái tim bay và hoa anh đào rơi.
   - Kéo-thả hoặc chọn ảnh từ máy (tối đa 30 ảnh, hỗ trợ JPG/PNG/WEBP, tự động nén qua Canvas để tối ưu bộ nhớ).
   - Sử dụng `URL.createObjectURL()` lưu tạm trên trình duyệt (kèm lưu trữ bền qua IndexedDB).
   - Lưới xem trước ảnh thumbnail kèm số lượng (`Đã chọn X/30 ảnh`) và nút xóa từng ảnh.
   - Nút **"Mở Lá Thư Yêu Thương 💌"** nổi bật (hoặc bấm bỏ qua để xem thư ngay).

2. **Màn hình 2: Hiệu ứng mở thư (`Envelope.tsx`)**
   - Phong bì thư 3D với tem bưu chính cổ điển và con dấu sáp trái tim nhịp đập.
   - Khi bấm mở, nắp thư mở ra (`rotateX: -160deg`), lá thư trượt lên với Framer Motion.
   - Pháo hoa giấy (confetti) và chùm trái tim nổ tung rực rỡ, kèm giai điệu nhẹ nhàng.

3. **Màn hình 3: Không gian chúc mừng chính (`CelebrationCard.tsx`)**
   - **Hiệu ứng nền (`ParticleEffect.tsx`):** Cánh hoa anh đào rơi tự nhiên bằng Canvas, hạt ánh kim lấp lánh (sparkles) và bokeh.
   - **Tương tác chạm/click:** Bất cứ điểm nào click/chạm trên màn hình đều bung nở chùm trái tim bay lên.
   - **Lời chúc 20/10:** Hộp thư với hiệu ứng gõ chữ (Typewriter) luân phiên các câu chúc chân thành. Dễ dàng sửa tại `config/site.ts`.
   - **Dynamic Gallery:** Các bức ảnh đã tải từ Bước 1 hiển thị dạng khung ảnh Polaroid lơ lửng, góc nghiêng tự nhiên, hover phóng to, click để mở Lightbox toàn màn hình (hỗ trợ vuốt trên điện thoại và phím mũi tên) và chế độ **Trình chiếu tự động (Slideshow)**.
   - Nút quay lại để bổ sung thêm ảnh bất cứ lúc nào.

---

## 🛠️ Cấu Trúc Mã Nguồn

```text
201026/
├── .github/workflows/deploy.yml # GitHub Actions build và deploy lên GitHub Pages
├── app/
│   ├── favicon.ico
│   ├── globals.css              # Cấu hình Tailwind, hiệu ứng thẻ Polaroid, thanh cuộn
│   ├── layout.tsx               # Fonts Dancing Script + Be Vietnam Pro, SEO OpenGraph
│   └── page.tsx                 # Điều phối 3 màn hình (upload -> envelope -> celebrate)
├── components/
│   ├── UploadScreen.tsx         # [Màn hình 1] Kéo thả ảnh, lưới thumbnail, đếm số ảnh
│   ├── Envelope.tsx             # [Màn hình 2] Mở nắp thư 3D, bắn pháo confetti
│   ├── CelebrationCard.tsx      # [Màn hình 3] Không gian chúc mừng chính & Polaroid Gallery
│   ├── ParticleEffect.tsx       # Tích hợp hoa anh đào, sparkles và tương tác chạm bắn tim
│   ├── PetalRain.tsx            # Cánh hoa anh đào rơi hiệu năng cao qua HTML5 Canvas
│   ├── FloatingHearts.tsx       # Trái tim lơ lửng & click burst
│   ├── Sparkles.tsx             # Hạt lấp lánh bokeh
│   ├── Typewriter.tsx           # Hiệu ứng gõ chữ các thông điệp yêu thương
│   ├── Lightbox.tsx             # Xem ảnh lớn, vuốt cảm ứng mobile, slideshow
│   ├── MusicToggle.tsx          # Bật/tắt nhạc nền + Web Audio chime dự phòng
│   └── FooterSection.tsx        # Trích dẫn và lời chúc kết
├── config/
│   └── site.ts                  # File cấu hình trung tâm (tùy biến chữ, tên, màu sắc)
├── lib/
│   ├── db.ts                    # Lưu trữ IndexedDB (idb-keyval) + fallback ẩn danh
│   ├── imageUtils.ts            # Nén Canvas (<1280px, quality 0.8), kiểm tra định dạng
│   └── utils.ts                 # Hỗ trợ tiền tố NEXT_PUBLIC_BASE_PATH
├── public/
│   ├── .nojekyll                # Bắt buộc để GitHub Pages không bỏ qua thư mục _next
│   ├── music.mp3                # Chỗ đặt file nhạc nền tùy ý
│   └── og-image.png             # Ảnh xem trước khi chia sẻ link mạng xã hội
└── next.config.ts               # output: 'export', unoptimized images, basePath
```

---

## 🚀 Hướng Dẫn Chạy Tại Máy & Deploy

### 1. Cài đặt và chạy local
```bash
# Cài đặt thư viện
npm install

# Chạy máy chủ dev
npm run dev
# Truy cập: http://localhost:3000

# Kiểm tra lint & build xuất tĩnh
npm run lint && npm run build
```

### 2. Triển khai lên GitHub Pages (Tự động 100%)
1. Tạo một repository mới trên GitHub (ví dụ: `chuc-mung-20-10`).
2. Đẩy mã nguồn lên GitHub:
   ```bash
   git add .
   git commit -m "feat: website chuc mung 20/10 theo luong 3 man hinh"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan>/<ten-repo>.git
   git push -u origin main
   ```
3. Trên GitHub repo, vào **Settings** → **Pages** → tại **Build and deployment / Source**, chọn **`GitHub Actions`**.
4. Chờ 1 phút, trang web sẽ xuất hiện tại `https://<tai-khoan>.github.io/<ten-repo>/`.

---

## 🎨 Cách Sửa Lời Chúc & Tên Người Nhận
Bạn chỉ cần mở duy nhất file **`config/site.ts`** để thay đổi:
- `recipient.name`: Tên người phụ nữ muốn gửi tặng.
- `sender.name`: Tên người gửi / chữ ký.
- `typewriterWishes`: Danh sách các câu chúc luân phiên.
