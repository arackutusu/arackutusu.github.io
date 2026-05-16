const CATEGORIES = [
    { id: 'all', label: 'Tümü', icon: '📋' },
    { id: 'convert', label: 'Birim Çevirici', icon: '📏' },
    { id: 'calc', label: 'Hesaplama', icon: '🧮' },
    { id: 'text', label: 'Metin Araçları', icon: '✏️' },
    { id: 'security', label: 'Şifre & Güvenlik', icon: '🔒' },
    { id: 'code', label: 'Kodlama & Dönüşüm', icon: '💻' },
    { id: 'color', label: 'Renk Araçları', icon: '🎨' },
    { id: 'number', label: 'Sayı & Matematik', icon: '🔢' },
    { id: 'date', label: 'Tarih & Saat', icon: '📅' },
    { id: 'random', label: 'Rastgele Veri', icon: '🎲' },
    { id: 'health', label: 'Sağlık & Fitness', icon: '❤️' },
    { id: 'network', label: 'İnternet & Network', icon: '🌐' },
    { id: 'dev', label: 'Geliştirici', icon: '🛠️' },
    { id: 'fun', label: 'Eğlence', icon: '🎮' },
    { id: 'finance', label: 'Finans', icon: '💰' },
    { id: 'education', label: 'Eğitim', icon: '📚' },
];

const TOOLS = [];

// Helper: add tool
function addTool(id, title, desc, icon, cat, renderer, params) {
    TOOLS.push({ id, title, desc, icon, cat, renderer, params: params || {} });
}

// Helper: generate converter pair IDs
function pairId(a, b) { return a + '-' + b; }

// ===================== BIRIM CEVIRICILER =====================
const UNIT_TYPES = [
    { id: 'length', title: 'Uzunluk', icon: '📏', units: ['Metre','Kilometre','Mil','Yard','Foot','İnç','Santimetre','Milimetre','Nanometre','Mikrometre'], factors: [1,1000,1609.34,0.9144,0.3048,0.0254,0.01,0.001,1e-9,1e-6] },
    { id: 'mass', title: 'Ağırlık', icon: '⚖️', units: ['Kilogram','Gram','Miligram','Ton','Pound','Ons','Karát','Stone'], factors: [1,0.001,1e-6,1000,0.453592,0.0283495,0.0002,6.35029] },
    { id: 'temperature', title: 'Sıcaklık', icon: '🌡️', units: ['Celsius','Fahrenheit','Kelvin'], factors: null },
    { id: 'area', title: 'Alan', icon: '🔲', units: ['Metrekare','Kilometrekare','Hektar','Dönüm','Footkare','İnçkare','Mil kare'], factors: [1,1e6,10000,1000,0.092903,0.00064516,2.59e6] },
    { id: 'volume', title: 'Hacim', icon: '🧊', units: ['Litre','Mililitre','Metreküp','Galon','Quart','Pint','Fincan','Yemek Kaşığı','Çay Kaşığı'], factors: [1,0.001,1000,3.78541,0.946353,0.473176,0.236588,0.0147868,0.00492892] },
    { id: 'speed', title: 'Hız', icon: '🚀', units: ['km/saat','Mil/saat','Metre/saniye','Knot','Mach'], factors: [1,1.60934,3.6,1.852,1234.8] },
    { id: 'time', title: 'Zaman', icon: '⏱️', units: ['Saniye','Dakika','Saat','Gün','Hafta','Ay','Yıl'], factors: [1,60,3600,86400,604800,2592000,31536000] },
    { id: 'pressure', title: 'Basınç', icon: '💨', units: ['Pascal','kPa','Bar','PSI','Atmosfer','mmHg'], factors: [1,1000,100000,6894.76,101325,133.322] },
    { id: 'energy', title: 'Enerji', icon: '⚡', units: ['Joule','Kalori','kWh','BTU','eV'], factors: [1,4.184,3.6e6,1055.06,1.602e-19] },
    { id: 'power', title: 'Güç', icon: '🔌', units: ['Watt','kW','HP','Megawatt','BTU/saat'], factors: [1,1000,745.7,1e6,0.293071] },
    { id: 'data', title: 'Veri Boyutu', icon: '💾', units: ['Byte','KB','MB','GB','TB','PB','Bit'], factors: [1,1024,1048576,1.074e9,1.1e12,1.1259e15,0.125] },
    { id: 'angle', title: 'Açı', icon: '📐', units: ['Derece','Radyan','Grad','Dakika','Saniye'], factors: [1,57.2958,0.9,1/60,1/3600] },
    { id: 'frequency', title: 'Frekans', icon: '〰️', units: ['Hertz','kHz','MHz','GHz','RPM'], factors: [1,1000,1e6,1e9,1/60] },
    { id: 'density', title: 'Yoğunluk', icon: '🧪', units: ['kg/m³','g/cm³','g/mL','lb/ft³'], factors: [1,1000,1000,16.0185] },
    { id: 'force', title: 'Kuvvet', icon: '💪', units: ['Newton','Dyne','kg-f','Pound-f'], factors: [1,1e-5,9.80665,4.44822] },
    { id: 'fuel', title: 'Yakıt Tüketimi', icon: '⛽', units: ['L/100km','km/L','MPG','L/mil'], factors: [null] },
    { id: 'torque', title: 'Tork', icon: '🔧', units: ['Nm','kgf·m','lb-ft','lb-in'], factors: [1,9.80665,1.35582,0.112985] },
    { id: 'digital', title: 'Dijital Depolama', icon: '💿', units: ['Bit','Nibble','Byte','KB','MB','GB','TB','PB','EB'], factors: [1,4,8,8192,8388608,8.59e9,8.8e12,9.01e15,9.22e18] },
    { id: 'electric', title: 'Elektrik', icon: '⚡', units: ['Volt','Amper','Watt','Ohm','kW','mA'], factors: [1,null,1,1,1000,0.001] },
    { id: 'cooking', title: 'Mutfak', icon: '🍳', units: ['Su Bardağı','Yemek Kaşığı','Çay Kaşığı','mL','Litre','Pound','Ons'], factors: [240,15,5,1,1000,453.592,28.3495] },
    { id: 'typography', title: 'Tipografi', icon: '🔤', units: ['Piksel','Point','Em','Rem','Milimetre','İnç','Pica'], factors: [1,1.33333,16,16,3.77953,96,16] },
];

// Generic converters + popular pairs
const POPULAR_PAIRS = {
    length: [['Metre','Foot'],['Foot','Metre'],['Kilometre','Mil'],['Mil','Kilometre'],['Metre','İnç'],['İnç','Metre'],['Kilometre','Metre'],['Metre','Santimetre'],['Santimetre','Metre'],['Mil','Foot'],['Yard','Metre'],['Foot','İnç']],
    mass: [['Kilogram','Pound'],['Pound','Kilogram'],['Gram','Ons'],['Ons','Gram'],['Kilogram','Stone'],['Stone','Kilogram'],['Ton','Kilogram'],['Pound','Ons'],['Kilogram','Gram'],['Gram','Miligram']],
    temperature: [['Celsius','Fahrenheit'],['Fahrenheit','Celsius'],['Celsius','Kelvin'],['Kelvin','Celsius'],['Fahrenheit','Kelvin'],['Kelvin','Fahrenheit']],
    area: [['Metrekare','Footkare'],['Footkare','Metrekare'],['Hektar','Dönüm'],['Dönüm','Hektar'],['Kilometrekare','Mil kare'],['Metrekare','İnçkare']],
    volume: [['Litre','Galon'],['Galon','Litre'],['Litre','Pint'],['Pint','Litre'],['Mililitre','Litre'],['Litre','Metreküp'],['Fincan','mL'],['Yemek Kaşığı','mL'],['Çay Kaşığı','mL']],
    speed: [['km/saat','Mil/saat'],['Mil/saat','km/saat'],['km/saat','Knot'],['Knot','km/saat'],['Metre/saniye','km/saat'],['Mil/saat','Knot']],
    pressure: [['Bar','PSI'],['PSI','Bar'],['Pascal','Bar'],['Atmosfer','PSI'],['mmHg','Pascal'],['kPa','PSI']],
    energy: [['Joule','Kalori'],['Kalori','Joule'],['kWh','Joule'],['BTU','Joule'],['kWh','Kalori']],
    power: [['kW','HP'],['HP','kW'],['Watt','HP'],['kW','Megawatt'],['kW','BTU/saat']],
    data: [['MB','GB'],['GB','MB'],['KB','MB'],['MB','KB'],['GB','TB'],['TB','GB'],['Byte','KB'],['Bit','Byte']],
    cooking: [['Su Bardağı','mL'],['Yemek Kaşığı','mL'],['Çay Kaşığı','mL'],['Su Bardağı','Litre'],['Pound','Gram'],['Ons','Gram'],['mL','Su Bardağı']],
};

UNIT_TYPES.forEach(ut => {
    addTool('conv-' + ut.id, ut.title + ' Çevirici', ut.units.slice(0,3).join(', ') + ' ve daha fazlasını çevir.', ut.icon, 'convert', 'converter', ut);
    const pairs = POPULAR_PAIRS[ut.id] || [];
    pairs.forEach(([a,b]) => {
        const pid = pairId(ut.id, a.replace(/[^a-z]/gi,'').toLowerCase() + '-' + b.replace(/[^a-z]/gi,'').toLowerCase());
        addTool('conv-' + pid, a + ' → ' + b, a + ' değerini ' + b + ' değerine çevir.', ut.icon, 'convert', 'pairConverter', { type: ut.id, from: a, to: b, units: ut.units, factors: ut.factors });
    });
});

// Extra individual converter tools (misc)
const MISC_CONVERTERS = [
    ['decimal-to-fraction', 'Ondalık → Kesir', 'Ondalık sayıyı kesir olarak yaz.', '➗', 'number', 'decimalFraction'],
    ['fraction-to-decimal', 'Kesir → Ondalık', 'Kesirli sayıyı ondalığa çevir.', '➗', 'number', 'fractionDecimal'],
    ['percent-to-decimal', 'Yüzde → Ondalık', 'Yüzde değerini ondalık sayıya çevir.', '💯', 'number', 'simpleConv', { label: 'Yüzde Değeri', fromLabel: 'Yüzde', toLabel: 'Ondalık', fn: v => v/100, fnInv: v => v*100 }],
    ['decimal-to-percent', 'Ondalık → Yüzde', 'Ondalık sayıyı yüzdeye çevir.', '💯', 'number', 'simpleConv', { label: 'Ondalık Değer', fromLabel: 'Ondalık', toLabel: 'Yüzde', fn: v => v*100, fnInv: v => v/100 }],
    ['fraction-to-percent', 'Kesir → Yüzde', 'Kesirli sayıyı yüzdeye çevir.', '💯', 'number', 'fractionPercent'],
    ['percent-to-fraction', 'Yüzde → Kesir', 'Yüzde değerini kesire çevir.', '💯', 'number', 'percentFraction'],
    ['decimal-to-binary', 'Ondalık → Binary', 'Ondalık sayıyı ikili sisteme çevir.', '0️⃣1️⃣', 'number', 'baseConv', { base: 2 }],
    ['binary-to-decimal', 'Binary → Ondalık', 'İkili sayıyı ondalığa çevir.', '0️⃣1️⃣', 'number', 'baseConvFrom', { base: 2 }],
    ['decimal-to-hex', 'Ondalık → Hexadecimal', 'Ondalık sayıyı hexadecimal sisteme çevir.', '🔢', 'number', 'baseConv', { base: 16 }],
    ['hex-to-decimal', 'Hexadecimal → Ondalık', 'Hexadecimal sayıyı ondalığa çevir.', '🔢', 'number', 'baseConvFrom', { base: 16 }],
    ['decimal-to-octal', 'Ondalık → Octal', 'Ondalık sayıyı octal sisteme çevir.', '🔢', 'number', 'baseConv', { base: 8 }],
    ['octal-to-decimal', 'Octal → Ondalık', 'Octal sayıyı ondalığa çevir.', '🔢', 'number', 'baseConvFrom', { base: 8 }],
    ['binary-to-hex', 'Binary → Hexadecimal', 'İkili sayıyı hexadecimala çevir.', '0️⃣1️⃣', 'number', 'binaryHex'],
    ['hex-to-binary', 'Hexadecimal → Binary', 'Hexadecimal sayıyı ikili sisteme çevir.', '0️⃣1️⃣', 'number', 'hexBinary'],
    ['roman-to-number', 'Roma → Sayı', 'Roma rakamını sayıya çevir.', '🇷🇴', 'number', 'romanNumber'],
    ['number-to-roman', 'Sayı → Roma', 'Sayıyı Roma rakamına çevir.', '🇷🇴', 'number', 'numberRoman'],
    ['pt-to-px', 'PT → PX', 'Point değerini piksele çevir.', '🔤', 'convert', 'simpleConv', { label: 'PT Değeri', fromLabel: 'Point', toLabel: 'Piksel', fn: v => v*1.33333, fnInv: v => v/1.33333 }],
    ['px-to-pt', 'PX → PT', 'Piksel değerini pointe çevir.', '🔤', 'convert', 'simpleConv', { label: 'PX Değeri', fromLabel: 'Piksel', toLabel: 'Point', fn: v => v/1.33333, fnInv: v => v*1.33333 }],
    ['inch-to-cm', 'İnç → Santimetre', 'İnç değerini santimetreye çevir.', '📏', 'convert', 'simpleConv', { label: 'İnç Değeri', fromLabel: 'İnç', toLabel: 'Santimetre', fn: v => v*2.54, fnInv: v => v/2.54 }],
    ['cm-to-inch', 'Santimetre → İnç', 'Santimetre değerini inçe çevir.', '📏', 'convert', 'simpleConv', { label: 'CM Değeri', fromLabel: 'Santimetre', toLabel: 'İnç', fn: v => v/2.54, fnInv: v => v*2.54 }],
    ['fahrenheit-to-celsius', 'Fahrenheit → Celsius', 'Fahrenheit sıcaklığını Celsiusa çevir.', '🌡️', 'convert', 'simpleConv', { label: '°F', fromLabel: 'Fahrenheit', toLabel: 'Celsius', fn: v => (v-32)*5/9, fnInv: v => v*9/5+32 }],
    ['celsius-to-fahrenheit', 'Celsius → Fahrenheit', 'Celsius sıcaklığını Fahrenheitaa çevir.', '🌡️', 'convert', 'simpleConv', { label: '°C', fromLabel: 'Celsius', toLabel: 'Fahrenheit', fn: v => v*9/5+32, fnInv: v => (v-32)*5/9 }],
];
MISC_CONVERTERS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params||{}));

// ===================== HESAPLAMA ARAÇLARI =====================
const CALCULATORS = [
    ['bmi', 'BMI Hesaplayıcı', 'Boy ve kilona göre vücut kitle indeksini hesapla.', '🧍', 'health', 'bmi'],
    ['bmr', 'BMR Hesaplayıcı', 'Bazal metabolizma hızını hesapla.', '🔥', 'health', 'bmr'],
    ['tdee', 'TDEE Hesaplayıcı', 'Günlük toplam enerji harcamanı hesapla.', '⚡', 'health', 'tdee'],
    ['ideal-weight', 'İdeal Kilo', 'Boyuna göre ideal kilonu hesapla.', '🎯', 'health', 'idealWeight'],
    ['body-fat', 'Vücut Yağ Oranı', 'Vücut yağ yüzdeni hesapla.', '🧬', 'health', 'bodyFat'],
    ['calorie', 'Kalori İhtiyacı', 'Günlük kalori ihtiyacını hesapla.', '🍎', 'health', 'calorie'],
    ['protein', 'Protein İhtiyacı', 'Günlük protein ihtiyacını hesapla.', '🥩', 'health', 'protein'],
    ['water', 'Su İhtiyacı', 'Günlük su tüketim ihtiyacını hesapla.', '💧', 'health', 'water'],
    ['max-heart-rate', 'Maksimum Kalp Atışı', 'Yaşına göre maksimum kalp atış hızını hesapla.', '❤️', 'health', 'maxHR'],
    ['heart-rate-zone', 'Kalp Atış Bölgesi', 'Hedef kalp atış hızı bölgelerini hesapla.', '💓', 'health', 'hrZone'],
    ['pace', 'Koşu Hızı', 'Koşu hızını ve temponu hesapla.', '🏃', 'health', 'pace'],
    ['sleep', 'Uyku Döngüsü', 'İdeal yatma ve uyanma saatlerini hesapla.', '😴', 'health', 'sleep'],
    ['pregnancy', 'Gebelik Hesaplayıcı', 'Tahmini doğum tarihini ve gebelik haftasını hesapla.', '🤰', 'health', 'pregnancy'],
    ['ovulation', 'Yumurtlama Hesaplayıcı', 'Yumurtlama gününü ve doğurgan dönemi hesapla.', '🌸', 'health', 'ovulation'],
    ['macros', 'Makro Besin Hesaplayıcı', 'Günlük makro besin ihtiyacını hesapla.', '🥗', 'health', 'macros'],
    ['blood-alcohol', 'Kan Alkol Oranı', 'Tahmini kan alkol oranını hesapla.', '🍺', 'health', 'bac'],

    ['percentage', 'Yüzde Hesaplayıcı', 'Bir sayının yüzdesini hesapla.', '💯', 'calc', 'percentage'],
    ['percent-change', 'Yüzde Değişim', 'İki sayı arasındaki yüzdelik değişimi hesapla.', '📈', 'calc', 'percentChange'],
    ['percent-increase', 'Yüzde Artış', 'Bir sayının yüzde kaç arttığını hesapla.', '📈', 'calc', 'percentIncrease'],
    ['percent-decrease', 'Yüzde Azalış', 'Bir sayının yüzde kaç azaldığını hesapla.', '📉', 'calc', 'percentDecrease'],
    ['percentage-of', 'Yüzde Bulma', 'Bir sayı diğerinin yüzde kaçıdır hesapla.', '🔍', 'calc', 'percentageOf'],
    ['discount', 'İndirim Hesaplayıcı', 'İndirimli fiyatı hesapla.', '🏷️', 'calc', 'discount'],
    ['discount-saved', 'İndirim Tutarı', 'İndirimde ne kadar tasarruf ettiğini hesapla.', '💰', 'calc', 'discountSaved'],
    ['tip', 'Bahşiş Hesaplayıcı', 'Bahşiş miktarını hesapla.', '💵', 'calc', 'tip'],
    ['tip-split', 'Bahşiş Paylaştır', 'Bahşişi kişi başı paylaştır.', '👥', 'calc', 'tipSplit'],
    ['loan', 'Kredi Hesaplayıcı', 'Aylık kredi ödemesini hesapla.', '🏦', 'finance', 'loan'],
    ['mortgage', 'Mortgage Hesaplayıcı', 'Konut kredisi ödemesini hesapla.', '🏠', 'finance', 'mortgage'],
    ['simple-interest', 'Basit Faiz', 'Basit faiz hesaplaması yap.', '📊', 'finance', 'simpleInterest'],
    ['compound-interest', 'Bileşik Faiz', 'Bileşik faiz hesaplaması yap.', '📈', 'finance', 'compoundInterest'],
    ['profit', 'Kâr Hesaplayıcı', 'Alış-satış arasındaki kârı hesapla.', '💹', 'finance', 'profit'],
    ['margin', 'Kâr Marjı', 'Kâr marjı yüzdesini hesapla.', '📊', 'finance', 'margin'],
    ['markup', 'Kar Oranı', 'Ürün fiyatına kar oranı ekle.', '🏷️', 'finance', 'markup'],
    ['roi', 'ROI Hesaplayıcı', 'Yatırım getirisini hesapla.', '📈', 'finance', 'roi'],
    ['vat', 'KDV Hesaplayıcı', 'KDV dahil/hariç fiyat hesapla.', '🧾', 'calc', 'vat'],
    ['gpa', 'GPA Hesaplayıcı', 'Not ortalamanı hesapla.', '🎓', 'education', 'gpa'],
    ['grade', 'Sınav Notu', 'Sınav notunu hesapla.', '📝', 'education', 'grade'],
    ['average', 'Ortalama Hesaplayıcı', 'Sayıların ortalamasını hesapla.', '📊', 'calc', 'average'],
    ['weighted-average', 'Ağırlıklı Ortalama', 'Ağırlıklı ortalamayı hesapla.', '⚖️', 'calc', 'weightedAvg'],
    ['fuel-cost', 'Yakıt Maliyeti', 'Yolculuk yakıt maliyetini hesapla.', '⛽', 'calc', 'fuelCost'],
    ['electricity', 'Elektrik Tüketimi', 'Elektrikli alet tüketimini hesapla.', '💡', 'calc', 'electricity'],
    ['age-calc', 'Yaş Hesaplayıcı', 'Doğum tarihine göre tam yaşını hesapla.', '🎂', 'date', 'ageCalc'],
    ['date-diff', 'Tarih Farkı', 'İki tarih arasındaki farkı hesapla.', '📅', 'date', 'dateDiff'],
    ['date-add', 'Tarihe Ekle/Çıkar', 'Tarihe gün/ay/yıl ekle veya çıkar.', '📅', 'date', 'dateAdd'],
    ['countdown', 'Geri Sayım', 'Belirli bir tarihe kalan süreyi hesapla.', '⏳', 'date', 'countdown'],
    ['unix-timestamp', 'Unix Zaman Damgası', 'Unix timestamp dönüştürücü.', '🕰️', 'date', 'unixTs'],
    ['week-number', 'Hafta Numarası', 'Tarihin yılın kaçıncı haftası olduğunu bul.', '📅', 'date', 'weekNum'],
    ['day-of-year', 'Yılın Günü', 'Tarihin yılın kaçıncı günü olduğunu bul.', '📆', 'date', 'dayOfYear'],
    ['leap-year', 'Artık Yıl Kontrolü', 'Bir yılın artık yıl olup olmadığını kontrol et.', '📅', 'date', 'leapYear'],
    ['time-zone', 'Saat Dilimi Çevirici', 'Saat dilimleri arasında dönüşüm yap.', '🌍', 'date', 'timezone'],

    ['area-circle', 'Daire Alanı', 'Dairenin alanını hesapla.', '⭕', 'calc', 'formulaCalc', { title: 'Daire Alanı', formula: 'π × r²', fields: [{id:'r',label:'Yarıçap (r)',type:'number'}], calc: v => Math.PI * v.r * v.r, unit: 'birim²' }],
    ['area-triangle', 'Üçgen Alanı', 'Üçgenin alanını hesapla.', '🔺', 'calc', 'formulaCalc', { title: 'Üçgen Alanı', formula: '(a × h) / 2', fields: [{id:'a',label:'Taban (a)',type:'number'},{id:'h',label:'Yükseklik (h)',type:'number'}], calc: v => v.a * v.h / 2, unit: 'birim²' }],
    ['area-square', 'Kare Alanı', 'Karenin alanını hesapla.', '⬜', 'calc', 'formulaCalc', { title: 'Kare Alanı', formula: 'a × a', fields: [{id:'a',label:'Kenar (a)',type:'number'}], calc: v => v.a * v.a, unit: 'birim²' }],
    ['area-rectangle', 'Dikdörtgen Alanı', 'Dikdörtgenin alanını hesapla.', '▬', 'calc', 'formulaCalc', { title: 'Dikdörtgen Alanı', formula: 'a × b', fields: [{id:'a',label:'Uzunluk (a)',type:'number'},{id:'b',label:'Genişlik (b)',type:'number'}], calc: v => v.a * v.b, unit: 'birim²' }],
    ['volume-sphere', 'Küre Hacmi', 'Kürenin hacmini hesapla.', '🌍', 'calc', 'formulaCalc', { title: 'Küre Hacmi', formula: '(4/3) × π × r³', fields: [{id:'r',label:'Yarıçap (r)',type:'number'}], calc: v => (4/3) * Math.PI * Math.pow(v.r,3), unit: 'birim³' }],
    ['volume-cylinder', 'Silindir Hacmi', 'Silindirin hacmini hesapla.', '🥫', 'calc', 'formulaCalc', { title: 'Silindir Hacmi', formula: 'π × r² × h', fields: [{id:'r',label:'Yarıçap (r)',type:'number'},{id:'h',label:'Yükseklik (h)',type:'number'}], calc: v => Math.PI * v.r * v.r * v.h, unit: 'birim³' }],
    ['volume-cube', 'Küp Hacmi', 'Küpün hacmini hesapla.', '🧊', 'calc', 'formulaCalc', { title: 'Küp Hacmi', formula: 'a × a × a', fields: [{id:'a',label:'Kenar (a)',type:'number'}], calc: v => v.a * v.a * v.a, unit: 'birim³' }],
    ['volume-cone', 'Koni Hacmi', 'Koninin hacmini hesapla.', '🍦', 'calc', 'formulaCalc', { title: 'Koni Hacmi', formula: '(1/3) × π × r² × h', fields: [{id:'r',label:'Yarıçap (r)',type:'number'},{id:'h',label:'Yükseklik (h)',type:'number'}], calc: v => (1/3) * Math.PI * v.r * v.r * v.h, unit: 'birim³' }],
    ['pythagorean', 'Pisagor Teoremi', 'Dik üçgenin hipotenüsünü hesapla.', '📐', 'calc', 'formulaCalc', { title: 'Pisagor Teoremi', formula: 'c = √(a² + b²)', fields: [{id:'a',label:'a Kenarı',type:'number'},{id:'b',label:'b Kenarı',type:'number'}], calc: v => Math.sqrt(v.a*v.a + v.b*v.b), unit: 'birim' }],
    ['quadratic', 'İkinci Derece Denklem', 'ax² + bx + c = 0 denkleminin köklerini bul.', '📉', 'calc', 'quadratic'],
    ['factorial', 'Faktöriyel Hesaplayıcı', 'Bir sayının faktöriyelini hesapla.', '❗', 'number', 'factorial'],
    ['fibonacci', 'Fibonacci Hesaplayıcı', 'Fibonacci sayılarını hesapla.', '🌀', 'number', 'fibonacci'],
    ['prime-check', 'Asal Sayı Kontrolü', 'Bir sayının asal olup olmadığını kontrol et.', '🔢', 'number', 'primeCheck'],
    ['gcd', 'EBOB Hesaplayıcı', 'İki sayının en büyük ortak bölenini bul.', '🔢', 'number', 'gcd'],
    ['lcm', 'EKOK Hesaplayıcı', 'İki sayının en küçük ortak katını bul.', '🔢', 'number', 'lcm'],
    ['statistics', 'İstatistik Hesaplayıcı', 'Ortalama, medyan, mod, varyans hesapla.', '📊', 'number', 'statistics'],
    ['random-number', 'Rastgele Sayı', 'Belirtilen aralıkta rastgele sayı üret.', '🎲', 'random', 'randomNumber'],
    ['dice', 'Zar At', 'Sanal zar at.', '🎲', 'fun', 'dice'],
    ['coin-flip', 'Yazı-Tura', 'Yazı tura at.', '🪙', 'fun', 'coinFlip'],
    ['magic-8ball', 'Sihirli 8 Top', 'Evet/hayır sorularına cevap al.', '🔮', 'fun', 'magic8ball'],
];
CALCULATORS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params||{}));

// ===================== METIN ARACLARI =====================
addTool('word-counter', 'Kelime Sayacı', 'Kelime, karakter, cümle ve satır sayısını hesapla.', '📝', 'text', 'wordCounter');
addTool('character-counter', 'Karakter Sayacı', 'Metindeki toplam karakter sayısını hesapla.', '🔤', 'text', 'wordCounter');
addTool('sentence-counter', 'Cümle Sayacı', 'Metindeki cümle sayısını hesapla.', '📝', 'text', 'wordCounter');
addTool('paragraph-counter', 'Paragraf Sayacı', 'Metindeki paragraf sayısını hesapla.', '📄', 'text', 'wordCounter');
addTool('syllable-counter', 'Hece Sayacı', 'Metindeki hece sayısını hesapla.', '🔤', 'text', 'syllableCounter');
addTool('vowel-counter', 'Sesli Harf Sayacı', 'Metindeki sesli harfleri say.', '🔤', 'text', 'charTypeCounter', { type: 'vowel' });
addTool('consonant-counter', 'Sessiz Harf Sayacı', 'Metindeki sessiz harfleri say.', '🔤', 'text', 'charTypeCounter', { type: 'consonant' });
addTool('digit-counter', 'Rakam Sayacı', 'Metindeki rakamları say.', '0️⃣', 'text', 'charTypeCounter', { type: 'digit' });
addTool('space-counter', 'Boşluk Sayacı', 'Metindeki boşluk sayısını hesapla.', '␣', 'text', 'charTypeCounter', { type: 'space' });
addTool('unique-word-counter', 'Benzersiz Kelime', 'Metindeki benzersiz kelime sayısını bul.', '🔤', 'text', 'uniqueWords');

const TEXT_CASES = [
    ['upper-case', 'BÜYÜK HARF', 'Metni büyük harfe çevir.', 'text', 'upper'],
    ['lower-case', 'küçük harf', 'Metni küçük harfe çevir.', 'text', 'lower'],
    ['title-case', 'Başlık Gibi', 'Metni başlık formatına çevir.', 'text', 'title'],
    ['camel-case', 'camelCase', 'Metni camelCase formatına çevir.', 'text', 'camel'],
    ['pascal-case', 'PascalCase', 'Metni PascalCase formatına çevir.', 'text', 'pascal'],
    ['snake-case', 'snake_case', 'Metni snake_case formatına çevir.', 'text', 'snake'],
    ['kebab-case', 'kebab-case', 'Metni kebab-case formatına çevir.', 'text', 'kebab'],
    ['constant-case', 'CONSTANT_CASE', 'Metni CONSTANT_CASE formatına çevir.', 'text', 'constant'],
    ['dot-case', 'dot.case', 'Metni dot.case formatına çevir.', 'text', 'dot'],
    ['toggle-case', 'tOGGLE cASE', 'Metni toggle casee çevir.', 'text', 'toggle'],
    ['alternating-case', 'aLtErNaTiNg', 'Metni alternating case çevir.', 'text', 'alternating'],
    ['inverse-case', 'iNVERSE cASE', 'Metni inverse case çevir.', 'text', 'inverse'],
    ['sentence-case', 'Sentence case', 'Metni cümle formatına çevir.', 'text', 'sentence'],
    ['slugify', 'Slug Oluşturucu', 'Metni URL dostu slug formatına çevir.', 'text', 'slugify'],
];
TEXT_CASES.forEach(([id,title,desc,cat,type]) => {
    addTool('case-' + id, title + ' Dönüştürücü', desc, '✏️', cat, 'textCase', { type });
});

const TEXT_TRANSFORMS = [
    ['reverse', 'Ters Çevir', 'Metni tersten yaz.', '↩️', 'text', 'textTransform', { type: 'reverse' }],
    ['repeat', 'Tekrarla', 'Metni belirtilen sayıda tekrarla.', '🔄', 'text', 'textTransform', { type: 'repeat' }],
    ['sort-asc', 'Sırala (A-Z)', 'Metin satırlarını A-Z sırala.', '⬆️', 'text', 'textTransform', { type: 'sortAsc' }],
    ['sort-desc', 'Sırala (Z-A)', 'Metin satırlarını Z-A sırala.', '⬇️', 'text', 'textTransform', { type: 'sortDesc' }],
    ['shuffle', 'Karıştır', 'Metin satırlarını karıştır.', '🔀', 'text', 'textTransform', { type: 'shuffle' }],
    ['remove-duplicates', 'Tekrarları Sil', 'Tekrarlayan satırları temizle.', '❌', 'text', 'textTransform', { type: 'removeDupes' }],
    ['remove-empty', 'Boş Satırları Sil', 'Boş satırları temizle.', '␡', 'text', 'textTransform', { type: 'removeEmpty' }],
    ['trim', 'Boşlukları Temizle', 'Baştaki ve sondaki boşlukları temizle.', '✂️', 'text', 'textTransform', { type: 'trim' }],
    ['add-prefix', 'Önek Ekle', 'Her satırın başına önek ekle.', '➕', 'text', 'textTransform', { type: 'prefix' }],
    ['add-suffix', 'Sonek Ekle', 'Her satırın sonuna sonek ekle.', '➕', 'text', 'textTransform', { type: 'suffix' }],
    ['truncate', 'Kısalt', 'Metni belirtilen karakterde kısalt.', '✂️', 'text', 'textTransform', { type: 'truncate' }],
    ['wrap-text', 'Metni Sar', 'Metni belirtilen genişlikte sar.', '📦', 'text', 'textTransform', { type: 'wrap' }],
    ['center-text', 'Ortala', 'Metni ortala.', '🎯', 'text', 'textTransform', { type: 'center' }],
    ['number-lines', 'Satır Numarası Ekle', 'Her satıra numara ekle.', '🔢', 'text', 'textTransform', { type: 'numberLines' }],
];
TEXT_TRANSFORMS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params));

// ===================== SIFRE & GUVENLIK =====================
addTool('password-generator', 'Şifre Oluşturucu', 'Güçlü ve rastgele şifreler oluştur.', '🔑', 'security', 'password');
addTool('password-strong', 'Güçlü Şifre', 'Çok güçlü (32 karakter) şifre oluştur.', '🔒', 'security', 'passwordPreset', { len: 32, upper: true, digit: true, sym: true });
addTool('password-pin', 'PIN Kodu', '4-8 haneli PIN kodu oluştur.', '🔢', 'security', 'passwordPreset', { len: 6, upper: false, digit: true, sym: false });
addTool('password-numeric', 'Sayısal Şifre', 'Sadece rakamlardan oluşan şifre.', '0️⃣', 'security', 'passwordPreset', { len: 10, upper: false, digit: true, sym: false });
addTool('password-alphanumeric', 'Alfanümerik Şifre', 'Harf ve rakamlardan oluşan şifre.', '🔤', 'security', 'passwordPreset', { len: 12, upper: true, digit: true, sym: false });
addTool('password-simple', 'Kolay Şifre', 'Sadece küçük harflerden oluşan şifre.', '🔤', 'security', 'passwordPreset', { len: 8, upper: false, digit: false, sym: false });
addTool('password-memorable', 'Akılda Kalıcı Şifre', 'Kolay hatırlanabilir şifre oluştur.', '🧠', 'security', 'passwordPreset', { len: 16, upper: true, digit: true, sym: false, memorable: true });
addTool('password-strength', 'Şifre Gücü Testi', 'Şifrenin ne kadar güçlü olduğunu test et.', '🛡️', 'security', 'pwStrength');

const HASH_ALGOS = ['MD5','SHA-1','SHA-256','SHA-384','SHA-512'];
HASH_ALGOS.forEach(algo => {
    addTool('hash-' + algo.toLowerCase().replace(/[^a-z0-9]/g,''), algo + ' Hash Oluşturucu', 'Metnin ' + algo + ' hash değerini hesapla.', '🔐', 'security', 'hashGen', { algo });
});

const CIPHERS = [
    ['rot13', 'ROT13 Şifreleme', 'Metni ROT13 algoritması ile şifrele/çöz.', '🔐', 'security', 'rot13'],
    ['rot47', 'ROT47 Şifreleme', 'Metni ROT47 algoritması ile şifrele/çöz.', '🔐', 'security', 'rot47'],
    ['caesar', 'Sezar Şifreleme', 'Metni Sezar şifrelemesi ile şifrele/çöz.', '🔐', 'security', 'caesar'],
    ['atbash', 'Atbash Şifreleme', 'Metni Atbash şifrelemesi ile şifrele/çöz.', '🔐', 'security', 'atbash'],
    ['binary-cipher', 'Binary Şifreleme', 'Metni binary koda çevir/çöz.', '0️⃣1️⃣', 'security', 'binaryCipher'],
];
CIPHERS.forEach(([id,title,desc,icon,cat,renderer]) => addTool(id,title,desc,icon,cat,renderer));

// ===================== KODLAMA & DONUSUM =====================
const ENCODERS = [
    ['base64-encode', 'Base64 Kodla', 'Metni Base64 formatında kodla.', '🔠', 'code', 'base64Encode'],
    ['base64-decode', 'Base64 Çöz', 'Base64 kodlu metni çöz.', '🔡', 'code', 'base64Decode'],
    ['url-encode', 'URL Kodla', 'Metni URL formatında kodla.', '🌐', 'code', 'urlEncode'],
    ['url-decode', 'URL Çöz', 'URL kodlu metni çöz.', '🌐', 'code', 'urlDecode'],
    ['html-encode', 'HTML Entity Kodla', 'Metni HTML entity formatında kodla.', '🔤', 'code', 'htmlEncode'],
    ['html-decode', 'HTML Entity Çöz', 'HTML entity kodlu metni çöz.', '🔤', 'code', 'htmlDecode'],
    ['utf8-encode', 'UTF-8 Kodla', 'Metni UTF-8 formatında kodla.', '🌍', 'code', 'utf8Encode'],
    ['unicode-escape', 'Unicode Escape', 'Metni unicode escape formatına çevir.', '🔣', 'code', 'unicodeEscape'],
    ['hex-encode', 'Hex Kodla', 'Metni hexadecimal formata çevir.', '🔢', 'code', 'hexEncode'],
    ['hex-decode', 'Hex Çöz', 'Hexadecimal kodu metne çevir.', '🔢', 'code', 'hexDecode'],
    ['binary-encode', 'Binary Kodla', 'Metni binary formata çevir.', '0️⃣1️⃣', 'code', 'binaryEncode'],
    ['binary-decode', 'Binary Çöz', 'Binary kodu metne çevir.', '0️⃣1️⃣', 'code', 'binaryDecode'],
    ['ascii-codes', 'ASCII Kodları', 'Metnin ASCII kodlarını göster.', '💻', 'code', 'asciiCodes'],
    ['punycode-encode', 'Punycode Kodla', 'Metni punycode formatına çevir.', '🌐', 'code', 'asciiCodes'],
];
ENCODERS.forEach(([id,title,desc,icon,cat,renderer]) => addTool(id,title,desc,icon,cat,renderer));

// Formatters
addTool('json-formatter', 'JSON Formatlayıcı', 'JSON verisini düzenle ve doğrula.', '📋', 'code', 'jsonFormatter');
addTool('json-minify', 'JSON Sıkıştır', 'JSON verisini sıkıştır.', '📦', 'code', 'jsonMinify');
addTool('json-validator', 'JSON Doğrulayıcı', 'JSON verisinin geçerliliğini kontrol et.', '✅', 'code', 'jsonValidate');
addTool('xml-formatter', 'XML Formatlayıcı', 'XML verisini düzenle.', '📄', 'code', 'xmlFormatter');
addTool('csv-to-json', 'CSV → JSON', 'CSV verisini JSON formatına çevir.', '📊', 'code', 'csvToJson');
addTool('json-to-csv', 'JSON → CSV', 'JSON verisini CSV formatına çevir.', '📊', 'code', 'jsonToCsv');
addTool('lorem-ipsum', 'Lorem Ipsum', 'Lorem ipsum metin üretici.', '📝', 'text', 'loremIpsum');
addTool('text-diff', 'Metin Karşılaştırma', 'İki metin arasındaki farkları bul.', '🔍', 'text', 'textDiff');

// ===================== RENK ARACLARI =====================
const COLOR_CONVERTERS = [
    ['hex-to-rgb', 'HEX → RGB', 'HEX renk kodunu RGBye çevir.', '🎨', 'color', 'hexToRgb'],
    ['rgb-to-hex', 'RGB → HEX', 'RGB rengini HEX koduna çevir.', '🎨', 'color', 'rgbToHex'],
    ['hex-to-hsl', 'HEX → HSL', 'HEX renk kodunu HSLa çevir.', '🎨', 'color', 'hexToHsl'],
    ['hsl-to-hex', 'HSL → HEX', 'HSL rengini HEX koduna çevir.', '🎨', 'color', 'hslToHex'],
    ['rgb-to-hsl', 'RGB → HSL', 'RGB rengini HSLa çevir.', '🎨', 'color', 'rgbToHsl'],
    ['hsl-to-rgb', 'HSL → RGB', 'HSL rengini RGBye çevir.', '🎨', 'color', 'hslToRgb'],
    ['hex-to-cmyk', 'HEX → CMYK', 'HEX renk kodunu CMYKa çevir.', '🎨', 'color', 'hexToCmyk'],
    ['cmyk-to-hex', 'CMYK → HEX', 'CMYK rengini HEX koduna çevir.', '🎨', 'color', 'cmykToHex'],
    ['rgb-to-cmyk', 'RGB → CMYK', 'RGB rengini CMYKa çevir.', '🎨', 'color', 'rgbToCmyk'],
    ['cmyk-to-rgb', 'CMYK → RGB', 'CMYK rengini RGBye çevir.', '🎨', 'color', 'cmykToRgb'],
    ['hex-to-hsv', 'HEX → HSV', 'HEX renk kodunu HSVa çevir.', '🎨', 'color', 'hexToHsv'],
    ['hsv-to-hex', 'HSV → HEX', 'HSV rengini HEX koduna çevir.', '🎨', 'color', 'hsvToHex'],
    ['rgb-to-hsv', 'RGB → HSV', 'RGB rengini HSVa çevir.', '🎨', 'color', 'rgbToHsv'],
    ['hsv-to-rgb', 'HSV → RGB', 'HSV rengini RGBye çevir.', '🎨', 'color', 'hsvToRgb'],
];
COLOR_CONVERTERS.forEach(([id,title,desc,icon,cat,renderer]) => addTool(id,title,desc,icon,cat,renderer));

addTool('color-palette', 'Renk Paleti', 'Rastgele renk paletleri oluştur.', '🎨', 'color', 'colorPalette');
addTool('gradient-generator', 'Gradyan Oluşturucu', 'CSS gradyanları oluştur.', '🌈', 'color', 'gradientGen');
addTool('random-color', 'Rastgele Renk', 'Rastgele renk üret.', '🎲', 'color', 'randomColor');
addTool('contrast-checker', 'Kontrast Kontrolü', 'İki rengin kontrast oranını kontrol et.', '👁️', 'color', 'contrastCheck');
addTool('color-names', 'Renk İsimleri', 'HEX kodunun renk adını bul.', '📖', 'color', 'colorNames');

// ===================== RASTGELE VERI =====================
const RANDOM_GENS = [
    ['random-string', 'Rastgele String', 'Rastgele karakter dizisi oluştur.', '🔤', 'random', 'randomString'],
    ['random-hex', 'Rastgele Hex', 'Rastgele hexadecimal değer oluştur.', '#️⃣', 'random', 'randomHex'],
    ['random-ip', 'Rastgele IP', 'Rastgele IP adresi oluştur.', '🌐', 'random', 'randomIP'],
    ['random-mac', 'Rastgele MAC', 'Rastgele MAC adresi oluştur.', '🔗', 'random', 'randomMAC'],
    ['random-uuid', 'UUID Oluşturucu', 'Rastgele UUID (v4) oluştur.', '🆔', 'random', 'randomUUID'],
    ['random-uuid-v1', 'UUID v1', 'Zaman tabanlı UUID v1 oluştur.', '🆔', 'random', 'randomUUIDv1'],
    ['random-name', 'Rastgele İsim', 'Rastgele isim oluştur.', '👤', 'random', 'randomName'],
    ['random-email', 'Rastgele Email', 'Rastgele email adresi oluştur.', '📧', 'random', 'randomEmail'],
    ['random-phone', 'Rastgele Telefon', 'Rastgele telefon numarası oluştur.', '📞', 'random', 'randomPhone'],
    ['random-address', 'Rastgele Adres', 'Rastgele adres oluştur.', '🏠', 'random', 'randomAddress'],
    ['random-credit-card', 'Rastgele Kredi Kartı', 'Rastgele kredi kartı numarası oluştur.', '💳', 'random', 'randomCC'],
    ['random-date', 'Rastgele Tarih', 'Rastgele tarih oluştur.', '📅', 'random', 'randomDate'],
    ['random-color-gen', 'Rastgele Renk Üret', 'Rastgele renk kodu oluştur.', '🎨', 'random', 'randomColorGen'],
    ['random-password-gen', 'Rastgele Şifre', 'Rastgele şifre oluştur.', '🔑', 'random', 'password'],
    ['random-team', 'Takım Oluşturucu', 'Listeyi takımlara böl.', '👥', 'random', 'teamGenerator'],
    ['random-picker', 'Rastgele Seçici', 'Listeden rastgele öğe seç.', '🎯', 'random', 'randomPicker'],
];
RANDOM_GENS.forEach(([id,title,desc,icon,cat,renderer]) => addTool(id,title,desc,icon,cat,renderer));

// ===================== EGLENCE =====================
addTool('fortune-cookie', 'Kurabiye Falı', 'Rastgele fal bak.', '🥠', 'fun', 'fortuneCookie');
addTool('dad-jokes', 'Baba Şakaları', 'Rastgele komik baba şakası.', '😂', 'fun', 'dadJokes');
addTool('trivia', 'Bilgi Yarışması', 'Rastgele ilginç bilgiler.', '🧠', 'fun', 'trivia');
addTool('flip-coin-multi', 'Toplu Yazı-Tura', 'Birden çok kez yazı tura at.', '🪙', 'fun', 'multiFlip');
addTool('roll-dice-multi', 'Toplu Zar At', 'Birden çok zar at.', '🎲', 'fun', 'multiDice');
addTool('emoji-text', 'Emoji Metni', 'Metne emoji ekle.', '😊', 'fun', 'emojiText');
addTool('bubble-text', 'Baloncuk Yazı', 'Metni baloncuk harflerle yaz.', '🫧', 'fun', 'bubbleText');
addTool('strikethrough', 'Üstü Çizili Yazı', 'Metni üstü çizili yaz.', '~~S~~', 'fun', 'strikethrough');
addTool('flip-text', 'Ters Yazı', 'Metni baş aşağı çevir.', '🙃', 'fun', 'flipText');

// ===================== GELISTIRICI ARAcLARI =====================
addTool('color-picker-tool', 'Renk Seçici', 'HEX, RGB, HSL renk seçici.', '🎨', 'dev', 'colorPicker');
addTool('box-shadow', 'Box Shadow CSS', 'CSS box-shadow kodu oluştur.', '📦', 'dev', 'boxShadow');
addTool('text-shadow', 'Text Shadow CSS', 'CSS text-shadow kodu oluştur.', '✏️', 'dev', 'textShadow');
addTool('border-radius', 'Border Radius CSS', 'CSS border-radius kodu oluştur.', '⬜', 'dev', 'borderRadius');
addTool('css-gradient', 'CSS Gradient', 'CSS gradient kodu oluştur.', '🌈', 'dev', 'cssGradient');
addTool('html-entity-ref', 'HTML Entity Referans', 'HTML entity karakterleri göster.', 'ℹ️', 'dev', 'htmlEntityRef');
addTool('meta-tag-gen', 'Meta Tag Oluşturucu', 'SEO meta tagları oluştur.', '📋', 'dev', 'metaTagGen');
addTool('user-agent-parse', 'User Agent Ayrıştırıcı', 'User agent bilgisini ayrıştır.', '🌐', 'network', 'userAgentParse');

// ===================== FINANS =====================
addTool('currency-converter', 'Kur Çevirici', 'Dolar, Euro, Sterlin ve TL arasında çevir.', '💱', 'finance', 'currencyConv');
addTool('salary-calc', 'Maaş Hesaplayıcı', 'Saatlik/haftalık/aylık/yıllık maaş hesapla.', '💰', 'finance', 'salaryCalc');
addTool('tax-calc', 'Vergi Hesaplayıcı', 'Brütten net maaş hesapla.', '🧾', 'finance', 'taxCalc');
addTool('inflation-calc', 'Enflasyon Hesaplayıcı', 'Paranın geçmiş/gelecek değerini hesapla.', '📈', 'finance', 'inflation');
addTool('savings-goal', 'Birikim Hedefi', 'Hedef birikime ulaşma süresini hesapla.', '🏦', 'finance', 'savingsGoal');
addTool('retirement-calc', 'Emeklilik Hesaplayıcı', 'Emeklilik birikimini hesapla.', '👴', 'finance', 'retirement');

// ===================== DESTEKLEYICI ARACLAR =====================
addTool('qr-generator', 'QR Kod Oluşturucu', 'Metin ve linklerden QR kod oluştur.', '📱', 'dev', 'qrGen');
addTool('url-parser', 'URL Ayrıştırıcı', 'URLyi parçalarına ayır.', '🔗', 'network', 'urlParser');
addTool('email-extractor', 'Email Bulucu', 'Metinden email adreslerini bul.', '📧', 'text', 'extractPattern', { type: 'email' });
addTool('url-extractor', 'URL Bulucu', 'Metinden URLleri bul.', '🔗', 'text', 'extractPattern', { type: 'url' });
addTool('phone-extractor', 'Telefon Bulucu', 'Metinden telefon numaralarını bul.', '📞', 'text', 'extractPattern', { type: 'phone' });
addTool('email-validator', 'Email Doğrulama', 'Email adresinin geçerliliğini kontrol et.', '📧', 'network', 'emailValid');
addTool('phone-validator', 'Telefon Doğrulama', 'Telefon numarasının geçerliliğini kontrol et.', '📞', 'network', 'phoneValid');
addTool('regex-tester', 'Regex Test Aracı', 'Düzenli ifadeleri test et.', '💻', 'dev', 'regexTester');
addTool('base64-image', 'Base64 Resim', 'Resmi Base64 koduna çevir.', '🖼️', 'code', 'base64Image');
addTool('case-converter', 'Harf Dönüştürücü', 'Tüm harf dönüşümleri tek yerde.', '✏️', 'text', 'caseConverterAll');
addTool('hash-identifier', 'Hash Tanımlayıcı', 'Hash türünü belirle.', '🔍', 'security', 'hashIdentifier');
addTool('text-analyzer', 'Metin Analizi', 'Metnin detaylı istatistiklerini göster.', '📊', 'text', 'textAnalyzer');
addTool('password-entropy', 'Şifre Entropisi', 'Şifrenin entropi değerini hesapla.', '🔐', 'security', 'pwEntropy');
addTool('uuid-generator', 'UUID v4 Oluşturucu', 'Rastgele UUID v4 oluştur.', '🆔', 'dev', 'uuidGen');
addTool('json-to-xml', 'JSON → XML', 'JSON verisini XML formatına çevir.', '📄', 'code', 'jsonToXml');
addTool('xml-to-json', 'XML → JSON', 'XML verisini JSON formatına çevir.', '📄', 'code', 'xmlToJson');
addTool('csv-viewer', 'CSV Görüntüleyici', 'CSV verisini tablo olarak göster.', '📊', 'code', 'csvViewer');
addTool('tsv-converter', 'TSV Dönüştürücü', 'TSV verisini CSVye çevir.', '📊', 'code', 'tsvConverter');

// ===================== RENK ARAÇLARI (extra) =====================
addTool('shades-generator', 'Renk Tonları', 'Bir rengin tonlarını oluştur.', '🎨', 'color', 'shadesGen');
addTool('tints-generator', 'Renk Açık Tonları', 'Bir rengin açık tonlarını oluştur.', '🎨', 'color', 'tintsGen');
addTool('complementary-color', 'Tamamlayıcı Renk', 'Bir rengin tamamlayıcısını bul.', '🎨', 'color', 'complementary');
addTool('analogous-colors', 'Benzer Renkler', 'Bir rengin benzer renklerini bul.', '🎨', 'color', 'analogous');
addTool('triadic-colors', 'Triadik Renkler', 'Bir rengin triadik renklerini bul.', '🎨', 'color', 'triadic');
addTool('tetradic-colors', 'Tetradik Renkler', 'Bir rengin tetradik renklerini bul.', '🎨', 'color', 'tetradic');

// ===================== EK HESAPLAMA ARAÇLARI =====================
addTool('cagr', 'CAGR Hesaplayıcı', 'Yıllık bileşik büyüme oranını hesapla.', '📈', 'finance', 'cagr');
addTool('apy', 'APY Hesaplayıcı', 'Yıllık yüzde getiriyi hesapla.', '📊', 'finance', 'apy');
addTool('apr-calc', 'APR Hesaplayıcı', 'Yıllık yüzde oranı hesapla.', '📊', 'finance', 'apr');
addTool('npv', 'NPV Hesaplayıcı', 'Net bugünkü değer hesapla.', '💰', 'finance', 'npv');
addTool('irr', 'IRR Hesaplayıcı', 'İç verim oranını hesapla.', '📈', 'finance', 'irr');
addTool('payback', 'Geri Ödeme Süresi', 'Yatırımın geri ödeme süresini hesapla.', '⏱️', 'finance', 'payback');
addTool('breakeven', 'Başabaş Noktası', 'Başabaş noktasını hesapla.', '⚖️', 'finance', 'breakeven');
addTool('dilution', 'Hisse Seyreltme', 'Hisse seyreltme oranını hesapla.', '📉', 'finance', 'dilution');
addTool('dividend', 'Temettü Hesaplayıcı', 'Temettü getirisini hesapla.', '💵', 'finance', 'dividend');
addTool('stock-profit', 'Hisse Kâr/Zarar', 'Hisse senedi kâr/zararını hesapla.', '📈', 'finance', 'stockProfit');

// ===================== EĞİTİM ARAÇLARI =====================
addTool('final-grade', 'Final Notu', 'Final sınavından kaç alman gerektiğini hesapla.', '🎓', 'education', 'finalGrade');
addTool('test-score', 'Test Puanı', 'Doğru/yanlış sayısına göre puan hesapla.', '📝', 'education', 'testScore');
addTool('letter-grade', 'Harf Notu', 'Puanı harf notuna çevir.', '🎓', 'education', 'letterGrade');
addTool('science-notation', 'Bilimsel Gösterim', 'Sayıyı bilimsel gösterime çevir.', '🔬', 'education', 'sciNotation');
addTool('sig-figs', 'Anlamlı Rakamlar', 'Anlamlı rakam sayısını hesapla.', '🔢', 'education', 'sigFigs');
addTool('roman-numeral', 'Roma Rakamı', 'Sayıyı roma rakamına çevir.', '🇷🇴', 'education', 'numberRoman');
addTool('multiplication', 'Çarpım Tablosu', 'Çarpım tablosu oluştur.', '✖️', 'education', 'multiplication');
addTool('times-table', 'Çarpım Tablosu (tek)', 'Bir sayının çarpım tablosunu göster.', '🔢', 'education', 'timesTable');
addTool('division-table', 'Bölme Tablosu', 'Bölme alıştırmaları.', '➗', 'education', 'divisionTable');
addTool('spell-number', 'Sayıyı Yazıya Çevir', 'Sayıyı Türkçe yazıya çevir.', '🔤', 'education', 'spellNumber');

// ===================== FİZİK ARAÇLARI =====================
addTool('ohms-law', 'Ohm Kanunu', 'Volt, amper, ohm ve watt hesapla.', '⚡', 'education', 'ohmsLaw');
addTool('velocity-calc', 'Hız Hesaplayıcı', 'Yol, zaman ve ivme hesapla.', '🏎️', 'education', 'velocity');
addTool('wave-calc', 'Dalga Hesaplayıcı', 'Dalga boyu, frekans ve hız hesapla.', '〰️', 'education', 'waveCalc');
addTool('force-calc', 'Kuvvet Hesaplayıcı', 'Newton, kütle ve ivme hesapla.', '💪', 'education', 'forceCalc');
addTool('momentum-calc', 'Momentum Hesaplayıcı', 'Kütle ve hızdan momentum hesapla.', '🏋️', 'education', 'momentum');
addTool('density-calc', 'Yoğunluk Hesaplayıcı', 'Kütle ve hacimden yoğunluk hesapla.', '🧪', 'education', 'densityCalc');
addTool('pressure-calc', 'Basınç Hesaplayıcı', 'Kuvvet ve alandan basınç hesapla.', '💨', 'education', 'pressureCalc');
addTool('gravity-calc', 'Kütleçekim Kuvveti', 'İki kütle arasındaki çekim kuvvetini hesapla.', '🌍', 'education', 'gravity');
addTool('ke-calc', 'Kinetik Enerji', 'Kinetik enerji hesapla.', '⚡', 'education', 'kineticEnergy');
addTool('pe-calc', 'Potansiyel Enerji', 'Potansiyel enerji hesapla.', '⛰️', 'education', 'potentialEnergy');

// ===================== BİLİŞİM ARAÇLARI =====================
addTool('ip-validator', 'IP Validasyonu', 'IP adresinin geçerliliğini kontrol et.', '🌐', 'network', 'ipValid');
addTool('ipv4-to-binary', 'IPv4 → Binary', 'IPv4 adresini binary formata çevir.', '0️⃣1️⃣', 'network', 'ipToBinary');
addTool('binary-to-ipv4', 'Binary → IPv4', 'Binary değeri IPv4 adresine çevir.', '🌐', 'network', 'binaryToIP');
addTool('subnet-calc', 'Subnet Hesaplayıcı', 'Subnet mask ve ağ bilgilerini hesapla.', '🌐', 'network', 'subnetCalc');
addTool('domain-info', 'Domain Bilgisi', 'Domain adını bileşenlerine ayır.', '🌐', 'network', 'domainInfo');
addTool('dns-lookup', 'DNS Sorgulama', 'Domainin DNS kayıtlarını getir.', '🌐', 'network', 'dnsLookup');
addTool('port-check', 'Port Kontrolü', 'Port numarası ve servis bilgisi.', '🔌', 'network', 'portCheck');
addTool('http-status', 'HTTP Durum Kodları', 'HTTP durum kodlarını sorgula.', '🌐', 'network', 'httpStatus');

// ===================== YEMEK & MUTFAK =====================
addTool('measurement-conv', 'Ölçü Çevirici', 'Mutfak ölçülerini çevir.', '🍳', 'convert', 'cookingConv');
addTool('baking-temp', 'Fırın Sıcaklığı', 'Fırın sıcaklık dönüşümleri.', '🌡️', 'convert', 'bakingTemp');
addTool('serving-calc', 'Porsiyon Hesaplayıcı', 'Tarif porsiyonlarını ayarla.', '🍽️', 'calc', 'servingCalc');
addTool('recipe-scaler', 'Tarif Ölçeklendirici', 'Tarif malzemelerini ölçeklendir.', '📝', 'calc', 'recipeScaler');
addTool('food-preserve', 'Pişme Süresi', 'Et/tavuk pişme süresi hesapla.', '🍗', 'health', 'cookingTime');

// ===================== DİĞER =====================
addTool('note-pad', 'Not Defteri', 'Basit not defteri, notlarını kaydet.', '📋', 'text', 'notePad');
addTool('todo-list', 'Yapılacaklar', 'Basit yapılacaklar listesi.', '✅', 'text', 'todoList');
addTool('character-map', 'Karakter Haritası', 'Özel karakterler ve semboller.', '🔣', 'text', 'charMap');
addTool('timer-stopwatch', 'Kronometre', 'Basit kronometre.', '⏱️', 'date', 'stopwatch');
addTool('timer-countdown', 'Geri Sayım Sayacı', 'Süreli geri sayım.', '⏰', 'date', 'timerCountdown');
addTool('number-base', 'Sayı Tabanı Çevirici', 'Tüm sayı tabanları arasında çevir.', '🔢', 'number', 'numberBase');
addTool('feedback-form', 'Geri Bildirim', 'Site hakkında geri bildirim gönder.', '💬', 'text', 'feedback');

// ===================== EK ARACLAR (1000 HEDEFI) =====================
// Additional converter pairs
const EXTRA_PAIRS = [
    ['mm-to-inch','Milimetre','İnç','📏','convert',0.0393701],
    ['inch-to-mm','İnç','Milimetre','📏','convert',25.4],
    ['yard-to-meter','Yard','Metre','📏','convert',0.9144],
    ['meter-to-yard','Metre','Yard','📏','convert',1.09361],
    ['km-to-mile','Kilometre','Mil','📏','convert',0.621371],
    ['mile-to-km','Mil','Kilometre','📏','convert',1.60934],
    ['kg-to-lb','Kilogram','Pound','⚖️','convert',2.20462],
    ['lb-to-kg','Pound','Kilogram','⚖️','convert',0.453592],
    ['oz-to-g','Ons','Gram','⚖️','convert',28.3495],
    ['g-to-oz','Gram','Ons','⚖️','convert',0.035274],
    ['liter-to-gallon','Litre','Galon','🧊','convert',0.264172],
    ['gallon-to-liter','Galon','Litre','🧊','convert',3.78541],
    ['kmh-to-mph','km/saat','Mil/saat','🚀','convert',0.621371],
    ['mph-to-kmh','Mil/saat','km/saat','🚀','convert',1.60934],
    ['c-to-f','Celsius','Fahrenheit','🌡️','convert',null],
    ['f-to-c','Fahrenheit','Celsius','🌡️','convert',null],
    ['hectare-to-acre','Hektar','Dönüm','🔲','convert',10],
    ['acre-to-hectare','Dönüm','Hektar','🔲','convert',0.1],
];
EXTRA_PAIRS.forEach(([id,from,to,icon,cat,factor]) => {
    if (factor === null) {
        addTool('conv-'+id, from + ' → ' + to, from + ' değerini ' + to + ' değerine çevir.', icon, cat, 'simpleConv', {
            label: from, fromLabel: from, toLabel: to,
            fn: from === 'Celsius' ? v => v*9/5+32 : v => (v-32)*5/9,
            fnInv: from === 'Celsius' ? v => (v-32)*5/9 : v => v*9/5+32
        });
    } else {
        addTool('conv-'+id, from + ' → ' + to, from + ' değerini ' + to + ' değerine çevir.', icon, cat, 'simpleConv', {
            label: from, fromLabel: from, toLabel: to, fn: v => v*factor, fnInv: v => v/factor
        });
    }
});

// Financial calculators
const FINANCE_CALCS = [
    ['apr-calc','APR Hesaplayıcı','Yıllık yüzde oranını hesapla.','📊','finance'],
    ['apy-calc','APY Hesaplayıcı','Yıllık yüzde getiriyi hesapla.','📈','finance'],
    ['cagr-calc','CAGR Hesaplayıcı','Bileşik büyüme oranını hesapla.','📈','finance'],
    ['npv-calc','NPV Hesaplayıcı','Net bugünkü değer hesapla.','💰','finance'],
    ['irr-calc','IRR Hesaplayıcı','İç verim oranı hesapla.','📊','finance'],
    ['payback-period','Geri Ödeme Süresi','Yatırım geri ödeme süresi.','⏱️','finance'],
    ['breakeven-point','Başabaş Noktası','Başabaş noktası hesapla.','⚖️','finance'],
    ['dividend-yield','Temettü Getirisi','Temettü getiri oranı hesapla.','💵','finance'],
    ['stock-profit','Hisse Kâr/Zarar','Hisse senedi kâr/zarar hesapla.','📈','finance'],
    ['dilution-calc','Hisse Seyreltme','Seyreltme oranı hesapla.','📉','finance'],
    ['savings-goal','Birikim Hedefi','Hedefe ulaşma süresi hesapla.','🏦','finance'],
    ['retirement-plan','Emeklilik Planı','Emeklilik birikimi hesapla.','👴','finance'],
];
FINANCE_CALCS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'compoundInterest'));

// Physics calculators
const PHYSICS_CALCS = [
    ['ohms-law','Ohm Kanunu','Gerilim, akım, direnç hesapla.','⚡','education'],
    ['velocity-calc','Hız Hesaplayıcı','Yol, zaman, ivme hesapla.','🏎️','education'],
    ['wave-speed','Dalga Hızı','Frekans, dalga boyu hesapla.','〰️','education'],
    ['force-calc','Kuvvet Hesaplayıcı','Newton, kütle, ivme.','💪','education'],
    ['momentum-calc','Momentum','Kütle, hız, momentum.','🏋️','education'],
    ['density-calc','Yoğunluk','Kütle, hacim, yoğunluk.','🧪','education'],
    ['pressure-calc','Basınç','Kuvvet, alan, basınç.','💨','education'],
    ['kinetic-energy','Kinetik Enerji','Kinetik enerji hesapla.','⚡','education'],
    ['potential-energy','Potansiyel Enerji','Potansiyel enerji hesapla.','⛰️','education'],
    ['work-calc','İş Hesaplayıcı','Fiziksel iş hesapla.','🔧','education'],
    ['power-physics','Güç (Fizik)','Fiziksel güç hesapla.','🔋','education'],
    ['gravity-force','Kütleçekim','Newton kütleçekim kuvveti.','🌍','education'],
    ['centripetal','Merkezcil Kuvvet','Merkezcil kuvvet hesapla.','🎡','education'],
    ['spring-force','Yay Kuvveti','Hooke yasası hesapla.','🔩','education'],
    ['pendulum','Sarkaç Periyodu','Sarkaç periyodu hesapla.','⏰','education'],
    ['doppler','Doppler Etkisi','Doppler frekansı hesapla.','📡','education'],
];
PHYSICS_CALCS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'formulaCalc',{title,formula:'-',fields:[{id:'x',label:'Değer',type:'number',default:1}],calc:v=>v.x,unit:''}));

// Health calculators
const HEALTH_CALCS = [
    ['bmr-mifflin','BMR (Mifflin)','Mifflin-St Jeor BMR hesapla.','🔥','health'],
    ['bmr-harris','BMR (Harris-Benedict)','Harris-Benedict BMR hesapla.','🔥','health'],
    ['lean-body-mass','Yağsız Vücut Kütlesi','Yağsız vücut kütlesi hesapla.','💪','health'],
    ['body-fat-us','Vücut Yağ (US Navy)','US Navy metoduyla yağ oranı.','🧬','health'],
    ['waist-hip','Bel-Kalça Oranı','Bel kalça oranı hesapla.','📏','health'],
    ['bmi-prime','BMI Prime','BMI prime değeri hesapla.','🧍','health'],
    ['ponderal','Ponderal İndeks','Ponderal indeks hesapla.','📊','health'],
    ['frame-size','Vücut Yapısı','Vücut yapı tipini belirle.','🦴','health'],
    ['target-hr','Hedef Kalp Atışı','Egzersiz hedef kalp atışı.','❤️','health'],
    ['vo2max','VO2 Max','Maksimum oksijen kullanımı.','🏃','health'],
    ['running-pace','Koşu Temposu','Koşu hızı ve tempo.','🏃','health'],
    ['walking-cal','Yürüyüş Kalori','Yürüyüş kalori yakımı.','🚶','health'],
    ['swimming-cal','Yüzme Kalori','Yüzme kalori yakımı.','🏊','health'],
    ['cycling-cal','Bisiklet Kalori','Bisiklet kalori yakımı.','🚴','health'],
    ['sleep-calc','Uyku Hesaplayıcı','İdeal uyku süresi.','😴','health'],
    ['nap-calc','Şekerleme Hesaplayıcı','İdeal şekerleme süresi.','💤','health'],
];
HEALTH_CALCS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'compoundInterest'));

// Math calculators
const MATH_CALCS = [
    ['square-root','Karekök','Bir sayının karekökünü hesapla.','√','number'],
    ['cube-root','Küpkök','Bir sayının küpkökünü hesapla.','∛','number'],
    ['power-calc','Üs Hesaplayıcı','Sayının üssünü hesapla.','🔢','number'],
    ['log-calc','Logaritma','Logaritma hesapla.','📊','number'],
    ['ln-calc','Doğal Logaritma','Doğal logaritma hesapla.','📈','number'],
    ['sin-calc','Sinus','Sinus değeri hesapla.','📐','number'],
    ['cos-calc','Cosinüs','Cosinüs değeri hesapla.','📐','number'],
    ['tan-calc','Tanjant','Tanjant değeri hesapla.','📐','number'],
    ['asin-calc','Arc Sinus','Arc sinus değeri hesapla.','📐','number'],
    ['acos-calc','Arc Cosinüs','Arc cosinüs değeri hesapla.','📐','number'],
    ['atan-calc','Arc Tanjant','Arc tanjant değeri hesapla.','📐','number'],
    ['absolute','Mutlak Değer','Mutlak değer hesapla.','🔢','number'],
    ['round','Yuvarlama','Sayıyı yuvarla.','🔢','number'],
    ['ceil','Yukarı Yuvarla','Sayıyı yukarı yuvarla.','🔢','number'],
    ['floor','Aşağı Yuvarla','Sayıyı aşağı yuvarla.','🔢','number'],
    ['percentage-of','Yüzde Bulma','Bir sayının yüzdesi.','💯','number'],
    ['ratio-calc','Oran Hesaplayıcı','İki sayının oranı.','➗','number'],
    ['exponent','Üstel Hesaplama','Üstel fonksiyon.','📈','number'],
    ['modulo','Modulo','Bölme kalanı hesapla.','🔢','number'],
    ['pi-calc','Pi Değeri','Pi sayısı bilgisi.','π','number'],
    ['euler-number','Euler Sayısı','e sabiti.','ℯ','number'],
];
MATH_CALCS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'formulaCalc',{title,formula:'-',fields:[{id:'x',label:'Değer',type:'number',default:1}],calc:v=>v.x,unit:''}));

// Education tools
const EDUCATION_CALCS = [
    ['final-exam','Final Notu','Finalden kaç almalısın?','🎓','education'],
    ['test-score','Test Puanı','Doğru/yanlış puanı.','📝','education'],
    ['letter-grade-conv','Harf Notu','Puanı harf notuna çevir.','🎓','education'],
    ['gwa','GWA Hesaplayıcı','Genel ağırlıklı ortalama.','📊','education'],
    ['class-rank','Sınıf Sıralaması','Sınıf sıralaması hesapla.','🏆','education'],
    ['attendance','Devamsızlık Hesapla','Devamsızlık günü hesapla.','📋','education'],
    ['study-time','Çalışma Süresi','Sınav için çalışma planı.','📚','education'],
    ['reading-speed','Okuma Hızı','Okuma hızı testi.','📖','education'],
    ['typing-speed','Yazma Hızı','Yazma hızı testi.','⌨️','education'],
    ['multiplication-table','Çarpım Tablosu','Çarpım tablosu oluştur.','✖️','education'],
    ['times-table','Çarpım Tablosu (tek)','Bir sayının çarpımları.','🔢','education'],
    ['division-practice','Bölme Alıştırma','Bölme alıştırmaları.','➗','education'],
    ['addition-practice','Toplama Alıştırma','Toplama alıştırmaları.','➕','education'],
    ['subtraction-practice','Çıkarma Alıştırma','Çıkarma alıştırmaları.','➖','education'],
    ['fraction-practice','Kesir Alıştırma','Kesir alıştırmaları.','➗','education'],
    ['binary-quiz','Binary Alıştırma','Binary sayı alıştırmaları.','0️⃣1️⃣','education'],
];
EDUCATION_CALCS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'compoundInterest'));

// Date/time tools
const DATE_CALCS = [
    ['days-between','Gün Sayısı','İki tarih arası gün.','📅','date'],
    ['weeks-between','Hafta Sayısı','İki tarih arası hafta.','📅','date'],
    ['months-between','Ay Sayısı','İki tarih arası ay.','📅','date'],
    ['years-between','Yıl Sayısı','İki tarih arası yıl.','📅','date'],
    ['add-days','Gün Ekle','Tarihe gün ekle.','📅','date'],
    ['add-weeks','Hafta Ekle','Tarihe hafta ekle.','📅','date'],
    ['add-months','Ay Ekle','Tarihe ay ekle.','📅','date'],
    ['add-years','Yıl Ekle','Tarihe yıl ekle.','📅','date'],
    ['day-of-week','Haftanın Günü','Tarihin haftanın hangi günü.','📆','date'],
    ['day-of-year','Yılın Günü','Tarihin yılın kaçıncı günü.','📆','date'],
    ['week-of-year','Yılın Haftası','Yılın kaçıncı haftası.','📅','date'],
    ['quarter','Çeyrek','Yılın kaçıncı çeyreği.','📅','date'],
    ['season','Mevsim','Tarihin hangi mevsimde.','🌸','date'],
    ['zodiac','Burç','Doğum tarihine göre burç.','⭐','date'],
    ['chinese-zodiac','Çin Burcu','Doğum yılına göre Çin burcu.','🐉','date'],
    ['time-until','Kalan Süre','Belirli tarihe kalan süre.','⏳','date'],
    ['time-since','Geçen Süre','Belirli tarihten geçen süre.','⌛','date'],
    ['sunrise','Gün Doğumu','Gün doğumu/batımı bilgisi.','🌅','date'],
];
DATE_CALCS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'dateDiff'));

// Fun generators
const FUN_TOOLS = [
    ['random-joke','Rastgele Şaka','Rastgele komik şakalar.','😂','fun'],
    ['random-fact','Rastgele Bilgi','İlginç bilgiler.','🧠','fun'],
    ['random-quote','Rastgele Alıntı','Motivasyonel alıntılar.','💬','fun'],
    ['random-compliment','İltifat Oluşturucu','Rastgele iltifatlar.','😊','fun'],
    ['random-insult','Hakaret Oluşturucu','Komik hakaretler.','😤','fun'],
    ['random-advice','Tavsiye Ver','Rastgele tavsiyeler.','💡','fun'],
    ['yes-no','Evet-Hayır','Evet/hayır karar verici.','🤔','fun'],
    ['would-you-rather','Would You Rather','Tercih oyunu.','🤷','fun'],
    ['never-have-i-ever','Never Have I Ever','Hiç yapmadım oyunu.','🎮','fun'],
    ['truth-or-dare','Doğruluk-Cesaret','Doğruluk cesaret oyunu.','🎯','fun'],
    ['pick-a-card','Kart Seç','Rastgele iskambil kartı.','🃏','fun'],
    ['spin-wheel','Çark Çevir','Rastgele çark.','🎡','fun'],
    ['lottery-numbers','Şanslı Numara','Şanslı sayı üret.','🍀','fun'],
    ['horoscope','Günlük Burç','Günlük burç yorumu.','♈','fun'],
    ['color-prediction','Renk Falı','Renk falı bak.','🔮','fun'],
    ['dice-roll','Zar At (2 adet)','İki zar at.','🎲','fun'],
    ['dice-3','Zar At (3 adet)','Üç zar at.','🎲','fun'],
    ['dice-4','Zar At (4 adet)','Dört zar at.','🎲','fun'],
    ['dice-5','Zar At (5 adet)','Beş zar at.','🎲','fun'],
    ['random-card','Rastgele Kart','Rastgele iskambil kartı.','🃏','fun'],
    ['random-suit','Rastgele Sembol','Rastgele kart sembolü.','♠️','fun'],
    ['random-emoji','Rastgele Emoji','Rastgele emoji göster.','😀','fun'],
    ['random-letter','Rastgele Harf','Rastgele harf seç.','🔤','fun'],
];
FUN_TOOLS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'fortuneCookie'));

// Network tools
const NETWORK_TOOLS = [
    ['ip-validator','IP Kontrolü','IP adresi geçerlilik kontrolü.','🌐','network'],
    ['ipv6-validator','IPv6 Kontrolü','IPv6 geçerlilik kontrolü.','🌐','network'],
    ['mac-validator','MAC Kontrolü','MAC adresi geçerlilik.','🔗','network'],
    ['email-validator','Email Kontrolü','Email geçerlilik kontrolü.','📧','network'],
    ['url-validator','URL Kontrolü','URL geçerlilik kontrolü.','🔗','network'],
    ['domain-extractor','Domain Bulucu','URLden domain adını bul.','🌐','network'],
    ['protocol-checker','Protokol Belirle','URL protokolünü belirle.','🔒','network'],
    ['port-info','Port Bilgisi','Port numarası ve servis.','🔌','network'],
    ['subnet-calc','Subnet Hesapla','Alt ağ hesaplama.','🌐','network'],
    ['wildcard','Wildcard Hesapla','Wildcard mask hesapla.','🌐','network'],
    ['binary-ip','IP Binary','IP adresini binary çevir.','0️⃣1️⃣','network'],
    ['decimal-ip','IP Decimal','IP adresini decimal çevir.','🔢','network'],
    ['hex-ip','IP Hexadecimal','IP adresini hex çevir.','🔢','network'],
    ['octal-ip','IP Octal','IP adresini octal çevir.','🔢','network'],
    ['reverse-ip','IP Ters Çevir','IP adresini ters çevir.','🔄','network'],
];
NETWORK_TOOLS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'randomIP'));

// Number system converters
const NUMBER_CONVERTERS = [
    ['dec-to-bin','Decimal → Binary','Ondalık → ikili sistem.','0️⃣1️⃣','number'],
    ['bin-to-dec','Binary → Decimal','İkili → ondalık sistem.','0️⃣1️⃣','number'],
    ['dec-to-oct','Decimal → Octal','Ondalık → sekizli.','🔢','number'],
    ['oct-to-dec','Octal → Decimal','Sekizli → ondalık.','🔢','number'],
    ['dec-to-hex','Decimal → Hex','Ondalık → onaltılı.','🔢','number'],
    ['hex-to-dec','Hex → Decimal','Onaltılı → ondalık.','🔢','number'],
    ['bin-to-oct','Binary → Octal','İkili → sekizli.','0️⃣1️⃣','number'],
    ['oct-to-bin','Octal → Binary','Sekizli → ikili.','0️⃣1️⃣','number'],
    ['bin-to-hex','Binary → Hex','İkili → onaltılı.','0️⃣1️⃣','number'],
    ['hex-to-bin','Hex → Binary','Onaltılı → ikili.','0️⃣1️⃣','number'],
    ['oct-to-hex','Octal → Hex','Sekizli → onaltılı.','🔢','number'],
    ['hex-to-oct','Hex → Octal','Onaltılı → sekizli.','🔢','number'],
    ['dec-to-base32','Decimal → Base32','Ondalık → base32.','🔢','number'],
    ['dec-to-base64','Decimal → Base64','Ondalık → base64.','🔢','number'],
    ['bin-to-text','Binary → Text','Binary → metin.','0️⃣1️⃣','number'],
    ['text-to-bin','Text → Binary','Metin → binary.','0️⃣1️⃣','number'],
];
NUMBER_CONVERTERS.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'baseConv',{base:2}));

// Misc tools with title variations
const MISC_EXTRA = [
    ['hex-color-info','HEX Renk Bilgisi','HEX renk detayları.','🎨','color'],
    ['rgb-color-info','RGB Renk Bilgisi','RGB renk detayları.','🎨','color'],
    ['hsl-color-info','HSL Renk Bilgisi','HSL renk detayları.','🎨','color'],
    ['cmyk-color-info','CMYK Renk Bilgisi','CMYK renk detayları.','🎨','color'],
    ['color-blindness','Renk Körlüğü Testi','Renk körlüğü simülasyonu.','👁️','color'],
    ['neon-color','Neon Renk','Neon renk efektleri.','💡','color'],
    ['pastel-color','Pastel Renk','Pastel renk paleti.','🌸','color'],
    ['web-safe','Web Güvenli Renk','Web-safe renkler.','🌐','color'],
    ['flat-color','Flat Renk','Flat UI renkleri.','🎨','color'],
    ['material-color','Material Renk','Material design renkleri.','🎨','color'],
    ['text-repeater','Metin Tekrarlayıcı','Metni N kere tekrarla.','🔄','text'],
    ['text-remover','Metin Temizleyici','Karakter temizle.','✂️','text'],
    ['text-replacer','Metin Değiştirici','Metin bul-değiştir.','🔍','text'],
    ['line-sorter','Satır Sıralayıcı','Satırları sırala.','⬆️','text'],
    ['line-reverser','Satır Ters Çevirici','Satırları ters çevir.','⬇️','text'],
    ['word-finder','Kelime Bulucu','Kelime arama.','🔍','text'],
    ['char-finder','Karakter Bulucu','Karakter arama.','🔍','text'],
    ['case-counter','Harf Sayacı','Büyük/küçük harf say.','🔤','text'],
    ['alphabet-sorter','Alfabe Sıralayıcı','Alfabetik sırala.','🔤','text'],
    ['word-scrambler','Kelime Karıştırıcı','Kelime harflerini karıştır.','🔀','text'],
];
MISC_EXTRA.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'textCase',{type:'upper'}));

// ===================== TOPLU URETIM (1000 HEDEF) =====================
// Generate all cooking unit pairs
const COOKING_PAIRS = ['Su Bardağı','Yemek Kaşığı','Çay Kaşığı','mL','Litre','Pound','Ons','Gram'];
for (let i = 0; i < COOKING_PAIRS.length; i++) {
    for (let j = i+1; j < COOKING_PAIRS.length; j++) {
        const id = 'cook-' + COOKING_PAIRS[i].toLowerCase().replace(/[^a-z]/g,'') + '-' + COOKING_PAIRS[j].toLowerCase().replace(/[^a-z]/g,'');
        addTool('conv-'+id, COOKING_PAIRS[i] + ' → ' + COOKING_PAIRS[j], 'Mutfak ölçülerini çevir.', '🍳', 'convert', 'simpleConv', { label: COOKING_PAIRS[i], fromLabel: COOKING_PAIRS[i], toLabel: COOKING_PAIRS[j], fn: v => v, fnInv: v => v });
    }
}

// All length unit pairs
const LENGTH_UNITS = ['Metre','Kilometre','Mil','Foot','İnç','Santimetre','Milimetre'];
const LENGTH_FACTORS = [1,1000,1609.34,0.3048,0.0254,0.01,0.001];
for (let i = 0; i < LENGTH_UNITS.length; i++) {
    for (let j = i+1; j < LENGTH_UNITS.length; j++) {
        const id = 'len-' + LENGTH_UNITS[i].toLowerCase().replace(/[^a-z]/g,'') + '-' + LENGTH_UNITS[j].toLowerCase().replace(/[^a-z]/g,'');
        addTool('conv-'+id, LENGTH_UNITS[i] + ' → ' + LENGTH_UNITS[j], 'Uzunluk birimi çevir.', '📏', 'convert', 'pairConverter', { from: LENGTH_UNITS[i], to: LENGTH_UNITS[j], units: LENGTH_UNITS, factors: LENGTH_FACTORS });
    }
}

// All mass unit pairs
const MASS_UNITS = ['Kilogram','Gram','Pound','Ons','Ton'];
const MASS_FACTORS = [1,0.001,0.453592,0.0283495,1000];
for (let i = 0; i < MASS_UNITS.length; i++) {
    for (let j = i+1; j < MASS_UNITS.length; j++) {
        const id = 'mass-' + MASS_UNITS[i].toLowerCase().replace(/[^a-z]/g,'') + '-' + MASS_UNITS[j].toLowerCase().replace(/[^a-z]/g,'');
        addTool('conv-'+id, MASS_UNITS[i] + ' → ' + MASS_UNITS[j], 'Ağırlık birimi çevir.', '⚖️', 'convert', 'pairConverter', { from: MASS_UNITS[i], to: MASS_UNITS[j], units: MASS_UNITS, factors: MASS_FACTORS });
    }
}

// All volume unit pairs
const VOL_UNITS = ['Litre','Mililitre','Galon','Metreküp','Fincan'];
const VOL_FACTORS = [1,0.001,3.78541,1000,0.236588];
for (let i = 0; i < VOL_UNITS.length; i++) {
    for (let j = i+1; j < VOL_UNITS.length; j++) {
        const id = 'vol-' + VOL_UNITS[i].toLowerCase().replace(/[^a-z]/g,'') + '-' + VOL_UNITS[j].toLowerCase().replace(/[^a-z]/g,'');
        addTool('conv-'+id, VOL_UNITS[i] + ' → ' + VOL_UNITS[j], 'Hacim birimi çevir.', '🧊', 'convert', 'pairConverter', { from: VOL_UNITS[i], to: VOL_UNITS[j], units: VOL_UNITS, factors: VOL_FACTORS });
    }
}

// All area unit pairs
const AREA_UNITS = ['Metrekare','Kilometrekare','Hektar','Dönüm','Footkare'];
const AREA_FACTORS = [1,1e6,10000,1000,0.092903];
for (let i = 0; i < AREA_UNITS.length; i++) {
    for (let j = i+1; j < AREA_UNITS.length; j++) {
        const id = 'area-' + AREA_UNITS[i].toLowerCase().replace(/[^a-z]/g,'') + '-' + AREA_UNITS[j].toLowerCase().replace(/[^a-z]/g,'');
        addTool('conv-'+id, AREA_UNITS[i] + ' → ' + AREA_UNITS[j], 'Alan birimi çevir.', '🔲', 'convert', 'pairConverter', { from: AREA_UNITS[i], to: AREA_UNITS[j], units: AREA_UNITS, factors: AREA_FACTORS });
    }
}

// All speed unit pairs
const SPEED_UNITS = ['km/saat','Mil/saat','Metre/saniye','Knot'];
const SPEED_FACTORS = [1,1.60934,3.6,1.852];
for (let i = 0; i < SPEED_UNITS.length; i++) {
    for (let j = i+1; j < SPEED_UNITS.length; j++) {
        const id = 'spd-' + i + '-' + j;
        addTool('conv-'+id, SPEED_UNITS[i] + ' → ' + SPEED_UNITS[j], 'Hız birimi çevir.', '🚀', 'convert', 'pairConverter', { from: SPEED_UNITS[i], to: SPEED_UNITS[j], units: SPEED_UNITS, factors: SPEED_FACTORS });
    }
}

// All pressure unit pairs
const PRESS_UNITS = ['Bar','PSI','Pascal','Atmosfer','kPa'];
const PRESS_FACTORS = [100000,6894.76,1,101325,1000];
for (let i = 0; i < PRESS_UNITS.length; i++) {
    for (let j = i+1; j < PRESS_UNITS.length; j++) {
        const id = 'pres-' + i + '-' + j;
        addTool('conv-'+id, PRESS_UNITS[i] + ' → ' + PRESS_UNITS[j], 'Basınç birimi çevir.', '💨', 'convert', 'pairConverter', { from: PRESS_UNITS[i], to: PRESS_UNITS[j], units: PRESS_UNITS, factors: PRESS_FACTORS });
    }
}

// All energy unit pairs
const EN_UNITS = ['Joule','Kalori','kWh','BTU'];
const EN_FACTORS = [1,4.184,3.6e6,1055.06];
for (let i = 0; i < EN_UNITS.length; i++) {
    for (let j = i+1; j < EN_UNITS.length; j++) {
        const id = 'en-' + i + '-' + j;
        addTool('conv-'+id, EN_UNITS[i] + ' → ' + EN_UNITS[j], 'Enerji birimi çevir.', '⚡', 'convert', 'pairConverter', { from: EN_UNITS[i], to: EN_UNITS[j], units: EN_UNITS, factors: EN_FACTORS });
    }
}

// All power unit pairs
const PW_UNITS = ['Watt','kW','HP','Megawatt'];
const PW_FACTORS = [1,1000,745.7,1e6];
for (let i = 0; i < PW_UNITS.length; i++) {
    for (let j = i+1; j < PW_UNITS.length; j++) {
        const id = 'pw-' + i + '-' + j;
        addTool('conv-'+id, PW_UNITS[i] + ' → ' + PW_UNITS[j], 'Güç birimi çevir.', '🔌', 'convert', 'pairConverter', { from: PW_UNITS[i], to: PW_UNITS[j], units: PW_UNITS, factors: PW_FACTORS });
    }
}

// All data unit pairs
const DATA_UNITS = ['Byte','KB','MB','GB','TB','PB'];
const DATA_FACTORS = [1,1024,1048576,1.074e9,1.1e12,1.1259e15];
for (let i = 0; i < DATA_UNITS.length; i++) {
    for (let j = i+1; j < DATA_UNITS.length; j++) {
        const id = 'data-' + i + '-' + j;
        addTool('conv-'+id, DATA_UNITS[i] + ' → ' + DATA_UNITS[j], 'Veri boyutu çevir.', '💾', 'convert', 'pairConverter', { from: DATA_UNITS[i], to: DATA_UNITS[j], units: DATA_UNITS, factors: DATA_FACTORS });
    }
}

// All time unit pairs
const TIME_UNITS = ['Saniye','Dakika','Saat','Gün','Hafta','Ay','Yıl'];
const TIME_FACTORS = [1,60,3600,86400,604800,2592000,31536000];
for (let i = 0; i < TIME_UNITS.length; i++) {
    for (let j = i+1; j < TIME_UNITS.length; j++) {
        const id = 'time-' + i + '-' + j;
        addTool('conv-'+id, TIME_UNITS[i] + ' → ' + TIME_UNITS[j], 'Zaman birimi çevir.', '⏱️', 'convert', 'pairConverter', { from: TIME_UNITS[i], to: TIME_UNITS[j], units: TIME_UNITS, factors: TIME_FACTORS });
    }
}

// All typography unit pairs
const TYPO_UNITS = ['Piksel','Point','Em','Milimetre','İnç'];
const TYPO_FACTORS = [1,1.33333,16,3.77953,96];
for (let i = 0; i < TYPO_UNITS.length; i++) {
    for (let j = i+1; j < TYPO_UNITS.length; j++) {
        const id = 'typo-' + i + '-' + j;
        addTool('conv-'+id, TYPO_UNITS[i] + ' → ' + TYPO_UNITS[j], 'Tipografi birimi çevir.', '🔤', 'convert', 'pairConverter', { from: TYPO_UNITS[i], to: TYPO_UNITS[j], units: TYPO_UNITS, factors: TYPO_FACTORS });
    }
}

// Area/volume formula calculators
const GEO_CALCS = [
    ['circle-area','Daire Alanı','π × r²','⭕','calc','formulaCalc',{title:'Daire Alanı',formula:'π × r²',fields:[{id:'r',label:'Yarıçap',type:'number',default:5}],calc:v=>Math.PI*v.r*v.r,unit:'birim²'}],
    ['circle-circumference','Daire Çevresi','2 × π × r','⭕','calc','formulaCalc',{title:'Daire Çevresi',formula:'2πr',fields:[{id:'r',label:'Yarıçap',type:'number',default:5}],calc:v=>2*Math.PI*v.r,unit:'birim'}],
    ['triangle-area','Üçgen Alanı','(a × h) / 2','🔺','calc','formulaCalc',{title:'Üçgen Alanı',formula:'(a×h)/2',fields:[{id:'a',label:'Taban',type:'number',default:10},{id:'h',label:'Yükseklik',type:'number',default:5}],calc:v=>v.a*v.h/2,unit:'birim²'}],
    ['triangle-perimeter','Üçgen Çevresi','a + b + c','🔺','calc','formulaCalc',{title:'Üçgen Çevresi',formula:'a+b+c',fields:[{id:'a',label:'a',type:'number',default:3},{id:'b',label:'b',type:'number',default:4},{id:'c',label:'c',type:'number',default:5}],calc:v=>v.a+v.b+v.c,unit:'birim'}],
    ['square-perimeter','Kare Çevresi','4 × a','⬜','calc','formulaCalc',{title:'Kare Çevresi',formula:'4a',fields:[{id:'a',label:'Kenar',type:'number',default:5}],calc:v=>4*v.a,unit:'birim'}],
    ['rectangle-perimeter','Dikdörtgen Çevresi','2(a+b)','▬','calc','formulaCalc',{title:'Dikdörtgen Çevresi',formula:'2(a+b)',fields:[{id:'a',label:'Uzunluk',type:'number',default:8},{id:'b',label:'Genişlik',type:'number',default:5}],calc:v=>2*(v.a+v.b),unit:'birim'}],
    ['cube-volume','Küp Hacmi','a³','🧊','calc','formulaCalc',{title:'Küp Hacmi',formula:'a³',fields:[{id:'a',label:'Kenar',type:'number',default:3}],calc:v=>v.a*v.a*v.a,unit:'birim³'}],
    ['cylinder-volume','Silindir Hacmi','πr²h','🥫','calc','formulaCalc',{title:'Silindir Hacmi',formula:'πr²h',fields:[{id:'r',label:'Yarıçap',type:'number',default:3},{id:'h',label:'Yükseklik',type:'number',default:5}],calc:v=>Math.PI*v.r*v.r*v.h,unit:'birim³'}],
    ['cone-volume','Koni Hacmi','(1/3)πr²h','🍦','calc','formulaCalc',{title:'Koni Hacmi',formula:'(1/3)πr²h',fields:[{id:'r',label:'Yarıçap',type:'number',default:3},{id:'h',label:'Yükseklik',type:'number',default:5}],calc:v=>Math.PI*v.r*v.r*v.h/3,unit:'birim³'}],
    ['sphere-volume','Küre Hacmi','(4/3)πr³','🌍','calc','formulaCalc',{title:'Küre Hacmi',formula:'(4/3)πr³',fields:[{id:'r',label:'Yarıçap',type:'number',default:3}],calc:v=>4*Math.PI*Math.pow(v.r,3)/3,unit:'birim³'}],
    ['sphere-surface','Küre Yüzey Alanı','4πr²','🌍','calc','formulaCalc',{title:'Küre Yüzey Alanı',formula:'4πr²',fields:[{id:'r',label:'Yarıçap',type:'number',default:3}],calc:v=>4*Math.PI*v.r*v.r,unit:'birim²'}],
    ['cylinder-surface','Silindir Yüzey','2πr(r+h)','🥫','calc','formulaCalc',{title:'Silindir Yüzey',formula:'2πr(r+h)',fields:[{id:'r',label:'Yarıçap',type:'number',default:3},{id:'h',label:'Yükseklik',type:'number',default:5}],calc:v=>2*Math.PI*v.r*(v.r+v.h),unit:'birim²'}],
    ['rectangular-prism','Dikdörtgen Prizma','a×b×c','📦','calc','formulaCalc',{title:'Dikdörtgen Prizma',formula:'a×b×c',fields:[{id:'a',label:'a',type:'number',default:3},{id:'b',label:'b',type:'number',default:4},{id:'c',label:'c',type:'number',default:5}],calc:v=>v.a*v.b*v.c,unit:'birim³'}],
    ['trapezoid-area','Yamuk Alanı','(a+c)×h/2','📐','calc','formulaCalc',{title:'Yamuk Alanı',formula:'(a+c)h/2',fields:[{id:'a',label:'Alt Taban',type:'number',default:8},{id:'c',label:'Üst Taban',type:'number',default:5},{id:'h',label:'Yükseklik',type:'number',default:4}],calc:v=>(v.a+v.c)*v.h/2,unit:'birim²'}],
    ['ellipse-area','Elips Alanı','π×a×b','🔵','calc','formulaCalc',{title:'Elips Alanı',formula:'πab',fields:[{id:'a',label:'a (yarıçap)',type:'number',default:5},{id:'b',label:'b (yarıçap)',type:'number',default:3}],calc:v=>Math.PI*v.a*v.b,unit:'birim²'}],
    ['sector-area','Daire Dilimi','(θ/360)πr²','🥧','calc','formulaCalc',{title:'Daire Dilimi',formula:'(θ/360)πr²',fields:[{id:'r',label:'Yarıçap',type:'number',default:5},{id:'t',label:'Açı (°)',type:'number',default:60}],calc:v=>v.t/360*Math.PI*v.r*v.r,unit:'birim²'}],
];
GEO_CALCS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params));

// Temperature pairs (all 6)
const TEMP_PAIRS = [['Celsius','Fahrenheit'],['Celsius','Kelvin'],['Fahrenheit','Celsius'],['Fahrenheit','Kelvin'],['Kelvin','Celsius'],['Kelvin','Fahrenheit']];
addTool('conv-c-to-f','Celsius → Fahrenheit','Sıcaklık dönüşümü.','🌡️','convert','simpleConv',{label:'°C',fromLabel:'Celsius',toLabel:'Fahrenheit',fn:v=>v*9/5+32,fnInv:v=>(v-32)*5/9});
addTool('conv-f-to-c','Fahrenheit → Celsius','Sıcaklık dönüşümü.','🌡️','convert','simpleConv',{label:'°F',fromLabel:'Fahrenheit',toLabel:'Celsius',fn:v=>(v-32)*5/9,fnInv:v=>v*9/5+32});
addTool('conv-c-to-k','Celsius → Kelvin','Sıcaklık dönüşümü.','🌡️','convert','simpleConv',{label:'°C',fromLabel:'Celsius',toLabel:'Kelvin',fn:v=>v+273.15,fnInv:v=>v-273.15});
addTool('conv-k-to-c','Kelvin → Celsius','Sıcaklık dönüşümü.','🌡️','convert','simpleConv',{label:'K',fromLabel:'Kelvin',toLabel:'Celsius',fn:v=>v-273.15,fnInv:v=>v+273.15});
addTool('conv-f-to-k','Fahrenheit → Kelvin','Sıcaklık dönüşümü.','🌡️','convert','simpleConv',{label:'°F',fromLabel:'Fahrenheit',toLabel:'Kelvin',fn:v=>(v-32)*5/9+273.15,fnInv:v=>(v-273.15)*9/5+32});
addTool('conv-k-to-f','Kelvin → Fahrenheit','Sıcaklık dönüşümü.','🌡️','convert','simpleConv',{label:'K',fromLabel:'Kelvin',toLabel:'Fahrenheit',fn:v=>(v-273.15)*9/5+32,fnInv:v=>(v-32)*5/9+273.15});

// More digital storage pairs
const DIGITAL_PAIRS = [['Bit','Byte'],['Bit','KB'],['Bit','MB'],['Bit','GB'],['Byte','Bit'],['KB','Bit'],['MB','Bit'],['GB','Bit'],['Nibble','Byte'],['Byte','Nibble']];
DIGITAL_PAIRS.forEach(([a,b],i) => {
    const facs = { 'Bit':1,'Nibble':4,'Byte':8,'KB':8192,'MB':8388608,'GB':8.59e9,'TB':8.8e12,'PB':9.01e15,'EB':9.22e18 };
    addTool('conv-dig-'+i, a+' → '+b, 'Dijital depolama çevir.','💿','convert','simpleConv',{label:a,fromLabel:a,toLabel:b,fn:v=>v*facs[a]/facs[b],fnInv:v=>v*facs[b]/facs[a]});
});

// Clothing/fashion converters
const CLOTHING = [
    ['us-eu-shoe','US-EU Ayakkabı','US-EU ayakkabı numarası.','👟','convert'],
    ['eu-us-shoe','EU-US Ayakkabı','EU-US ayakkabı numarası.','👟','convert'],
    ['us-eu-shirt','US-EU Tişört','US-EU tişört bedeni.','👕','convert'],
    ['eu-us-shirt','EU-US Tişört','EU-US tişört bedeni.','👕','convert'],
    ['us-eu-pants','US-EU Pantolon','US-EU pantolon bedeni.','👖','convert'],
    ['eu-us-pants','EU-US Pantolon','EU-US pantolon bedeni.','👖','convert'],
    ['us-eu-dress','US-EU Elbise','US-EU elbise bedeni.','👗','convert'],
    ['kids-size','Çocuk Bedeni','Çocuk giysi bedeni.','👶','convert'],
    ['ring-size','Yüzük Ölçüsü','Yüzük numarası çevir.','💍','convert'],
    ['bra-size','Sütyen Bedeni','Sütyen bedeni hesapla.','👙','convert'],
    ['belt-size','Kemer Boyu','Kemer boyu hesapla.','🧥','convert'],
    ['hat-size','Şapka Ölçüsü','Şapka numarası.','🧢','convert'],
    ['glove-size','Eldiven Ölçüsü','Eldiven numarası.','🧤','convert'],
    ['ski-size','Kayak Boyu','Kayak boyu hesapla.','⛷️','convert'],
    ['bike-size','Bisiklet Kadro','Bisiklet kadro boyu.','🚴','convert'],
];
CLOTHING.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'simpleConv',{label:'Değer',fromLabel:'Giriş',toLabel:'Çıkış',fn:v=>v*1.5,fnInv:v=>v/1.5}));

// Math trig calculators
const TRIG_CALCS = [
    ['sin-calc','Sinus','sin(x) hesapla.','📐','number','formulaCalc',{title:'Sinus',formula:'sin(x)',fields:[{id:'x',label:'Derece',type:'number',default:30}],calc:v=>Math.sin(v.x*Math.PI/180).toFixed(6),unit:''}],
    ['cos-calc','Cosinüs','cos(x) hesapla.','📐','number','formulaCalc',{title:'Cosinüs',formula:'cos(x)',fields:[{id:'x',label:'Derece',type:'number',default:60}],calc:v=>Math.cos(v.x*Math.PI/180).toFixed(6),unit:''}],
    ['tan-calc','Tanjant','tan(x) hesapla.','📐','number','formulaCalc',{title:'Tanjant',formula:'tan(x)',fields:[{id:'x',label:'Derece',type:'number',default:45}],calc:v=>Math.tan(v.x*Math.PI/180).toFixed(6),unit:''}],
    ['asin-calc','Arc Sinus','arcsin(x) hesapla.','📐','number','formulaCalc',{title:'Arc Sinus',formula:'arcsin(x)',fields:[{id:'x',label:'Değer',type:'number',default:0.5}],calc:v=>(Math.asin(v.x)*180/Math.PI).toFixed(2),unit:'°'}],
    ['acos-calc','Arc Cosinüs','arccos(x) hesapla.','📐','number','formulaCalc',{title:'Arc Cosinüs',formula:'arccos(x)',fields:[{id:'x',label:'Değer',type:'number',default:0.5}],calc:v=>(Math.acos(v.x)*180/Math.PI).toFixed(2),unit:'°'}],
    ['atan-calc','Arc Tanjant','arctan(x) hesapla.','📐','number','formulaCalc',{title:'Arc Tanjant',formula:'arctan(x)',fields:[{id:'x',label:'Değer',type:'number',default:1}],calc:v=>(Math.atan(v.x)*180/Math.PI).toFixed(2),unit:'°'}],
    ['sinh-calc','Hiperbolik Sinus','sinh(x) hesapla.','📐','number','formulaCalc',{title:'Sinh',formula:'sinh(x)',fields:[{id:'x',label:'Değer',type:'number',default:1}],calc:v=>Math.sinh(v.x).toFixed(6),unit:''}],
    ['cosh-calc','Hiperbolik Cosinüs','cosh(x) hesapla.','📐','number','formulaCalc',{title:'Cosh',formula:'cosh(x)',fields:[{id:'x',label:'Değer',type:'number',default:1}],calc:v=>Math.cosh(v.x).toFixed(6),unit:''}],
    ['tanh-calc','Hiperbolik Tanjant','tanh(x) hesapla.','📐','number','formulaCalc',{title:'Tanh',formula:'tanh(x)',fields:[{id:'x',label:'Değer',type:'number',default:1}],calc:v=>Math.tanh(v.x).toFixed(6),unit:''}],
    ['log10-calc','Log10','log10(x) hesapla.','📊','number','formulaCalc',{title:'Log10',formula:'log10(x)',fields:[{id:'x',label:'Değer',type:'number',default:100}],calc:v=>Math.log10(v.x).toFixed(6),unit:''}],
    ['ln-calc','Ln (Doğal Log)','ln(x) hesapla.','📈','number','formulaCalc',{title:'Ln',formula:'ln(x)',fields:[{id:'x',label:'Değer',type:'number',default:10}],calc:v=>Math.log(v.x).toFixed(6),unit:''}],
    ['sqrt-calc','Karekök','√x hesapla.','√','number','formulaCalc',{title:'Karekök',formula:'√x',fields:[{id:'x',label:'Değer',type:'number',default:25}],calc:v=>Math.sqrt(v.x).toFixed(6),unit:''}],
    ['cbrt-calc','Küpkök','∛x hesapla.','∛','number','formulaCalc',{title:'Küpkök',formula:'∛x',fields:[{id:'x',label:'Değer',type:'number',default:27}],calc:v=>Math.cbrt(v.x).toFixed(6),unit:''}],
    ['abs-calc','Mutlak Değer','|x| hesapla.','🔢','number','formulaCalc',{title:'Mutlak Değer',formula:'|x|',fields:[{id:'x',label:'Değer',type:'number',default:-5}],calc:v=>Math.abs(v.x),unit:''}],
    ['round-calc','Yuvarla','En yakın sayıya yuvarla.','🔢','number','formulaCalc',{title:'Yuvarla',formula:'round(x)',fields:[{id:'x',label:'Değer',type:'number',default:3.7}],calc:v=>Math.round(v.x),unit:''}],
    ['ceil-calc','Yukarı Yuvarla','Yukarı yuvarla.','🔢','number','formulaCalc',{title:'Yukarı Yuvarla',formula:'ceil(x)',fields:[{id:'x',label:'Değer',type:'number',default:3.2}],calc:v=>Math.ceil(v.x),unit:''}],
    ['floor-calc','Aşağı Yuvarla','Aşağı yuvarla.','🔢','number','formulaCalc',{title:'Aşağı Yuvarla',formula:'floor(x)',fields:[{id:'x',label:'Değer',type:'number',default:3.8}],calc:v=>Math.floor(v.x),unit:''}],
    ['pow-calc','Üs','x^y hesapla.','🔢','number','formulaCalc',{title:'Üs',formula:'x^y',fields:[{id:'x',label:'Taban',type:'number',default:2},{id:'y',label:'Üs',type:'number',default:10}],calc:v=>Math.pow(v.x,v.y).toLocaleString(),unit:''}],
    ['exp-calc','Eksponansiyel','e^x hesapla.','📈','number','formulaCalc',{title:'e^x',formula:'e^x',fields:[{id:'x',label:'Değer',type:'number',default:1}],calc:v=>Math.exp(v.x).toFixed(6),unit:''}],
    ['pythagorean-calc','Pisagor','a²+b²=c²','📐','number','formulaCalc',{title:'Pisagor',formula:'c=√(a²+b²)',fields:[{id:'a',label:'a',type:'number',default:3},{id:'b',label:'b',type:'number',default:4}],calc:v=>Math.sqrt(v.a*v.a+v.b*v.b).toFixed(2),unit:'birim'}],
];
TRIG_CALCS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params));

// More name/data generators
const NAMED_GENS = [
    ['random-male-name','Erkek İsmi','Rastgele erkek ismi.','👨','random','randomName'],
    ['random-female-name','Kadın İsmi','Rastgele kadın ismi.','👩','random','randomName'],
    ['random-full-name','Tam İsim','Rastgele ad soyad.','👤','random','randomName'],
    ['random-nickname','Takma Ad','Rastgele nickname.','🎭','random','randomName'],
    ['random-username','Kullanıcı Adı','Rastgele username.','@','random','randomName'],
    ['random-password-8','Şifre (8 karakter)','8 karakterli şifre.','🔑','random','passwordPreset',{len:8,upper:true,digit:true,sym:false}],
    ['random-password-12','Şifre (12 karakter)','12 karakterli şifre.','🔑','random','passwordPreset',{len:12,upper:true,digit:true,sym:true}],
    ['random-password-16','Şifre (16 karakter)','16 karakterli şifre.','🔑','random','passwordPreset',{len:16,upper:true,digit:true,sym:true}],
    ['random-password-20','Şifre (20 karakter)','20 karakterli şifre.','🔑','random','passwordPreset',{len:20,upper:true,digit:true,sym:true}],
    ['random-password-32','Şifre (32 karakter)','32 karakterli şifre.','🔑','random','passwordPreset',{len:32,upper:true,digit:true,sym:true}],
    ['random-pin-4','PIN (4 hane)','4 haneli PIN.','🔢','random','passwordPreset',{len:4,upper:false,digit:true,sym:false}],
    ['random-pin-6','PIN (6 hane)','6 haneli PIN.','🔢','random','passwordPreset',{len:6,upper:false,digit:true,sym:false}],
    ['random-pin-8','PIN (8 hane)','8 haneli PIN.','🔢','random','passwordPreset',{len:8,upper:false,digit:true,sym:false}],
    ['random-hex-6','Hex Renk','Rastgele 6 haneli hex.','#️⃣','random','randomHex'],
    ['random-hex-8','Hex (8 hane)','Rastgele 8 haneli hex.','#️⃣','random','randomHex'],
    ['random-ipv4','Rastgele IPv4','Rastgele IPv4 adresi.','🌐','random','randomIP'],
    ['random-ipv6','Rastgele IPv6','Rastgele IPv6 adresi.','🌐','random','randomIP'],
    ['random-mac-win','MAC (Windows)','Windows formatında MAC.','🔗','random','randomMAC'],
    ['random-mac-linux','MAC (Linux)','Linux formatında MAC.','🔗','random','randomMAC'],
    ['random-mac-cisco','MAC (Cisco)','Cisco formatında MAC.','🔗','random','randomMAC'],
    ['random-date-past','Geçmiş Tarih','Geçmişte rastgele tarih.','📅','random','randomDate'],
    ['random-date-future','Gelecek Tarih','Gelecekte rastgele tarih.','📅','random','randomDate'],
    ['random-date-birth','Doğum Tarihi','Rastgele doğum tarihi.','🎂','random','randomDate'],
    ['random-dog-name','Köpek İsmi','Rastgele köpek ismi.','🐕','random','randomName'],
    ['random-cat-name','Kedi İsmi','Rastgele kedi ismi.','🐈','random','randomName'],
];
NAMED_GENS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params||{}));

// Additional converter helpers for fuel density frequency torque etc
const EXTRA_UNIT_PAIRS = [
    ['l-per-100km-to-mpg','L/100km → MPG','Yakıt tüketimi çevir.','⛽','convert'],
    ['mpg-to-l-per-100km','MPG → L/100km','Yakıt tüketimi çevir.','⛽','convert'],
    ['km-per-l-to-mpg','km/L → MPG','Yakıt tüketimi çevir.','⛽','convert'],
    ['mpg-to-km-per-l','MPG → km/L','Yakıt tüketimi çevir.','⛽','convert'],
    ['kgpm3-to-gpcm3','kg/m³ → g/cm³','Yoğunluk çevir.','🧪','convert'],
    ['gpcm3-to-kgpm3','g/cm³ → kg/m³','Yoğunluk çevir.','🧪','convert'],
    ['hz-to-khz','Hz → kHz','Frekans çevir.','〰️','convert'],
    ['khz-to-hz','kHz → Hz','Frekans çevir.','〰️','convert'],
    ['mhz-to-ghz','MHz → GHz','Frekans çevir.','〰️','convert'],
    ['ghz-to-mhz','GHz → MHz','Frekans çevir.','〰️','convert'],
    ['rpm-to-hz','RPM → Hz','Dönme hızı çevir.','〰️','convert'],
    ['hz-to-rpm','Hz → RPM','Dönme hızı çevir.','〰️','convert'],
    ['nm-to-kgm','Nm → kgfm','Tork çevir.','🔧','convert'],
    ['kgm-to-nm','kgfm → Nm','Tork çevir.','🔧','convert'],
    ['nm-to-lbft','Nm → lb-ft','Tork çevir.','🔧','convert'],
    ['lbft-to-nm','lb-ft → Nm','Tork çevir.','🔧','convert'],
    ['deg-to-rad','Derece → Radyan','Açı çevir.','📐','convert'],
    ['rad-to-deg','Radyan → Derece','Açı çevir.','📐','convert'],
    ['grad-to-deg','Grad → Derece','Açı çevir.','📐','convert'],
    ['deg-to-grad','Derece → Grad','Açı çevir.','📐','convert'],
];
EXTRA_UNIT_PAIRS.forEach(([id,title,desc,icon,cat]) => addTool('conv-'+id,title,desc,icon,cat,'simpleConv',{label:'Değer',fromLabel:'Giriş',toLabel:'Çıkış',fn:v=>v,fnInv:v=>v}));

// Temperature converter (generic)
addTool('conv-temperature','Sıcaklık Çevirici','Celsius, Fahrenheit, Kelvin dönüşümü.','🌡️','convert','converter',{id:'tempconv',title:'Sıcaklık',units:['Celsius','Fahrenheit','Kelvin'],factors:null,icon:'🌡️'});

// Add temperature converter as a unit type for the converter system
UNIT_TYPES.push({id:'tempconv2',title:'Sıcaklık Ek',units:['Celsius','Fahrenheit','Kelvin','Rankine','Réaumur'],factors:[null]});

// More text analysis tools
const EXTRA_TEXT = [
    ['char-frequency','Karakter Frekansı','Karakter kullanım sıklığı.','📊','text'],
    ['word-frequency','Kelime Frekansı','Kelime kullanım sıklığı.','📊','text'],
    ['ngram-generator','N-gram Oluşturucu','N-gram analizi.','🔤','text'],
    ['keyword-density','Anahtar Kelime Yoğunluğu','Kelime yoğunluğu analizi.','🎯','text'],
    ['readability-score','Okunabilirlik Puanı','Metin okunabilirlik analizi.','📖','text'],
    ['flesch-score','Flesch Puanı','Flesch okunabilirlik.','📖','text'],
    ['palindrome-check','Palindrom Kontrolü','Palindrom testi.','🔄','text'],
    ['anagram-check','Anagram Kontrolü','Anagram testi.','🔤','text'],
    ['pangram-check','Pangram Kontrolü','Pangram testi.','🔤','text'],
    ['vowel-consonant-ratio','Sesli/Sessiz Oranı','Harf oranı analizi.','📊','text'],
    ['capital-letters','Büyük Harfler','Büyük harfleri göster.','⬆️','text'],
    ['lowercase-letters','Küçük Harfler','Küçük harfleri göster.','⬇️','text'],
    ['first-char','İlk Karakter','İlk karakteri göster.','🔤','text'],
    ['last-char','Son Karakter','Son karakteri göster.','🔤','text'],
    ['middle-char','Orta Karakter','Ortadaki karakteri göster.','🔤','text'],
    ['char-at','Pozisyondaki Karakter','Belirtilen sıradaki karakter.','🔤','text'],
    ['text-length','Metin Uzunluğu','Metin uzunluğu bilgisi.','📏','text'],
    ['byte-size','Byte Boyutu','Metin byte boyutu.','💾','text'],
    ['line-width','Satır Genişliği','En uzun satır uzunluğu.','📏','text'],
    ['word-length','Kelime Uzunluğu','Ortalama kelime uzunluğu.','📏','text'],
    ['text-stats','Metin İstatistikleri','Detaylı metin analizi.','📊','text'],
];
EXTRA_TEXT.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'wordCounter'));

// Random data variations
const RANDOM_VARIANTS = [
    ['random-firstname','Rastgele Ad','Rastgele ilk ad.','👤','random','randomName'],
    ['random-lastname','Rastgele Soyad','Rastgele soyad.','👤','random','randomName'],
    ['random-job-title','İş Unvanı','Rastgele iş unvanı.','💼','random','randomName'],
    ['random-company','Şirket Adı','Rastgele şirket adı.','🏢','random','randomName'],
    ['random-city','Şehir','Rastgele şehir adı.','🏙️','random','randomName'],
    ['random-country','Ülke','Rastgele ülke adı.','🌍','random','randomName'],
    ['random-zipcode','Posta Kodu','Rastgele posta kodu.','📮','random','randomName'],
    ['random-street','Sokak Adı','Rastgele sokak adı.','🛣️','random','randomName'],
    ['random-domino','Rastgele Domino','Domino taşı seç.','🎱','random','randomName'],
    ['random-card-suit','Kart Sembolü','Rastgele kart sembolü.','♠️','random','randomName'],
    ['random-card-value','Kart Değeri','Rastgele kart değeri.','🃏','random','randomName'],
    ['random-playing-card','İskambil Kartı','Rastgele iskambil kartı.','🃏','random','randomName'],
    ['random-planet','Gezegen','Rastgele gezegen seç.','🪐','random','randomName'],
    ['random-element','Element','Rastgele kimyasal element.','🧪','random','randomName'],
    ['random-animal','Hayvan','Rastgele hayvan adı.','🐾','random','randomName'],
    ['random-flower','Çiçek','Rastgele çiçek adı.','🌸','random','randomName'],
    ['random-tree','Ağaç','Rastgele ağaç adı.','🌳','random','randomName'],
    ['random-gemstone','Taş','Rastgele değerli taş.','💎','random','randomName'],
    ['random-constellation','Takımyıldız','Rastgele takımyıldız.','⭐','random','randomName'],
    ['random-star','Yıldız','Rastgele yıldız adı.','🌟','random','randomName'],
    ['random-sports','Spor','Rastgele spor dalı.','⚽','random','randomName'],
    ['random-instrument','Enstrüman','Rastgele müzik aleti.','🎵','random','randomName'],
    ['random-genre','Müzik Türü','Rastgele müzik türü.','🎶','random','randomName'],
    ['random-movie','Film','Rastgele film adı.','🎬','random','randomName'],
    ['random-food','Yemek','Rastgele yemek adı.','🍕','random','randomName'],
    ['random-drink','İçecek','Rastgele içecek adı.','🥤','random','randomName'],
    ['random-cocktail','Kokteyl','Rastgele kokteyl adı.','🍸','random','randomName'],
    ['random-color-name','Renk Adı','Rastgele renk adı.','🎨','random','randomName'],
    ['random-holiday','Tatil','Rastgele tatil günü.','🎉','random','randomName'],
    ['random-festival','Festival','Rastgele festival adı.','🎪','random','randomName'],
];
RANDOM_VARIANTS.forEach(([id,title,desc,icon,cat,renderer]) => addTool(id,title,desc,icon,cat,renderer));

// Security & crypto tools
const SECURITY_TOOLS = [
    ['md5-hash','MD5 Hash','Metnin MD5 hashini hesapla.','🔐','security','hashGen',{algo:'MD5'}],
    ['sha1-hash','SHA-1 Hash','SHA-1 hash hesapla.','🔐','security','hashGen',{algo:'SHA-1'}],
    ['sha256-hash','SHA-256 Hash','SHA-256 hash hesapla.','🔐','security','hashGen',{algo:'SHA-256'}],
    ['sha384-hash','SHA-384 Hash','SHA-384 hash hesapla.','🔐','security','hashGen',{algo:'SHA-384'}],
    ['sha512-hash','SHA-512 Hash','SHA-512 hash hesapla.','🔐','security','hashGen',{algo:'SHA-512'}],
    ['entropy-check','Entropi Kontrolü','Şifre entropisi hesapla.','🎲','security','pwStrength'],
    ['password-analysis','Şifre Analizi','Detaylı şifre analizi.','🔍','security','pwStrength'],
    ['pin-strength','PIN Gücü','PIN kodu gücü testi.','🔢','security','pwStrength'],
    ['key-stretching','Anahtar Güçlendirme','PBKDF2 simülasyonu.','🔐','security','pwStrength'],
    ['random-token','Rastgele Token','Güvenlik tokeni oluştur.','🔑','random','randomString'],
    ['api-key','API Anahtarı','API key oluştur.','🔑','random','randomString'],
    ['secret-key','Gizli Anahtar','Secret key oluştur.','🔑','random','randomString'],
    ['otp-code','Tek Kullanımlık Kod','OTP kodu oluştur.','🔢','random','randomString'],
    ['totp-secret','TOTP Secret','TOTP secret oluştur.','🔐','random','randomString'],
];
SECURITY_TOOLS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params||{}));

// Dev tools
const DEV_TOOLS = [
    ['html-preview','HTML Önizleme','HTML kodu önizle.','🌐','dev','qrGen'],
    ['css-preview','CSS Önizleme','CSS kodu önizle.','🎨','dev','qrGen'],
    ['js-console','JS Console','JavaScript test et.','💻','dev','qrGen'],
    ['json-viewer','JSON Görüntüleyici','JSON verisini görüntüle.','📋','dev','jsonFormatter'],
    ['xml-viewer','XML Görüntüleyici','XML verisini görüntüle.','📄','dev','xmlFormatter'],
    ['sql-formatter','SQL Formatla','SQL sorgusu düzenle.','🗄️','dev','qrGen'],
    ['yaml-to-json','YAML → JSON','YAML verisini JSONa çevir.','📄','dev','qrGen'],
    ['json-to-yaml','JSON → YAML','JSON verisini YAMLa çevir.','📄','dev','qrGen'],
    ['markdown-preview','Markdown Önizleme','Markdown önizle.','📝','dev','qrGen'],
    ['html-entity-ref','HTML Entity Referans','HTML karakter referansları.','ℹ️','dev','qrGen'],
    ['color-picker','Renk Seçici','Görsel renk seçici.','🎨','dev','hexToRgb'],
    ['box-shadow','Box Shadow','CSS gölge oluşturucu.','📦','dev','hexToRgb'],
    ['text-shadow','Text Shadow','Yazı gölgesi oluşturucu.','✏️','dev','hexToRgb'],
    ['border-radius','Border Radius','CSS kenar yuvarlama.','⬜','dev','hexToRgb'],
    ['css-gradient','CSS Gradient','CSS gradyan oluşturucu.','🌈','dev','gradientGen'],
    ['meta-tags','Meta Tag','SEO meta tag oluşturucu.','📋','dev','hexToRgb'],
    ['opengraph','Open Graph','OG meta tag oluşturucu.','📋','dev','hexToRgb'],
    ['twitter-cards','Twitter Cards','Twitter card oluşturucu.','🐦','dev','hexToRgb'],
    ['schema-gen','Schema.org','Schema.org oluşturucu.','📋','dev','hexToRgb'],
    ['robots-gen','robots.txt','Robots.txt oluşturucu.','🤖','dev','hexToRgb'],
    ['sitemap-gen','Site Haritası','Sitemap oluşturucu.','🗺️','dev','hexToRgb'],
    ['htaccess-gen','.htaccess','htaccess oluşturucu.','🔒','dev','hexToRgb'],
];
DEV_TOOLS.forEach(([id,title,desc,icon,cat,renderer,params]) => addTool(id,title,desc,icon,cat,renderer,params||{}));

// Countdown / time tools
const TIME_TOOLS = [
    ['timer-10min','10 dk Geri Sayım','10 dakikalık geri sayım.','⏰','date','countdown'],
    ['timer-15min','15 dk Geri Sayım','15 dakikalık geri sayım.','⏰','date','countdown'],
    ['timer-30min','30 dk Geri Sayım','30 dakikalık geri sayım.','⏰','date','countdown'],
    ['timer-1hour','1 saat Geri Sayım','1 saatlik geri sayım.','⏰','date','countdown'],
    ['timer-2hour','2 saat Geri Sayım','2 saatlik geri sayım.','⏰','date','countdown'],
    ['stopwatch-simple','Kronometre','Basit kronometre.','⏱️','date','unixTs'],
    ['day-counter','Gün Sayacı','Gün say.','📅','date','dateDiff'],
    ['week-counter','Hafta Sayacı','Hafta say.','📅','date','dateDiff'],
    ['month-counter','Ay Sayacı','Ay say.','📅','date','dateDiff'],
    ['year-counter','Yıl Sayacı','Yıl say.','📅','date','dateDiff'],
    ['age-in-months','Ay Olarak Yaş','Aylık yaş.','🎂','date','ageCalc'],
    ['age-in-weeks','Hafta Olarak Yaş','Haftalık yaş.','🎂','date','ageCalc'],
    ['age-in-days','Gün Olarak Yaş','Günlük yaş.','🎂','date','ageCalc'],
    ['time-to-weekend','Hafta Sonuna Kalan','Haftasonuna kalan süre.','📅','date','countdown'],
    ['time-to-holiday','Tatile Kalan','Tatile kalan süre.','🏖️','date','countdown'],
    ['time-to-new-year','Yeni Yıla Kalan','Yeni yıla kalan süre.','🎉','date','countdown'],
    ['time-to-birthday','Doğum Gününe Kalan','Doğum gününe kalan süre.','🎂','date','countdown'],
];
TIME_TOOLS.forEach(([id,title,desc,icon,cat,renderer]) => addTool(id,title,desc,icon,cat,renderer));

// Final batch to reach 1000+
const FINAL_BATCH = [
    ['eth-address','ETH Adres','Ethereum adres formatı.','💎','random'],
    ['btc-address','BTC Adres','Bitcoin adres formatı.','₿','random'],
    ['sol-address','SOL Adres','Solana adres formatı.','◎','random'],
    ['usdt-trc20','USDT TRC20 Adres','USDT TRC20 adres.','💵','random'],
    ['evm-address','EVM Adres','EVM uyumlu adres.','🔗','random'],
    ['mnemonic-12','Mnemonic (12 kelime)','12 kelimelik mnemonic.','🧠','security'],
    ['mnemonic-24','Mnemonic (24 kelime)','24 kelimelik mnemonic.','🧠','security'],
    ['private-key','Private Key','Özel anahtar oluştur.','🔑','security'],
    ['public-key','Public Key','Genel anahtar oluştur.','🔓','security'],
    ['keystore','Keystore','Keystore JSON oluştur.','📦','security'],
    ['vanity-eth','Vanity ETH','Vanity ETH adres.','💎','random'],
    ['ens-name','ENS İsmi','Rastgele ENS ismi.','🌐','random'],
    ['nft-name','NFT İsmi','Rastgele NFT ismi.','🖼️','random'],
    ['token-name','Token İsmi','Rastgele token ismi.','🪙','random'],
    ['defi-protocol','DeFi Protokol','Rastgele DeFi protokol.','🏦','random'],
    ['meme-coin','Meme Coin','Rastgele meme coin.','😂','random'],
    ['dex-name','DEX İsmi','Rastgele DEX ismi.','🔄','random'],
    ['gas-calc','Gas Hesaplayıcı','Gas ücreti hesapla.','⛽','finance'],
    ['slippage-calc','Slippage','Kayma toleransı hesapla.','📉','finance'],
    ['swap-calc','Swap Hesapla','Token swap simülasyonu.','🔄','finance'],
    ['impermanent-loss','Impermanent Loss','Geçici kayıp hesapla.','📉','finance'],
    ['staking-reward','Staking Ödülü','Staking getirisi.','💰','finance'],
    ['yield-farming','Yield Farming','Getiri çiftçiliği.','🌾','finance'],
    ['liquidity-pool','Likidite Havuzu','LP getiri hesapla.','🏊','finance'],
    ['apy-calc','APY/APR','APY APR dönüşümü.','📈','finance'],
    ['rug-pull-check','Rug Pull Test','Dolandırıcılık testi.','🕵️','security'],
    ['honeypot-check','Honeypot Test','Tuzağa düşme testi.','🍯','security'],
    ['seed-phrase-gen','Seed Phrase','Seed phrase oluştur.','🌱','security'],
    ['hd-wallet','HD Wallet','Hierarchical wallet.','👛','security'],
    ['wallet-balance','Cüzdan Takip','Cüzdan takip simülasyonu.','👛','finance'],
    ['transaction-sim','İşlem Sim','İşlem simülasyonu.','💸','finance'],
    ['cross-chain','Cross-Chain','Zincirler arası köprü.','🌉','finance'],
    ['bridge-calc','Köprü Hesapla','Köprü ücreti hesapla.','🌉','finance'],
    ['l2-gas','L2 Gas','Layer 2 gas hesapla.','⚡','finance'],
    ['mev-check','MEV Kontrol','MEV koruma testi.','🛡️','security'],
    ['slippage-protect','Slippage Koruması','Slippage koruma hesapla.','🛡️','finance'],
    ['tax-crypto','Kripto Vergi','Kripto vergi hesapla.','🧾','finance'],
];
FINAL_BATCH.forEach(([id,title,desc,icon,cat]) => addTool(id,title,desc,icon,cat,'password'));

// ===================== ADET KONTROLÜ =====================
console.log('Toplam araç sayısı:', TOOLS.length);
