/* ==========================================================================
   PETUALANGAN BILANGAN TRILIUNAN - DUAL-PLAYER INDEPENDENT ACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- APP GLOBAL STATE ---
    const state = {
        activeTab: 'tab-battle',
        activeMateriSubTab: 'subtab-dekomposisi',
        sortDir: 'asc',
        soundEnabled: true,
        
        // Battle State
        mode: 'campuran',
        campuranLevel: 'miliaran',
        totalRounds: 5,
        p1Name: 'Budi',
        p2Name: 'Siti',
        p1Score: 0,
        p2Score: 0,

        p1CurrentRound: 1,
        p2CurrentRound: 1,
        p1Question: null,
        p2Question: null,
        p1FinishedAll: false,
        p2FinishedAll: false,

        questionsSequence: { p1: [], p2: [] },

        // INDEPENDENT DUAL-PLAYER SELECTION STATE
        p1SelectedDigitVal: null,
        p2SelectedDigitVal: null,

        // GAME END TRACKING
        gameEnded: false,
        endGameTimer: null
    };

    // --- DOM REFERENCES ---
    const dom = {
        bgCanvas: document.getElementById('bg-canvas'),
        navBtns: document.querySelectorAll('.nav-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        btnSound: document.getElementById('btn-sound'),
        btnCert: document.getElementById('btn-cert'),
        certOverlay: document.getElementById('cert-overlay'),
        btnCloseCert: document.getElementById('btn-close-cert'),
        certNameInput: document.getElementById('cert-name-input'),

        // Welcome Hub & Home Elements
        welcomeHubOverlay: document.getElementById('welcome-hub-overlay'),
        btnSelectHubBattle: document.getElementById('btn-select-hub-battle'),
        btnSelectHubMateri: document.getElementById('btn-select-hub-materi'),
        btnHomeMenu: document.getElementById('btn-home-menu'),
        btnForceLandscape: document.getElementById('btn-force-landscape'),

        // Battle Elements
        startOverlay: document.getElementById('start-overlay'),
        victoryOverlay: document.getElementById('victory-overlay'),
        btnStartGame: document.getElementById('btn-start-game'),
        btnPlayAgain: document.getElementById('btn-play-again'),
        btnRestartTop: document.getElementById('btn-restart-battle-top'),
        btnRestartCenter: document.getElementById('btn-restart-battle-center'),
        p1NameInput: document.getElementById('p1-name-input'),
        p2NameInput: document.getElementById('p2-name-input'),
        p1DisplayName: document.getElementById('p1-display-name'),
        p2DisplayName: document.getElementById('p2-display-name'),
        p1Score: document.getElementById('p1-score'),
        p2Score: document.getElementById('p2-score'),
        p1RoundDisp: document.getElementById('p1-round-disp'),
        p2RoundDisp: document.getElementById('p2-round-disp'),
        totalRoundsDisps: document.querySelectorAll('.total-rounds-disp'),
        p1TargetNum: document.getElementById('p1-target-number'),
        p2TargetNum: document.getElementById('p2-target-number'),
        p1DigitGrid: document.getElementById('p1-digit-grid'),
        p2DigitGrid: document.getElementById('p2-digit-grid'),
        p1ModeTag: document.getElementById('p1-mode-tag'),
        p2ModeTag: document.getElementById('p2-mode-tag'),
        p1BtnCheck: document.getElementById('p1-btn-check'),
        p2BtnCheck: document.getElementById('p2-btn-check'),
        p1Feedback: document.getElementById('p1-feedback'),
        p2Feedback: document.getElementById('p2-feedback'),
        centerTokensContainer: document.getElementById('center-tokens-container'),
        p1SelectedDigitValDisp: document.getElementById('p1-selected-digit-val'),
        p2SelectedDigitValDisp: document.getElementById('p2-selected-digit-val'),
        winnerTitle: document.getElementById('winner-title'),
        winnerSubtitle: document.getElementById('winner-subtitle'),
        p1FinalName: document.getElementById('p1-final-name'),
        p2FinalName: document.getElementById('p2-final-name'),
        p1FinalScore: document.getElementById('p1-final-score'),
        p2FinalScore: document.getElementById('p2-final-score'),
        modeBtns: document.querySelectorAll('.btn-mode'),
        campuranLevelContainer: document.getElementById('campuran-level-container'),
        campuranLevelBtns: document.querySelectorAll('.btn-campuran-level'),
        roundBtns: document.querySelectorAll('.btn-round'),

        // Materi Guru Elements
        subTabBtns: document.querySelectorAll('.sub-tab-btn'),
        materiSubContents: document.querySelectorAll('.materi-sub-content'),

        // Subtab 1 Dekomposisi
        materiNumInput: document.getElementById('materi-num-input'),
        btnSpeakMateri: document.getElementById('btn-speak-materi'),
        materiWordsText: document.getElementById('materi-words-text'),
        materiMatrixGrid: document.getElementById('materi-matrix-grid'),
        materiExpansionText: document.getElementById('materi-expansion-text'),
        btnPresets: document.querySelectorAll('.btn-preset'),

        // Subtab 2 Membandingkan Bilangan
        compareNumA: document.getElementById('compare-num-a'),
        compareNumB: document.getElementById('compare-num-b'),
        compareWordsA: document.getElementById('compare-words-a'),
        compareWordsB: document.getElementById('compare-words-b'),
        compareOpBadge: document.getElementById('compare-op-badge'),
        compareOpText: document.getElementById('compare-op-text'),
        compareVerdictBanner: document.getElementById('compare-verdict-banner'),
        compareStepsList: document.getElementById('compare-steps-list'),
        btnSpeakCompare: document.getElementById('btn-speak-compare'),
        btnRandomCompare: document.getElementById('btn-random-compare'),
        comparePresets: document.querySelectorAll('.btn-compare-preset'),

        // Subtab 3 Mengurutkan Bilangan
        sortNumInputs: document.querySelectorAll('.sort-num-input'),
        btnSortDirs: document.querySelectorAll('.btn-sort-dir'),
        btnRandomSort: document.getElementById('btn-random-sort'),
        sortPresets: document.querySelectorAll('.btn-sort-preset'),
        sortResultTitle: document.getElementById('sort-result-title'),
        sortedCardsContainer: document.getElementById('sorted-cards-container'),
        sortAnalysisSteps: document.getElementById('sort-analysis-steps')
    };

    // --- AUDIO SYNTH ENGINE ---
    const AudioEngine = {
        ctx: null,
        init() {
            if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        },
        play(type) {
            if (!state.soundEnabled) return;
            this.init();
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            const now = this.ctx.currentTime;

            if (type === 'correct') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                osc.start(now); osc.stop(now + 0.35);
            } else if (type === 'wrong') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.start(now); osc.stop(now + 0.25);
            } else if (type === 'drag') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                osc.start(now); osc.stop(now + 0.08);
            } else if (type === 'win') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.4);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                osc.start(now); osc.stop(now + 0.6);
            }
        }
    };

    // --- TAB NAVIGATION ENGINE ---
    function switchTab(targetTab) {
        dom.navBtns.forEach(b => b.classList.remove('active'));
        dom.tabContents.forEach(tc => tc.classList.remove('active'));

        const btn = document.querySelector(`.nav-btn[data-tab="${targetTab}"]`);
        if (btn) btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        state.activeTab = targetTab;

        if (targetTab === 'tab-materi') renderMateriTab();
    }

    dom.navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // WELCOME HUB LISTENERS
    dom.btnSelectHubBattle.addEventListener('click', () => {
        AudioEngine.play('drag');
        dom.welcomeHubOverlay.classList.remove('active');
        switchTab('tab-battle');
        dom.startOverlay.classList.add('active');
    });

    dom.btnSelectHubMateri.addEventListener('click', () => {
        AudioEngine.play('drag');
        dom.welcomeHubOverlay.classList.remove('active');
        switchTab('tab-materi');
    });

    dom.btnHomeMenu.addEventListener('click', () => {
        AudioEngine.play('drag');
        dom.welcomeHubOverlay.classList.add('active');
    });

    function formatDots(numStr) {
        return numStr.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // --- COLOR-CODED INDONESIAN TERBILANG ALGORITHM ---
    function terbilangIndonesianColored(nStr) {
        const raw = nStr.replace(/\D/g, '');
        if (!raw || raw === '0') return '<span class="word-segment" style="color: #94a3b8">Nol</span>';
        let n = BigInt(raw);

        const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

        function convertUnderThousand(num) {
            let str = '';
            num = Number(num);
            if (num >= 100) {
                const ratus = Math.floor(num / 100);
                if (ratus === 1) str += 'Seratus ';
                else str += satuan[ratus] + ' Ratus ';
                num %= 100;
            }
            if (num >= 12) {
                const puluh = Math.floor(num / 10);
                str += satuan[puluh] + ' Puluh ';
                num %= 10;
                if (num > 0) str += satuan[num] + ' ';
            } else if (num > 0) {
                str += satuan[num] + ' ';
            }
            return str.trim();
        }

        const units = [
            { name: 'Triliun', val: 1000000000000n, color: '#a855f7' },
            { name: 'Miliar', val: 1000000000n, color: '#06b6d4' },
            { name: 'Juta', val: 1000000n, color: '#10b981' },
            { name: 'Ribu', val: 1000n, color: '#f59e0b' }
        ];

        let segments = [];
        let current = n;

        for (let u of units) {
            if (current >= u.val) {
                let count = current / u.val;
                current %= u.val;
                let phrase = '';
                if (u.name === 'Ribu' && count === 1n && n < 2000n) {
                    phrase = 'Seribu';
                } else {
                    phrase = convertUnderThousand(count) + ' ' + u.name;
                }
                segments.push(`<span class="word-segment" style="color: ${u.color}">${phrase}</span>`);
            }
        }

        if (current > 0n) {
            let phrase = convertUnderThousand(current);
            segments.push(`<span class="word-segment" style="color: #f97316">${phrase}</span>`);
        }

        return segments.join(' ');
    }

    const ALL_PV_LEVELS = {
        triliunan: [
            { key: 'triliunan', label: 'Triliunan' },
            { key: 'ratusan_miliar', label: 'Ratusan Miliar' },
            { key: 'puluhan_miliar', label: 'Puluhan Miliar' },
            { key: 'miliaran', label: 'Miliaran' },
            { key: 'ratusan_juta', label: 'Ratusan Juta' },
            { key: 'puluhan_juta', label: 'Puluhan Juta' },
            { key: 'jutaan', label: 'Jutaan' },
            { key: 'ratusan_ribu', label: 'Ratusan Ribu' },
            { key: 'puluhan_ribu', label: 'Puluhan Ribu' },
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        miliaran: [
            { key: 'miliaran', label: 'Miliaran' },
            { key: 'ratusan_juta', label: 'Ratusan Juta' },
            { key: 'puluhan_juta', label: 'Puluhan Juta' },
            { key: 'jutaan', label: 'Jutaan' },
            { key: 'ratusan_ribu', label: 'Ratusan Ribu' },
            { key: 'puluhan_ribu', label: 'Puluhan Ribu' },
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        ratusan_juta: [
            { key: 'ratusan_juta', label: 'Ratusan Juta' },
            { key: 'puluhan_juta', label: 'Puluhan Juta' },
            { key: 'jutaan', label: 'Jutaan' },
            { key: 'ratusan_ribu', label: 'Ratusan Ribu' },
            { key: 'puluhan_ribu', label: 'Puluhan Ribu' },
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        puluhan_juta: [
            { key: 'puluhan_juta', label: 'Puluhan Juta' },
            { key: 'jutaan', label: 'Jutaan' },
            { key: 'ratusan_ribu', label: 'Ratusan Ribu' },
            { key: 'puluhan_ribu', label: 'Puluhan Ribu' },
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        jutaan: [
            { key: 'jutaan', label: 'Jutaan' },
            { key: 'ratusan_ribu', label: 'Ratusan Ribu' },
            { key: 'puluhan_ribu', label: 'Puluhan Ribu' },
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        ratusan_ribu: [
            { key: 'ratusan_ribu', label: 'Ratusan Ribu' },
            { key: 'puluhan_ribu', label: 'Puluhan Ribu' },
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        puluhan_ribu: [
            { key: 'puluhan_ribu', label: 'Puluhan Ribu' },
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        ribuan: [
            { key: 'ribuan', label: 'Ribuan' },
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ],
        ratusan: [
            { key: 'ratusan', label: 'Ratusan' },
            { key: 'puluhan', label: 'Puluhan' },
            { key: 'satuan', label: 'Satuan' }
        ]
    };

    const PV_LEVEL_ORDER = [
        'ratusan',
        'ribuan',
        'puluhan_ribu',
        'ratusan_ribu',
        'jutaan',
        'puluhan_juta',
        'ratusan_juta',
        'miliaran',
        'triliunan'
    ];

    function generateQuestionsSequence() {
        const usedNumbers = new Set();
        const seqP1 = [];
        const seqP2 = [];

        let allowedLevels = [];
        if (state.mode === 'campuran') {
            const ceilingKey = state.campuranLevel || 'miliaran';
            const maxIdx = PV_LEVEL_ORDER.indexOf(ceilingKey);
            allowedLevels = PV_LEVEL_ORDER.slice(0, maxIdx >= 0 ? maxIdx + 1 : PV_LEVEL_ORDER.length);
        } else {
            allowedLevels = [state.mode];
        }

        for (let r = 1; r <= state.totalRounds; r++) {
            let levelKey;
            if (state.mode === 'campuran') {
                levelKey = allowedLevels[Math.floor(Math.random() * allowedLevels.length)];
            } else {
                levelKey = state.mode;
            }

            const pvDefList = ALL_PV_LEVELS[levelKey] || ALL_PV_LEVELS.ribuan;
            const numDigits = pvDefList.length;

            // Unique question for Player 1
            let digitsP1, numStrP1, attemptsP1 = 0;
            do {
                digitsP1 = [];
                for (let i = 0; i < numDigits; i++) {
                    digitsP1.push(i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10));
                }
                numStrP1 = digitsP1.join('');
                attemptsP1++;
            } while (usedNumbers.has(numStrP1) && attemptsP1 < 100);
            usedNumbers.add(numStrP1);

            // Unique question for Player 2 (different from P1 and prior numbers)
            let digitsP2, numStrP2, attemptsP2 = 0;
            do {
                digitsP2 = [];
                for (let i = 0; i < numDigits; i++) {
                    digitsP2.push(i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10));
                }
                numStrP2 = digitsP2.join('');
                attemptsP2++;
            } while (usedNumbers.has(numStrP2) && attemptsP2 < 100);
            usedNumbers.add(numStrP2);

            const formattedP1 = formatDots(numStrP1);
            const formattedP2 = formatDots(numStrP2);

            seqP1.push({ roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), formattedNumber: formattedP1, digits: digitsP1, pvDefList });
            seqP2.push({ roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), formattedNumber: formattedP2, digits: digitsP2, pvDefList });
        }

        return { p1: seqP1, p2: seqP2 };
    }

    function buildPlayerQuestionFromSeq(pKey, roundIndex) {
        const qData = state.questionsSequence[pKey][roundIndex];
        const targetSlots = qData.pvDefList.map((pv, idx) => ({
            pvKey: pv.key,
            label: pv.label,
            expectedDigit: qData.digits[idx],
            filled: false,
            filledDigit: null,
            status: 'neutral'
        }));

        return {
            playerKey: pKey,
            roundIndex: roundIndex,
            levelName: qData.levelName,
            formattedNumber: qData.formattedNumber,
            targetSlots: targetSlots,
            isComplete: false
        };
    }

    function initBattle() {
        state.questionsSequence = generateQuestionsSequence();

        state.p1Score = 0;
        state.p2Score = 0;
        dom.p1Score.textContent = 0;
        dom.p2Score.textContent = 0;

        state.p1CurrentRound = 1;
        state.p2CurrentRound = 1;
        state.p1FinishedAll = false;
        state.p2FinishedAll = false;

        state.gameEnded = false;
        if (state.endGameTimer) {
            clearTimeout(state.endGameTimer);
            state.endGameTimer = null;
        }

        // Reset independent player selections
        state.p1SelectedDigitVal = null;
        state.p2SelectedDigitVal = null;
        dom.p1SelectedDigitValDisp.textContent = '-';
        dom.p2SelectedDigitValDisp.textContent = '-';

        dom.totalRoundsDisps.forEach(d => d.textContent = state.totalRounds);
        dom.p1RoundDisp.textContent = 1;
        dom.p2RoundDisp.textContent = 1;

        dom.p1Feedback.textContent = ''; dom.p1Feedback.className = 'feedback-msg';
        dom.p2Feedback.textContent = ''; dom.p2Feedback.className = 'feedback-msg';

        state.p1Question = buildPlayerQuestionFromSeq('p1', 0);
        state.p2Question = buildPlayerQuestionFromSeq('p2', 0);

        renderPlayerSingleSoal('p1', state.p1Question);
        renderPlayerSingleSoal('p2', state.p2Question);
        renderStaticCenterDigitsGrid();
    }

    function restartBattle() {
        AudioEngine.play('drag');
        initBattle();
        dom.p1Feedback.textContent = '🔄 Game diulang! Soal baru siap dikerjakan.';
        dom.p1Feedback.className = 'feedback-msg correct';
        dom.p2Feedback.textContent = '🔄 Game diulang! Soal baru siap dikerjakan.';
        dom.p2Feedback.className = 'feedback-msg correct';
        setTimeout(() => {
            dom.p1Feedback.textContent = '';
            dom.p2Feedback.textContent = '';
        }, 1500);
    }

    dom.btnRestartTop.addEventListener('click', restartBattle);
    dom.btnRestartCenter.addEventListener('click', restartBattle);

    function renderPlayerSingleSoal(pKey, question) {
        const numDisplay = pKey === 'p1' ? dom.p1TargetNum : dom.p2TargetNum;
        const grid = pKey === 'p1' ? dom.p1DigitGrid : dom.p2DigitGrid;
        const tag = pKey === 'p1' ? dom.p1ModeTag : dom.p2ModeTag;
        const roundDisp = pKey === 'p1' ? dom.p1RoundDisp : dom.p2RoundDisp;

        numDisplay.textContent = question.formattedNumber;
        tag.textContent = question.levelName;
        roundDisp.textContent = (pKey === 'p1' ? state.p1CurrentRound : state.p2CurrentRound);

        grid.innerHTML = '';
        question.targetSlots.forEach((slot, idx) => {
            const boxEl = document.createElement('div');
            let statusClass = '';
            if (slot.status === 'correct') statusClass = 'checked-correct';
            if (slot.status === 'wrong') statusClass = 'checked-wrong';

            boxEl.className = `digit-box ${slot.filled ? 'filled' : ''} ${statusClass}`;
            boxEl.dataset.player = pKey;
            boxEl.dataset.slotIndex = idx;
            boxEl.dataset.pv = slot.pvKey;

            boxEl.innerHTML = `
                <span class="digit-pv-label">${slot.label}</span>
                <span class="digit-slot">${slot.filled ? slot.filledDigit : '?'}</span>
            `;

            // INDEPENDENT CLICK TO PLACE FOR P1 & P2
            boxEl.addEventListener('click', () => {
                const selectedVal = pKey === 'p1' ? state.p1SelectedDigitVal : state.p2SelectedDigitVal;
                if (selectedVal !== null && !question.isComplete) {
                    placeDigitInSlot(pKey, idx, selectedVal);
                }
            });

            // INDEPENDENT DRAG & DROP FOR P1 & P2
            boxEl.addEventListener('dragover', (e) => { e.preventDefault(); boxEl.classList.add('drag-over'); });
            boxEl.addEventListener('dragleave', () => boxEl.classList.remove('drag-over'));
            boxEl.addEventListener('drop', (e) => {
                e.preventDefault();
                boxEl.classList.remove('drag-over');
                const val = parseInt(e.dataTransfer.getData('text/plain'));
                if (!isNaN(val) && !question.isComplete) {
                    placeDigitInSlot(pKey, idx, val);
                }
            });

            grid.appendChild(boxEl);
        });
    }

    function placeDigitInSlot(pKey, slotIdx, digitVal) {
        AudioEngine.play('drag');
        const question = pKey === 'p1' ? state.p1Question : state.p2Question;
        const targetSlot = question.targetSlots[slotIdx];

        targetSlot.filled = true;
        targetSlot.filledDigit = digitVal;
        targetSlot.status = 'neutral';

        renderPlayerSingleSoal(pKey, question);
    }

    // STATIC CENTER GRID OF DIGITS 0 TO 9 (DUAL INDEPENDENT PLAYERS)
    function renderStaticCenterDigitsGrid() {
        dom.centerTokensContainer.innerHTML = '';
        const staticDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        staticDigits.forEach((digitVal) => {
            const tokenEl = document.createElement('div');

            let selectClass = '';
            const isP1 = state.p1SelectedDigitVal === digitVal;
            const isP2 = state.p2SelectedDigitVal === digitVal;
            if (isP1 && isP2) selectClass = 'selected-both';
            else if (isP1) selectClass = 'selected-p1';
            else if (isP2) selectClass = 'selected-p2';

            tokenEl.className = `digit-token-static ${selectClass}`;
            tokenEl.textContent = digitVal;
            tokenEl.draggable = true;

            // CLICK SELECTION - SETS FOR BOTH P1 & P2 INDEPENDENTLY
            tokenEl.addEventListener('click', (e) => {
                AudioEngine.play('drag');
                // Set both or whichever clicked
                state.p1SelectedDigitVal = digitVal;
                state.p2SelectedDigitVal = digitVal;
                dom.p1SelectedDigitValDisp.textContent = digitVal;
                dom.p2SelectedDigitValDisp.textContent = digitVal;
                renderStaticCenterDigitsGrid();
            });

            // DRAG START (SIMULTANEOUS DUAL PLAYER DRAG)
            tokenEl.addEventListener('dragstart', (e) => {
                AudioEngine.play('drag');
                e.dataTransfer.setData('text/plain', digitVal);
            });

            dom.centerTokensContainer.appendChild(tokenEl);
        });
    }

    dom.p1BtnCheck.addEventListener('click', () => checkPlayerAnswer('p1'));
    dom.p2BtnCheck.addEventListener('click', () => checkPlayerAnswer('p2'));

    function checkPlayerAnswer(pKey) {
        const question = pKey === 'p1' ? state.p1Question : state.p2Question;
        const feedbackEl = pKey === 'p1' ? dom.p1Feedback : dom.p2Feedback;

        if (question.isComplete) return;

        let allFilled = true;
        let allCorrect = true;

        question.targetSlots.forEach(slot => {
            if (!slot.filled) {
                allFilled = false;
                slot.status = 'wrong';
            } else if (slot.filledDigit === slot.expectedDigit) {
                slot.status = 'correct';
            } else {
                slot.status = 'wrong';
                allCorrect = false;
            }
        });

        renderPlayerSingleSoal(pKey, question);

        if (!allFilled) {
            AudioEngine.play('wrong');
            feedbackEl.textContent = '❌ Isilah semua kotak nilai tempat terlebih dahulu!';
            feedbackEl.className = 'feedback-msg wrong';
        } else if (allCorrect) {
            AudioEngine.play('correct');
            question.isComplete = true;

            if (pKey === 'p1') {
                state.p1Score += 100 * question.targetSlots.length;
                dom.p1Score.textContent = state.p1Score;

                if (state.p1CurrentRound < state.totalRounds) {
                    state.p1CurrentRound++;
                    state.p1Question = buildPlayerQuestionFromSeq('p1', state.p1CurrentRound - 1);
                    feedbackEl.textContent = `🔥 BENAR! Kamu duluan masuk ke RONDE ${state.p1CurrentRound}! (${state.p1Question.levelName})`;
                    feedbackEl.className = 'feedback-msg correct';
                    setTimeout(() => {
                        feedbackEl.textContent = '';
                        renderPlayerSingleSoal('p1', state.p1Question);
                    }, 1200);
                } else {
                    state.p1FinishedAll = true;
                    feedbackEl.textContent = '🏆 SELAMAT! Kamu telah menyelesaikan SELURUH RONDE!';
                    feedbackEl.className = 'feedback-msg correct';
                    checkEndGame();
                }
            } else {
                state.p2Score += 100 * question.targetSlots.length;
                dom.p2Score.textContent = state.p2Score;

                if (state.p2CurrentRound < state.totalRounds) {
                    state.p2CurrentRound++;
                    state.p2Question = buildPlayerQuestionFromSeq('p2', state.p2CurrentRound - 1);
                    feedbackEl.textContent = `🔥 BENAR! Kamu duluan masuk ke RONDE ${state.p2CurrentRound}! (${state.p2Question.levelName})`;
                    feedbackEl.className = 'feedback-msg correct';
                    setTimeout(() => {
                        feedbackEl.textContent = '';
                        renderPlayerSingleSoal('p2', state.p2Question);
                    }, 1200);
                } else {
                    state.p2FinishedAll = true;
                    feedbackEl.textContent = '🏆 SELAMAT! Kamu telah menyelesaikan SELURUH RONDE!';
                    feedbackEl.className = 'feedback-msg correct';
                    checkEndGame();
                }
            }

        } else {
            AudioEngine.play('wrong');
            feedbackEl.textContent = '⚠️ Ada digit yang belum pas (kotak merah). Ayo perbaiki!';
            feedbackEl.className = 'feedback-msg wrong';
            if (pKey === 'p1') state.p1Score = Math.max(0, state.p1Score - 20);
            else state.p2Score = Math.max(0, state.p2Score - 20);
            dom.p1Score.textContent = state.p1Score;
            dom.p2Score.textContent = state.p2Score;
        }
    }

    function checkEndGame() {
        if (state.gameEnded) return;

        if (state.p1FinishedAll && state.p2FinishedAll) {
            if (state.endGameTimer) clearTimeout(state.endGameTimer);
            state.endGameTimer = setTimeout(endGame, 1000);
        } else if (state.p1FinishedAll || state.p2FinishedAll) {
            if (!state.endGameTimer) {
                state.endGameTimer = setTimeout(endGame, 4000);
            }
        }
    }

    function endGame() {
        if (state.gameEnded) return;
        state.gameEnded = true;

        AudioEngine.play('win');
        dom.victoryOverlay.classList.add('active');
        dom.p1FinalName.textContent = state.p1Name;
        dom.p2FinalName.textContent = state.p2Name;
        dom.p1FinalScore.textContent = state.p1Score;
        dom.p2FinalScore.textContent = state.p2Score;

        if (state.p1Score > state.p2Score) {
            dom.winnerTitle.textContent = `🏆 ${state.p1Name.toUpperCase()} MENANG!`;
            dom.winnerSubtitle.textContent = `Selamat! ${state.p1Name} memimpin skor dan kecepatan ronde!`;
        } else if (state.p2Score > state.p1Score) {
            dom.winnerTitle.textContent = `🏆 ${state.p2Name.toUpperCase()} MENANG!`;
            dom.winnerSubtitle.textContent = `Selamat! ${state.p2Name} memimpin skor dan kecepatan ronde!`;
        } else {
            dom.winnerTitle.textContent = `🤝 HASIL SERI!`;
            dom.winnerSubtitle.textContent = `Kedua pemain memiliki ketepatan nilai tempat yang sangat luar biasa!`;
        }
    }

    // --- TAB 2: MATERI GURU INTERAKTIF ENGINE ---
    function renderMateriTab() {
        const rawDigits = dom.materiNumInput.value.replace(/\D/g, '') || '0';
        dom.materiNumInput.value = formatDots(rawDigits);

        // 1. COLOR-CODED TERJEMAHAN BAHASA INDONESIA
        const coloredHTML = terbilangIndonesianColored(rawDigits);
        dom.materiWordsText.innerHTML = coloredHTML;

        // 2. PLACE VALUE BREAKDOWN MATRIX
        const paddedDigits = rawDigits.padStart(15, '0');
        const listPV = [
            { name: 'Ratus Triliun', group: 'Triliun', color: 'var(--col-ratusan)' },
            { name: 'Puluh Triliun', group: 'Triliun', color: 'var(--col-puluhan)' },
            { name: 'Triliun', group: 'Triliun', color: 'var(--col-satuan)' },
            { name: 'Ratus Miliar', group: 'Miliar', color: 'var(--col-miliaran)' },
            { name: 'Puluh Miliar', group: 'Miliar', color: 'var(--col-miliaran)' },
            { name: 'Miliar', group: 'Miliar', color: 'var(--col-miliaran)' },
            { name: 'Ratus Juta', group: 'Juta', color: 'var(--col-jutaan)' },
            { name: 'Puluh Juta', group: 'Juta', color: 'var(--col-jutaan)' },
            { name: 'Juta', group: 'Juta', color: 'var(--col-jutaan)' },
            { name: 'Ratus Ribu', group: 'Ribu', color: 'var(--col-ribuan)' },
            { name: 'Puluh Ribu', group: 'Ribu', color: 'var(--col-ribuan)' },
            { name: 'Ribuan', group: 'Ribu', color: 'var(--col-ribuan)' },
            { name: 'Ratusan', group: 'Satuan', color: 'var(--col-ratusan)' },
            { name: 'Puluhan', group: 'Satuan', color: 'var(--col-puluhan)' },
            { name: 'Satuan', group: 'Satuan', color: 'var(--col-satuan)' }
        ];

        dom.materiMatrixGrid.innerHTML = '';
        paddedDigits.split('').forEach((d, idx) => {
            const pv = listPV[idx] || { name: 'Satuan', group: 'Satuan', color: 'var(--col-satuan)' };
            const col = document.createElement('div');
            col.className = 'matrix-col';
            col.innerHTML = `
                <span class="col-group-title" style="background:${pv.color}">${pv.group}</span>
                <span class="col-pv-name">${pv.name}</span>
                <span class="col-digit-val">${d}</span>
            `;
            dom.materiMatrixGrid.appendChild(col);
        });

        // 3. EXPANDED FORM NOTATION
        const expansionParts = [];
        const mults = [
            '100.000.000.000.000', '10.000.000.000.000', '1.000.000.000.000',
            '100.000.000.000', '10.000.000.000', '1.000.000.000',
            '100.000.000', '10.000.000', '1.000.000',
            '100.000', '10.000', '1.000',
            '100', '10', '1'
        ];

        paddedDigits.split('').forEach((d, idx) => {
            if (d !== '0') {
                expansionParts.push(`(${d} x ${mults[idx]})`);
            }
        });

        dom.materiExpansionText.textContent = expansionParts.length > 0 ? expansionParts.join(' + ') : '0';
    }

    // MATERI INPUT LISTENERS
    dom.materiNumInput.addEventListener('input', renderMateriTab);

    dom.btnPresets.forEach(btn => {
        btn.addEventListener('click', () => {
            AudioEngine.play('drag');
            dom.materiNumInput.value = btn.dataset.num;
            renderMateriTab();
        });
    });

    dom.btnSpeakMateri.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            const textToSpeak = dom.materiWordsText.textContent;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'id-ID';
            window.speechSynthesis.speak(utterance);
        }
    });

    // --- TERBILANG PLAIN TEXT HELPER ---
    function terbilangTextPlain(nStr) {
        const raw = nStr.replace(/\D/g, '');
        if (!raw || raw === '0') return 'Nol';
        let n = BigInt(raw);
        const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

        function convertUnderThousand(num) {
            let str = '';
            num = Number(num);
            if (num >= 100) {
                const ratus = Math.floor(num / 100);
                if (ratus === 1) str += 'Seratus ';
                else str += satuan[ratus] + ' Ratus ';
                num %= 100;
            }
            if (num >= 12) {
                const puluh = Math.floor(num / 10);
                str += satuan[puluh] + ' Puluh ';
                num %= 10;
                if (num > 0) str += satuan[num] + ' ';
            } else if (num > 0) {
                str += satuan[num] + ' ';
            }
            return str.trim();
        }

        const units = [
            { name: 'Triliun', val: 1000000000000n },
            { name: 'Miliar', val: 1000000000n },
            { name: 'Juta', val: 1000000n },
            { name: 'Ribu', val: 1000n }
        ];

        let segments = [];
        let current = n;

        for (let u of units) {
            if (current >= u.val) {
                let count = current / u.val;
                current %= u.val;
                let phrase = '';
                if (u.name === 'Ribu' && count === 1n && n < 2000n) {
                    phrase = 'Seribu';
                } else {
                    phrase = convertUnderThousand(count) + ' ' + u.name;
                }
                segments.push(phrase);
            }
        }

        if (current > 0n) {
            segments.push(convertUnderThousand(current));
        }

        return segments.join(' ');
    }

    // --- SUBTAB 2: MEMBANDINGKAN BILANGAN ENGINE ---
    function renderCompareModule() {
        if (!dom.compareNumA || !dom.compareNumB) return;
        const rawA = dom.compareNumA.value.replace(/\D/g, '') || '0';
        const rawB = dom.compareNumB.value.replace(/\D/g, '') || '0';

        dom.compareNumA.value = formatDots(rawA);
        dom.compareNumB.value = formatDots(rawB);

        const valA = BigInt(rawA);
        const valB = BigInt(rawB);

        const wordsA = terbilangTextPlain(rawA);
        const wordsB = terbilangTextPlain(rawB);
        if (dom.compareWordsA) dom.compareWordsA.textContent = wordsA;
        if (dom.compareWordsB) dom.compareWordsB.textContent = wordsB;

        let op = '=';
        let opText = 'Sama Dengan';
        let opColor = '#fde047';
        let verdictText = '';

        if (valA > valB) {
            op = '>';
            opText = 'Lebih Besar Dari ( > )';
            opColor = '#4ade80';
            verdictText = `Bilangan A <strong>(${formatDots(rawA)})</strong> LEBIH BESAR dari Bilangan B <strong>(${formatDots(rawB)})</strong>`;
        } else if (valA < valB) {
            op = '<';
            opText = 'Lebih Kecil Dari ( < )';
            opColor = '#f87171';
            verdictText = `Bilangan A <strong>(${formatDots(rawA)})</strong> LEBIH KECIL dari Bilangan B <strong>(${formatDots(rawB)})</strong>`;
        } else {
            op = '=';
            opText = 'Sama Dengan ( = )';
            opColor = '#38bdf8';
            verdictText = `Bilangan A <strong>(${formatDots(rawA)})</strong> SAMA DENGAN Bilangan B <strong>(${formatDots(rawB)})</strong>`;
        }

        if (dom.compareOpBadge) {
            dom.compareOpBadge.textContent = op;
            dom.compareOpBadge.style.background = opColor;
        }
        if (dom.compareOpText) dom.compareOpText.textContent = opText;
        if (dom.compareVerdictBanner) dom.compareVerdictBanner.innerHTML = verdictText;

        const steps = [];
        const lenA = rawA.length;
        const lenB = rawB.length;

        steps.push(`📌 <strong>Langkah 1 (Banyak Digit):</strong> Bilangan A mempunyai <strong>${lenA} digit</strong>, sedangkan Bilangan B mempunyai <strong>${lenB} digit</strong>.`);

        if (lenA !== lenB) {
            if (lenA > lenB) {
                steps.push(`💡 <strong>Langkah 2 (Bandingkan Banyak Digit):</strong> Karena Bilangan A memiliki digit lebih banyak (${lenA} > ${lenB}), maka Bilangan A dipastikan <strong>lebih besar</strong> dari Bilangan B.`);
            } else {
                steps.push(`💡 <strong>Langkah 2 (Bandingkan Banyak Digit):</strong> Karena Bilangan B memiliki digit lebih banyak (${lenB} > ${lenA}), maka Bilangan A dipastikan <strong>lebih kecil</strong> dari Bilangan B.`);
            }
        } else {
            steps.push(`💡 <strong>Langkah 2 (Bandingkan Nilai Tempat dari Paling Kiri):</strong> Karena jumlah digit sama (${lenA} digit), kita amati angka dari nilai tempat terbesar:`);
            
            let foundDiff = false;
            const PV_NAMES_15 = ['Ratus Triliun', 'Puluh Triliun', 'Triliun', 'Ratus Miliar', 'Puluh Miliar', 'Miliar', 'Ratus Juta', 'Puluh Juta', 'Juta', 'Ratus Ribu', 'Puluh Ribu', 'Ribuan', 'Ratusan', 'Puluhan', 'Satuan'];
            
            const padA = rawA.padStart(15, '0');
            const padB = rawB.padStart(15, '0');

            for (let i = 0; i < 15; i++) {
                if (padA[i] !== padB[i]) {
                    const pvName = PV_NAMES_15[i];
                    steps.push(`👉 <strong>Perbedaan Pertama Ada di Nilai Tempat ${pvName}:</strong> Digit A = <strong>${padA[i]}</strong> vs Digit B = <strong>${padB[i]}</strong>.`);
                    if (padA[i] > padB[i]) {
                        steps.push(`✅ <strong>Kesimpulan:</strong> Karena ${padA[i]} > ${padB[i]} pada nilai tempat ${pvName}, maka Bilangan A > Bilangan B.`);
                    } else {
                        steps.push(`✅ <strong>Kesimpulan:</strong> Karena ${padA[i]} < ${padB[i]} pada nilai tempat ${pvName}, maka Bilangan A < Bilangan B.`);
                    }
                    foundDiff = true;
                    break;
                }
            }

            if (!foundDiff) {
                steps.push(`✅ <strong>Kesimpulan:</strong> Seluruh digit pada setiap nilai tempat dari kiri ke kanan sama persis, sehingga Bilangan A = Bilangan B.`);
            }
        }

        if (dom.compareStepsList) {
            dom.compareStepsList.innerHTML = steps.map(s => `<div class="reason-step-item">${s}</div>`).join('');
        }
    }

    // --- SUBTAB 3: MENGURUTKAN BILANGAN ENGINE ---
    function renderSortingModule() {
        if (!dom.sortNumInputs || dom.sortNumInputs.length === 0) return;

        const items = [];
        dom.sortNumInputs.forEach((input, idx) => {
            const raw = input.value.replace(/\D/g, '') || '0';
            input.value = formatDots(raw);
            items.push({
                origIdx: idx + 1,
                raw: raw,
                val: BigInt(raw),
                formatted: formatDots(raw),
                words: terbilangTextPlain(raw)
            });
        });

        const isAsc = state.sortDir === 'asc';
        items.sort((a, b) => {
            if (a.val < b.val) return isAsc ? -1 : 1;
            if (a.val > b.val) return isAsc ? 1 : -1;
            return 0;
        });

        if (dom.sortResultTitle) {
            dom.sortResultTitle.textContent = isAsc 
                ? '🏆 HASIL URUTAN DARI TERKECIL KE TERBESAR (NAIK ↗️):' 
                : '🏆 HASIL URUTAN DARI TERBESAR KE TERKECIL (TURUN ↘️):';
        }

        if (dom.sortedCardsContainer) {
            let html = '';
            items.forEach((item, rankIdx) => {
                html += `
                    <div class="sorted-card-item">
                        <span class="rank-badge">Urutan #${rankIdx + 1}</span>
                        <span class="sorted-val-disp">${item.formatted}</span>
                        <span class="sorted-words-sm">${item.words}</span>
                    </div>
                `;
                if (rankIdx < items.length - 1) {
                    html += `<div class="sort-arrow">➔</div>`;
                }
            });
            dom.sortedCardsContainer.innerHTML = html;
        }

        if (dom.sortAnalysisSteps) {
            const stepsHtml = items.map((item, rankIdx) => 
                `<div class="reason-step-item">Urutan #${rankIdx + 1}: <strong>${item.formatted}</strong> (${item.raw.length} Digit - ${item.words})</div>`
            ).join('');
            dom.sortAnalysisSteps.innerHTML = `<div class="reasoning-steps-list"><span class="preset-label">📊 Rincian Urutan:</span>${stepsHtml}</div>`;
        }
    }

    // MATERI SUB-TAB NAVIGATION LISTENERS
    if (dom.subTabBtns) {
        dom.subTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dom.subTabBtns.forEach(b => b.classList.remove('active'));
                dom.materiSubContents.forEach(sc => sc.classList.remove('active'));

                btn.classList.add('active');
                const targetSub = btn.dataset.subtab;
                const targetEl = document.getElementById(targetSub);
                if (targetEl) targetEl.classList.add('active');

                state.activeMateriSubTab = targetSub;

                if (targetSub === 'subtab-dekomposisi') renderMateriTab();
                if (targetSub === 'subtab-banding') renderCompareModule();
                if (targetSub === 'subtab-urut') renderSortingModule();
            });
        });
    }

    // COMPARE LISTENERS
    if (dom.compareNumA) dom.compareNumA.addEventListener('input', renderCompareModule);
    if (dom.compareNumB) dom.compareNumB.addEventListener('input', renderCompareModule);

    if (dom.comparePresets) {
        dom.comparePresets.forEach(btn => {
            btn.addEventListener('click', () => {
                AudioEngine.play('drag');
                dom.compareNumA.value = btn.dataset.a;
                dom.compareNumB.value = btn.dataset.b;
                renderCompareModule();
            });
        });
    }

    if (dom.btnRandomCompare) {
        dom.btnRandomCompare.addEventListener('click', () => {
            AudioEngine.play('drag');
            const randDigits = Math.floor(Math.random() * 8) + 4;
            let a = '', b = '';
            for (let i = 0; i < randDigits; i++) {
                a += i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
                b += i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
            }
            dom.compareNumA.value = formatDots(a);
            dom.compareNumB.value = formatDots(b);
            renderCompareModule();
        });
    }

    if (dom.btnSpeakCompare) {
        dom.btnSpeakCompare.addEventListener('click', () => {
            if ('speechSynthesis' in window && dom.compareVerdictBanner) {
                const textToSpeak = dom.compareVerdictBanner.textContent;
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'id-ID';
                window.speechSynthesis.speak(utterance);
            }
        });
    }

    // SORTING LISTENERS
    if (dom.sortNumInputs) {
        dom.sortNumInputs.forEach(input => {
            input.addEventListener('input', renderSortingModule);
        });
    }

    if (dom.btnSortDirs) {
        dom.btnSortDirs.forEach(btn => {
            btn.addEventListener('click', () => {
                dom.btnSortDirs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.sortDir = btn.dataset.dir;
                renderSortingModule();
            });
        });
    }

    if (dom.sortPresets) {
        dom.sortPresets.forEach(btn => {
            btn.addEventListener('click', () => {
                AudioEngine.play('drag');
                const nums = btn.dataset.nums.split(',');
                nums.forEach((n, idx) => {
                    const el = document.getElementById(`sort-in-${idx}`);
                    if (el) el.value = formatDots(n);
                });
                renderSortingModule();
            });
        });
    }

    if (dom.btnRandomSort) {
        dom.btnRandomSort.addEventListener('click', () => {
            AudioEngine.play('drag');
            for (let idx = 0; idx < 4; idx++) {
                const randDigits = Math.floor(Math.random() * 7) + 4;
                let num = '';
                for (let i = 0; i < randDigits; i++) {
                    num += i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
                }
                const el = document.getElementById(`sort-in-${idx}`);
                if (el) el.value = formatDots(num);
            }
            renderSortingModule();
        });
    }

    // --- MODE & ROUNDS SELECTOR IN MODAL ---
    dom.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dom.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;

            if (dom.campuranLevelContainer) {
                if (state.mode === 'campuran') {
                    dom.campuranLevelContainer.style.display = 'flex';
                } else {
                    dom.campuranLevelContainer.style.display = 'none';
                }
            }
        });
    });

    if (dom.campuranLevelBtns) {
        dom.campuranLevelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dom.campuranLevelBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.campuranLevel = btn.dataset.level;
            });
        });
    }

    dom.roundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dom.roundBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.totalRounds = parseInt(btn.dataset.rounds);
        });
    });

    // --- CERTIFICATE MODAL ENGINE ---
    dom.btnCert.addEventListener('click', () => dom.certOverlay.classList.add('active'));
    dom.btnCloseCert.addEventListener('click', () => dom.certOverlay.classList.remove('active'));

    // --- START BATTLE LISTENERS ---
    dom.btnStartGame.addEventListener('click', () => {
        state.p1Name = dom.p1NameInput.value.trim() || 'Budi';
        state.p2Name = dom.p2NameInput.value.trim() || 'Siti';
        dom.p1DisplayName.textContent = state.p1Name;
        dom.p2DisplayName.textContent = state.p2Name;

        dom.startOverlay.classList.remove('active');
        initBattle();
    });

    dom.btnPlayAgain.addEventListener('click', () => {
        dom.victoryOverlay.classList.remove('active');
        dom.startOverlay.classList.add('active');
    });

    dom.btnSound.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        dom.btnSound.textContent = state.soundEnabled ? '🔊' : '🔇';
    });

    // --- ANTI-ZOOM & FIXED VIEWPORT ENGINE ---
    // 1. Dynamic CSS --vh calculation
    function setVhVariable() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVhVariable();
    window.addEventListener('resize', setVhVariable);
    window.addEventListener('orientationchange', setVhVariable);

    // 2. Prevent multi-finger touch zoom / pinch zoom
    document.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // 3. Prevent double-tap to zoom
    let lastTouchEndTime = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEndTime <= 300) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        }
        lastTouchEndTime = now;
    }, { passive: false });

    // 4. Prevent iOS gesture zoom
    ['gesturestart', 'gesturechange', 'gestureend'].forEach((eventName) => {
        document.addEventListener(eventName, (e) => {
            e.preventDefault();
        }, { passive: false });
    });

    // 5. Prevent Ctrl + wheel zoom
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    // 6. Landscape Lock & Fullscreen Request Helper
    async function requestLandscapeMode() {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            }
        } catch (err) {
            console.log('Fullscreen ignored:', err);
        }

        try {
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (err) {
            console.log('Orientation lock not supported:', err);
        }
    }

    if (dom.btnForceLandscape) {
        dom.btnForceLandscape.addEventListener('click', () => {
            requestLandscapeMode();
        });
    }

    if (dom.btnStartGame) {
        dom.btnStartGame.addEventListener('click', () => {
            requestLandscapeMode();
        });
    }

    if (dom.btnSelectHubBattle) {
        dom.btnSelectHubBattle.addEventListener('click', () => {
            requestLandscapeMode();
        });
    }

    // INITIAL RENDER
    renderMateriTab();
    renderCompareModule();
    renderSortingModule();
});
