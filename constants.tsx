
import { ChristmasConcept, ConceptDetail } from './types';

export const CONCEPTS: ConceptDetail[] = [
  {
    id: ChristmasConcept.TRADITIONAL,
    title: 'Noel Truyền Thống',
    description: 'Tông màu đỏ – xanh – vàng ấm, cây thông Noel, hộp quà, đèn nháy, tuyết nhẹ.',
    icon: '🎄',
    colorClass: 'bg-red-600',
    prompt: 'Transform this image into a traditional Christmas scene. Add a grand, decorated Christmas tree with ornaments, neatly wrapped gift boxes, sparkling fairy lights, and a gentle dusting of snow. Use a warm palette of deep red, forest green, and golden yellow. Ensure the lighting is warm and festive.'
  },
  {
    id: ChristmasConcept.WHITE_WINTER,
    title: 'Tuyết Trắng Châu Âu',
    description: 'Mùa đông châu Âu, tuyết rơi dày, phố cổ, ánh đèn vàng, phong cách điện ảnh.',
    icon: '❄️',
    colorClass: 'bg-blue-500',
    prompt: 'Transform this image into a cinematic European winter Christmas scene. Add heavy falling snow, a background of an old European cobblestone street with warm glowing gas lanterns. The atmosphere should be romantic and slightly cold, contrasting blue winter tones with warm amber lights.'
  },
  {
    id: ChristmasConcept.CUTE_FUN,
    title: 'Vui Nhộn & Dễ Thương',
    description: 'Phong cách hoạt hình, mũ ông già Noel, tuần lộc, người tuyết, màu sắc tươi sáng.',
    icon: '🎅',
    colorClass: 'bg-orange-500',
    prompt: 'Transform this image into a cute and fun cartoon-style Christmas illustration. Add adorable Santa hats to the people, cute reindeer antlers, and friendly snowmen in the background. Use bright, cheerful colors and a playful aesthetic suitable for children and families.'
  },
  {
    id: ChristmasConcept.LUXURY,
    title: 'Sang Trọng & Đẳng Cấp',
    description: 'Ánh đèn vàng kim, background tối nhẹ, trang phục lịch lãm, cao cấp.',
    icon: '✨',
    colorClass: 'bg-amber-700',
    prompt: 'Transform this image into a luxury high-end Christmas portrait. Use sophisticated golden lighting, a softly blurred elegant dark background with premium holiday decorations. The subjects should appear to be in a stylish, high-fashion setting with rich textures and a polished finish.'
  },
  {
    id: ChristmasConcept.COZY,
    title: 'Ấm Áp & Bình Yên',
    description: 'Trong nhà, ánh nến, lò sưởi, áo len Noel, màu nâu – cam – vàng.',
    icon: '🕯️',
    colorClass: 'bg-orange-800',
    prompt: 'Transform this image into a cozy indoor Christmas sanctuary. Add a warm glowing fireplace, flickering candles, and make the subjects appear to be wearing knit Christmas sweaters. Use a soothing palette of earthy browns, burnt oranges, and soft yellows for a peaceful, homey feel.'
  },
  {
    id: ChristmasConcept.MINIMALIST,
    title: 'Hiện Đại & Tối Giản',
    description: 'Nền đơn sắc, ít chi tiết, ánh sáng mềm, đỏ hoặc xanh chủ đạo.',
    icon: '🌌',
    colorClass: 'bg-slate-700',
    prompt: 'Transform this image into a modern minimalist Christmas style. Use a clean, monochromatic background with subtle holiday elements like a single sleek ornament or a simple stylized tree. Focus on soft lighting and a modern color scheme centered around a single bold Christmas color like contemporary red or deep teal.'
  }
];
