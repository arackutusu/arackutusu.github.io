const tools = [
    { id: 'word-counter', icon: '&#128221;', title: 'Karakter Sayacı', desc: 'Kelime, karakter, cümle sayısını hesapla.', render: renderWordCounter },
    { id: 'password', icon: '&#128274;', title: 'Şifre Oluşturucu', desc: 'Güçlü ve rastgele şifreler oluştur.', render: renderPassword },
    { id: 'qr', icon: '&#128247;', title: 'QR Kod Oluşturucu', desc: 'Metin veya linkten QR kod oluştur.', render: renderQR },
    { id: 'converter', icon: '&#8646;', title: 'Birim Dönüştürücü', desc: 'Uzunluk, ağırlık, sıcaklık birimlerini çevir.', render: renderConverter },
    { id: 'text-case', icon: '&#9000;', title: 'Metin Dönüştürücü', desc: 'Metni büyük/küçük harf, başlık formatına çevir.', render: renderTextCase },
    { id: 'age', icon: '&#127873;', title: 'Yaş Hesaplayıcı', desc: 'Doğum tarihine göre tam yaşını hesapla.', render: renderAge },
    { id: 'random', icon: '&#127922;', title: 'Rastgele Sayı', desc: 'Belirlediğin aralıkta rastgele sayı üret.', render: renderRandom },
    { id: 'json', icon: '&#123;&#125;', title: 'JSON Formatlayıcı', desc: 'JSON verisini düzenle ve doğrula.', render: renderJson },
    { id: 'base64', icon: '&#128289;', title: 'Base64 Dönüştürücü', desc: 'Metin ile Base64 arasında dönüşüm yap.', render: renderBase64 },
    { id: 'color', icon: '&#127912;', title: 'Renk Paleti', desc: 'Rastgele renk paletleri oluştur.', render: renderColor },
];

let activeTool = null;

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.body.classList.add('dark');
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    renderGrid();
});

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function renderGrid() {
    const grid = document.getElementById('toolsGrid');
    grid.innerHTML = tools.map(t => `
        <div class="tool-card" data-id="${t.id}">
            <div class="icon">${t.icon}</div>
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
        </div>
    `).join('');
    grid.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => openTool(card.dataset.id));
    });
}

function openTool(id) {
    activeTool = id;
    document.getElementById('toolsGrid').style.display = 'none';
    document.getElementById('adTop').style.display = 'none';
    document.getElementById('adBottom').style.display = 'none';
    const detail = document.getElementById('toolDetail');
    detail.style.display = 'block';
    const tool = tools.find(t => t.id === id);
    document.getElementById('toolContent').innerHTML = `
        <div class="tool-header">
            <h2>${tool.icon} ${tool.title}</h2>
            <p>${tool.desc}</p>
        </div>
        <div class="tool-body" id="toolBody"></div>
    `;
    tool.render();
    detail.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('backBtn').addEventListener('click', closeTool);
}

function closeTool() {
    activeTool = null;
    document.getElementById('toolsGrid').style.display = 'grid';
    document.getElementById('adTop').style.display = 'block';
    document.getElementById('adBottom').style.display = 'block';
    document.getElementById('toolDetail').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Tool: Word Counter ---
function renderWordCounter() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="form-group">
            <label>Metninizi girin</label>
            <textarea id="wcInput" placeholder="Metninizi buraya yapıştırın..." oninput="updateWordCount()"></textarea>
        </div>
        <div class="flex-row">
            <div class="result-box" style="flex:1"><span class="result-label">Karakter:</span> <span id="wcChars">0</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">Kelime:</span> <span id="wcWords">0</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">Satır:</span> <span id="wcLines">0</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">Cümle:</span> <span id="wcSentences">0</span></div>
        </div>
    `;
    window.updateWordCount = function() {
        const t = document.getElementById('wcInput').value || '';
        document.getElementById('wcChars').textContent = t.length;
        document.getElementById('wcWords').textContent = t.trim() ? t.trim().split(/\s+/).length : 0;
        document.getElementById('wcLines').textContent = t ? t.split('\n').length : 0;
        document.getElementById('wcSentences').textContent = t ? (t.match(/[.!?]+/g) || []).length : 0;
    };
}

// --- Tool: Password Generator ---
function renderPassword() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="flex-row">
            <div class="form-group">
                <label>Uzunluk</label>
                <input type="number" id="pwLen" value="16" min="4" max="128">
            </div>
            <div class="form-group">
                <label>Büyük Harf</label>
                <select id="pwUpper"><option value="1">Evet</option><option value="0">Hayır</option></select>
            </div>
            <div class="form-group">
                <label>Rakam</label>
                <select id="pwDigit"><option value="1">Evet</option><option value="0">Hayır</option></select>
            </div>
            <div class="form-group">
                <label>Sembol</label>
                <select id="pwSym"><option value="1">Evet</option><option value="0">Hayır</option></select>
            </div>
        </div>
        <button class="btn" onclick="generatePassword()">Şifre Oluştur</button>
        <div class="result-box" id="pwResult">
            <span class="result-label">Şifreniz:</span>
            <span id="pwOutput" style="font-family:monospace;font-size:1.1rem"></span>
            <button class="btn copy-btn" onclick="copyPassword()">Kopyala</button>
        </div>
    `;
    window.generatePassword = function() {
        const len = +document.getElementById('pwLen').value || 16;
        const upper = document.getElementById('pwUpper').value === '1';
        const digit = document.getElementById('pwDigit').value === '1';
        const sym = document.getElementById('pwSym').value === '1';
        let chars = 'abcdefghijklmnopqrstuvwxyz';
        if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (digit) chars += '0123456789';
        if (sym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        if (!chars) { document.getElementById('pwOutput').textContent = 'En az bir seçenek işaretleyin'; return; }
        let pw = '';
        for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)];
        document.getElementById('pwOutput').textContent = pw;
    };
    window.copyPassword = function() {
        const pw = document.getElementById('pwOutput').textContent;
        if (pw) navigator.clipboard.writeText(pw);
    };
    generatePassword();
}

// --- Tool: QR Code Generator ---
function renderQR() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="form-group">
            <label>Metin veya URL</label>
            <input type="text" id="qrInput" placeholder="https://ornek.com" value="https://ornek.com">
        </div>
        <button class="btn" onclick="generateQR()">QR Kod Oluştur</button>
        <div id="qrContainer" style="margin-top:16px;text-align:center;min-height:200px;display:flex;align-items:center;justify-content:center"></div>
    `;
    window.generateQR = function() {
        const val = document.getElementById('qrInput').value.trim();
        if (!val) return;
        const c = document.getElementById('qrContainer');
        c.innerHTML = '<div style="color:var(--text2)">Oluşturuluyor...</div>';
        setTimeout(() => {
            c.innerHTML = '';
            new QRCode(c, { text: val, width: 200, height: 200, colorDark: getComputedStyle(document.body).getPropertyValue('--text').trim(), colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
        }, 100);
    };
    generateQR();
}

// --- Tool: Unit Converter ---
function renderConverter() {
    const body = document.getElementById('toolBody');
    const conversions = {
        uzunluk: { units: ['Metre', 'Kilometre', 'Mil', 'Foot', 'İnç', 'Santimetre'], factor: [1, 1000, 1609.344, 0.3048, 0.0254, 0.01] },
        agirlik: { units: ['Kilogram', 'Gram', 'Pound', 'Ons', 'Ton'], factor: [1, 0.001, 0.453592, 0.0283495, 1000] },
        sicaklik: { units: ['Celsius', 'Fahrenheit', 'Kelvin'], factor: null },
    };
    body.innerHTML = `
        <div class="form-group">
            <label>Kategori</label>
            <select id="convCat" onchange="renderConvFields()">
                <option value="uzunluk">Uzunluk</option>
                <option value="agirlik">Ağırlık</option>
                <option value="sicaklik">Sıcaklık</option>
            </select>
        </div>
        <div id="convFields"></div>
        <div class="result-box" id="convResult"><span class="result-label">Sonuç:</span> <span id="convOutput">-</span></div>
    `;
    window.renderConvFields = function() {
        const cat = document.getElementById('convCat').value;
        const data = conversions[cat];
        const f = document.getElementById('convFields');
        f.innerHTML = `
            <div class="flex-row">
                <div class="form-group">
                    <label>Değer</label>
                    <input type="number" id="convVal" value="1" oninput="convertUnit()">
                </div>
                <div class="form-group">
                    <label>Kaynak</label>
                    <select id="convFrom" onchange="convertUnit()">${data.units.map((u,i) => `<option value="${i}">${u}</option>`).join('')}</select>
                </div>
                <div class="form-group">
                    <label>Hedef</label>
                    <select id="convTo" onchange="convertUnit()">${data.units.map((u,i) => `<option value="${i}">${u}</option>`).join('')}</select>
                </div>
            </div>
        `;
        convertUnit();
    };
    window.convertUnit = function() {
        const cat = document.getElementById('convCat').value;
        const data = conversions[cat];
        const val = +document.getElementById('convVal').value || 0;
        const from = +document.getElementById('convFrom').value;
        const to = +document.getElementById('convTo').value;
        let result;
        if (cat === 'sicaklik') {
            const toC = [v => v, v => (v - 32) * 5/9, v => v - 273.15];
            const fromC = [v => v, v => v * 9/5 + 32, v => v + 273.15];
            const c = toC[from](val);
            result = fromC[to](c);
        } else {
            result = val * data.factor[from] / data.factor[to];
        }
        document.getElementById('convOutput').textContent = result.toLocaleString(undefined, { maximumFractionDigits: 6 });
    };
    renderConvFields();
}

// --- Tool: Text Case Converter ---
function renderTextCase() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="form-group">
            <label>Metin</label>
            <textarea id="tcInput" placeholder="Metninizi yazın..." oninput="convertCase()"></textarea>
        </div>
        <div class="flex-row">
            <button class="btn" onclick="setCase('upper')">BÜYÜK HARF</button>
            <button class="btn" onclick="setCase('lower')">küçük harf</button>
            <button class="btn" onclick="setCase('title')">Başlık Gibi</button>
            <button class="btn" onclick="setCase('camel')">camelCase</button>
            <button class="btn" onclick="setCase('toggle')">tOGGLE cASE</button>
        </div>
        <div class="result-box"><span class="result-label">Çıktı:</span><div id="tcOutput" style="margin-top:6px"></div></div>
        <button class="btn copy-btn" onclick="copyTC()">Kopyala</button>
    `;
    window.convertCase = function() {
        const t = document.getElementById('tcInput').value || '';
        document.getElementById('tcOutput').textContent = t;
    };
    window.setCase = function(type) {
        const t = document.getElementById('tcInput').value || '';
        let r;
        switch(type) {
            case 'upper': r = t.toUpperCase(); break;
            case 'lower': r = t.toLowerCase(); break;
            case 'title': r = t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); break;
            case 'camel': r = t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break;
            case 'toggle': r = [...t].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
        }
        document.getElementById('tcOutput').textContent = r;
    };
    window.copyTC = function() {
        const t = document.getElementById('tcOutput').textContent;
        if (t) navigator.clipboard.writeText(t);
    };
}

// --- Tool: Age Calculator ---
function renderAge() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="form-group">
            <label>Doğum Tarihi</label>
            <input type="date" id="ageInput" onchange="calculateAge()">
        </div>
        <button class="btn" onclick="calculateAge()">Hesapla</button>
        <div class="flex-row">
            <div class="result-box" style="flex:1"><span class="result-label">Yaş (yıl):</span> <span id="ageYears">-</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">Ay:</span> <span id="ageMonths">-</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">Gün:</span> <span id="ageDays">-</span></div>
        </div>
        <div class="result-box"><span class="result-label">Toplam gün:</span> <span id="ageTotalDays">-</span></div>
    `;
    window.calculateAge = function() {
        const val = document.getElementById('ageInput').value;
        if (!val) return;
        const birth = new Date(val);
        const now = new Date();
        let y = now.getFullYear() - birth.getFullYear();
        let m = now.getMonth() - birth.getMonth();
        let d = now.getDate() - birth.getDate();
        if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        document.getElementById('ageYears').textContent = y;
        document.getElementById('ageMonths').textContent = m;
        document.getElementById('ageDays').textContent = d;
        document.getElementById('ageTotalDays').textContent = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
    };
    document.getElementById('ageInput').valueAsDate = new Date('2000-01-01');
    calculateAge();
}

// --- Tool: Random Number ---
function renderRandom() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="flex-row">
            <div class="form-group">
                <label>Minimum</label>
                <input type="number" id="randMin" value="1">
            </div>
            <div class="form-group">
                <label>Maksimum</label>
                <input type="number" id="randMax" value="100">
            </div>
            <div class="form-group">
                <label>Adet</label>
                <input type="number" id="randCount" value="1" min="1" max="50">
            </div>
        </div>
        <button class="btn" onclick="generateRandom()">Rastgele Üret</button>
        <div class="result-box" id="randResult"><span class="result-label">Sayı(lar):</span> <span id="randOutput">-</span></div>
    `;
    window.generateRandom = function() {
        const min = +document.getElementById('randMin').value || 0;
        const max = +document.getElementById('randMax').value || 100;
        const count = Math.min(+document.getElementById('randCount').value || 1, 50);
        if (min > max) { document.getElementById('randOutput').textContent = 'Min, Max\'dan büyük olamaz'; return; }
        const nums = [];
        for (let i = 0; i < count; i++) nums.push(Math.floor(Math.random() * (max - min + 1)) + min);
        document.getElementById('randOutput').textContent = nums.join(', ');
    };
}

// --- Tool: JSON Formatter ---
function renderJson() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="form-group">
            <label>JSON Verisi</label>
            <textarea id="jsonInput" placeholder='{"ornek": "deger"}' oninput="formatJSON()" style="font-family:monospace"></textarea>
        </div>
        <div class="flex-row">
            <button class="btn" onclick="formatJSON()">Formatla</button>
            <button class="btn btn-outline" onclick="compressJSON()">Sıkıştır</button>
            <button class="btn btn-outline" onclick="validateJSON()">Doğrula</button>
            <button class="btn copy-btn" onclick="copyJSON()">Kopyala</button>
        </div>
        <div class="result-box"><span class="result-label">Çıktı:</span><pre id="jsonOutput" style="margin-top:6px;white-space:pre-wrap;font-family:monospace;font-size:.85rem"></pre></div>
    `;
    window.formatJSON = function() {
        try { const p = JSON.parse(document.getElementById('jsonInput').value || '{}'); document.getElementById('jsonOutput').textContent = JSON.stringify(p, null, 2); } catch(e) { document.getElementById('jsonOutput').textContent = 'Hatalı JSON: ' + e.message; }
    };
    window.compressJSON = function() {
        try { const p = JSON.parse(document.getElementById('jsonInput').value || '{}'); document.getElementById('jsonOutput').textContent = JSON.stringify(p); } catch(e) { document.getElementById('jsonOutput').textContent = 'Hatalı JSON'; }
    };
    window.validateJSON = function() {
        try { JSON.parse(document.getElementById('jsonInput').value || '{}'); document.getElementById('jsonOutput').textContent = 'JSON geçerli ✓'; } catch(e) { document.getElementById('jsonOutput').textContent = 'Hatalı JSON: ' + e.message; }
    };
    window.copyJSON = function() {
        const t = document.getElementById('jsonOutput').textContent;
        if (t) navigator.clipboard.writeText(t);
    };
}

// --- Tool: Base64 ---
function renderBase64() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="form-group">
            <label>Metin</label>
            <textarea id="b64Input" placeholder="Metin veya Base64 girin..." oninput="autoBase64()"></textarea>
        </div>
        <div class="flex-row">
            <button class="btn" onclick="encodeBase64()">Metin → Base64</button>
            <button class="btn btn-outline" onclick="decodeBase64()">Base64 → Metin</button>
            <button class="btn copy-btn" onclick="copyB64()">Kopyala</button>
        </div>
        <div class="result-box"><span class="result-label">Çıktı:</span><div id="b64Output" style="margin-top:6px;word-break:break-all"></div></div>
    `;
    window.encodeBase64 = function() {
        try { document.getElementById('b64Output').textContent = btoa(document.getElementById('b64Input').value || ''); } catch(e) { document.getElementById('b64Output').textContent = 'Hata: ' + e.message; }
    };
    window.decodeBase64 = function() {
        try { document.getElementById('b64Output').textContent = atob(document.getElementById('b64Input').value || ''); } catch(e) { document.getElementById('b64Output').textContent = 'Geçersiz Base64: ' + e.message; }
    };
    window.autoBase64 = function() { };
    window.copyB64 = function() {
        const t = document.getElementById('b64Output').textContent;
        if (t) navigator.clipboard.writeText(t);
    };
}

// --- Tool: Color Palette ---
function renderColor() {
    const body = document.getElementById('toolBody');
    body.innerHTML = `
        <div class="flex-row">
            <div class="form-group">
                <label>Renk Sayısı</label>
                <input type="number" id="colorCount" value="5" min="1" max="20">
            </div>
        </div>
        <button class="btn" onclick="generatePalette()">Palet Oluştur</button>
        <div id="paletteContainer" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;min-height:80px"></div>
    `;
    window.generatePalette = function() {
        const count = Math.min(+document.getElementById('colorCount').value || 5, 20);
        const c = document.getElementById('paletteContainer');
        c.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const hex = '#' + [...Array(6)].map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
            const div = document.createElement('div');
            div.style.cssText = `background:${hex};width:100px;height:100px;border-radius:10px;display:flex;align-items:end;justify-content:center;padding:8px;font-size:.75rem;font-weight:600;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.5);cursor:pointer`;
            div.textContent = hex;
            div.onclick = () => navigator.clipboard.writeText(hex);
            div.title = 'Kopyalamak için tıkla';
            c.appendChild(div);
        }
    };
    generatePalette();
}
