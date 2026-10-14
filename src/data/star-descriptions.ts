import type { Locale } from '../i18n';

// Short observing notes for every selectable star and planet. Sources:
// https://eco.mtk.nao.ac.jp/koyomi/faq/stars.html
// https://www.nao.ac.jp/astro/sky/2026/01.html
// https://www.nao.ac.jp/news/blog/2022/20220201-astro.html
// https://exopla.net/star-names/modern-iau-star-names/
// https://science.nasa.gov/solar-system/skywatching/what-is-the-north-star-and-how-do-you-find-it/
// https://science.nasa.gov/image-article/apod-2006-march-17-the-big-dipper-cluster/
// https://science.nasa.gov/solar-system/skywatching/night-sky-network/connecting-the-dots-with-asterisms/
// https://science.nasa.gov/universe/stories/quick-reads/discovering-the-universe-through-the-constellation-orion/
// https://science.nasa.gov/solar-system/skywatching/night-sky-network/spooky-stargazing/
// https://science.nasa.gov/solar-system/skywatching/night-sky-network/summer-triangle-corner-altair/
// https://science.nasa.gov/solar-system/skywatching/night-sky-network/summer-triangle-corner-deneb/
// https://science.nasa.gov/missions/hubble/astronomers-use-hubble-to-weigh-dog-stars-companion/
// https://science.nasa.gov/solar-system/planets/
export const starDescriptions: Record<string, Record<Locale, string>> = {
  Sirius: {
    ja: 'おおいぬ座の星で、夜空で最も明るく見える恒星。白色矮星の伴星シリウスBを持ちます。',
    en: 'The brightest star in our night sky, in Canis Major. Its companion Sirius B is a white dwarf.',
    zh: '位于大犬座，是夜空中视亮度最高的恒星。伴星天狼星B是一颗白矮星。',
  },
  Canopus: {
    ja: 'りゅうこつ座の星。夜空ではシリウスに次いで明るく、東京では南の地平線近くに見えます。',
    en: 'A star in Carina, second only to Sirius in apparent brightness. From Tokyo it stays low in the southern sky.',
    zh: '位于船底座，夜空中的视亮度仅次于天狼星。在东京只能在南方低空看到它。',
  },
  Arcturus: {
    ja: 'うしかい座のα星。スピカ、デネボラとともに春の大三角をつくります。',
    en: 'Alpha Boötis. It forms the Spring Triangle with Spica and Denebola.',
    zh: '牧夫座α星，与角宿一、狮子座β星组成春季大三角。',
  },
  Vega: {
    ja: 'こと座の星で、七夕の織姫星。アルタイル、デネブと夏の大三角をつくります。',
    en: 'The bright star in Lyra, known as the Weaver Girl. It joins Altair and Deneb in the Summer Triangle.',
    zh: '天琴座的亮星，也是七夕传说中的织女星。与牛郎星、天津四组成夏季大三角。',
  },
  Capella: {
    ja: 'ぎょしゃ座のα星。冬のダイヤモンドを形づくる6つの明るい星のひとつです。',
    en: 'Alpha Aurigae, one of the six bright stars outlining the Winter Hexagon.',
    zh: '御夫座α星，是勾勒冬季大六边形的六颗亮星之一。',
  },
  Rigel: {
    ja: 'オリオン座のβ星。冬のダイヤモンドの一角を担う明るい星です。',
    en: 'Beta Orionis, a bright corner of the Winter Hexagon.',
    zh: '猎户座β星，是冬季大六边形的一个明亮顶点。',
  },
  Procyon: {
    ja: 'こいぬ座のα星。シリウス、ベテルギウスと冬の大三角をつくります。',
    en: 'Alpha Canis Minoris, forming the Winter Triangle with Sirius and Betelgeuse.',
    zh: '小犬座α星，与天狼星、参宿四组成冬季大三角。',
  },
  Betelgeuse: {
    ja: 'オリオン座のα星。冬の大三角をつくる星で、明るさが変化する恒星です。',
    en: 'Alpha Orionis, a variable star and one corner of the Winter Triangle.',
    zh: '猎户座α星，是亮度会变化的恒星，也是冬季大三角的一个顶点。',
  },
  Altair: {
    ja: 'わし座の星で、七夕の彦星。自転が速く、赤道方向にふくらんだ形をしています。',
    en: 'The bright star in Aquila, known as the Cowherd. Its rapid spin makes it bulge around the equator.',
    zh: '天鹰座的亮星，也是七夕传说中的牛郎星。快速自转使它在赤道处鼓起。',
  },
  Aldebaran: {
    ja: 'おうし座のα星。冬のダイヤモンドを形づくる星のひとつです。',
    en: 'Alpha Tauri, one of the bright stars forming the Winter Hexagon.',
    zh: '金牛座α星，是组成冬季大六边形的亮星之一。',
  },
  Spica: {
    ja: 'おとめ座のα星。アルクトゥルス、デネボラと春の大三角をつくります。',
    en: 'Alpha Virginis, joining Arcturus and Denebola in the Spring Triangle.',
    zh: '室女座α星，与大角星、狮子座β星组成春季大三角。',
  },
  Antares: {
    ja: 'さそり座のα星。星座をたどる目印になる、明るさが変化する恒星です。',
    en: 'Alpha Scorpii, a variable star that helps trace the constellation Scorpius.',
    zh: '天蝎座α星，亮度会发生变化，是辨认天蝎座的标志之一。',
  },
  Pollux: {
    ja: 'ふたご座のβ星。カストルと並び、冬のダイヤモンドの一角をつくります。',
    en: 'Beta Geminorum, beside Castor and at one corner of the Winter Hexagon.',
    zh: '双子座β星，与北河二相邻，也是冬季大六边形的一个顶点。',
  },
  Fomalhaut: {
    ja: 'みなみのうお座のα星。約1.2等の明るさで見える恒星です。',
    en: 'Alpha Piscis Austrini, visible at about magnitude 1.2.',
    zh: '南鱼座α星，视星等约为1.2等。',
  },
  Deneb: {
    ja: 'はくちょう座の尾にあたる星。ベガ、アルタイルと夏の大三角をつくります。',
    en: 'The star marking the swan’s tail in Cygnus. It forms the Summer Triangle with Vega and Altair.',
    zh: '位于天鹅座尾部，与织女星、牛郎星组成夏季大三角。',
  },
  Regulus: {
    ja: 'しし座のα星。約1.4等の明るさで、星座をたどる目印になります。',
    en: 'Alpha Leonis, a magnitude 1.4 guide to the constellation Leo.',
    zh: '狮子座α星，视星等约为1.4等，是辨认狮子座的标志之一。',
  },
  Adhara: {
    ja: 'おおいぬ座のε星。シリウスと同じ星座にある、約1.5等の恒星です。',
    en: 'Epsilon Canis Majoris, a magnitude 1.5 star in the same constellation as Sirius.',
    zh: '大犬座ε星，视星等约为1.5等，与天狼星同属大犬座。',
  },
  Castor: {
    ja: 'ふたご座のα星。ポルックスとともに、ふたご座を見つける目印になります。',
    en: 'Alpha Geminorum, paired with Pollux as a guide to Gemini.',
    zh: '双子座α星，与北河三一起成为寻找双子座的标志。',
  },
  Bellatrix: {
    ja: 'オリオン座のγ星。名前はラテン語で「女戦士」を意味します。',
    en: 'Gamma Orionis. Its Latin name means “female warrior.”',
    zh: '猎户座γ星，拉丁语名称意为“女战士”。',
  },
  Elnath: {
    ja: 'おうし座のβ星。名前はアラビア語の「角で突くこと」に由来します。',
    en: 'Beta Tauri. Its name comes from an Arabic term for butting with horns.',
    zh: '金牛座β星，名称源自阿拉伯语中“用角顶撞”的意思。',
  },
  Alnilam: {
    ja: 'オリオン座の三つ星の中央。並んで見える三つ星も、地球からの距離はそれぞれ異なります。',
    en: 'The middle star of Orion’s Belt. The three belt stars lie at different distances from Earth.',
    zh: '猎户座腰带三星中间的一颗。三颗星看似并列，与地球的距离却各不相同。',
  },
  Alnitak: {
    ja: 'オリオン座の三つ星の東端。アルニラム、ミンタカと帯のように並んで見えます。',
    en: 'The eastern star of Orion’s Belt, aligned with Alnilam and Mintaka.',
    zh: '猎户座腰带三星最东侧的一颗，与参宿二、参宿三排列成带状。',
  },
  Alioth: {
    ja: 'おおぐま座の星。北斗七星の柄で、ひしゃくの器に最も近い位置にあります。',
    en: 'A star in Ursa Major, on the Big Dipper’s handle nearest its bowl.',
    zh: '大熊座的恒星，位于北斗七星斗柄上最靠近斗身的位置。',
  },
  Mirfak: {
    ja: 'ペルセウス座のα星。アルゴルとともに星座をたどる目印になる恒星です。',
    en: 'Alpha Persei, a guide to Perseus along with Algol.',
    zh: '英仙座α星，与大陵五一起成为辨认英仙座的标志。',
  },
  Dubhe: {
    ja: '北斗七星の器の端にある星。メラクからこの星へ線を延ばすと北極星を探せます。',
    en: 'At the edge of the Big Dipper’s bowl. A line from Merak through Dubhe points toward Polaris.',
    zh: '位于北斗七星斗身的边缘。从天璇向天枢延长连线，可以寻找北极星。',
  },
  Mizar: {
    ja: '北斗七星の柄の中央にある星。すぐ近くにアルコルが並んで見えます。',
    en: 'The middle star of the Big Dipper’s handle, with Alcor appearing close beside it.',
    zh: '北斗七星斗柄中间的一颗，旁边可以看到辅星。',
  },
  Alkaid: {
    ja: 'おおぐま座の星で、北斗七星の柄の先端にあたります。',
    en: 'A star in Ursa Major at the tip of the Big Dipper’s handle.',
    zh: '大熊座的恒星，位于北斗七星斗柄的末端。',
  },
  Polaris: {
    ja: 'こぐま座にある北極星。天の北極に近く、北の方角を知る目印になります。',
    en: 'The North Star in Ursa Minor. Close to the north celestial pole, it is a useful guide to true north.',
    zh: '小熊座中的北极星，靠近北天极，是判断正北方向的标志。',
  },
  Saiph: {
    ja: 'オリオン座のκ星。名前はアラビア語の「巨人の剣」に由来します。',
    en: 'Kappa Orionis. Its name comes from an Arabic phrase meaning “the giant’s sword.”',
    zh: '猎户座κ星，名称源自阿拉伯语中的“巨人之剑”。',
  },
  Alpheratz: {
    ja: 'アンドロメダ座の星。ペガスス座の星々とともに秋の四辺形をつくります。',
    en: 'A star in Andromeda that joins stars in Pegasus to form the Great Square.',
    zh: '仙女座的恒星，与飞马座的几颗星一起组成秋季四边形。',
  },
  Algol: {
    ja: 'ペルセウス座の食変光星。互いを回る星が重なって見えると、明るさが下がります。',
    en: 'An eclipsing variable in Perseus. Its light dims when orbiting stars pass in front of each other.',
    zh: '英仙座的食变星。相互绕行的恒星发生遮挡时，看到的亮度会降低。',
  },
  Denebola: {
    ja: 'しし座のβ星。アルクトゥルス、スピカと春の大三角をつくります。',
    en: 'Beta Leonis, forming the Spring Triangle with Arcturus and Spica.',
    zh: '狮子座β星，与大角星、角宿一组成春季大三角。',
  },
  Mintaka: {
    ja: 'オリオン座の三つ星の西端。一点のように見えますが、複数の星からなる星系です。',
    en: 'The western star of Orion’s Belt. Its single point of light is actually a multiple-star system.',
    zh: '猎户座腰带三星最西侧的一颗。看似一个光点，实际是由多颗恒星组成的系统。',
  },
  Merak: {
    ja: '北斗七星の器をつくる星。ドゥーベと結んだ線が、北極星を探す道しるべになります。',
    en: 'A star in the Big Dipper’s bowl. The line through Merak and Dubhe leads toward Polaris.',
    zh: '组成北斗七星斗身的一颗星。它与天枢的连线可以指引北极星的方向。',
  },
  Phecda: {
    ja: 'おおぐま座の星。北斗七星で、ひしゃくの器の一角をつくります。',
    en: 'A star in Ursa Major forming a corner of the Big Dipper’s bowl.',
    zh: '大熊座的恒星，构成北斗七星斗身的一个角。',
  },
  Scheat: {
    ja: 'ペガスス座の星。マルカブ、アルフェラッツなどと秋の四辺形をつくります。',
    en: 'A star in Pegasus, outlining the Great Square with Markab, Alpheratz, and Algenib.',
    zh: '飞马座的恒星，与飞马座α星、壁宿二和壁宿一组成秋季四边形。',
  },
  Markab: {
    ja: 'ペガスス座の星。秋の四辺形の一角を担う、星空の目印です。',
    en: 'A star in Pegasus marking one corner of the Great Square.',
    zh: '飞马座的恒星，是秋季四边形的一个顶点。',
  },
  Megrez: {
    ja: 'おおぐま座の星。北斗七星の器と柄がつながる位置にあります。',
    en: 'A star in Ursa Major where the Big Dipper’s bowl meets its handle.',
    zh: '大熊座的恒星，位于北斗七星斗身与斗柄的连接处。',
  },
  Mercury: {
    ja: '太陽に最も近い惑星。太陽系の8惑星の中で最も小さい、岩石の惑星です。',
    en: 'The closest planet to the Sun, and the smallest of the eight planets. It has a rocky surface.',
    zh: '距离太阳最近、八大行星中最小的一颗，是具有固体表面的岩石行星。',
  },
  Venus: {
    ja: '太陽から2番目の惑星。地球と同じく、固体の表面を持つ岩石の惑星です。',
    en: 'The second planet from the Sun. Like Earth, it is a rocky planet with a solid surface.',
    zh: '太阳系中距离太阳第二近的行星，和地球一样拥有固体表面。',
  },
  Mars: {
    ja: '太陽から4番目の惑星。地球より外側を回る、赤みを帯びた岩石の惑星です。',
    en: 'The fourth planet from the Sun, a reddish rocky world orbiting beyond Earth.',
    zh: '距离太阳第四近的行星，是在地球轨道外侧运行的红色岩石世界。',
  },
  Jupiter: {
    ja: '太陽系で最も大きい惑星。太陽から5番目を回るガス惑星です。',
    en: 'The largest planet in our solar system, a gas giant fifth from the Sun.',
    zh: '太阳系中最大的行星，距离太阳第五近，是一颗气态巨行星。',
  },
  Saturn: {
    ja: '太陽系で2番目に大きい惑星。太陽から6番目を回る、環で知られるガス惑星です。',
    en: 'The second-largest planet, a ringed gas giant sixth from the Sun.',
    zh: '太阳系中第二大的行星，距离太阳第六近，是以光环闻名的气态巨行星。',
  },
};
