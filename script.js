// 1. 滚动入场动画
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
revealElements.forEach(el => observer.observe(el));

// 2. 弹窗功能
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

function showDetail(title, desc) {
    modalTitle.innerText = title;
    modalDesc.innerText = desc;
    modal.style.display = 'flex';
}
function closeModal() { modal.style.display = 'none'; }
window.onclick = function (event) { if (event.target == modal) closeModal(); }

// 3. 背景音乐
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        isPlaying = false;
    } else {
        bgMusic.play().then(() => {
            musicBtn.classList.add('playing');
            isPlaying = true;
        }).catch(err => {
            alert("播放失败：请确保在 wwwroot 文件夹里放入了名为 music.mp3 的音乐文件！");
        });
    }
}

// 4. 汉服趣味问答逻辑
const quizData = [
    {
        question: "1. 汉服最核心、最鲜明的结构特征是什么？",
        options: ["交领右衽", "立领盘扣", "左衽系带", "对襟纽扣"],
        answer: 0
    },
    {
        question: "2. 以下哪一个不是中国传统色？",
        options: ["黛蓝", "提香红", "胭脂", "缃色"],
        answer: 1
    },
    {
        question: "3. “有服章之美谓之华”的下一句是？",
        options: ["衣袂飘飘若神仙", "华夏文明五千年", "有礼仪之大故称夏", "锦绣中华万代传"],
        answer: 2
    },
    // 👇 v3.0 新增题目 👇
    {
        question: "4. 传统纹样中的“江崖海水”通常寓意着什么？",
        options: ["富贵不断头", "生生不息", "江山永固", "吉祥如意"],
        answer: 2 // 对应“江山永固”
    },
    {
        question: "5. 古代男子二十岁行冠礼，束发佩戴以下哪种配饰？",
        options: ["发簪与冠巾", "香囊与荷包", "玉佩与禁步", "团扇与折扇"],
        answer: 0 // 对应“冠”
    },
    {
        question: "6. 被称为“寸锦寸金”、元明清三代皇家御用的非遗工艺是？",
        options: ["苏绣", "南京云锦", "缂丝", "白族扎染"],
        answer: 1
    },
    {
        question: "7. 在古代，女子常用的日常行礼方式，双手交叠微蹲并口称“万福”，这叫什么礼？",
        options: ["拱手作揖", "天揖", "稽首", "万福礼"],
        answer: 3
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('quiz-progress');
const scoreText = document.getElementById('quiz-score');
const nextBtn = document.getElementById('next-btn');

function loadQuestion() {
    // 重置状态
    const currentData = quizData[currentQuestionIndex];
    questionText.innerText = currentData.question;
    optionsContainer.innerHTML = '';
    nextBtn.classList.add('hidden');

    // 更新进度
    progressText.innerText = `第 ${currentQuestionIndex + 1} / ${quizData.length} 题`;
    scoreText.innerText = `得分: ${score}`;

    // 生成选项按钮
    currentData.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const currentData = quizData[currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');

    // 禁用所有按钮防止重复点击
    allBtns.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentData.answer) {
        btnElement.classList.add('correct');
        score += 10;
        scoreText.innerText = `得分: ${score}`;
    } else {
        btnElement.classList.add('wrong');
        // 标出正确答案
        allBtns[currentData.answer].classList.add('correct');
    }

    // 显示下一题按钮
    if (currentQuestionIndex < quizData.length - 1) {
        nextBtn.innerText = "下一题";
    } else {
        nextBtn.innerText = "查看结果";
    }
    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        // 结束问答
        questionText.innerText = `测试结束！你的总得分为：${score} 分`;
        optionsContainer.innerHTML = '';
        nextBtn.classList.add('hidden');
        progressText.innerText = "完成";
    }
}

// 页面加载时初始化第一题
loadQuestion();

// 5. 点击屏幕飘落花瓣特效 (v2.0 新增)
document.addEventListener('click', function (e) {
    createPetal(e.clientX, e.clientY);
});

function createPetal(x, y) {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    // 随机大小
    const size = Math.random() * 10 + 8;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;

    // 定位在鼠标点击处
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;

    // 随机水平漂移
    const randomX = (Math.random() - 0.5) * 100;
    petal.style.setProperty('--random-x', `${randomX}px`);

    document.body.appendChild(petal);

    // 动画结束后移除元素
    setTimeout(() => {
        petal.remove();
    }, 1500);
}

// 6. 传统色交互逻辑 (v3.0 新增)
let currentHex = '#FFFFFF';
const colorModal = document.getElementById('colorModal');

function showColorDetail(name, hex, origin) {
    currentHex = hex;
    document.getElementById('color-modal-title').innerText = name;
    document.getElementById('color-modal-hex').innerText = hex;
    document.getElementById('color-modal-origin').innerText = origin;
    document.getElementById('modal-color-block').style.backgroundColor = hex;

    // 每次打开重置配色区
    document.getElementById('palette-result').classList.add('hidden');

    colorModal.style.display = 'flex';
}

function closeColorModal() {
    colorModal.style.display = 'none';
}

// 点击弹窗外部关闭
window.addEventListener('click', function (event) {
    if (event.target == colorModal) {
        closeColorModal();
    }
});

// 复制色值功能
function copyHex() {
    navigator.clipboard.writeText(currentHex).then(() => {
        alert(`已成功复制色值：${currentHex}`);
    }).catch(err => {
        alert('复制失败，请手动选择复制。');
    });
}

// 生成配色方案 (核心算法：基于当前色生成类似色与互补色)
function generatePalette() {
    const blocksContainer = document.getElementById('palette-blocks');
    blocksContainer.innerHTML = '';

    // 将 HEX 转为 RGB 调整明暗
    const r = parseInt(currentHex.slice(1, 3), 16);
    const g = parseInt(currentHex.slice(3, 5), 16);
    const b = parseInt(currentHex.slice(5, 7), 16);

    // 生成 5 种颜色：原色、极浅色(背景)、浅色、极深色(文字)、反向对比色
    const colors = [
        currentHex,
        `rgb(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)})`, // 浅
        `rgb(${Math.floor(r * 0.4)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.4)})`, // 深
        `rgb(${255 - r}, ${255 - g}, ${255 - b})`, // 对比色
        `rgb(${Math.floor((r + 255) / 2)}, ${Math.floor((g + 255) / 2)}, ${Math.floor((b + 255) / 2)})` // 柔和色
    ];

    // 随机打乱一下排列（把主色放第一位，其他的打乱）
    const shuffled = [colors[0], colors[3], colors[1], colors[4], colors[2]];

    shuffled.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = 'palette-color-item';
        div.style.backgroundColor = color;
        div.innerText = index === 0 ? '主色' : '辅色';
        div.onclick = function () {
            navigator.clipboard.writeText(color);
            alert(`已复制配色：${color}`);
        };
        blocksContainer.appendChild(div);
    });

    document.getElementById('palette-result').classList.remove('hidden');
}