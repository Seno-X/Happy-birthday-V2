const pool = {
    starters: ["ขอให้", "ถ้าปีนี้", "ถึงจะ", "ต่อให้", "ภาวนาให้", "ปีนี้จง", "ขอวอนให้"],
    nouns: ["งาน", "รัก", "เงิน", "ดวง", "หุ่น", "หน้าตา", "ตับไต", "แฟน", "ยอดไลก์", "พอร์ตหุ้น", "เงินเก็บ", "การเรียน"],
    verbs: ["ปัง", "รุ่ง", "พุ่ง", "ดี", "เฮง", "จึ้ง", "แรง", "ไม่บูด", "แข็งแรง", "รวย", "แน่น", "ล้น"],
    connectors: ["และ", "หรือ", "แต่ก็", "แถมยัง", "แถมจะ", "พ่วงด้วย", "แล้วก็", "คู่กับ"],
    modifiers: ["เวอร์", "สับๆ", "ฉ่ำๆ", "ตะโกน", "แบบงงๆ", "เกินต้าน", "สู้ชีวิต", "ระดับแม่", "มหาศาล", "ระดับโลก"],
    endings: ["สาธุ", "นะจ๊ะ", "ปังปุริเย่", "สุดจัด", "จึ้งมากแม่", "เพี้ยง!", "น้าาา", "สิคะ", "รัวๆ"]
};

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Matrix BG
const bg = document.getElementById('matrix-bg');
for (let i = 0; i < 31; i++) {
    const span = document.createElement('span');
    span.className = 'birthday-text';
    span.innerText = "HAPPY BIRTHDAY";
    span.style.left = Math.random() * 100 + "%";
    span.style.animationDuration = (Math.random() * 3 + 2.5) + "s";
    bg.appendChild(span);
}

// สร้างชุดคำ 6-12 คำ
const cardCount = Math.floor(Math.random() * 7) + 6; 
let finalWords = [];
for (let i = 0; i < cardCount; i++) {
    let currentPool;
    if (i === 0) currentPool = pool.starters;
    else if (i === cardCount - 1) currentPool = pool.endings;
    else {
        if (i === 1 || i === 4) currentPool = pool.nouns;
        else if (i === 2 || i === 5) currentPool = pool.verbs;
        else if (i === 3) currentPool = pool.connectors;
        else currentPool = pool.modifiers;
    }
    let word = getRandom(currentPool);
    while (finalWords.includes(word)) { word = getRandom(currentPool); }
    finalWords.push(word);
}

const deckArea = document.getElementById('deck-area');
let isSpread = false;
let openedCount = 0;
let startX = 0, startY = 0;

finalWords.forEach((word) => {
    const card = document.createElement('div');
    card.className = 'card in-deck';
    card.innerHTML = `<div class="card-front">?</div><div class="card-back">${word}</div>`;
    
    card.addEventListener('mousedown', () => { if(!isSpread) spreadCards(); });
    card.addEventListener('click', function() { 
        if(isSpread && !this.classList.contains('flipped')) {
            flipCard(this);
        }
    });
    deckArea.appendChild(card);
});

function flipCard(card) {
    card.classList.add('flipped');
    openedCount++;
    if (openedCount === cardCount) {
        enableDragAndDrop();
    }
}

function enableDragAndDrop() {
    // ปรับแต่ง Sortable ให้ทำงาน "ทันที" (ลบ delay ออกทั้งหมด)
    Sortable.create(deckArea, {
        animation: 150,
        delay: 0,
        delayOnTouchOnly: false,
        touchStartThreshold: 0, 
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        onStart: function() {
            if (window.navigator.vibrate) window.navigator.vibrate(15);
        }
    });
}

// Touch Events สำหรับปัดและรูดเปิด
window.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
}, {passive: false});

window.addEventListener('touchmove', (e) => {
    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;

    if (!isSpread) {
        if (Math.abs(startX - curX) > 20 || Math.abs(startY - curY) > 20) spreadCards();
    } else {
        // ขณะรูดเปิด จะไม่ให้ระบบลากทำงานจนกว่าจะเปิดครบ
        if (openedCount < cardCount) {
            const target = document.elementFromPoint(curX, curY);
            const card = target ? target.closest('.card') : null;
            if (card && !card.classList.contains('flipped')) {
                flipCard(card);
            }
        }
    }
}, {passive: false});

function spreadCards() {
    if (isSpread) return;
    isSpread = true;
    document.querySelectorAll('.card').forEach((card, index) => {
        card.classList.remove('in-deck');
        card.style.transitionDelay = (index * 0.06) + "s";
    });
}
