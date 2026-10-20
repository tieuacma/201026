/**
 * File cấu hình tùy biến toàn bộ nội dung website chúc mừng 20/10
 * Bạn có thể dễ dàng thay đổi tên, lời chúc, danh xưng và thông điệp tại đây.
 */

export interface SiteConfig {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    url: string;
  };
  event: {
    tag: string;
    title: string;
    subtitle: string;
    date: string;
  };
  recipient: {
    name: string;
    shortTitle: string;
  };
  sender: {
    name: string;
    signature: string;
  };
  letter: {
    badge: string;
    stampText: string;
    greeting: string;
    paragraphs: string[];
    callToAction: string;
  };
  typewriterWishes: string[];
  cards: {
    title: string;
    description: string;
    icon: string;
  }[];
  gallery: {
    title: string;
    subtitle: string;
    maxPhotos: number;
    maxFileSizeMB: number;
  };
  closing: {
    quote: string;
    author: string;
    message: string;
  };
  music: {
    title: string;
    src: string; // đường dẫn tương đối từ thư mục /public
    synthFallback: boolean; // bật âm thanh hộp nhạc synthesizer lãng mạn nếu chưa có file mp3
  };
}

export const siteConfig: SiteConfig = {
  meta: {
    title: "Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10 🌸",
    description: "Trang web gửi trọn ngàn yêu thương, lời tri ân và kỷ niệm đẹp nhất tới những người phụ nữ tuyệt vời nhân ngày 20/10.",
    keywords: ["20/10", "Phụ nữ Việt Nam", "Chúc mừng 20/10", "Thiệp chúc mừng", "Quà tặng 20/10"],
    ogImage: "/og-image.png",
    url: "https://your-username.github.io/201026",
  },
  event: {
    tag: "Ngày Phụ Nữ Việt Nam 20.10",
    title: "Tôn Vinh Vẻ Đẹp & Yêu Thương",
    subtitle: "Dành tặng những bông hoa ngát hương và rạng rỡ nhất trong cuộc đời",
    date: "20 Tháng 10",
  },
  recipient: {
    name: "Những Người Phụ Nữ Tuyệt Vời",
    shortTitle: "Gửi Người Tôi Yêu Quý",
  },
  sender: {
    name: "Gửi trọn từ trái tim",
    signature: "Thân thương & Tri ân sâu sắc ❤️",
  },
  letter: {
    badge: "Thư Gửi Ngày 20/10",
    stampText: "20-10 VN",
    greeting: "Thân gửi người phụ nữ rạng rỡ nhất,",
    paragraphs: [
      "Nhân ngày Phụ nữ Việt Nam 20/10, xin gửi tới bạn lời chúc an lành, ngập tràn niềm vui và hạnh phúc trọn vẹn.",
      "Cảm ơn vì những yêu thương, sự dịu dàng và những hy sinh thầm lặng mà bạn đã mang đến cho thế giới này.",
      "Hãy luôn mỉm cười thật tươi, luôn tự tin tỏa sáng theo cách riêng của mình, bởi bạn là đóa hoa xinh đẹp và quý giá nhất!"
    ],
    callToAction: "Chạm để mở phong thư yêu thương 💌",
  },
  typewriterWishes: [
    "Chúc bạn mỗi ngày trôi qua đều là một ngày ngập tràn tiếng cười và an yên.",
    "Chúc bạn luôn rạng rỡ như ánh bình minh, dịu dàng như hoa ban mai và kiên cường như nắng hạ.",
    "Chúc bạn luôn được yêu thương, trân trọng và hạnh phúc trong từng phút giây.",
    "Mong mọi ước nguyện tốt đẹp nhất trong trái tim bạn đều sớm trở thành hiện thực.",
    "Cảm ơn bạn đã luôn là ngọn lửa ấm áp, là nguồn cảm hứng tuyệt vời cho những người xung quanh."
  ],
  cards: [
    {
      title: "Rạng Rỡ Tươi Vui",
      description: "Nụ cười của bạn là ánh nắng sưởi ấm mọi khoảnh khắc xung quanh.",
      icon: "Sparkles",
    },
    {
      title: "Bình An & Hạnh Phúc",
      description: "Mong cuộc đời dịu dàng với bạn, mọi âu lo đều nhường chỗ cho an yên.",
      icon: "Heart",
    },
    {
      title: "Tự Do Tỏa Sáng",
      description: "Hãy vững tin bước đi trên con đường của mình, bạn luôn phi thường!",
      icon: "Sun",
    },
  ],
  gallery: {
    title: "Góc Kỷ Niệm Yêu Thương",
    subtitle: "Lưu giữ những khoảnh khắc đẹp nhất (tối đa 30 bức ảnh, lưu an toàn trên máy của bạn)",
    maxPhotos: 30,
    maxFileSizeMB: 10,
  },
  closing: {
    quote: "Phụ nữ sinh ra là để được yêu thương, nâng niu và trân trọng mỗi ngày, không chỉ riêng ngày 20/10.",
    author: "Lời nhắn gửi chân thành",
    message: "Chúc một ngày 20/10 ấm áp, ngọt ngào và trọn vẹn hạnh phúc bên những người thân yêu!",
  },
  music: {
    title: "Giai điệu yêu thương 20/10",
    src: "/music.mp3",
    synthFallback: true,
  },
};
