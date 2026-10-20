import { Course, User, StudentProgress, Certificate, CoinMarketItem } from '../types';

export const INITIAL_COIN_MARKET_ITEMS: CoinMarketItem[] = [
  {
    id: 'book-jadid-6',
    title: "Jadid adabiyoti namoyondalari. To'plam (6 ta kitob) ▷ ASAXIYdan xarid qilish: narxlar, xususiyatlar, izohlar",
    description: "Fitrat, Cho'lpon, Abdulla Qodiriy, Mahmudxo'ja Behbudiy, Abdulla Avloniy va Munavvarqori Abdurashidxonovning sara asarlari jamlangan 6 jildlik nodir to'plam.",
    cost: 50,
    iconName: 'BookOpen',
    category: 'kitoblar'
  },
  {
    id: 'book-toplami-3',
    title: "Kitoblar to‘plami",
    description: "IIV tinglovchilari va talabalari uchun kasbiy mahorat, harbiy-vatanparvarlik va maxsus adabiyotlar to'plami.",
    cost: 50,
    iconName: 'BookOpen',
    category: 'kitoblar'
  },
  {
    id: 'book-badiiy-1',
    title: "Badiiy adabiyot kitoblar to`plami",
    description: "O'zbek va jahon mumtoz badiiy adabiyotining eng sara durdona asarlari, roman va qissalari to'plami.",
    cost: 50,
    iconName: 'BookOpen',
    category: 'kitoblar'
  }
];

// O'quvchilar hali ro'yxatdan o'tmagan, ular o'zlari ro'yxatdan o'tadi!
// Faqat bitta rasmiy admin hisobi mavjud, paroli: "iiv admin"
export const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    fullName: 'IIV Administratori',
    group: 'Bosh Boshqarma',
    role: 'admin',
    password: 'iiv admin', // User explicit requirement
    createdAt: '2026-01-01',
    mustChangePassword: false,
    coins: 0
  }
];

// Hech qanday soxta o'quvchi progressi yo'q
export const INITIAL_PROGRESS: StudentProgress[] = [];

// Hech qanday soxta sertifikat yo'q
export const INITIAL_CERTIFICATES: Certificate[] = [];

// 6 ta asosiy kurs: Videolar va testlarni admin/o'qituvchi o'zi kiritadi!
export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-cpp',
    title: 'IT kursi — C++',
    category: 'Axborot Texnologiyalari',
    badge: 'IT & Dasturlash',
    description: "C++ dasturlash tili asoslari, tizimli dasturlash, obyektga yo'naltirilgan dasturlash (OOP), xotira xavfsizligi va xavfsiz tizimlar ishlab chiqish bo'yicha 20 darslik kurs.",
    totalLessons: 20,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    accentColor: '#0284c7',
    lessons: [], // Admin o'zi videolarni kiritadi!
    finalExamQuestions: [], // Admin o'zi test tuzib kiritadi!
    createdAt: '2026-01-15'
  },
  {
    id: 'course-history',
    title: 'Tarix',
    category: 'Ijtimoiy-Gumanitar',
    badge: 'Vatan Tarixi',
    description: "O'zbekiston davlatchiligi, Amir Temur harbiy san'ati, jadidchilik, Yangi O'zbekiston islohotlari va Ichki Ishlar Organlari tizimining shakllanish tarixi bo'yicha 20 darslik dastur.",
    totalLessons: 20,
    thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
    accentColor: '#d97706',
    lessons: [], // Admin o'zi videolarni kiritadi!
    finalExamQuestions: [], // Admin o'zi test tuzib kiritadi!
    createdAt: '2026-01-15'
  },
  {
    id: 'course-english',
    title: 'Ingliz tili',
    category: 'Xorijiy Tillar',
    badge: 'Professional English',
    description: "Huquqni muhofaza qilish, xalqaro hamkorlik, xizmat muloqoti va professional terminologiyani qamrab oluvchi 20 darslik ingliz tili kursi.",
    totalLessons: 20,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    accentColor: '#2563eb',
    lessons: [], // Admin o'zi videolarni kiritadi!
    finalExamQuestions: [], // Admin o'zi test tuzib kiritadi!
    createdAt: '2026-01-15'
  },
  {
    id: 'course-russian',
    title: 'Rus tili',
    category: 'Xorijiy Tillar',
    badge: 'Деловой русский язык',
    description: "Xizmat hujjatlarini rasmiylashtirish, me'yoriy aktlar bilan ishlash, fuqarolar bilan muloqot va huquqiy terminologiyani chuqur o'rganishga qaratilgan 20 darslik kurs.",
    totalLessons: 20,
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    accentColor: '#dc2626',
    lessons: [], // Admin o'zi videolarni kiritadi!
    finalExamQuestions: [], // Admin o'zi test tuzib kiritadi!
    createdAt: '2026-01-15'
  },
  {
    id: 'course-python',
    title: 'Python',
    category: 'Axborot Texnologiyalari',
    badge: 'Kiberxavfsizlik & IT',
    description: "Zamonaviy Python dasturlash tili: ma'lumotlar tahlili, log fayllarni o'rganish, kiberxavfsizlik asoslari va xizmat jarayonlarini avtomatlashtirish bo'yicha 20 darslik kurs.",
    totalLessons: 20,
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    accentColor: '#16a34a',
    lessons: [], // Admin o'zi videolarni kiritadi!
    finalExamQuestions: [], // Admin o'zi test tuzib kiritadi!
    createdAt: '2026-01-15'
  },
  {
    id: 'course-onatili',
    title: 'Ona tili',
    category: 'Ijtimoiy-Gumanitar',
    badge: 'Davlat Tili',
    description: "Ona tili va davlat tilida ish yuritish, rasmiy-idoraviy uslub, orfografiya, me'yoriy hujjatlar va nutq madaniyati bo'yicha 20 darslik maxsus kurs.",
    totalLessons: 20,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    accentColor: '#059669',
    lessons: [], // Admin o'zi videolarni kiritadi!
    finalExamQuestions: [], // Admin o'zi test tuzib kiritadi!
    createdAt: '2026-01-20'
  }
];

// O'qituvchi xohlasa tezkor foydalanishi uchun tayyor 20 talik dars mavzulari shablonlari
export const COURSE_LESSON_TITLE_TEMPLATES: Record<string, string[]> = {
  'course-cpp': [
    "C++ ga kirish va dasturlash muhiti (IDE, Compiler)",
    "O'zgaruvchilar, ma'lumot turlari va xotira tuzilishi",
    "Arifmetik va mantiqiy amallar, operatorlar",
    "Shart operatorlari (if, else, switch-case)",
    "Takrorlanuvchi jarayonlar: for, while va do-while sikllari",
    "Funksiyalar va modulli dasturlash tamoyillari",
    "Funksiyalarga parametrlarni qiymat va ko'rsatkich bo'yicha uzatish",
    "Bir o'lchamli massivlar va ular bilan ishlash",
    "Ko'p o'lchamli massivlar va matritsalar",
    "Ko'rsatkichlar (Pointers) va dinamik xotira (new/delete)",
    "Havolalar (References) va ko'rsatkichlar bilan xavfsiz ishlash",
    "Belgilar qatori: char[] va std::string klassi",
    "Tuzilmalar (struct) va maxsus ma'lumot turlari",
    "Obyektga yo'naltirilgan dasturlash (OOP): Sinf va Obyektlar",
    "Konstruktorlar, destruktorlar va inkapsulyatsiya",
    "Merosxo'rlik (Inheritance) va sinflar iyerarxiyasi",
    "Polimorfizm va virtual funksiyalar (Virtual methods)",
    "Fayllar bilan ishlash: ifstream va ofstream",
    "Standart shablonlar kutubxonasi (STL): vector, map, set",
    "C++ da xavfsizlik, xatolarni ushlash va xavfsiz kod yozish"
  ],
  'course-history': [
    "O'zbekiston hududidagi ilk davlatchilik asoslari",
    "Qadimgi Baqtriya, Xorazm va So'g'd davlatlari",
    "Buyuk Ipak yo'li va mintaqaning geosiyosiy ahamiyati",
    "Amir Temur davlati: harbiy san'at va boshqaruv tizimi",
    "Temuriylar renessansi: ilm-fan, madaniyat va me'morchilik",
    "O'zbek xonliklari davri (Buxoro, Xiva, Qo'qon)",
    "XIX asr oxirida Chor Rossiyasi bosqini va mustamlaka zulmi",
    "Jadidchilik harakati: milliy uyg'onish va ma'rifatparvarlik",
    "Mustaqillik uchun kurash va sovet mustabid tuzumi qatag'onlari",
    "Ikkinchi jahon urushida O'zbekiston xalqining jasorati",
    "O'zbekiston Respublikasi Davlat Mustaqilligining e'lon qilinishi",
    "O'zbekiston Konstitutsiyasi va huquqiy davlat asoslari",
    "O'zbekiston Respublikasi Qurolli Kuchlari va harbiy doktrinasi",
    "Ichki Ishlar Organlarining shakllanish tarixi va vazifalari",
    "Huquq-tartibot tizimidagi islohotlar va jamoat xavfsizligi",
    "Yangi O'zbekiston taraqqiyot strategiyasi",
    "Inson qadri va adolatli jamiyat qurish tamoyillari",
    "O'zbekistonning mintaqaviy va global xalqaro hamkorligi",
    "Tarixiy obidalar, milliy meros va madaniy qadriyatlarni asrash",
    "Vatanga sadoqat, harbiy qasamyod va fuqarolik burchi"
  ],
  'course-english': [
    "English Alphabet, Phonetics & Self-Introduction",
    "Personal Pronouns & Verb 'To Be' in Present & Past",
    "Essential Vocabulary: Family, Ranks, Professions & Daily Routine",
    "Present Simple Tense: Affirmative, Negative & Interrogative",
    "Present Continuous Tense & Action Verbs",
    "Past Simple Tense & Regular / Irregular Verbs",
    "Future Simple & 'Going To' for Plans and Predictions",
    "Modal Verbs (Can, Must, Should) in Official Context",
    "Law Enforcement & Public Safety Basic Vocabulary",
    "Prepositions of Place, Direction & Time",
    "Comparative and Superlative Adjectives",
    "Professional Greetings & Radio/Telephone Communications",
    "Giving Directions, Patrolling & Citizen Assistance Dialogues",
    "Incident Reporting & Describing Persons / Vehicles",
    "Present Perfect Tense & Life Experiences",
    "Passive Voice in Official and Legal Reports",
    "Conditional Sentences (Zero, First and Second Conditionals)",
    "Official Letters, Formal Emails & Professional Notes",
    "Interviewing & Questioning Techniques in English",
    "Comprehensive English for Official & International Duty"
  ],
  'course-russian': [
    "Вводный курс: русский алфавит, правила чтения и ударение",
    "Приветствие, обращение по уставу и представление о себе",
    "Имя существительное: род, число и одушевленность",
    "Имя прилагательное и согласование с существительными",
    "Местоимения и притяжательные формы в русском языке",
    "Глаголы настоящего времени: I и II спряжения",
    "Прошедшее и будущее время глагола: виды совершенный и несовершенный",
    "Падежная система: Именительный и Родительный падежи",
    "Дательный и Винительный падежи в практической речи",
    "Творительный и Предложный падежи: синтаксис и употребление",
    "Служебная терминология органов внутренних дел на русском языке",
    "Составление рапортов, заявлений и служебных актов",
    "Деловой телефонный разговор и правила радиообмена",
    "Опрос граждан, свидетелей и протоколирование показаний",
    "Описание внешности, примет подозреваемых и автотранспорта",
    "Сложноподчиненные предложения и правила пунктуации",
    "Официально-деловой стиль переписки и документооборота",
    "Чрезвычайные ситуации: термины безопасности и оповещения",
    "Юридические и правовые основы законодательства на русском",
    "Итоговый практикум деловой речи и проверка грамотности"
  ],
  'course-python': [
    "Python ga kirish: sintaksis, xususiyatlar va muhitni sozlash",
    "O'zgaruvchilar, dinamik tiplash va asosiy ma'lumot turlari",
    "Arifmetik amallar, mantiqiy ifodalar va shartlar (if/elif/else)",
    "Takrorlanish operatorlari: for va while sikllari, range()",
    "Funksiyalar, argumentlar, return va lambda ifodalar",
    "Ro'yxatlar (Lists): yaratish, indexlash va ro'yxat metodlari",
    "Lug'atlar (Dictionaries) va kortejlar (Tuples) bilan ishlash",
    "To'plamlar (Sets) va ularning mantiqiy amallari",
    "Matnlar bilan ishlash (Strings) va regex (re moduli) asoslari",
    "Fayllar bilan ishlash: o'qish, yozish, JSON va CSV formatlar",
    "Xatoliklarni boshqarish: try, except, finally bloklari",
    "Modullar va paketlar bilan ishlash, virtual muhit (venv)",
    "Obyektga yo'naltirilgan dasturlash (OOP): Class, Ob'ekt, __init__",
    "Merosxo'rlik, polimorfizm va enkapsulyatsiya Python'da",
    "Standart kutubxonalar: datetime, math, os, sys modullari",
    "Veb-so'rovlar yuborish: requests kutubxonasi va API bilan ishlash",
    "Log fayllarni avtomatik tahlil qilish va skriptlar yozish",
    "Kiberxavfsizlikda Python: port skanerlash va monitoring asoslari",
    "Ma'lumotlar bilan ishlashga kirish: sqlite3 va oddiy bazalar",
    "Python loyihani yig'ish, xavfsizlik qoidalari va avtomatlashtirish"
  ],
  'course-onatili': [
    "Ona tili va davlat tili maqomi, til siyosati tamoyillari",
    "Davlat tilida ish yuritishning asosiy qonuniyatlari",
    "Rasmiy-idoraviy uslub: xarakterli xususiyatlar va me'yorlar",
    "Xizmat xati, bildirishnoma va tushuntirish xatlarini yozish",
    "Buyruq, farmoyish va qaror loyihalarini to'g'ri rasmiylashtirish",
    "Bayonnoma (protokol) tuzish va uni tasdiqlash tartibi",
    "Ariza, ma'lumotnoma va tavsiyanoma tuzish madaniyati",
    "Fuqarolar murojaatlariga rasmiy javob xati tayyorlash",
    "Huquqiy va ma'muriy atamalarning to'g'ri qo'llanilishi",
    "Kirill va lotin yozuviga asoslangan o'zbek alifbosi qoidalari",
    "Orfografik me'yorlar: eng ko'p uchraydigan imlo xatolar tahlili",
    "Punktuatsiya qoidalari: vergul, tire, ikki nuqta va qavslar",
    "Nutq madaniyati, muloqot etikasi va fuqarolar bilan so'zlashuv",
    "Matn tahriri va stilistik tuzatishlar: ortiqcha so'zlarni yo'qotish",
    "Ijtimoiy tarmoqlar va OAV uchun xizmat xabarlarini savodli yozish",
    "Xizmat yozishmalarida mantiqiy ketma-ketlik va ixchamlik",
    "So'z boyligi va sinonimlardan unumli foydalanish",
    "Huquqbuzarliklar bo'yicha bayonnomalarni to'g'ri yozish",
    "Nutqiy kamchiliklar va shevaga xos so'zlarni xizmatda cheklash",
    "Davlat tilida ish yuritish bo'yicha yakuniy attestatsiya"
  ]
};
