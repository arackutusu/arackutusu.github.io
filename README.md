# AraçKutusu - Ücretsiz Online Araçlar

10+ kullanışlı online araç içeren, AdSense ile para kazandıracak statik web sitesi.

## İçindeki Araçlar
- Karakter/Kelime Sayacı
- Şifre Oluşturucu
- QR Kod Oluşturucu
- Birim Dönüştürücü
- Metin Dönüştürücü
- Yaş Hesaplayıcı
- Rastgele Sayı Üretici
- JSON Formatlayıcı
- Base64 Dönüştürücü
- Renk Paleti Oluşturucu

## Para Kazanma Yöntemi
1. Google AdSense'e başvur
2. `index.html` içindeki `ad-placeholder` div'lerine AdSense kodlarını yerleştir
3. SEO için meta etiketler hazır (başlık, description, keywords)
4. Trafik çekmek için sosyal medyada ve forumlarda paylaş

## Deploy (Ücretsiz)

### GitHub Pages
```bash
git init
git add .
git commit -m "ilk commit"
# GitHub'da repo oluştur, sonra:
git remote add origin https://github.com/kullanici/repo-adi.git
git branch -M main
git push -u origin main
# Settings > Pages > Branch: main > / (root) > Kaydet
# https://kullanici.github.io/repo-adi/ adresinde yayında
```

### Vercel (Önerilen)
```bash
# vercel.com'a git, GitHub ile bağlan, repo'yu seç, deploy et
```

### Netlify
```bash
# netlify.com'a git, repo'yu bağla veya manuel yükle
```

## Dosya Yapısı
```
├── index.html   # Ana sayfa
├── style.css    # Stil dosyası
├── script.js    # Tüm araçların JS kodları
└── README.md    # Bu dosya
```

## Lisans
MIT
