let activeTool = null;
let activeCat = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.body.classList.add('dark');
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    renderCategories();
    renderGrid();
});

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function renderCategories() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = CATEGORIES.map(c => `<button class="cat-btn${c.id === 'all' ? ' active' : ''}" data-cat="${c.id}">${c.icon} ${c.label}</button>`).join('');
    container.querySelectorAll('.cat-btn').forEach(btn => btn.addEventListener('click', () => {
        container.querySelector('.active')?.classList.remove('active');
        btn.classList.add('active');
        activeCat = btn.dataset.cat;
        filterTools();
    }));
}

function filterTools() {
    const q = (document.getElementById('searchInput').value || '').toLowerCase().trim();
    const filtered = TOOLS.filter(t => {
        if (activeCat !== 'all' && t.cat !== activeCat) return false;
        if (q && !t.title.toLowerCase().includes(q) && !t.desc.toLowerCase().includes(q)) return false;
        return true;
    });
    renderGrid(filtered);
}

function renderGrid(filtered) {
    const grid = document.getElementById('toolsGrid');
    const items = filtered || TOOLS;
    document.getElementById('toolCount').textContent = `${items.length} araç bulundu`;
    grid.innerHTML = items.map(t => `
        <div class="tool-card" data-id="${t.id}">
            <div class="icon">${t.icon}</div>
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <span class="cat-badge">${CATEGORIES.find(c => c.id === t.cat)?.label || t.cat}</span>
        </div>
    `).join('');
    grid.querySelectorAll('.tool-card').forEach(card => card.addEventListener('click', () => openTool(card.dataset.id)));
}

function openTool(id) {
    activeTool = id;
    document.getElementById('toolsGrid').style.display = 'none';
    document.getElementById('toolbar').style.display = 'none';
    document.getElementById('adTop').style.display = 'block';
    document.getElementById('adBottom').style.display = 'block';
    const detail = document.getElementById('toolDetail');
    detail.style.display = 'block';
    const tool = TOOLS.find(t => t.id === id);
    document.getElementById('toolContent').innerHTML = `
        <div class="tool-header">
            <h2>${tool.icon} ${tool.title}</h2>
            <p>${tool.desc}</p>
        </div>
        <div class="ad-placeholder"><div class="ad-label">Reklam</div><div class="ad-content"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7847705061926743" data-ad-slot="5087169124" data-ad-format="autorelaxed" data-full-width-responsive="true"></ins></div></div>
        <div class="tool-body" id="toolBody"></div>
        <div class="ad-placeholder" style="margin-top:20px"><div class="ad-label">Reklam</div><div class="ad-content"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7847705061926743" data-ad-slot="5087169124" data-ad-format="autorelaxed" data-full-width-responsive="true"></ins></div></div>
    `;
    try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
    const renderFn = window[tool.renderer];
    if (typeof renderFn === 'function') renderFn(tool.params);
    else document.getElementById('toolBody').innerHTML = `<div class="result-box">Bu araç hazırlanıyor...</div>`;
    detail.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('backBtn').addEventListener('click', closeTool);
}

function closeTool() {
    activeTool = null;
    document.getElementById('toolsGrid').style.display = 'grid';
    document.getElementById('toolbar').style.display = 'flex';
    document.getElementById('adTop').style.display = 'block';
    document.getElementById('adBottom').style.display = 'block';
    document.getElementById('toolDetail').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function $body() { return document.getElementById('toolBody'); }
function $html(bodyHtml) { $body().innerHTML = bodyHtml; }
function $val(id) { return document.getElementById(id)?.value || ''; }
function $num(id, def) { return +document.getElementById(id)?.value || (def || 0); }
function $txt(id) { const e = document.getElementById(id); return e ? e.value || '' : ''; }
function $set(id, v) { const e = document.getElementById(id); if (e) e.textContent = v; }
function $on(id, evt, fn) { const e = document.getElementById(id); if (e) e.addEventListener(evt, fn); }
function $copy(id) { const t = document.getElementById(id)?.textContent; if (t) navigator.clipboard.writeText(t); }

// ============ CONVERTER ============
function converter(p) {
    if (!p) return;
    const { units, factors, id } = p;
    const isTemp = id === 'temperature';
    $html(`
        <div class="flex-row">
            <div class="form-group"><label>Değer</label><input type="number" id="cvVal" value="1" oninput="cvUpdate()"></div>
            <div class="form-group"><label>Kaynak</label><select id="cvFrom" onchange="cvUpdate()">${units.map((u,i) => `<option value="${i}">${u}</option>`).join('')}</select></div>
            <div class="form-group"><label>Hedef</label><select id="cvTo" onchange="cvUpdate()">${units.map((u,i) => `<option value="${i}">${u}</option>`).join('')}</select></div>
        </div>
        <div class="result-box"><span class="result-label">Sonuç:</span> <span id="cvOut">-</span></div>
    `);
    window.cvUpdate = function() {
        const v = $num('cvVal', 1);
        const from = $num('cvFrom');
        const to = $num('cvTo');
        let r;
        if (isTemp) {
            const toC = [x => x, x => (x - 32) * 5/9, x => x - 273.15];
            const fromC = [x => x, x => x * 9/5 + 32, x => x + 273.15];
            r = fromC[to](toC[from](v));
        } else {
            r = v * factors[from] / factors[to];
        }
        $set('cvOut', r.toLocaleString(undefined, { maximumFractionDigits: 8 }));
    };
    cvUpdate();
}

function pairConverter(p) {
    if (!p) return;
    const { from, to, units, factors } = p;
    const fi = units.indexOf(from);
    const ti = units.indexOf(to);
    $html(`
        <div class="form-group"><label>${from}</label><input type="number" id="pcVal" value="1" oninput="pcUpdate()"></div>
        <div class="result-box"><span class="result-label">${to}:</span> <span id="pcOut">-</span></div>
    `);
    window.pcUpdate = function() {
        const v = $num('pcVal', 1);
        $set('pcOut', (v * factors[fi] / factors[ti]).toLocaleString(undefined, { maximumFractionDigits: 8 }));
    };
    pcUpdate();
}

function simpleConv(p) {
    if (!p) return;
    const { label, fromLabel, toLabel, fn, fnInv } = p;
    $html(`
        <div class="form-group"><label>${label}</label><input type="number" id="scVal" value="1" oninput="scUpdate()"></div>
        <div class="flex-row">
            <div class="result-box" style="flex:1"><span class="result-label">${fromLabel}:</span> <span id="scFrom">-</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">${toLabel}:</span> <span id="scTo">-</span></div>
        </div>
    `);
    window.scUpdate = function() {
        const v = $num('scVal', 1);
        $set('scFrom', fn(v).toLocaleString(undefined, { maximumFractionDigits: 6 }));
        $set('scTo', fnInv ? fnInv(v).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '-');
    };
    scUpdate();
}

// ============ CALC ============
function formulaCalc(p) {
    if (!p) return;
    const { title, fields, calc, unit } = p;
    $html(`
        ${fields.map(f => `<div class="form-group"><label>${f.label}</label><input type="number" id="fc_${f.id}" value="${f.default||''}" oninput="fcUpdate()"></div>`).join('')}
        <div class="result-box"><span class="result-label">${title}:</span> <span id="fcOut">-</span> ${unit||''}</div>
    `);
    window.fcUpdate = function() {
        const vals = {};
        fields.forEach(f => vals[f.id] = $num('fc_' + f.id, 0));
        $set('fcOut', calc(vals).toLocaleString(undefined, { maximumFractionDigits: 6 }));
    };
    fcUpdate();
}

// ============ BMI ============
function bmi() {
    $html(`
        <div class="flex-row">
            <div class="form-group"><label>Boy (cm)</label><input type="number" id="bmiH" value="175" oninput="bmiCalc()"></div>
            <div class="form-group"><label>Kilo (kg)</label><input type="number" id="bmiW" value="70" oninput="bmiCalc()"></div>
        </div>
        <div class="result-box"><span class="result-label">BMI:</span> <span id="bmiOut">-</span></div>
        <div class="result-box"><span class="result-label">Kategori:</span> <span id="bmiCat">-</span></div>
    `);
    window.bmiCalc = function() {
        const h = $num('bmiH', 175) / 100;
        const w = $num('bmiW', 70);
        const b = w / (h * h);
        $set('bmiOut', b.toFixed(1));
        const cats = [{max:18.4,label:'Zayıf'},{max:24.9,label:'Normal'},{max:29.9,label:'Fazla Kilolu'},{max:34.9,label:'Obez I'},{max:39.9,label:'Obez II'},{max:999,label:'Obez III'}];
        $set('bmiCat', cats.find(c => b <= c.max)?.label || '-');
    };
    bmiCalc();
}

// ============ AGE ============
function ageCalc() {
    $html(`
        <div class="form-group"><label>Doğum Tarihi</label><input type="date" id="ageInp" onchange="ageDo()"></div>
        <button class="btn" onclick="ageDo()">Hesapla</button>
        <div class="flex-row">
            <div class="result-box" style="flex:1"><span class="result-label">Yaş:</span> <span id="ageY">-</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">Ay:</span> <span id="ageM">-</span></div>
            <div class="result-box" style="flex:1"><span class="result-label">Gün:</span> <span id="ageD">-</span></div>
        </div>
        <div class="result-box"><span class="result-label">Toplam gün:</span> <span id="ageTotal">-</span></div>
    `);
    document.getElementById('ageInp').valueAsDate = new Date('2000-01-01');
    window.ageDo = function() {
        const v = $val('ageInp'); if (!v) return;
        const b = new Date(v), n = new Date();
        let y = n.getFullYear() - b.getFullYear(), m = n.getMonth() - b.getMonth(), d = n.getDate() - b.getDate();
        if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        $set('ageY', y); $set('ageM', m); $set('ageD', d);
        $set('ageTotal', Math.floor((n - b) / 86400000));
    };
    ageDo();
}

// ============ PASSWORD ============
function password(p) {
    const defs = p || {};
    $html(`
        <div class="flex-row">
            <div class="form-group"><label>Uzunluk</label><input type="number" id="pwLen" value="${defs.len||16}" min="4" max="128"></div>
            <div class="form-group"><label>Büyük Harf</label><select id="pwUp"><option value="1" ${defs.upper!==false?'selected':''}>Evet</option><option value="0">Hayır</option></select></div>
            <div class="form-group"><label>Rakam</label><select id="pwDig"><option value="1" ${defs.digit!==false?'selected':''}>Evet</option><option value="0">Hayır</option></select></div>
            <div class="form-group"><label>Sembol</label><select id="pwSym"><option value="1" ${defs.sym?'selected':''}>Evet</option><option value="0">Hayır</option></select></div>
        </div>
        <button class="btn" onclick="pwGen()">Oluştur</button>
        <div class="result-box"><span class="result-label">Şifre:</span> <span id="pwOut" style="font-family:monospace;font-size:1.1rem"></span> <button class="btn copy-btn" onclick="pwCopy()">Kopyala</button></div>
    `);
    window.pwGen = function() {
        const len = $num('pwLen', 16);
        const up = $val('pwUp') === '1';
        const dig = $val('pwDig') === '1';
        const sym = $val('pwSym') === '1';
        let chars = 'abcdefghijklmnopqrstuvwxyz';
        if (up) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (dig) chars += '0123456789';
        if (sym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        if (!chars) { $set('pwOut', 'En az bir seçenek seçin'); return; }
        let pw = '';
        for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)];
        $set('pwOut', pw);
    };
    window.pwCopy = () => { const t = document.getElementById('pwOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
    pwGen();
}

function passwordPreset(p) {
    password(p);
}

// ============ WORD COUNTER ============
function wordCounter() {
    $html(`
        <div class="form-group"><label>Metin</label><textarea id="wcInp" placeholder="Metninizi yapıştırın..." oninput="wcDo()"></textarea></div>
        <div class="mini-grid">
            <div class="result-box"><span class="result-label">Karakter:</span> <span id="wcChars">0</span></div>
            <div class="result-box"><span class="result-label">Kelime:</span> <span id="wcWords">0</span></div>
            <div class="result-box"><span class="result-label">Satır:</span> <span id="wcLines">0</span></div>
            <div class="result-box"><span class="result-label">Cümle:</span> <span id="wcSent">0</span></div>
        </div>
    `);
    window.wcDo = function() {
        const t = $txt('wcInp');
        $set('wcChars', t.length);
        $set('wcWords', t.trim() ? t.trim().split(/\s+/).length : 0);
        $set('wcLines', t ? t.split('\n').length : 0);
        $set('wcSent', t ? (t.match(/[.!?]+/g) || []).length : 0);
    };
}

// ============ TEXT CASE ============
function textCase(p) {
    const type = p?.type || 'upper';
    $html(`
        <div class="form-group"><label>Metin</label><textarea id="tcInp" placeholder="Metninizi yazın..." oninput="tcDo()"></textarea></div>
        <button class="btn" onclick="tcDo()">Dönüştür</button>
        <div class="result-box"><span class="result-label">Çıktı:</span><div id="tcOut" style="margin-top:6px"></div></div>
        <button class="btn copy-btn" onclick="tcCopy()">Kopyala</button>
    `);
    window.tcDo = function() {
        const t = $txt('tcInp');
        const cases = {
            upper: t.toUpperCase(), lower: t.toLowerCase(),
            title: t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
            camel: t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
            pascal: (t.match(/[a-zA-Z0-9]+/g)||[]).map(w => w[0].toUpperCase()+w.slice(1).toLowerCase()).join(''),
            snake: t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, ''),
            kebab: t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, ''),
            constant: t.toUpperCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, ''),
            dot: t.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '.').replace(/^\.|\.$/g, ''),
            toggle: [...t].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
            alternating: [...t].map((c,i) => i%2===0 ? c.toLowerCase() : c.toUpperCase()).join(''),
            inverse: [...t].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
            sentence: t.replace(/(^\w|\.\s+\w)/g, c => c.toUpperCase()),
            slugify: t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        };
        $set('tcOut', cases[type] || t);
    };
    window.tcCopy = () => { const t = document.getElementById('tcOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}

// ============ TEXT TRANSFORM ============
function textTransform(p) {
    const type = p?.type || 'reverse';
    const needNum = ['repeat','truncate','wrap','prefix','suffix'].includes(type);
    const need2 = ['prefix','suffix'].includes(type);
    $html(`
        <div class="form-group"><label>Metin</label><textarea id="ttInp" placeholder="Metninizi yazın..."></textarea></div>
        ${needNum ? `<div class="form-group"><label>${need2 ? 'Metin' : 'Değer'}</label><input type="${need2?'text':'number'}" id="ttVal" value="${need2?'':10}"></div>` : ''}
        <button class="btn" onclick="ttDo()">Dönüştür</button>
        <div class="result-box"><span class="result-label">Çıktı:</span><div id="ttOut" style="margin-top:6px"></div></div>
        <button class="btn copy-btn" onclick="ttCopy()">Kopyala</button>
    `);
    window.ttDo = function() {
        let t = $txt('ttInp');
        const v = $val('ttVal');
        const lines = t.split('\n');
        const ops = {
            reverse: () => [...t].reverse().join(''),
            repeat: () => Array($num('ttVal',2)).fill(t).join(''),
            sortAsc: () => lines.sort().join('\n'),
            sortDesc: () => lines.sort().reverse().join('\n'),
            shuffle: () => lines.sort(() => Math.random() - 0.5).join('\n'),
            removeDupes: () => [...new Set(lines)].join('\n'),
            removeEmpty: () => lines.filter(l => l.trim()).join('\n'),
            trim: () => t.trim(),
            prefix: () => lines.map(l => v + l).join('\n'),
            suffix: () => lines.map(l => l + v).join('\n'),
            truncate: () => t.slice(0, $num('ttVal',100)),
            wrap: () => { const w = $num('ttVal',80); const r=[]; for(let i=0;i<t.length;i+=w) r.push(t.slice(i,i+w)); return r.join('\n'); },
            center: () => { const m = Math.max(...lines.map(l=>l.length)); return lines.map(l => l.padStart((m+l.length)/2).padEnd(m)).join('\n'); },
            numberLines: () => lines.map((l,i) => `${i+1}. ${l}`).join('\n'),
        };
        $set('ttOut', (ops[type] || (()=>t))());
    };
    window.ttCopy = () => { const t = document.getElementById('ttOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}

// ============ JSON FORMATTER ============
function jsonFormatter() {
    $html(`
        <div class="form-group"><label>JSON</label><textarea id="jsInp" placeholder='{"ornek": "deger"}' style="font-family:monospace"></textarea></div>
        <div class="flex-row"><button class="btn" onclick="jsFormat()">Formatla</button><button class="btn btn-outline" onclick="jsMinify()">Sıkıştır</button><button class="btn btn-outline" onclick="jsValid()">Doğrula</button><button class="btn copy-btn" onclick="jsCopy()">Kopyala</button></div>
        <div class="result-box"><pre id="jsOut" style="margin-top:6px;white-space:pre-wrap;font-family:monospace;font-size:.85rem"></pre></div>
    `);
    window.jsFormat = () => { try { $set('jsOut', JSON.stringify(JSON.parse($txt('jsInp')||'{}'),null,2)); } catch(e) { $set('jsOut','Hata: '+e.message); } };
    window.jsMinify = () => { try { $set('jsOut', JSON.stringify(JSON.parse($txt('jsInp')||'{}'))); } catch(e) { $set('jsOut','Hata: '+e.message); } };
    window.jsValid = () => { try { JSON.parse($txt('jsInp')||'{}'); $set('jsOut','JSON geçerli ✓'); } catch(e) { $set('jsOut','Geçersiz: '+e.message); } };
    window.jsCopy = () => { const t = document.getElementById('jsOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}
function jsonMinify() { jsonFormatter(); }
function jsonValidate() { jsonFormatter(); }

// ============ ENCODERS ============
function base64Encode() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="encInp" placeholder="Metin girin..."></textarea></div>
    <button class="btn" onclick="encDo()">Kodla</button><div class="result-box"><span class="result-label">Çıktı:</span><div id="encOut" style="word-break:break-all;margin-top:4px"></div></div>
    <button class="btn copy-btn" onclick="encCopy()">Kopyala</button>`);
    window.encDo = () => { try { $set('encOut', btoa(unescape(encodeURIComponent($txt('encInp'))))); } catch(e) { $set('encOut', 'Hata'); } };
    window.encCopy = () => { const t = document.getElementById('encOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}
function base64Decode() {
    $html(`<div class="form-group"><label>Base64</label><textarea id="encInp" placeholder="Base64 kod girin..."></textarea></div>
    <button class="btn" onclick="encDo()">Çöz</button><div class="result-box"><span class="result-label">Çıktı:</span><div id="encOut" style="word-break:break-all;margin-top:4px"></div></div>
    <button class="btn copy-btn" onclick="encCopy()">Kopyala</button>`);
    window.encDo = () => { try { $set('encOut', decodeURIComponent(escape(atob($txt('encInp'))))); } catch(e) { $set('encOut', 'Geçersiz Base64'); } };
    window.encCopy = () => { const t = document.getElementById('encOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}
function urlEncode() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="encInp" placeholder="Metin girin..."></textarea></div>
    <button class="btn" onclick="encDo()">Kodla</button><div class="result-box"><span class="result-label">Çıktı:</span><div id="encOut" style="word-break:break-all;margin-top:4px"></div></div>
    <button class="btn copy-btn" onclick="encCopy()">Kopyala</button>`);
    window.encDo = () => { try { $set('encOut', encodeURIComponent($txt('encInp'))); } catch(e) { $set('encOut', 'Hata'); } };
    window.encCopy = () => { const t = document.getElementById('encOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}
function urlDecode() {
    $html(`<div class="form-group"><label>URL Kodlu</label><textarea id="encInp" placeholder="URL kodlu metin girin..."></textarea></div>
    <button class="btn" onclick="encDo()">Çöz</button><div class="result-box"><span class="result-label">Çıktı:</span><div id="encOut" style="word-break:break-all;margin-top:4px"></div></div>
    <button class="btn copy-btn" onclick="encCopy()">Kopyala</button>`);
    window.encDo = () => { try { $set('encOut', decodeURIComponent($txt('encInp'))); } catch(e) { $set('encOut', 'Geçersiz'); } };
    window.encCopy = () => { const t = document.getElementById('encOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}

// ============ QR ============
function qrGen() {
    $html(`
        <div class="form-group"><label>Metin / URL</label><input type="text" id="qrInp" placeholder="https://" value="https://arackutusu.github.io" oninput="qrDo()"></div>
        <button class="btn" onclick="qrDo()">Oluştur</button>
        <div id="qrBox" style="margin-top:16px;text-align:center;min-height:200px;display:flex;align-items:center;justify-content:center"></div>
    `);
    window.qrDo = function() {
        const v = $val('qrInp'); if (!v) return;
        const box = document.getElementById('qrBox');
        box.innerHTML = '<div style="color:var(--text2)">Oluşturuluyor...</div>';
        setTimeout(() => {
            box.innerHTML = '';
            if (typeof QRCode !== 'undefined') {
                new QRCode(box, { text: v, width: 200, height: 200, colorDark: getComputedStyle(document.body).getPropertyValue('--text').trim()||'#000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
            } else {
                box.innerHTML = '<div class="result-box">QR kütüphanesi yüklenemedi</div>';
            }
        }, 100);
    };
    qrDo();
}

// ============ COLOR TOOLS ============
function colorPalette() {
    $html(`
        <div class="form-group"><label>Renk Sayısı</label><input type="number" id="cpCount" value="5" min="1" max="20"></div>
        <button class="btn" onclick="cpDo()">Oluştur</button>
        <div id="cpBox" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;min-height:60px"></div>
    `);
    window.cpDo = function() {
        const c = $num('cpCount',5);
        const box = document.getElementById('cpBox'); box.innerHTML = '';
        for (let i = 0; i < c; i++) {
            const hex = '#' + Array.from({length:6}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
            const el = document.createElement('div');
            el.style.cssText = `background:${hex};width:90px;height:90px;border-radius:10px;display:flex;align-items:end;justify-content:center;padding:6px;font-size:.7rem;font-weight:600;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.5);cursor:pointer`;
            el.textContent = hex;
            el.onclick = () => navigator.clipboard.writeText(hex);
            el.title = 'Kopyala';
            box.appendChild(el);
        }
    };
    cpDo();
}

// ============ HASH ============
function hashGen(p) {
    const algo = p?.algo || 'SHA-256';
    $html(`
        <div class="form-group"><label>Metin</label><textarea id="hashInp" placeholder="Metin girin..." oninput="hashDo()"></textarea></div>
        <div class="result-box"><span class="result-label">${algo}:</span><div id="hashOut" style="margin-top:4px;font-family:monospace;font-size:.8rem;word-break:break-all"></div></div>
        <button class="btn copy-btn" onclick="hashCopy()">Kopyala</button>
    `);
    window.hashDo = async function() {
        const t = $txt('hashInp');
        if (!t) { $set('hashOut', ''); return; }
        try {
            const buf = new TextEncoder().encode(t);
            const hash = await crypto.subtle.digest(algo, buf);
            const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
            $set('hashOut', hex);
        } catch(e) { $set('hashOut', 'Hata: ' + e.message); }
    };
    window.hashCopy = () => { const t = document.getElementById('hashOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
    hashDo();
}

// ============ PERCENTAGE ============
function percentage() {
    $html(`<div class="flex-row"><div class="form-group"><label>Sayı</label><input type="number" id="pNum" value="200" oninput="pDo()"></div><div class="form-group"><label>Yüzde</label><input type="number" id="pPct" value="15" oninput="pDo()"></div></div><div class="result-box"><span class="result-label">Sonuç:</span> <span id="pOut">30</span></div>`);
    window.pDo = () => $set('pOut', ($num('pNum') * $num('pPct') / 100).toFixed(2));
    pDo();
}
function percentChange() {
    $html(`<div class="flex-row"><div class="form-group"><label>Eski Değer</label><input type="number" id="pOld" value="100" oninput="pDo()"></div><div class="form-group"><label>Yeni Değer</label><input type="number" id="pNew" value="150" oninput="pDo()"></div></div><div class="result-box"><span class="result-label">Değişim:</span> <span id="pOut">%50</span></div>`);
    window.pDo = () => { const o=$num('pOld'), n=$num('pNew'); $set('pOut', '%' + ((n-o)/o*100).toFixed(2)); };
    pDo();
}
function discount() {
    $html(`<div class="flex-row"><div class="form-group"><label>Fiyat</label><input type="number" id="pPrice" value="100" oninput="pDo()"></div><div class="form-group"><label>İndirim %</label><input type="number" id="pDisc" value="20" oninput="pDo()"></div></div><div class="result-box"><span class="result-label">İndirimli Fiyat:</span> <span id="pOut">80.00</span></div>`);
    window.pDo = () => { const p=$num('pPrice'), d=$num('pDisc'); $set('pOut', (p-p*d/100).toFixed(2)); };
    pDo();
}
function tip() {
    $html(`<div class="flex-row"><div class="form-group"><label>Hesap</label><input type="number" id="pAmt" value="200" oninput="pDo()"></div><div class="form-group"><label>Bahşiş %</label><input type="number" id="pPct" value="10" oninput="pDo()"></div></div><div class="result-box"><span class="result-label">Bahşiş:</span> <span id="pOut">20.00</span></div>`);
    window.pDo = () => { $set('pOut', ($num('pAmt')*$num('pPct')/100).toFixed(2)); };
    pDo();
}

// ============ LOAN ============
function loan() {
    $html(`<div class="flex-row"><div class="form-group"><label>Tutar</label><input type="number" id="lnAmt" value="100000" oninput="lnDo()"></div><div class="form-group"><label>Faiz % (yıllık)</label><input type="number" id="lnRate" value="12" oninput="lnDo()"></div><div class="form-group"><label>Vade (ay)</label><input type="number" id="lnTerm" value="60" oninput="lnDo()"></div></div><div class="result-box"><span class="result-label">Aylık Ödeme:</span> <span id="lnOut">-</span></div>`);
    window.lnDo = function() {
        const p=$num('lnAmt'), r=$num('lnRate')/100/12, n=$num('lnTerm');
        $set('lnOut', r ? (p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)).toFixed(2) : (p/n).toFixed(2));
    };
    lnDo();
}

// ============ DICE / COIN ============
function dice() {
    $html(`<div class="result-box" style="text-align:center;font-size:3rem;padding:30px"><span id="diceFace">⚀</span></div><button class="btn" onclick="diceRoll()">Zar At</button>`);
    window.diceRoll = () => { const faces = ['⚀','⚁','⚂','⚃','⚄','⚅']; document.getElementById('diceFace').textContent = faces[Math.floor(Math.random()*6)]; };
    diceRoll();
}
function coinFlip() {
    $html(`<div class="result-box" style="text-align:center;font-size:3rem;padding:30px"><span id="coinFace">🪙</span></div><button class="btn" onclick="coinDo()">At</button>`);
    window.coinDo = () => document.getElementById('coinFace').textContent = Math.random() < 0.5 ? 'Yazı' : 'Tura';
}

// ============ RANDOM NUMBER ============
function randomNumber() {
    $html(`<div class="flex-row"><div class="form-group"><label>Min</label><input type="number" id="rnMin" value="1"></div><div class="form-group"><label>Max</label><input type="number" id="rnMax" value="100"></div><div class="form-group"><label>Adet</label><input type="number" id="rnCnt" value="1" min="1" max="100"></div></div><button class="btn" onclick="rnDo()">Üret</button><div class="result-box"><span class="result-label">Sayı(lar):</span> <span id="rnOut">-</span></div>`);
    window.rnDo = function() {
        const min=$num('rnMin'), max=$num('rnMax'), cnt=Math.min($num('rnCnt',1),100);
        if (min > max) { $set('rnOut', 'Min > max olamaz'); return; }
        $set('rnOut', Array.from({length:cnt}, () => Math.floor(Math.random()*(max-min+1))+min).join(', '));
    };
}

// ============ STATISTICS ============
function statistics() {
    $html(`<div class="form-group"><label>Sayılar (virgülle ayırın)</label><input type="text" id="stInp" value="1,2,3,4,5,6,7,8,9,10" oninput="stDo()"></div>
    <div class="mini-grid">
        <div class="result-box"><span class="result-label">Ortalama:</span> <span id="stMean">-</span></div>
        <div class="result-box"><span class="result-label">Medyan:</span> <span id="stMed">-</span></div>
        <div class="result-box"><span class="result-label">Mod:</span> <span id="stMode">-</span></div>
        <div class="result-box"><span class="result-label">Min:</span> <span id="stMin">-</span></div>
        <div class="result-box"><span class="result-label">Max:</span> <span id="stMax">-</span></div>
        <div class="result-box"><span class="result-label">Toplam:</span> <span id="stSum">-</span></div>
    </div>`);
    window.stDo = function() {
        const nums = $val('stInp').split(',').map(Number).filter(n => !isNaN(n));
        if (!nums.length) return;
        const s = nums.sort((a,b)=>a-b);
        $set('stMean', (nums.reduce((a,b)=>a+b,0)/nums.length).toFixed(2));
        $set('stMed', nums.length%2 ? s[Math.floor(nums.length/2)] : ((s[nums.length/2-1]+s[nums.length/2])/2).toFixed(2));
        const freq = {}; nums.forEach(n => freq[n]=(freq[n]||0)+1);
        const maxFreq = Math.max(...Object.values(freq));
        $set('stMode', Object.entries(freq).filter(([,v])=>v===maxFreq).map(([k])=>k).join(', '));
        $set('stMin', s[0]); $set('stMax', s[s.length-1]); $set('stSum', nums.reduce((a,b)=>a+b,0));
    };
    stDo();
}

// ============ DATE ============
function dateDiff() {
    $html(`<div class="flex-row"><div class="form-group"><label>Başlangıç</label><input type="date" id="dd1"></div><div class="form-group"><label>Bitiş</label><input type="date" id="dd2"></div></div><button class="btn" onclick="ddDo()">Hesapla</button>
    <div class="mini-grid"><div class="result-box"><span class="result-label">Gün:</span> <span id="ddDays">-</span></div><div class="result-box"><span class="result-label">Hafta:</span> <span id="ddWeeks">-</span></div><div class="result-box"><span class="result-label">Ay:</span> <span id="ddMonths">-</span></div><div class="result-box"><span class="result-label">Yıl:</span> <span id="ddYears">-</span></div></div>`);
    document.getElementById('dd1').valueAsDate = new Date(Date.now() - 86400000*7);
    document.getElementById('dd2').valueAsDate = new Date();
    window.ddDo = function() {
        const a = new Date($val('dd1')), b = new Date($val('dd2'));
        const diff = Math.abs(b - a);
        $set('ddDays', Math.floor(diff/86400000));
        $set('ddWeeks', (diff/604800000).toFixed(1));
        $set('ddMonths', (diff/2592000000).toFixed(1));
        $set('ddYears', (diff/31536000000).toFixed(2));
    };
    ddDo();
}
function unixTs() {
    $html(`<div class="flex-row"><div class="form-group"><label>Unix Timestamp</label><input type="number" id="utInp" oninput="utDo()"></div></div><button class="btn" onclick="utNow()">Şimdi</button>
    <div class="result-box"><span class="result-label">Tarih:</span> <span id="utOut">-</span></div>`);
    window.utNow = () => { document.getElementById('utInp').value = Math.floor(Date.now()/1000); utDo(); };
    window.utDo = () => { const t = $num('utInp'); $set('utOut', t ? new Date(t*1000).toLocaleString('tr-TR') : '-'); };
    utNow();
}
function leapYear() {
    $html(`<div class="form-group"><label>Yıl</label><input type="number" id="lyInp" value="2024" oninput="lyDo()"></div><div class="result-box"><span id="lyOut">-</span></div>`);
    window.lyDo = function() {
        const y = $num('lyInp');
        $set('lyOut', (y%4===0 && y%100!==0) || y%400===0 ? `${y} artık yıl ✓` : `${y} artık yıl değil ✗`);
    };
    lyDo();
}

// ============ RANDOM GENERATORS ============
function randomString() {
    $html(`<div class="form-group"><label>Uzunluk</label><input type="number" id="rsLen" value="16" min="1" max="1000"></div>
    <button class="btn" onclick="rsDo()">Oluştur</button><div class="result-box"><span id="rsOut" style="font-family:monospace;word-break:break-all">-</span></div>
    <button class="btn copy-btn" onclick="rsCopy()">Kopyala</button>`);
    window.rsDo = () => { const l=$num('rsLen',16); const c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; $set('rsOut', Array.from({length:l},()=>c[Math.floor(Math.random()*c.length)]).join('')); };
    window.rsCopy = () => { const t = document.getElementById('rsOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
    rsDo();
}
function randomUUID() {
    $html(`<button class="btn" onclick="ruDo()">Oluştur</button><div class="result-box"><span id="ruOut" style="font-family:monospace">-</span></div><button class="btn copy-btn" onclick="ruCopy()">Kopyala</button>`);
    window.ruDo = () => { $set('ruOut', crypto.randomUUID()); };
    window.ruCopy = () => { const t = document.getElementById('ruOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
    ruDo();
}
function randomIP() {
    $html(`<button class="btn" onclick="riDo()">Oluştur</button><div class="result-box"><span id="riOut">-</span></div><button class="btn copy-btn" onclick="riCopy()">Kopyala</button>`);
    window.riDo = () => { $set('riOut', Array.from({length:4},()=>Math.floor(Math.random()*256)).join('.')); };
    window.riCopy = () => { const t = document.getElementById('riOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
    riDo();
}

// ============ FUN ============
function magic8ball() {
    const answers = ['Kesinlikle evet','Evet','Olabilir','Şüpheli','Hayır','Kesinlikle hayır','Soruyu tekrar sor','Pek sayılmaz','Görünüşe göre evet','Kaynaklar hayır diyor'];
    $html(`<div class="result-box" style="text-align:center;font-size:2rem;padding:30px;min-height:100px;display:flex;align-items:center;justify-content:center"><span id="m8Out">🔮</span></div><button class="btn" onclick="m8Do()">Sor</button>`);
    window.m8Do = () => document.getElementById('m8Out').textContent = answers[Math.floor(Math.random()*answers.length)];
}
function fortuneCookie() {
    const fortunes = ['Bugün şanslı günün!','Beklenmedik bir para gelecek','Eski bir dosttan haber alacaksın','Yeni bir fırsat kapıda','Sevdiğin kişi seni düşünüyor','Büyük bir değişim yakın','Hayallerine bir adım daha yaklaştın','Bugün gülümse, her şey güzel olacak','Geçmişi bırak, geleceğe odaklan','Bir sürpriz seni bekliyor'];
    $html(`<div class="result-box" style="text-align:center;font-size:1.2rem;padding:30px;min-height:80px;display:flex;align-items:center;justify-content:center"><span id="fcOut">🥠</span></div><button class="btn" onclick="fcDo()">Fal Bak</button>`);
    window.fcDo = () => document.getElementById('fcOut').textContent = fortunes[Math.floor(Math.random()*fortunes.length)];
}

// ============ CURRENCY ============
function currencyConv() {
    const rates = { USD: 1, EUR: 0.92, TRY: 30.5, GBP: 0.79, JPY: 149.5, CHF: 0.88, CAD: 1.36, AUD: 1.53, CNY: 7.24, RUB: 91.5, SAR: 3.75, AED: 3.67 };
    $html(`<div class="flex-row"><div class="form-group"><label>Tutar</label><input type="number" id="ccAmt" value="100" oninput="ccDo()"></div>
    <div class="form-group"><label>Kaynak</label><select id="ccFrom" onchange="ccDo()">${Object.keys(rates).map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>Hedef</label><select id="ccTo" onchange="ccDo()">${Object.keys(rates).map(c => `<option value="${c}">${c}</option>`).join('')}</select></div></div>
    <div class="result-box"><span id="ccOut">-</span></div>`);
    document.getElementById('ccTo').value = 'TRY';
    window.ccDo = function() {
        const a = $num('ccAmt',100), f = $val('ccFrom'), t = $val('ccTo');
        $set('ccOut', `${a} ${f} = ${(a / rates[f] * rates[t]).toFixed(2)} ${t}`);
    };
    ccDo();
}

// ============ LOREM IPSUM ============
function loremIpsum() {
    const words = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua'];
    $html(`<div class="form-group"><label>Kelime Sayısı</label><input type="number" id="liCnt" value="50" min="1" max="1000"></div>
    <button class="btn" onclick="liDo()">Oluştur</button><div class="result-box"><div id="liOut" style="line-height:1.6"></div></div><button class="btn copy-btn" onclick="liCopy()">Kopyala</button>`);
    window.liDo = () => { const n=$num('liCnt',50); $set('liOut', Array.from({length:n},()=>words[Math.floor(Math.random()*words.length)]).join(' ')); };
    window.liCopy = () => { const t = document.getElementById('liOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
    liDo();
}

// ============ BMR / TDEE ============
function bmr() {
    $html(`<div class="flex-row"><div class="form-group"><label>Cinsiyet</label><select id="bmrG"><option value="male">Erkek</option><option value="female">Kadın</option></select></div>
    <div class="form-group"><label>Kilo (kg)</label><input type="number" id="bmrW" value="70" oninput="bmrDo()"></div>
    <div class="form-group"><label>Boy (cm)</label><input type="number" id="bmrH" value="175" oninput="bmrDo()"></div>
    <div class="form-group"><label>Yaş</label><input type="number" id="bmrA" value="30" oninput="bmrDo()"></div></div>
    <div class="result-box"><span class="result-label">BMR:</span> <span id="bmrOut">-</span> kcal/gün</div>`);
    window.bmrDo = function() {
        const w=$num('bmrW'), h=$num('bmrH'), a=$num('bmrA'), g=$val('bmrG');
        $set('bmrOut', Math.round(g==='male' ? (10*w+6.25*h-5*a+5) : (10*w+6.25*h-5*a-161)));
    };
    bmrDo();
}
function tdee() {
    $html(`<div class="flex-row"><div class="form-group"><label>Cinsiyet</label><select id="tdG"><option value="male">Erkek</option><option value="female">Kadın</option></select></div>
    <div class="form-group"><label>Kilo</label><input type="number" id="tdW" value="70" oninput="tdDo()"></div>
    <div class="form-group"><label>Boy</label><input type="number" id="tdH" value="175" oninput="tdDo()"></div>
    <div class="form-group"><label>Yaş</label><input type="number" id="tdA" value="30" oninput="tdDo()"></div></div>
    <div class="form-group"><label>Aktivite</label><select id="tdAct" onchange="tdDo()"><option value="1.2">Hareketsiz</option><option value="1.375">Hafif</option><option value="1.55" selected>Orta</option><option value="1.725">Aktif</option><option value="1.9">Çok Aktif</option></select></div>
    <div class="result-box"><span class="result-label">TDEE:</span> <span id="tdOut">-</span> kcal/gün</div>`);
    window.tdDo = function() {
        const w=$num('tdW'), h=$num('tdH'), a=$num('tdA'), g=$val('tdG'), act=+$val('tdAct');
        const bmr = g==='male' ? (10*w+6.25*h-5*a+5) : (10*w+6.25*h-5*a-161);
        $set('tdOut', Math.round(bmr*act));
    };
    tdDo();
}

// ============ VAT ============
function vat() {
    $html(`<div class="flex-row"><div class="form-group"><label>Tutar</label><input type="number" id="vtAmt" value="100" oninput="vtDo()"></div>
    <div class="form-group"><label>KDV %</label><input type="number" id="vtRate" value="20" oninput="vtDo()"></div></div>
    <div class="mini-grid"><div class="result-box"><span class="result-label">KDV Dahil:</span> <span id="vtIncl">-</span></div><div class="result-box"><span class="result-label">KDV Hariç:</span> <span id="vtExcl">-</span></div><div class="result-box"><span class="result-label">KDV Tutarı:</span> <span id="vtAmtOut">-</span></div></div>`);
    window.vtDo = function() {
        const a=$num('vtAmt'), r=$num('vtRate')/100;
        $set('vtIncl', (a*(1+r)).toFixed(2)); $set('vtExcl', a.toFixed(2)); $set('vtAmtOut', (a*r).toFixed(2));
    };
    vtDo();
}

// ============ AVERAGE ============
function average() {
    $html(`<div class="form-group"><label>Sayılar (virgülle ayır)</label><input type="text" id="avInp" value="10,20,30,40,50" oninput="avDo()"></div>
    <div class="result-box"><span class="result-label">Ortalama:</span> <span id="avOut">-</span></div>`);
    window.avDo = () => { const n = $val('avInp').split(',').map(Number).filter(x=>!isNaN(x)); $set('avOut', n.length ? (n.reduce((a,b)=>a+b,0)/n.length).toFixed(2) : '-'); };
    avDo();
}

// ============ GRADES ============
function gpa() {
    $html(`<div class="form-group"><label>Notlar (virgülle, 0-100)</label><input type="text" id="gpInp" value="80,90,75,85,95" oninput="gpDo()"></div>
    <div class="result-box"><span class="result-label">Ortalama:</span> <span id="gpOut">-</span></div>`);
    window.gpDo = () => { const n = $val('gpInp').split(',').map(Number).filter(x=>!isNaN(x)); $set('gpOut', n.length ? (n.reduce((a,b)=>a+b,0)/n.length).toFixed(1) : '-'); };
    gpDo();
}
function grade() { gpa(); }

// ============ COMPOUND INTEREST ============
function compoundInterest() {
    $html(`<div class="flex-row"><div class="form-group"><label>Anapara</label><input type="number" id="ciP" value="10000" oninput="ciDo()"></div>
    <div class="form-group"><label>Faiz % (yıllık)</label><input type="number" id="ciR" value="10" oninput="ciDo()"></div>
    <div class="form-group"><label>Yıl</label><input type="number" id="ciY" value="5" oninput="ciDo()"></div></div>
    <div class="result-box"><span class="result-label">Toplam:</span> <span id="ciOut">-</span></div>`);
    window.ciDo = () => { const p=$num('ciP'), r=$num('ciR')/100, y=$num('ciY'); $set('ciOut', (p*Math.pow(1+r,y)).toFixed(2)); };
    ciDo();
}

// ============ PRIME CHECK ============
function primeCheck() {
    $html(`<div class="form-group"><label>Sayı</label><input type="number" id="prInp" value="17" oninput="prDo()"></div><div class="result-box"><span id="prOut">-</span></div>`);
    window.prDo = function() {
        const n = $num('prInp'); if (n < 2) { $set('prOut', `${n} asal değil`); return; }
        for (let i = 2; i * i <= n; i++) { if (n % i === 0) { $set('prOut', `${n} asal değil (${i} ile bölünür)`); return; } }
        $set('prOut', `${n} asal sayı ✓`);
    };
    prDo();
}

// ============ FACTORIAL ============
function factorial() {
    $html(`<div class="form-group"><label>Sayı</label><input type="number" id="faInp" value="10" min="0" max="170" oninput="faDo()"></div><div class="result-box" style="word-break:break-all"><span class="result-label">Sonuç:</span> <span id="faOut">-</span></div>`);
    window.faDo = function() {
        const n = $num('faInp', 10); if (n > 170) { $set('faOut', 'Çok büyük'); return; }
        let r = 1; for (let i = 2; i <= n; i++) r *= i;
        $set('faOut', r.toLocaleString());
    };
    faDo();
}

// ============ FIBONACCI ============
function fibonacci() {
    $html(`<div class="form-group"><label>Terim Sayısı</label><input type="number" id="fiInp" value="20" min="1" max="100" oninput="fiDo()"></div><div class="result-box" style="word-break:break-all"><span class="result-label">Fibonacci:</span> <span id="fiOut">-</span></div>`);
    window.fiDo = function() {
        const n = Math.min($num('fiInp', 20), 100);
        const fib = [0, 1]; for (let i = 2; i < n; i++) fib[i] = fib[i-1] + fib[i-2];
        $set('fiOut', fib.slice(0, n).join(', '));
    };
    fiDo();
}

// ============ GCD / LCM ============
function gcd() {
    $html(`<div class="flex-row"><div class="form-group"><label>Sayı 1</label><input type="number" id="gdA" value="48" oninput="gdDo()"></div><div class="form-group"><label>Sayı 2</label><input type="number" id="gdB" value="36" oninput="gdDo()"></div></div><div class="result-box"><span class="result-label">EBOB:</span> <span id="gdOut">-</span></div>`);
    window.gdDo = function() {
        const gcd = (a,b) => b ? gcd(b, a%b) : a;
        $set('gdOut', gcd($num('gdA'), $num('gdB')));
    };
    gdDo();
}
function lcm() {
    $html(`<div class="flex-row"><div class="form-group"><label>Sayı 1</label><input type="number" id="lcA" value="12" oninput="lcDo()"></div><div class="form-group"><label>Sayı 2</label><input type="number" id="lcB" value="18" oninput="lcDo()"></div></div><div class="result-box"><span class="result-label">EKOK:</span> <span id="lcOut">-</span></div>`);
    window.lcDo = function() {
        const gcd = (a,b) => b ? gcd(b, a%b) : a;
        const a=$num('lcA'), b=$num('lcB');
        $set('lcOut', a && b ? a*b/gcd(a,b) : 0);
    };
    lcDo();
}

// ============ WATER ============
function water() {
    $html(`<div class="form-group"><label>Kilo (kg)</label><input type="number" id="waInp" value="70" oninput="waDo()"></div><div class="result-box"><span class="result-label">Günlük Su:</span> <span id="waOut">-</span> litre</div>`);
    window.waDo = () => $set('waOut', ($num('waInp') * 0.033).toFixed(1));
    waDo();
}

// ============ IDEAL WEIGHT ============
function idealWeight() {
    $html(`<div class="flex-row"><div class="form-group"><label>Cinsiyet</label><select id="iwG"><option value="male">Erkek</option><option value="female">Kadın</option></select></div>
    <div class="form-group"><label>Boy (cm)</label><input type="number" id="iwH" value="175" oninput="iwDo()"></div></div>
    <div class="result-box"><span class="result-label">İdeal Kilo:</span> <span id="iwOut">-</span> kg</div>`);
    window.iwDo = function() {
        const h = $num('iwH', 175), g = $val('iwG');
        $set('iwOut', g === 'male' ? (50 + 0.91*(h-152.4)).toFixed(1) : (45.5 + 0.91*(h-152.4)).toFixed(1));
    };
    iwDo();
}

// ============ STRING FUNCTIONS ============
function charTypeCounter(p) {
    const type = p?.type || 'vowel';
    const labels = { vowel: 'Sesli Harf', consonant: 'Sessiz Harf', digit: 'Rakam', space: 'Boşluk' };
    $html(`<div class="form-group"><label>Metin</label><textarea id="ctInp" placeholder="Metin girin..." oninput="ctDo()"></textarea></div>
    <div class="result-box"><span class="result-label">${labels[type]||type} Sayısı:</span> <span id="ctOut">0</span></div>`);
    window.ctDo = function() {
        const t = $txt('ctInp');
        const counts = {
            vowel: (t.match(/[aeiouAEIOUöÖüÜıİ]/g)||[]).length,
            consonant: (t.match(/[bcçdfgğhjklmnprsştvyzwxBCÇDFGĞHJKLMNPRSŞTVYZWX]/g)||[]).length,
            digit: (t.match(/\d/g)||[]).length,
            space: (t.match(/\s/g)||[]).length,
        };
        $set('ctOut', counts[type] || 0);
    };
}
function uniqueWords() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="uwInp" placeholder="Metin girin..." oninput="uwDo()"></textarea></div>
    <div class="result-box"><span class="result-label">Benzersiz Kelime:</span> <span id="uwOut">0</span></div>`);
    window.uwDo = function() {
        const t = $txt('uwInp').trim().toLowerCase();
        $set('uwOut', t ? [...new Set(t.split(/\s+/))].length : 0);
    };
}
function syllableCounter() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="syInp" placeholder="Türkçe metin girin..." oninput="syDo()"></textarea></div>
    <div class="result-box"><span class="result-label">Tahmini Hece:</span> <span id="syOut">0</span></div>`);
    window.syDo = function() {
        const t = $txt('syInp').toLowerCase().replace(/[^a-zçğıöşü]/g,' ').trim();
        const words = t.split(/\s+/).filter(Boolean);
        let total = 0;
        words.forEach(w => {
            const vowels = (w.match(/[aeiouçğıöşü]/g)||[]).length;
            total += Math.max(vowels, 1);
        });
        $set('syOut', total);
    };
}

// ============ TEXT DIFF ============
function textDiff() {
    $html(`<div class="flex-row"><div class="form-group"><label>Metin 1</label><textarea id="td1" placeholder="İlk metin..."></textarea></div>
    <div class="form-group"><label>Metin 2</label><textarea id="td2" placeholder="İkinci metin..."></textarea></div></div>
    <button class="btn" onclick="tdDo()">Karşılaştır</button><div class="result-box"><span id="tdOut">-</span></div>`);
    window.tdDo = function() {
        const a = $txt('td1'), b = $txt('td2');
        const min = Math.min(a.length, b.length);
        let diff = 0;
        for (let i = 0; i < min; i++) if (a[i] !== b[i]) diff++;
        diff += Math.abs(a.length - b.length);
        const sim = Math.round((1 - diff / Math.max(a.length, b.length, 1)) * 100);
        $set('tdOut', `${diff} farklı karakter, %${sim} benzerlik`);
    };
}

// ============ EXTRACT PATTERN ============
function extractPattern(p) {
    const type = p?.type || 'email';
    const labels = { email: 'E-posta', url: 'URL', phone: 'Telefon' };
    const patterns = { email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, url: /https?:\/\/[^\s<>"]+|www\.[^\s<>"]+/g, phone: /[\+]?[\d\s\-\(\)]{7,20}/g };
    $html(`<div class="form-group"><label>Metin</label><textarea id="exInp" placeholder="${labels[type]} bulmak için metin girin..."></textarea></div>
    <button class="btn" onclick="exDo()">Bul</button><div class="result-box"><div id="exOut">-</div></div>`);
    window.exDo = function() {
        const t = $txt('exInp');
        const matches = t.match(patterns[type]) || [];
        $set('exOut', matches.length ? matches.join('<br>') : 'Bulunamadı');
    };
}

// ============ PW STRENGTH ============
function pwStrength() {
    $html(`<div class="form-group"><label>Şifre</label><input type="text" id="psInp" placeholder="Şifrenizi girin..." oninput="psDo()"></div>
    <div class="result-box"><span class="result-label">Güç:</span> <span id="psOut">-</span></div>
    <div style="display:flex;gap:8px;margin-top:8px"><div id="psBar" style="height:8px;border-radius:4px;background:var(--border);flex:1;overflow:hidden"><div id="psFill" style="height:100%;width:0;transition:.3s"></div></div></div>`);
    window.psDo = function() {
        const p = $val('psInp');
        let score = 0;
        if (p.length >= 8) score++; if (p.length >= 12) score++; if (p.length >= 16) score++;
        if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
        if (/\d/.test(p)) score++;
        if (/[^a-zA-Z0-9]/.test(p)) score++;
        const labels = ['Çok Zayıf','Zayıf','Orta','İyi','Güçlü','Çok Güçlü'];
        const colors = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#27ae60','#1abc9c'];
        $set('psOut', labels[score] || '');
        document.getElementById('psFill').style.width = (score / 6 * 100) + '%';
        document.getElementById('psFill').style.background = colors[score] || '#e74c3c';
    };
}

// ============ ROT13 ============
function rot13() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="rotInp" placeholder="Metin girin..." oninput="rotDo()"></textarea></div>
    <div class="result-box"><span class="result-label">ROT13:</span><div id="rotOut" style="margin-top:4px"></div></div><button class="btn copy-btn" onclick="rotCopy()">Kopyala</button>`);
    window.rotDo = function() {
        const t = $txt('rotInp');
        $set('rotOut', t.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() <= 'm' ? 13 : -13))));
    };
    window.rotCopy = () => { const t = document.getElementById('rotOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}
function rot47() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="rotInp" placeholder="Metin girin..." oninput="rotDo()"></textarea></div>
    <div class="result-box"><span class="result-label">ROT47:</span><div id="rotOut" style="margin-top:4px"></div></div><button class="btn copy-btn" onclick="rotCopy()">Kopyala</button>`);
    window.rotDo = function() {
        $set('rotOut', $txt('rotInp').replace(/[\x21-\x7e]/g, c => String.fromCharCode(((c.charCodeAt(0)-33+47)%94)+33)));
    };
    window.rotCopy = () => { const t = document.getElementById('rotOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}
function caesar() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="rotInp" placeholder="Metin girin..."></textarea></div>
    <div class="form-group"><label>Kaydırma</label><input type="number" id="rotShift" value="3" min="1" max="25"></div>
    <button class="btn" onclick="rotDo()">Şifrele/Çöz</button>
    <div class="result-box"><span class="result-label">Çıktı:</span><div id="rotOut" style="margin-top:4px"></div></div><button class="btn copy-btn" onclick="rotCopy()">Kopyala</button>`);
    window.rotDo = function() {
        const t = $txt('rotInp'), s = $num('rotShift', 3);
        $set('rotOut', t.replace(/[a-zA-Z]/g, c => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode((c.charCodeAt(0)-base+s)%26+base);
        }));
    };
    window.rotCopy = () => { const t = document.getElementById('rotOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}
function atbash() {
    $html(`<div class="form-group"><label>Metin</label><textarea id="rotInp" placeholder="Metin girin..." oninput="rotDo()"></textarea></div>
    <div class="result-box"><span class="result-label">Atbash:</span><div id="rotOut" style="margin-top:4px"></div></div><button class="btn copy-btn" onclick="rotCopy()">Kopyala</button>`);
    window.rotDo = function() {
        $set('rotOut', $txt('rotInp').replace(/[a-zA-Z]/g, c => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(25 - (c.charCodeAt(0)-base) + base);
        }));
    };
    window.rotCopy = () => { const t = document.getElementById('rotOut')?.textContent; if (t) navigator.clipboard.writeText(t); };
}

// ============ PAST RENDERERS ============
function base64Image() { $html('<div class="result-box">Bu araç hazırlanıyor...</div>'); }
function xmlFormatter() { $html('<div class="result-box">XML biçimlendirici hazırlanıyor...</div>'); }
function csvToJson() { $html('<div class="result-box">CSV → JSON dönüştürücü hazırlanıyor...</div>'); }
function jsonToCsv() { $html('<div class="result-box">JSON → CSV dönüştürücü hazırlanıyor...</div>'); }
// Color converter stubs (would be complex - implement core ones)
function hexToRgb() {
    $html(`<div class="form-group"><label>HEX Renk</label><input type="text" id="crInp" value="#6c5ce7" oninput="crDo()"></div>
    <div class="result-box"><span class="result-label">RGB:</span> <span id="crOut">-</span></div>
    <div id="crPreview" style="width:100%;height:60px;border-radius:10px;margin-top:8px"></div>`);
    window.crDo = function() {
        const h = $val('crInp').replace('#','');
        if (h.length !== 6) { $set('crOut', 'Geçersiz HEX'); return; }
        const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
        $set('crOut', `rgb(${r}, ${g}, ${b})`);
        document.getElementById('crPreview').style.background = `rgb(${r},${g},${b})`;
    };
    crDo();
}
function rgbToHex() {
    $html(`<div class="flex-row"><div class="form-group"><label>R</label><input type="number" id="crR" value="108" min="0" max="255" oninput="crDo()"></div>
    <div class="form-group"><label>G</label><input type="number" id="crG" value="92" min="0" max="255" oninput="crDo()"></div>
    <div class="form-group"><label>B</label><input type="number" id="crB" value="231" min="0" max="255" oninput="crDo()"></div></div>
    <div class="result-box"><span class="result-label">HEX:</span> <span id="crOut">-</span></div>
    <div id="crPreview" style="width:100%;height:60px;border-radius:10px;margin-top:8px"></div>`);
    window.crDo = function() {
        const r=$num('crR'), g=$num('crG'), b=$num('crB');
        const hex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
        $set('crOut', hex.toUpperCase());
        document.getElementById('crPreview').style.background = hex;
    };
    crDo();
}
function contrastCheck() {
    $html(`<div class="flex-row"><div class="form-group"><label>Arka Plan</label><input type="text" id="ccBg" value="#ffffff" oninput="ccDo()"></div>
    <div class="form-group"><label>Yazı</label><input type="text" id="ccFg" value="#000000" oninput="ccDo()"></div></div>
    <div id="ccPrev" style="width:100%;padding:20px;border-radius:10px;text-align:center;font-size:1.2rem;margin-top:8px">Örnek Metin</div>
    <div class="result-box"><span class="result-label">Kontrast Oranı:</span> <span id="ccOut">-</span></div>`);
    window.ccDo = function() {
        const hex = h => { const v = h.replace('#',''); return v.length===6 ? [parseInt(v.slice(0,2),16),parseInt(v.slice(2,4),16),parseInt(v.slice(4,6),16)] : [0,0,0]; };
        const lum = ([r,g,b]) => (0.299*r + 0.587*g + 0.114*b)/255;
        const bg = hex($val('ccBg')||'#ffffff'), fg = hex($val('ccFg')||'#000000');
        const l1 = lum(bg), l2 = lum(fg);
        const ratio = (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
        document.getElementById('ccPrev').style.background = $val('ccBg'); document.getElementById('ccPrev').style.color = $val('ccFg');
        $set('ccOut', `${ratio.toFixed(2)}:1 - ${ratio >= 4.5 ? '✓ Geçerli' : '✗ Geçersiz'}`);
    };
    ccDo();
}
