/**
 * King Wen sequence of the 64 I Ching hexagrams.
 * `lower` is the bottom trigram, `upper` is the top trigram.
 * Binary strings are derived in engine.ts from these trigrams.
 */

export interface HexagramRecord {
  readonly number: number
  readonly name: string
  readonly upper: string
  readonly lower: string
  readonly judgment: string
}

export const HEXAGRAMS: readonly HexagramRecord[] = [
  { number: 1, name: '乾为天', upper: '乾', lower: '乾', judgment: '元亨利贞。' },
  { number: 2, name: '坤为地', upper: '坤', lower: '坤', judgment: '元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞吉。' },
  { number: 3, name: '水雷屯', upper: '坎', lower: '震', judgment: '元亨利贞。勿用有攸往，利建侯。' },
  { number: 4, name: '山水蒙', upper: '艮', lower: '坎', judgment: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
  { number: 5, name: '水天需', upper: '坎', lower: '乾', judgment: '有孚，光亨，贞吉。利涉大川。' },
  { number: 6, name: '天水讼', upper: '乾', lower: '坎', judgment: '有孚窒惕，中吉，终凶。利见大人，不利涉大川。' },
  { number: 7, name: '地水师', upper: '坤', lower: '坎', judgment: '贞，丈人吉，无咎。' },
  { number: 8, name: '水地比', upper: '坎', lower: '坤', judgment: '吉。原筮，元永贞，无咎。不宁方来，后夫凶。' },
  { number: 9, name: '风天小畜', upper: '巽', lower: '乾', judgment: '亨。密云不雨，自我西郊。' },
  { number: 10, name: '天泽履', upper: '乾', lower: '兑', judgment: '履虎尾，不咥人，亨。' },
  { number: 11, name: '地天泰', upper: '坤', lower: '乾', judgment: '小往大来，吉亨。' },
  { number: 12, name: '天地否', upper: '乾', lower: '坤', judgment: '否之匪人，不利君子贞，大往小来。' },
  { number: 13, name: '天火同人', upper: '乾', lower: '离', judgment: '同人于野，亨。利涉大川，利君子贞。' },
  { number: 14, name: '火天大有', upper: '离', lower: '乾', judgment: '元亨。' },
  { number: 15, name: '地山谦', upper: '坤', lower: '艮', judgment: '亨，君子有终。' },
  { number: 16, name: '雷地豫', upper: '震', lower: '坤', judgment: '利建侯行师。' },
  { number: 17, name: '泽雷随', upper: '兑', lower: '震', judgment: '元亨利贞，无咎。' },
  { number: 18, name: '山风蛊', upper: '艮', lower: '巽', judgment: '元亨，利涉大川。先甲三日，后甲三日。' },
  { number: 19, name: '地泽临', upper: '坤', lower: '兑', judgment: '元亨利贞。至于八月有凶。' },
  { number: 20, name: '风地观', upper: '巽', lower: '坤', judgment: '盥而不荐，有孚颙若。' },
  { number: 21, name: '火雷噬嗑', upper: '离', lower: '震', judgment: '亨。利用狱。' },
  { number: 22, name: '山火贲', upper: '艮', lower: '离', judgment: '亨。小利有攸往。' },
  { number: 23, name: '山地剥', upper: '艮', lower: '坤', judgment: '不利有攸往。' },
  { number: 24, name: '地雷复', upper: '坤', lower: '震', judgment: '亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。' },
  { number: 25, name: '天雷无妄', upper: '乾', lower: '震', judgment: '元亨利贞。其匪正有眚，不利有攸往。' },
  { number: 26, name: '山天大畜', upper: '艮', lower: '乾', judgment: '利贞，不家食吉，利涉大川。' },
  { number: 27, name: '山雷颐', upper: '艮', lower: '震', judgment: '贞吉。观颐，自求口实。' },
  { number: 28, name: '泽风大过', upper: '兑', lower: '巽', judgment: '栋桡，利有攸往，亨。' },
  { number: 29, name: '坎为水', upper: '坎', lower: '坎', judgment: '习坎，有孚，维心亨，行有尚。' },
  { number: 30, name: '离为火', upper: '离', lower: '离', judgment: '利贞，亨。畜牝牛，吉。' },
  { number: 31, name: '泽山咸', upper: '兑', lower: '艮', judgment: '亨，利贞，取女吉。' },
  { number: 32, name: '雷风恒', upper: '震', lower: '巽', judgment: '亨，无咎，利贞，利有攸往。' },
  { number: 33, name: '天山遁', upper: '乾', lower: '艮', judgment: '亨，小利贞。' },
  { number: 34, name: '雷天大壮', upper: '震', lower: '乾', judgment: '利贞。' },
  { number: 35, name: '火地晋', upper: '离', lower: '坤', judgment: '康侯用锡马蕃庶，昼日三接。' },
  { number: 36, name: '地火明夷', upper: '坤', lower: '离', judgment: '利艰贞。' },
  { number: 37, name: '风火家人', upper: '巽', lower: '离', judgment: '利女贞。' },
  { number: 38, name: '火泽睽', upper: '离', lower: '兑', judgment: '小事吉。' },
  { number: 39, name: '水山蹇', upper: '坎', lower: '艮', judgment: '利西南，不利东北。利见大人，贞吉。' },
  { number: 40, name: '雷水解', upper: '震', lower: '坎', judgment: '利西南，无所往，其来复吉。有攸往，夙吉。' },
  { number: 41, name: '山泽损', upper: '艮', lower: '兑', judgment: '有孚，元吉，无咎，可贞，利有攸往。曷之用？二簋可用享。' },
  { number: 42, name: '风雷益', upper: '巽', lower: '震', judgment: '利有攸往，利涉大川。' },
  { number: 43, name: '泽天夬', upper: '兑', lower: '乾', judgment: '扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。' },
  { number: 44, name: '天风姤', upper: '乾', lower: '巽', judgment: '女壮，勿用取女。' },
  { number: 45, name: '泽地萃', upper: '兑', lower: '坤', judgment: '亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。' },
  { number: 46, name: '地风升', upper: '坤', lower: '巽', judgment: '元亨，用见大人，勿恤，南征吉。' },
  { number: 47, name: '泽水困', upper: '兑', lower: '坎', judgment: '亨，贞，大人吉，无咎，有言不信。' },
  { number: 48, name: '水风井', upper: '坎', lower: '巽', judgment: '改邑不改井，无丧无得，往来井井。汔至亦未繘井，羸其瓶，凶。' },
  { number: 49, name: '泽火革', upper: '兑', lower: '离', judgment: '己日乃孚，元亨利贞，悔亡。' },
  { number: 50, name: '火风鼎', upper: '离', lower: '巽', judgment: '元吉，亨。' },
  { number: 51, name: '震为雷', upper: '震', lower: '震', judgment: '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。' },
  { number: 52, name: '艮为山', upper: '艮', lower: '艮', judgment: '艮其背，不获其身；行其庭，不见其人，无咎。' },
  { number: 53, name: '风山渐', upper: '巽', lower: '艮', judgment: '女归吉，利贞。' },
  { number: 54, name: '雷泽归妹', upper: '震', lower: '兑', judgment: '征凶，无攸利。' },
  { number: 55, name: '雷火丰', upper: '震', lower: '离', judgment: '亨，王假之，勿忧，宜日中。' },
  { number: 56, name: '火山旅', upper: '离', lower: '艮', judgment: '小亨，旅贞吉。' },
  { number: 57, name: '巽为风', upper: '巽', lower: '巽', judgment: '小亨，利有攸往，利见大人。' },
  { number: 58, name: '兑为泽', upper: '兑', lower: '兑', judgment: '亨，利贞。' },
  { number: 59, name: '风水涣', upper: '巽', lower: '坎', judgment: '亨。王假有庙，利涉大川，利贞。' },
  { number: 60, name: '水泽节', upper: '坎', lower: '兑', judgment: '亨。苦节不可贞。' },
  { number: 61, name: '风泽中孚', upper: '巽', lower: '兑', judgment: '豚鱼吉，利涉大川，利贞。' },
  { number: 62, name: '雷山小过', upper: '震', lower: '艮', judgment: '亨，利贞，可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。' },
  { number: 63, name: '水火既济', upper: '坎', lower: '离', judgment: '亨小，利贞，初吉终乱。' },
  { number: 64, name: '火水未济', upper: '离', lower: '坎', judgment: '亨，小狐汔济，濡其尾，无攸利。' },
]
