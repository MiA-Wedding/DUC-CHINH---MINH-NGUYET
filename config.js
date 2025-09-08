/* config.js - cấu hình dễ chỉnh
   Nếu anh có iframe embed chính xác từ Google Maps (Share > Embed a map),
   paste src vào mapEmbed. Nếu không, mapEmbed để trống và script sẽ
   hiển thị một bản đồ tìm kiếm bằng mapUrl.
*/
const WEDDING_CONFIG = {
  groomName: "Nguyễn Chính ",
  brideName: " Phan Nguyệt",

  weddingDate: "2025-09-25 15:00:00",
  location: "Trung tâm tiệc cưới thành phố Bắc Giang",

  // link mở ngoài (mở app Google Maps trên điện thoại)
  mapUrl: "https://www.google.com/maps/place/%C4%90%E1%BA%A1i+Ho%C3%A0ng+S%C6%A1n+Opera+Wedding+Place/@21.2787972,106.1979203,1197m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31356d0b93d92e25:0xc26472b051a461d0!8m2!3d21.2787922!4d106.2004952!16s%2Fg%2F11gtyrsg1h?hl=vi&entry=ttu&g_ep=EgoyMDI1MDkwMy4wIKXMDSoASAFQAw%3D%3D",

  // link embed hiển thị trực tiếp trong trang
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.316488336918!2d105.81945431540247!3d21.02168589350337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab8c97ddf2b9%3A0x69bbbf61c74aeb55!2sSapphire%20Center!5e0!3m2!1svi!2s!4v1694512345678!5m2!1svi!2s",


  heroImage: "assets/hero-cover.jpg",
  doorLeft: "assets/A.png",
  doorRight: "assets/B.png",

  music: "assets/Music.mp3",

  effectImage: "assets/effect.png",
  effectEnabled: true,

  videoUrl: "https://www.youtube.com/embed/hCTkRHEIgXM",

  gallery: [
    {src:"assets/g1.jpg"},
    {src:"assets/g2.jpg"},
    {src:"assets/g3.jpg"},
    {src:"assets/g4.jpg"},
    {src:"assets/g5.jpg"},
    {src:"assets/g6.jpg"},
    {src:"assets/g7.jpg"},
    {src:"assets/g8.jpg"},
    {src:"assets/g9.jpg"},
    {src:"assets/g10.jpg"},
	{src:"assets/g11.jpg"},
    {src:"assets/g12.jpg"}
  ],

  invitation: {
    groomSide: {
      avatar: "assets/g1.jpg",
      name: "Nguyễn Chính",
      parents: "Con của: Ông Nguyễn Văn Cung<br>Bà Nông Thị Học",
      address: "Hạ Long - Xã Lục Ngạn - T.Bắc Ninh"
    },
    brideSide: {
      avatar: "assets/g2.jpg",
      name: "Phan Nguyệt",
      parents: "Con của: Ông Phan Văn Phúc<br>Bà Hoàng Thị Chức",
      address: "Tân Hải Thành - Tuyên Quang - T.Tuyên Quang"
    }
  },

  qr: [
    {src: "assets/QR01.jpg", title: "Nhà Trai - Nguyễn Chính", info: "STK 0821000107509 - Vietcombank"},
    {src: "assets/QR02.jpg", title: "Nhà Gái - Phan Nguyệt", info: "STK 0335618551 - MB Bank"}
  ],
};
