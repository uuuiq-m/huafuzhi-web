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
        answer: 0 // 索引为 0 即第一项
    },
    {
        question: "2. 以下哪一个不是中国传统色？",
        options: ["黛蓝", "提香红", "胭脂", "缃色"],
        answer: 1 // 提香红是西方画家的颜色
    },
    {
        question: "3. “有服章之美谓之华”的下一句是？",
        options: ["衣袂飘飘若神仙", "华夏文明五千年", "有礼仪之大故称夏", "锦绣中华万代传"],
        answer: 2
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