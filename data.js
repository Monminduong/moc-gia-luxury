// Database sản phẩm Mộc Gia Luxury
const PRODUCTS_DATA = [
  {
    id: "prod-walnut-shelf",
    name: "Tủ Kệ Trang Trí Walnut & Khung Thép Mid-Century",
    category: "livingroom",
    categoryName: "Phòng Khách",
    woodType: "Gỗ Óc Chó & Thép Tĩnh Điện",
    price: 11850000,
    originalPrice: 14500000,
    discountPercent: 18,
    rating: 4.9,
    reviewsCount: 38,
    image: "./assets/products/tu-ke-trang-tri-walnut.jpg",
    gallery: [
      "./assets/products/tu-ke-trang-tri-walnut.jpg",
      "./assets/products/media_1791941888712_1cb094be.jpg"
    ],
    tag: "Khuyên Dùng",
    isFeatured: true,
    inStock: true,
    sku: "MG-SHF-01",
    dimensions: "D120 x R40 x C185 cm",
    warranty: "5 năm bảo hành chính hãng, bảo trì trọn đời",
    origin: "Gỗ Óc Chó Bắc Mỹ nhập khẩu FAS, thép sơn tĩnh điện chống rỉ",
    description: "Kệ trang trí kết hợp tủ đợt mở phong cách Mid-Century Modern thanh lịch. Thiết kế tủ dưới 2 cánh mở trượt màu ghi xám phối tay nắm gỗ vát chéo độc đáo, hệ khung đợt mở so le phía trên tối ưu trưng bày sách báo, tượng nghệ thuật và bình hoa decor.",
    specs: {
      "Chất liệu khung": "Gỗ Óc Chó (American Walnut) tự nhiên tuyển chọn",
      "Cánh tủ dưới": "MDF chống ẩm phủ Melamine xám khói kháng trầy",
      "Chân đế": "Thép hộp sơn tĩnh điện đen mờ chịu lực 300kg",
      "Sơn phủ": "Sơn Inchem Mỹ 5 lớp giữ màu gỗ trầm ấm sang trọng",
      "Phụ kiện": "Bản lề hơi Hafele giảm chấn êm ái khi đóng mở"
    },
    colors: ["Gỗ Óc Chó Màu Trầm", "Gỗ Sồi Màu Sáng", "Nâu Cacao"],
    sizes: ["D120 x R40 x C185 cm (Tiêu chuẩn)", "D150 x R40 x C190 cm (+2.200.000₫)"]
  },
  {
    id: "prod-navy-cabinet",
    name: "Tủ Bát Đĩa & Trưng Bày Royal Navy Heritage",
    category: "dining",
    categoryName: "Phòng Ăn & Bếp",
    woodType: "Gỗ Tần Bì Sơn Kháng Khuẩn",
    price: 13900000,
    originalPrice: 16500000,
    discountPercent: 16,
    rating: 5.0,
    reviewsCount: 42,
    image: "./assets/products/tu-bat-dia-navy-royal.jpg",
    gallery: [
      "./assets/products/tu-bat-dia-navy-royal.jpg",
      "./assets/products/tu-bat-dia-navy-detail.jpg"
    ],
    tag: "Best Seller",
    isFeatured: true,
    inStock: true,
    sku: "MG-CAB-02",
    dimensions: "D95 x R45 x C190 cm",
    warranty: "5 năm bảo hành khung gỗ, nước sơn bóng mờ",
    origin: "Gỗ Tần Bì (Ash) tự nhiên đã sấy đạt độ ẩm chuẩn 10-12%",
    description: "Tủ trưng bày bát đĩa, ly rượu cao cấp phong cách Tân Cổ Điển Hiện Đại (Modern Classic). Gam màu Xanh Royal Navy thời thượng mang lại chiều sâu quyền quý cho không gian phòng ăn. Bên trong chia 4 tầng đợt chứa chịu lực cao cùng lòng tủ màu ghi sáng tương phản nổi bật.",
    specs: {
      "Chất liệu khung vỏ": "Gỗ Tần Bì tự nhiên kết hợp gỗ thịt cao cấp",
      "Cánh cửa": "Khung pano phay rãnh sắc sảo, tích hợp kính an toàn",
      "Màu sơn": "Sơn bóng mờ AkzoNobel kháng khuẩn, chống ẩm mốc phòng bếp",
      "Khả năng tải trọng": "Tối đa 40kg mỗi tầng đợt",
      "Phụ kiện": "Khóa hít nam châm cao cấp & bản lề đồng mạ rơm"
    },
    colors: ["Xanh Royal Navy", "Trắng Sữa Parisian", "Gỗ Óc Chó Tự Nhiên"],
    sizes: ["D95 x R45 x C190 cm (2 cánh)", "D135 x R45 x C190 cm (3 cánh +3.500.000₫)"]
  },
  {
    id: "prod-nordic-desk",
    name: "Bàn Làm Việc Kiêm Bàn Phấn Nordic Pastel",
    category: "office",
    categoryName: "Phòng Làm Việc",
    woodType: "Gỗ Sồi & Sơn Pastel",
    price: 7450000,
    originalPrice: 8900000,
    discountPercent: 16,
    rating: 4.8,
    reviewsCount: 29,
    image: "./assets/products/ban-lam-viec-phan-nordic.jpg",
    gallery: [
      "./assets/products/ban-lam-viec-phan-nordic.jpg"
    ],
    tag: "Mẫu Mới 2026",
    isFeatured: true,
    inStock: true,
    sku: "MG-DSK-03",
    dimensions: "D130 x R60 x C75 cm",
    warranty: "5 năm kết cấu mộng gỗ",
    origin: "Gỗ Sồi tự nhiên sấy khô tiêu chuẩn xuất khẩu Châu Âu",
    description: "Chiếc bàn đa năng lý tưởng vừa làm việc chuyên nghiệp vừa có thể sử dụng làm bàn trang điểm tinh tế. Thiết kế bo góc mềm mại, 5 hộc tủ lưu trữ tài liệu mỹ phẩm gọn gàng, điểm xuyết núm tay nắm kim loại vàng ánh kim sang trọng.",
    specs: {
      "Chất liệu": "Gỗ Sồi tự nhiên kết hợp phụ kiện kim khí đồng thau",
      "Hệ ngăn kéo": "5 hộc kéo phân vùng khoa học kèm ray trượt mượt mà",
      "Mặt bàn": "Rộng rãi 1m3, sơn mờ chống bám vân tay và dễ lau chùi",
      "Chân bàn": "Chân gỗ tiện nguyên khối vững chãi, gầm cao 60cm để chân thoải mái"
    },
    colors: ["Xám Khói Pastel", "Trắng Tinh Khôi", "Gỗ Sồi Tự Nhiên Tươi Sáng"],
    sizes: ["D130 x R60 x C75 cm", "D110 x R55 x C75 cm (-600.000₫)"]
  },
  {
    id: "prod-zen-dresser",
    name: "Tủ Ngăn Kéo Phòng Ngủ 6 Hộc Zen Dresser",
    category: "bedroom",
    categoryName: "Phòng Ngủ",
    woodType: "Gỗ Sồi Bo Góc Tự Nhiên",
    price: 8600000,
    originalPrice: 10200000,
    discountPercent: 15,
    rating: 4.9,
    reviewsCount: 54,
    image: "./assets/products/tu-ngan-keo-dresser-zen.jpg",
    gallery: [
      "./assets/products/tu-ngan-keo-dresser-zen.jpg"
    ],
    tag: "Bán Chạy Nhất",
    isFeatured: true,
    inStock: true,
    sku: "MG-DRS-04",
    dimensions: "D125 x R45 x C88 cm",
    warranty: "5 năm phụ kiện ray trượt và khung tủ",
    origin: "Gỗ Sồi Mỹ thịt tự nhiên & HDF chống ẩm siêu bền",
    description: "Tủ ngăn kéo 6 hộc đối xứng với viền bo tròn bo cong nghệ thuật, cực kỳ an toàn cho gia đình có trẻ nhỏ. Màu kem be trung tính dịu mắt, hòa quyện tuyệt đẹp với ánh sáng phòng ngủ hiện đại. Bề mặt trên rộng có thể đặt tranh ảnh, nến thơm và lọ hoa decor.",
    specs: {
      "Số ngăn kéo": "6 hộc kéo thể tích lớn, lót đáy gỗ thông kháng mối mọt",
      "Hệ ray": "Ray âm giảm chấn 3 khúc Hafele kéo trơn tru không tiếng động",
      "Tay nắm": "Đồng đúc nguyên khối mạ vàng lì",
      "Chân tủ": "Gỗ nguyên khối cách sàn 12cm dễ dàng cho robot hút bụi lau dọn"
    },
    colors: ["Kem Be Sandstone", "Gỗ Óc Chó Cổ Điển", "Trắng Sứ"],
    sizes: ["D125 x R45 x C88 cm (6 ngăn)", "D150 x R48 x C88 cm (6 ngăn lớn +1.800.000₫)"]
  },
  {
    id: "prod-walnut-bed",
    name: "Giường Ngủ Gỗ Óc Chó Zen Sanctuary Master",
    category: "bedroom",
    categoryName: "Phòng Ngủ",
    woodType: "Gỗ Óc Chó Bắc Mỹ",
    price: 19500000,
    originalPrice: 23000000,
    discountPercent: 15,
    rating: 5.0,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Luxury Master",
    isFeatured: true,
    inStock: true,
    sku: "MG-BED-05",
    dimensions: "1m8 x 2m0 (Lọt lòng nệm)",
    warranty: "10 năm kết cấu khung sườn, chống cong vênh mối mọt",
    origin: "Gỗ Óc Chó tự nhiên nhập khẩu Bắc Mỹ loại 1 (FAS)",
    description: "Giường ngủ đẳng cấp mang phong cách Tối Giản Thiền Định (Zen Luxury). Đường vân cuộn xoáy tự nhiên huyền ảo, đầu giường tựa nghiêng công thái học êm ái. Thang giường hợp kim thép gia cường nâng đỡ nệm vững chãi, không bao giờ phát ra tiếng cọt kẹt.",
    specs: {
      "Khung giường": "100% Gỗ Óc Chó thịt tự nhiên không pha tạp",
      "Dát giường": "Dát phản nan cong chịu lực 800kg, thoáng khí đáy nệm",
      "Bề mặt hoàn thiện": "Dầu lau dưỡng gỗ tự nhiên gốc thực vật chuẩn an toàn cho giấc ngủ",
      "Kích thước phủ bì": "D215 x R195 x C95 cm"
    },
    colors: ["Óc Chó Bắc Mỹ Tự Nhiên", "Nâu Chocolate Đậm"],
    sizes: ["1m6 x 2m0 (-1.500.000₫)", "1m8 x 2m0 (Chuẩn)", "2m0 x 2m2 (+2.800.000₫)"]
  },
  {
    id: "prod-wardrobe-4doors",
    name: "Tủ Áo 4 Cánh Gỗ Sồi Tự Nhiên Kèm Đèn Cảm Biến Smart LED",
    category: "bedroom",
    categoryName: "Phòng Ngủ",
    woodType: "Gỗ Sồi Tự Nhiên",
    price: 21500000,
    originalPrice: 25000000,
    discountPercent: 14,
    rating: 4.9,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Khuyên Dùng",
    isFeatured: true,
    inStock: true,
    sku: "MG-WDR-06",
    dimensions: "D200 x S60 x C220 cm",
    warranty: "5 năm chính hãng, miễn phí căn chỉnh bản lề định kỳ",
    origin: "Gỗ Sồi Nga thịt tự nhiên",
    description: "Tủ quần áo 4 cánh mở rộng rãi tối ưu hóa không gian lưu trữ cho gia đình. Tích hợp thanh nhôm LED cảm biến mở cửa tự động bật sáng lung linh. Khoang chứa chia khoa học: khu treo váy dài, áo vest, ngăn kéo bí mật có khóa số, hộc cavat và phụ kiện.",
    specs: {
      "Vật liệu khung thùng": "Gỗ Sồi thịt kết hợp veneer chống cong vênh",
      "Bản lề": "Hafele giảm chấn cao cấp thử nghiệm 100.000 lần đóng mở",
      "Đèn LED": "Thanh nhôm LED âm 12V an toàn, cảm biến hồng ngoại",
      "Suốt treo quần áo": "Hợp kim nhôm đúc có đệm cao su chống ồn"
    },
    colors: ["Gỗ Sồi Tự Nhiên Mộc", "Màu Óc Chó Ấm", "Sơn Trắng Sữa Kem"],
    sizes: ["D160 x S60 x C220 cm (3 cánh -2.500.000₫)", "D200 x S60 x C220 cm (4 cánh Chuẩn)", "D240 x S60 x C240 cm (Tủ kịch trần +4.500.000₫)"]
  },
  {
    id: "prod-nightstand-solis",
    name: "Tủ Đầu Giường 2 Ngăn Kéo Solis Nightstand",
    category: "bedroom",
    categoryName: "Phòng Ngủ",
    woodType: "Gỗ Sồi Tự Nhiên",
    price: 2850000,
    originalPrice: 3400000,
    discountPercent: 16,
    rating: 4.8,
    reviewsCount: 47,
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Phụ Kiện Hot",
    isFeatured: false,
    inStock: true,
    sku: "MG-TAB-07",
    dimensions: "D48 x R40 x C50 cm",
    warranty: "3 năm kết cấu mộng gỗ",
    origin: "Gỗ Sồi Bắc Mỹ sấy chân không",
    description: "Tab đầu giường kích thước gọn gàng, tiện lợi đặt đèn ngủ, sạc điện thoại và sách đọc ban đêm. 2 ngăn kéo chứa đồ kín đáo, đường ray trượt nhẹ tênh không gây tiếng động làm phiền người bên cạnh.",
    specs: {
      "Chất liệu": "Gỗ Sồi tự nhiên 100%",
      "Ray trượt": "Ray âm giảm chấn tự đóng",
      "Góc cạnh": "Bo viền vát cạnh CNC tỉ mỉ",
      "Lớp phủ": "Sơn mờ bảo vệ chống nước, chống cồn lau chùi"
    },
    colors: ["Gỗ Sồi Tự Nhiên", "Nâu Hạt Dẻ", "Xám Khói"],
    sizes: ["D48 x R40 x C50 cm (Chuẩn)"]
  },
  {
    id: "prod-vanity-bloom",
    name: "Bàn Trang Điểm Bloom Bắc Âu Kèm Gương LED Thông Minh & Đôn",
    category: "bedroom",
    categoryName: "Phòng Ngủ",
    woodType: "Gỗ Tần Bì & Gương Bỉ AGC",
    price: 6950000,
    originalPrice: 8200000,
    discountPercent: 15,
    rating: 4.9,
    reviewsCount: 36,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Tặng Kèm Đôn",
    isFeatured: true,
    inStock: true,
    sku: "MG-VAN-08",
    dimensions: "D100 x R45 x C78 cm (Bàn) + Gương D50cm",
    warranty: "5 năm phần gỗ, 2 năm hệ thống đèn LED",
    origin: "Gỗ Tần Bì tự nhiên & Gương tráng bạc nhập Bỉ",
    description: "Bộ bàn trang điểm chuẩn phong cách Scandinavian tối giản mà ngọt ngào. Đi kèm gương tròn LED cảm ứng chạm 3 chế độ màu (Trắng tinh khiết, Vàng ấm nồng, Tự nhiên trung tính) chuẩn cho makeup. Tặng kèm ghế đôn nệm bọc nỉ cao cấp.",
    specs: {
      "Chất liệu": "Gỗ Tần Bì tự nhiên kết hợp phụ kiện gương Bỉ 8 lớp tráng bạc",
      "Ngăn kéo": "Chia ô mỹ phẩm bằng gỗ nhung nhung êm ái",
      "Gương LED": "Nút cảm ứng trên mặt gương, có dimmer chỉnh độ sáng",
      "Ghế đi kèm": "Đôn gỗ sồi bọc đệm êm ái"
    },
    colors: ["Trắng Sữa Chân Gỗ", "Gỗ Sồi Mộc Tự Nhiên", "Hồng Khói Pastel"],
    sizes: ["D100 x R45 x C78 cm", "D120 x R45 x C78 cm (+800.000₫)"]
  },
  {
    id: "prod-sofa-carina",
    name: "Bộ Sofa Văng Gỗ Óc Chó Đệm Da Ý Carina Living",
    category: "livingroom",
    categoryName: "Phòng Khách",
    woodType: "Gỗ Óc Chó Bắc Mỹ & Da Bò Ý",
    price: 26500000,
    originalPrice: 31000000,
    discountPercent: 15,
    rating: 5.0,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Siêu Phẩm Phòng Khách",
    isFeatured: true,
    inStock: true,
    sku: "MG-SOF-09",
    dimensions: "D240 x S85 x C78 cm (Văng 3 chỗ)",
    warranty: "10 năm khung sườn, 3 năm đệm da",
    origin: "Gỗ Óc Chó Bắc Mỹ FAS, đệm mút D40 bọc da nhập khẩu",
    description: "Bộ sofa văng sang trọng tôn vinh không gian phòng khách hiện đại. Khung gỗ Óc Chó nguyên khối với vân cuộn sóng nghệ thuật, tay vịn vát cong công phu kết hợp đệm mút cao cấp không lún xẹp sau nhiều năm sử dụng.",
    specs: {
      "Khung xương": "Gỗ Óc Chó tự nhiên dày 4-5cm chịu lực cao",
      "Đệm ngồi": "Đệm mút D40 nhập khẩu bọc màng lông vũ nhân tạo êm ái",
      "Vỏ bọc": "Da bò tự nhiên hoặc Microfiber chống cào xước thú cưng",
      "Gối tựa": "Tặng kèm 3 gối tựa cao cấp đồng màu"
    },
    colors: ["Nâu Da Bò Cognac", "Xanh Rêu Luxury", "Ghi Xám Khói", "Kem Ivory"],
    sizes: ["Văng 2m2 (2-3 chỗ)", "Văng 2m6 (3-4 chỗ +3.500.000₫)", "Bộ chữ L 2m8 x 1m7 (+8.900.000₫)"]
  },
  {
    id: "prod-dining-hiroshima",
    name: "Bộ Bàn Ăn 6 Ghế Hiroshima Gỗ Sồi Tự Nhiên Tinh Tế",
    category: "dining",
    categoryName: "Phòng Ăn & Bếp",
    woodType: "Gỗ Sồi Bắc Mỹ",
    price: 15800000,
    originalPrice: 18900000,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Combo Gia Đình",
    isFeatured: true,
    inStock: true,
    sku: "MG-DIN-10",
    dimensions: "Bàn D160 x R80 x C75 cm + 6 Ghế Hiroshima",
    warranty: "5 năm bảo hành kết cấu mộng gỗ",
    origin: "Gỗ Sồi nhập khẩu đã sấy vô trùng chống mọt",
    description: "Mẫu bàn ăn kinh điển được yêu thích hàng đầu cho các căn hộ chung cư và nhà phố hiện đại. Tựa lưng ghế uốn cong mềm mại nâng niu cột sống, mặt bàn vát cạnh kim cương tinh tế tạo cảm giác nhẹ nhàng thanh lịch.",
    specs: {
      "Mặt bàn": "Gỗ Sồi thịt tự nhiên ghép thanh công nghệ phủ sơn Inchem mờ",
      "Ghế Hiroshima": "6 ghế tựa lưng gỗ uốn nhiệt, mặt ghế bọc đệm da Simili cao cấp",
      "Chân bàn": "Chân trụ côn nghiêng tạo thế vững chắc",
      "Khả năng chịu nhiệt": "Chịu nhiệt tốt, không để lại vết tròn khi đặt nồi canh ấm"
    },
    colors: ["Màu Gỗ Sồi Tự Nhiên", "Màu Óc Chó Sang Trọng"],
    sizes: ["Bàn 1m4 + 4 Ghế (-2.800.000₫)", "Bàn 1m6 + 6 Ghế (Chuẩn)", "Bàn 1m8 + 8 Ghế (+3.500.000₫)"]
  },
  {
    id: "prod-dining-metay",
    name: "Bàn Ăn Gỗ Me Tây Nguyên Tấm Dày 5cm Liền Khối",
    category: "dining",
    categoryName: "Phòng Ăn & Bếp",
    woodType: "Gỗ Me Tây Nguyên Tấm",
    price: 18200000,
    originalPrice: 22000000,
    discountPercent: 17,
    rating: 5.0,
    reviewsCount: 23,
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Độc Bản Vân Gỗ",
    isFeatured: false,
    inStock: true,
    sku: "MG-MTY-11",
    dimensions: "D180 x R85 x C75 cm (Dày 5cm)",
    warranty: "10 năm không cong vênh, chống rạn nứt",
    origin: "Gỗ Me Tây cổ thụ Campuchia / Tây Nguyên",
    description: "Mỗi tấm mặt bàn là một kiệt tác tự nhiên độc nhất vô nhị không có chiếc thứ hai trên đời. Giữ nguyên viền giác gỗ tự nhiên (Live Edge) mộc mạc, tôn vinh nét thẩm mỹ sang trọng nguyên bản của thiên nhiên.",
    specs: {
      "Mặt bàn": "Gỗ Me Tây nguyên tấm 100% không ghép, sấy sấy lò hơi công nghiệp",
      "Độ dày": "5cm chuẩn thước đo thực tế",
      "Chân bàn": "Chân sắt hộp chữ X sơn tĩnh điện đen mờ chịu lực 1.5 tấn",
      "Sơn bóng": "Phủ bóng mờ 50% khoe trọn từng thớ vân gỗ uốn lượn"
    },
    colors: ["Vân Gỗ Me Tây Tự Nhiên Sấy Khô"],
    sizes: ["D160 x R80 cm (-1.800.000₫)", "D180 x R85 cm (Chuẩn)", "D220 x R90 cm (+4.800.000₫)"]
  },
  {
    id: "prod-tv-stand-horizon",
    name: "Kệ Tivi Gỗ Óc Chó Hiện Đại Horizon Đa Năng (2m)",
    category: "livingroom",
    categoryName: "Phòng Khách",
    woodType: "Gỗ Óc Chó Bắc Mỹ",
    price: 9800000,
    originalPrice: 11500000,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 34,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Tối Giản",
    isFeatured: false,
    inStock: true,
    sku: "MG-TVS-12",
    dimensions: "D200 x R40 x C45 cm",
    warranty: "5 năm khung vỏ và phụ kiện",
    origin: "Gỗ Óc Chó tự nhiên",
    description: "Kệ tivi dáng bệt dài 2 mét phù hợp cho các dòng tivi màn hình lớn từ 55 đến 85 inch. 3 ngăn kéo ray âm kết hợp khoang đục lỗ thông dây điện gọn gàng giấu kín dây cáp, giữ cho phòng khách luôn ngăn nắp thanh lịch.",
    specs: {
      "Chất liệu": "Gỗ Óc Chó tự nhiên tuyển vân",
      "Ray trượt": "Ray âm giảm chấn tự hít Hafele",
      "Mặt lưng": "Có lỗ luồn dây cáp HDMI & nguồn thông minh",
      "Chân kệ": "Chân gỗ tiện tròn thanh mảnh gầm cao dễ quét dọn"
    },
    colors: ["Gỗ Óc Chó Màu Trầm Tự Nhiên", "Màu Sồi Bắc Âu"],
    sizes: ["D180 x R40 x C45 cm (-800.000₫)", "D200 x R40 x C45 cm (Chuẩn)", "D220 x R40 x C45 cm (+1.200.000₫)"]
  },
  {
    id: "prod-coffee-table-duet",
    name: "Bộ Bàn Trà Đôi Mặt Đá Ceramic & Chân Gỗ Sồi Duet",
    category: "livingroom",
    categoryName: "Phòng Khách",
    woodType: "Gỗ Sồi & Đá Ceramic Chống Ố",
    price: 4800000,
    originalPrice: 5900000,
    discountPercent: 19,
    rating: 4.9,
    reviewsCount: 61,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Bán Chạy",
    isFeatured: true,
    inStock: true,
    sku: "MG-COF-13",
    dimensions: "Bàn lớn D70 x C45 cm, Bàn nhỏ D50 x C40 cm",
    warranty: "3 năm mặt đá và chân gỗ",
    origin: "Khung chân Gỗ Sồi sấy lò, mặt đá Ceramic nhập khẩu Ý",
    description: "Cặp bàn trà tròn đôi có thể lồng vào nhau tiết kiệm diện tích hoặc tách rời linh hoạt khi tiếp nhiều khách. Mặt đá Ceramic chống trầy xước, chịu nhiệt độ cao và không lo ố vàng do nước trà hay cafe rớt ra.",
    specs: {
      "Mặt bàn": "Đá Ceramic bóng vân mây cẩm thạch trắng dày 12mm",
      "Khung chân": "Gỗ Sồi tiện tròn thanh thoát chịu lực 150kg",
      "Tính năng": "Chống xước, chống ố, chống cháy nổ bề mặt",
      "Tiện ích": "Bàn nhỏ có thể thu gọn vào lòng bàn lớn"
    },
    colors: ["Mặt Đá Trắng Vân Mây Chân Gỗ Tự Nhiên", "Mặt Đá Đen Tia Chớp Chân Gỗ Óc Chó"],
    sizes: ["Bộ 2 Bàn Tròn (70cm + 50cm)", "Bộ 2 Bàn Tròn Lớn (80cm + 60cm +800.000₫)"]
  },
  {
    id: "prod-shoe-cabinet-fresh",
    name: "Tủ Giày Cửa Nan Thoáng Khí Gỗ Tần Bì Fresh Air",
    category: "livingroom",
    categoryName: "Phòng Khách",
    woodType: "Gỗ Tần Bì Tự Nhiên",
    price: 4900000,
    originalPrice: 6000000,
    discountPercent: 18,
    rating: 4.8,
    reviewsCount: 39,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Gia Đình Tiện Ích",
    isFeatured: false,
    inStock: true,
    sku: "MG-SHO-14",
    dimensions: "D100 x R35 x C105 cm",
    warranty: "3 năm chống ẩm mốc cong vênh",
    origin: "Gỗ Tần Bì (Ash) tự nhiên",
    description: "Giải pháp thông minh cho sảnh đón căn hộ và nhà phố. Cánh cửa nan chớp tinh tế giúp lưu thông không khí liên tục, loại bỏ hoàn toàn mùi giày dép ẩm mốc. Tích hợp ngăn kéo nhỏ để chìa khóa, khẩu trang, ví tiền trước khi ra khỏi nhà.",
    specs: {
      "Sức chứa": "25 - 30 đôi giày dép các loại",
      "Cửa tủ": "Thiết kế cửa nan chớp khí động học chống mùi hôi",
      "Đợt chia": "Các đợt có thể tháo rời để vừa bốt cao cổ",
      "Chân tủ": "Gỗ nguyên khối cách ẩm nền nhà hiệu quả"
    },
    colors: ["Gỗ Tự Nhiên Mộc Sáng", "Màu Óc Chó Bắc Mỹ", "Trắng Phối Cánh Gỗ"],
    sizes: ["D80 x R35 x C105 cm (-500.000₫)", "D100 x R35 x C105 cm (Chuẩn)", "D120 x R35 x C105 cm (+700.000₫)"]
  },
  {
    id: "prod-desk-godo-master",
    name: "Bàn Làm Việc Giám Đốc Gỗ Gõ Đỏ Masterpiece 1m8",
    category: "office",
    categoryName: "Phòng Làm Việc",
    woodType: "Gỗ Gõ Đỏ Pachy Quý Hiếm",
    price: 28000000,
    originalPrice: 34000000,
    discountPercent: 18,
    rating: 5.0,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Đẳng Cấp Lãnh Đạo",
    isFeatured: true,
    inStock: true,
    sku: "MG-EXEC-15",
    dimensions: "D180 x R90 x C76 cm",
    warranty: "15 năm bảo hành gỗ nhóm 1, trọn đời mộng gỗ",
    origin: "Gỗ Gõ Đỏ Pachy Nam Phi tuyển chọn không rác",
    description: "Chiếc bàn mang lại uy quyền và phong thái đĩnh đạc cho phòng làm việc của các nhà lãnh đạo và doanh nhân. Chất gỗ Gõ Đỏ đanh chắc, vân núi cuộn đỏ rực rỡ, tích hợp hộp nắp điện âm bàn mạ crom cao cấp phục vụ thiết bị công nghệ hiện đại.",
    specs: {
      "Chất liệu": "100% Gỗ Gõ Đỏ nhóm 1 siêu bền, chống mối mọt vĩnh viễn",
      "Mặt bàn": "Liền tấm dày 3.5cm tuyển vân đối xứng",
      "Tủ phụ kèm": "Tủ phụ 3 ngăn kéo khóa số an toàn tài liệu mật",
      "Công nghệ": "Hộp luồn dây điện thông minh âm bàn cao cấp"
    },
    colors: ["Gỗ Gõ Đỏ Tự Nhiên Sơn PU Mờ 70%", "Màu Gỗ Cánh Gián Trầm"],
    sizes: ["D180 x R90 x C76 cm", "D200 x R100 x C76 cm (+4.500.000₫)"]
  },
  {
    id: "prod-armchair-lounge",
    name: "Ghế Thư Giãn Armchair Nordic Wood & Vải Dạ Cao Cấp",
    category: "livingroom",
    categoryName: "Phòng Khách",
    woodType: "Gỗ Sồi Uốn Cong Nhiệt",
    price: 4900000,
    originalPrice: 5800000,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 41,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Góc Thư Giãn",
    isFeatured: false,
    inStock: true,
    sku: "MG-ARM-16",
    dimensions: "D75 x R80 x C82 cm",
    warranty: "3 năm khung gỗ và nệm",
    origin: "Gỗ Sồi Nga uốn cong công nghệ cao",
    description: "Ghế đơn thư giãn đặt tại góc đọc sách phòng khách hoặc phòng ngủ. Độ ngả lưng 105 độ công thái học giúp thả lỏng tối đa các đốt sống lưng sau ngày làm việc căng thẳng.",
    specs: {
      "Khung tay vịn": "Gỗ Sồi uốn nhiệt mềm mại không chắp nối",
      "Vải bọc": "Vải dạ Bouclé lông cừu hoặc vải nỉ dệt thô cao cấp",
      "Nệm mút": "Mút đúc cao su non đàn hồi cao",
      "Khả năng tải trọng": "180kg"
    },
    colors: ["Trắng Kem Bouclé", "Xám Ghi Tro", "Vàng Mù Tạt Vintage"],
    sizes: ["D75 x R80 x C82 cm"],
    condition: "new"
  },
  {
    id: "prod-outlet-dining-table",
    name: "Bộ Bàn Ăn Gỗ Sồi 4 Ghế Concorde (Trưng Bày Showroom 95%)",
    category: "dining",
    categoryName: "Phòng Ăn & Bếp",
    woodType: "Gỗ Sồi Nga (Oak)",
    price: 8500000,
    originalPrice: 14000000,
    discountPercent: 39,
    rating: 4.8,
    reviewsCount: 12,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Thanh Lý Showroom",
    condition: "used",
    conditionPercent: 95,
    conditionNote: "Hàng mẫu trưng bày tại showroom Sala Thủ Thiêm được 3 tháng, bề mặt còn mới 95%, sơn bóng nguyên vẹn.",
    isFeatured: true,
    inStock: true,
    sku: "MG-OUT-01",
    dimensions: "Bàn D140 x R75 x C75 cm + 4 Ghế bọc da",
    warranty: "2 năm bảo hành kết cấu mộng gỗ",
    origin: "Gỗ Sồi tự nhiên sấy khô",
    description: "Bộ bàn ăn 4 ghế thanh lý xả kho thay mẫu decor mới cho showroom. Bàn và ghế đã được nhân viên kỹ thuật xưởng kiểm tra, đánh bóng lại xi dưỡng như mới.",
    specs: {
      "Tình trạng": "Hàng cũ trưng bày (Độ mới 95%)",
      "Khung bàn ghế": "Gỗ Sồi Nga tự nhiên 100%",
      "Mặt đệm": "Da Microfiber màu kem cao cấp",
      "Chính sách": "Bảo hành 2 năm, kiểm tra ưng ý mới thanh toán"
    },
    colors: ["Màu Sồi Mộc Tự Nhiên"],
    sizes: ["Bàn 1m4 + 4 Ghế"]
  },
  {
    id: "prod-outlet-bookshelf",
    name: "Kệ Sách Gỗ Tần Bì 4 Tầng Decor (Hàng Lướt Khách Đổi Size 98%)",
    category: "livingroom",
    categoryName: "Phòng Khách",
    woodType: "Gỗ Tần Bì Tự Nhiên",
    price: 3800000,
    originalPrice: 6500000,
    discountPercent: 41,
    rating: 4.9,
    reviewsCount: 8,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80"
    ],
    tag: "Xả Kho Đổi Trả",
    condition: "used",
    conditionPercent: 98,
    conditionNote: "Khách hàng đổi sang mẫu tủ lớn hơn sau 3 ngày nhận hàng. Tủ nguyên đai nguyên kiện mới 98%.",
    isFeatured: true,
    inStock: true,
    sku: "MG-OUT-02",
    dimensions: "D90 x R32 x C150 cm",
    warranty: "3 năm kết cấu khung gỗ",
    origin: "Gỗ Tần Bì tự nhiên",
    description: "Kệ sách 4 tầng thanh lý giá sốc do khách hàng đặt nhầm kích thước phòng. Thiết kế chân côn Bắc Âu, các đợt chịu lực 30kg/đợt thích hợp để sách và cây xanh phong thủy.",
    specs: {
      "Tình trạng": "Hàng lướt đổi trả (Độ mới 98%)",
      "Chất liệu": "Gỗ Tần Bì tự nhiên chống ẩm mốc",
      "Số tầng": "4 tầng đợt chứa đồ",
      "Ưu đãi": "Tiết kiệm ngay 2.700.000₫ so với giá mới"
    },
    colors: ["Gỗ Sáng Tự Nhiên"],
    sizes: ["D90 x R32 x C150 cm"]
  }
];

// Danh mục phòng
const ROOM_CATEGORIES = [
  { id: "all", name: "Tất Cả Sản Phẩm", count: 16, icon: "sparkles" },
  { id: "livingroom", name: "Phòng Khách", count: 5, icon: "sofa" },
  { id: "bedroom", name: "Phòng Ngủ", count: 5, icon: "bed" },
  { id: "dining", name: "Phòng Ăn & Bếp", count: 3, icon: "utensils" },
  { id: "office", name: "Phòng Làm Việc", count: 3, icon: "briefcase" }
];

// Các loại chất liệu gỗ chính
const WOOD_TYPES = [
  { id: "all", name: "Tất cả chất liệu" },
  { id: "walnut", name: "Gỗ Óc Chó Bắc Mỹ (Walnut)" },
  { id: "oak", name: "Gỗ Sồi Tự Nhiên (Oak)" },
  { id: "ash", name: "Gỗ Tần Bì (Ash)" },
  { id: "metay", name: "Gỗ Me Tây Nguyên Tấm" },
  { id: "godo", name: "Gỗ Gõ Đỏ Quý Hiếm" }
];

// Cẩm nang các loại gỗ
const WOOD_GUIDE = [
  {
    name: "Gỗ Óc Chó (American Walnut)",
    origin: "Nhập khẩu Bắc Mỹ (Chứng nhận FAS)",
    features: "Vân xoáy cuộn sóng màu nâu chocolate huyền bí, độ cứng hoàn hảo, không co ngót cong vênh, phong thủy hưng vượng.",
    usage: "Thích hợp cho sofa cao cấp, giường ngủ master, kệ tivi biệt thự.",
    grade: "5/5 Sao Cao Cấp"
  },
  {
    name: "Gỗ Sồi (White / Red Oak)",
    origin: "Bắc Mỹ & Châu Âu",
    features: "Vân sọc thẳng và tia gỗ dài thanh thoát, màu gỗ sáng ấm áp trẻ trung, khả năng chống mối mọt tự nhiên nhờ hàm lượng tannin cao.",
    usage: "Bàn ghế ăn Scandi, tủ áo, tủ đầu giường, phong cách Bắc Âu & Japandi.",
    grade: "4.8/5 Sao Phổ Biến"
  },
  {
    name: "Gỗ Tần Bì (Ash Wood)",
    origin: "Đông Âu",
    features: "Vân elip đồng tâm mềm mại, chịu lực uốn nhiệt cực tốt, bắt màu sơn hoàn hảo thích hợp cho các sản phẩm phủ màu Pastel & Royal Navy.",
    usage: "Tủ bát đĩa cao cấp, bàn trang điểm, ghế uốn cong.",
    grade: "4.7/5 Sao Đa Dụng"
  },
  {
    name: "Gỗ Me Tây (Rain Tree Wood)",
    origin: "Campuchia & Nam Á",
    features: "Vân gỗ uốn lượn sắc sảo như tranh thủy mặc, giác gỗ vàng sáng tương phản lõi nâu đậm, đường kính lớn làm bàn nguyên tấm.",
    usage: "Bàn ăn nguyên tấm, bàn họp văn phòng sáng tạo, bàn cafe biệt thự.",
    grade: "4.9/5 Sao Độc Bản"
  }
];

// Đánh giá thực tế từ khách hàng
const TESTIMONIALS = [
  {
    name: "Anh Hoàng Nam",
    role: "Chủ căn hộ Vinhomes Smart City",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "12/09/2026",
    comment: "Tôi vừa nhận bàn giao chiếc Bàn làm việc Nordic và Kệ trang trí Walnut. Thật sự bất ngờ vì bên ngoài gỗ còn bóng mịn và sắc nét hơn cả ảnh chụp! Đội ngũ lắp đặt chuyên nghiệp, bọc xốp cẩn thận và dọn dẹp sạch sẽ trước khi về.",
    purchased: "Bàn Làm Việc Nordic & Tủ Kệ Walnut"
  },
  {
    name: "Chị Thùy Dung",
    role: "Kiến trúc sư - Ecopark Grand",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "28/08/2026",
    comment: "Là dân trong nghề nên tôi rất khó tính về mộng gỗ và đường sơn. Tủ bát đĩa Royal Navy của Mộc Gia hoàn thiện nước sơn mờ cực kỳ mịn, không một vết bọt sơn. Đợt kính và tay nắm rất chắc chắn. Sẽ tiếp tục chỉ định Mộc Gia cho các dự án sau.",
    purchased: "Tủ Bát Đĩa Royal Navy & Tủ Dresser Zen"
  },
  {
    name: "Bác Trần Quốc Bảo",
    role: "Biệt thự Đảo Kim Cương, TP.HCM",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "15/07/2026",
    comment: "Bộ giường ngủ Zen Sanctuary và Sofa Carina bằng gỗ óc chó nhìn rất bề thế. Vân gỗ cuộn đẹp tự nhiên, đệm da ngồi rất êm mà không bị bí lưng. Đáng đồng tiền bát gạo!",
    purchased: "Giường Zen Sanctuary & Sofa Carina"
  }
];
