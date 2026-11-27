export const LOGO: string = import.meta.env.BASE_URL + "img/logo.webp";
export const PHOTOS: Record<number, string> = {"7": import.meta.env.BASE_URL + "img/p-7.jpg", "8": import.meta.env.BASE_URL + "img/p-8.jpg", "2": import.meta.env.BASE_URL + "img/p-2.jpg", "1": import.meta.env.BASE_URL + "img/p-1.jpg", "0": import.meta.env.BASE_URL + "img/p-0.jpg", "6": import.meta.env.BASE_URL + "img/p-6.jpg", "13": import.meta.env.BASE_URL + "img/p-13.jpg"};

// V4 illustratsiyalar (Higgsfield, 27.11)
const V4 = (n: string) => import.meta.env.BASE_URL + 'img/v4/' + n + '.webp';
export const ART = {
  basket: V4('1-savatcha'), shelf: V4('2-javon'), discount: V4('3-chegirma'), profit: V4('4-foyda'),
  delivery: V4('5-yetkazish'), emptyCart: V4('6-bosh-savat'), shelfCount: V4('7-javon-sanash'),
  promo: V4('8-aksiya-banner'), success: V4('9-yuborildi'), chat: V4('10-chat'),
};
