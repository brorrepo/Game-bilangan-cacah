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
        category: 'nilai_tempat', // 'nilai_tempat', 'membandingkan', 'mengurutkan', 'campuran_kategori'
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
        btnCloseWelcome: document.getElementById('btn-close-welcome'),
        btnCloseStart: document.getElementById('btn-close-start'),
        btnCloseVictory: document.getElementById('btn-close-victory'),
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
        p1CatTag: document.getElementById('p1-cat-tag'),
        p2CatTag: document.getElementById('p2-cat-tag'),
        p1Instruction: document.getElementById('p1-instruction'),
        p2Instruction: document.getElementById('p2-instruction'),
        p1DigitGrid: document.getElementById('p1-digit-grid'),
        p2DigitGrid: document.getElementById('p2-digit-grid'),
        p1CompareGrid: document.getElementById('p1-compare-grid'),
        p2CompareGrid: document.getElementById('p2-compare-grid'),
        p1SortGrid: document.getElementById('p1-sort-grid'),
        p2SortGrid: document.getElementById('p2-sort-grid'),
        p1SortPool: document.getElementById('p1-sort-pool'),
        p2SortPool: document.getElementById('p2-sort-pool'),
        p1SortSlots: document.getElementById('p1-sort-slots'),
        p2SortSlots: document.getElementById('p2-sort-slots'),
        p1ModeTag: document.getElementById('p1-mode-tag'),
        p2ModeTag: document.getElementById('p2-mode-tag'),
        p1BtnCheck: document.getElementById('p1-btn-check'),
        p2BtnCheck: document.getElementById('p2-btn-check'),
        p1Feedback: document.getElementById('p1-feedback'),
        p2Feedback: document.getElementById('p2-feedback'),
        centerTokensContainer: document.getElementById('center-tokens-container'),
        centerPoolInstruction: document.getElementById('center-pool-instruction'),
        centerSelectionIndicators: document.getElementById('center-selection-indicators'),
        p1SelectedDigitValDisp: document.getElementById('p1-selected-digit-val'),
        p2SelectedDigitValDisp: document.getElementById('p2-selected-digit-val'),
        winnerTitle: document.getElementById('winner-title'),
        winnerSubtitle: document.getElementById('winner-subtitle'),
        p1FinalName: document.getElementById('p1-final-name'),
        p2FinalName: document.getElementById('p2-final-name'),
        p1FinalScore: document.getElementById('p1-final-score'),
        p2FinalScore: document.getElementById('p2-final-score'),
        catBtns: document.querySelectorAll('.btn-category'),
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

    function switchTab(targetTab) {
        dom.navBtns.forEach(b => b.classList.remove('active'));
        dom.tabContents.forEach(tc => tc.classList.remove('active'));

        const btn = document.querySelector(`.nav-btn[data-tab="${targetTab}"]`);
        if (btn) btn.classList.add('active');
        const targetEl = document.getElementById(targetTab);
        if (targetEl) targetEl.classList.add('active');
        state.activeTab = targetTab;

        if (targetTab === 'tab-materi') renderMateriTab();
        if (targetTab === 'tab-battle') dom.startOverlay.classList.add('active');
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

        const catPool = ['nilai_tempat', 'membandingkan', 'mengurutkan'];

        for (let r = 1; r <= state.totalRounds; r++) {
            let rCat = state.category;
            if (state.category === 'campuran_kategori') {
                rCat = catPool[Math.floor(Math.random() * catPool.length)];
            }

            let levelKey;
            if (state.mode === 'campuran') {
                levelKey = allowedLevels[Math.floor(Math.random() * allowedLevels.length)];
            } else {
                levelKey = state.mode;
            }

            const pvDefList = ALL_PV_LEVELS[levelKey] || ALL_PV_LEVELS.ribuan;
            const numDigits = pvDefList.length;

            function genUniqueNumStr() {
                let digits, numStr, attempts = 0;
                do {
                    digits = [];
                    for (let i = 0; i < numDigits; i++) {
                        digits.push(i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10));
                    }
                    numStr = digits.join('');
                    attempts++;
                } while (usedNumbers.has(numStr) && attempts < 100);
                usedNumbers.add(numStr);
                return { digits, numStr, formatted: formatDots(numStr) };
            }

            if (rCat === 'nilai_tempat') {
                const n1 = genUniqueNumStr();
                const n2 = genUniqueNumStr();
                seqP1.push({ category: 'nilai_tempat', roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), formattedNumber: n1.formatted, digits: n1.digits, pvDefList });
                seqP2.push({ category: 'nilai_tempat', roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), formattedNumber: n2.formatted, digits: n2.digits, pvDefList });
            } else if (rCat === 'membandingkan') {
                const a1 = genUniqueNumStr();
                const b1 = genUniqueNumStr();
                const a2 = genUniqueNumStr();
                const b2 = genUniqueNumStr();

                const vA1 = BigInt(a1.numStr), vB1 = BigInt(b1.numStr);
                const expOp1 = vA1 > vB1 ? '>' : (vA1 < vB1 ? '<' : '=');

                const vA2 = BigInt(a2.numStr), vB2 = BigInt(b2.numStr);
                const expOp2 = vA2 > vB2 ? '>' : (vA2 < vB2 ? '<' : '=');

                seqP1.push({ category: 'membandingkan', roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), numA: a1.formatted, numB: b1.formatted, expectedOp: expOp1 });
                seqP2.push({ category: 'membandingkan', roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), numA: a2.formatted, numB: b2.formatted, expectedOp: expOp2 });
            } else if (rCat === 'mengurutkan') {
                const sortDir = Math.random() < 0.5 ? 'asc' : 'desc';
                const items1 = [genUniqueNumStr(), genUniqueNumStr(), genUniqueNumStr()];
                const items2 = [genUniqueNumStr(), genUniqueNumStr(), genUniqueNumStr()];

                const sorted1 = [...items1].sort((a, b) => {
                    const vA = BigInt(a.numStr);
                    const vB = BigInt(b.numStr);
                    if (vA === vB) return 0;
                    return sortDir === 'asc' ? (vA < vB ? -1 : 1) : (vA > vB ? -1 : 1);
                });

                const sorted2 = [...items2].sort((a, b) => {
                    const vA = BigInt(a.numStr);
                    const vB = BigInt(b.numStr);
                    if (vA === vB) return 0;
                    return sortDir === 'asc' ? (vA < vB ? -1 : 1) : (vA > vB ? -1 : 1);
                });

                seqP1.push({ category: 'mengurutkan', roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), sortDir, pool: items1.map(i => i.formatted), expectedSorted: sorted1.map(s => s.formatted) });
                seqP2.push({ category: 'mengurutkan', roundNum: r, levelKey, levelName: levelKey.replace(/_/g, ' ').toUpperCase(), sortDir, pool: items2.map(i => i.formatted), expectedSorted: sorted2.map(s => s.formatted) });
            }
        }

        return { p1: seqP1, p2: seqP2 };
    }

    function buildPlayerQuestionFromSeq(pKey, roundIndex) {
        const qData = state.questionsSequence[pKey][roundIndex];

        if (qData.category === 'nilai_tempat') {
            const targetSlots = qData.pvDefList.map((pv, idx) => ({
                pvKey: pv.key,
                label: pv.label,
                expectedDigit: qData.digits[idx],
                filled: false,
                filledDigit: null,
                status: 'neutral'
            }));

            return {
                category: 'nilai_tempat',
                playerKey: pKey,
                roundIndex: roundIndex,
                levelName: qData.levelName,
                formattedNumber: qData.formattedNumber,
                targetSlots: targetSlots,
                isComplete: false
            };
        } else if (qData.category === 'membandingkan') {
            return {
                category: 'membandingkan',
                playerKey: pKey,
                roundIndex: roundIndex,
                levelName: qData.levelName,
                numA: qData.numA,
                numB: qData.numB,
                expectedOp: qData.expectedOp,
                selectedOp: null,
                isComplete: false
            };
        } else if (qData.category === 'mengurutkan') {
            return {
                category: 'mengurutkan',
                playerKey: pKey,
                roundIndex: roundIndex,
                levelName: qData.levelName,
                sortDir: qData.sortDir,
                pool: [...qData.pool],
                targetSlots: [],
                isComplete: false
            };
        }
    }

    function placeNextEmptySlot(pKey, digitVal) {
        const question = pKey === 'p1' ? state.p1Question : state.p2Question;
        if (!question || question.category !== 'nilai_tempat' || question.isComplete) return;

        const emptyIdx = question.targetSlots.findIndex(s => !s.filled);
        if (emptyIdx !== -1) {
            placeDigitInSlot(pKey, emptyIdx, digitVal);
        } else {
            placeDigitInSlot(pKey, 0, digitVal);
        }
    }

    function renderStaticCenterDigitsGrid() {
        if (!dom.centerTokensContainer) return;
        dom.centerTokensContainer.innerHTML = '';

        for (let d = 0; d <= 9; d++) {
            const token = document.createElement('div');
            token.className = 'digit-token-static';
            token.dataset.digit = d;

            token.innerHTML = `
                <span class="token-digit-num">${d}</span>
                <div class="token-tap-btns">
                    <button class="btn-tap-p1" title="P1 Tap">P1</button>
                    <button class="btn-tap-p2" title="P2 Tap">P2</button>
                </div>
            `;

            // 1. Instant Tap P1 Button (Simultaneous)
            const btnP1 = token.querySelector('.btn-tap-p1');
            if (btnP1) {
                btnP1.addEventListener('pointerdown', (e) => {
                    e.stopPropagation();
                    AudioEngine.play('drag');
                    state.p1SelectedDigitVal = d;
                    if (dom.p1SelectedDigitValDisp) dom.p1SelectedDigitValDisp.textContent = d;
                    placeNextEmptySlot('p1', d);
                    token.classList.add('selected-p1');
                    setTimeout(() => token.classList.remove('selected-p1'), 400);
                });
            }

            // 2. Instant Tap P2 Button (Simultaneous)
            const btnP2 = token.querySelector('.btn-tap-p2');
            if (btnP2) {
                btnP2.addEventListener('pointerdown', (e) => {
                    e.stopPropagation();
                    AudioEngine.play('drag');
                    state.p2SelectedDigitVal = d;
                    if (dom.p2SelectedDigitValDisp) dom.p2SelectedDigitValDisp.textContent = d;
                    placeNextEmptySlot('p2', d);
                    token.classList.add('selected-p2');
                    setTimeout(() => token.classList.remove('selected-p2'), 400);
                });
            }

            // 3. Multi-Touch Concurrent Pointer Dragging for 2 Players
            token.addEventListener('pointerdown', (e) => {
                if (e.target.classList.contains('btn-tap-p1') || e.target.classList.contains('btn-tap-p2')) return;
                
                try {
                    token.setPointerCapture(e.pointerId);
                } catch (err) {}

                const clone = document.createElement('div');
                clone.className = 'floating-touch-token';
                clone.textContent = d;
                clone.style.left = `${e.clientX - 26}px`;
                clone.style.top = `${e.clientY - 26}px`;
                document.body.appendChild(clone);

                const onPointerMove = (moveEvt) => {
                    if (moveEvt.pointerId === e.pointerId) {
                        clone.style.left = `${moveEvt.clientX - 26}px`;
                        clone.style.top = `${moveEvt.clientY - 26}px`;
                    }
                };

                const onPointerUp = (upEvt) => {
                    if (upEvt.pointerId === e.pointerId) {
                        try {
                            token.releasePointerCapture(e.pointerId);
                        } catch (err) {}
                        window.removeEventListener('pointermove', onPointerMove);
                        window.removeEventListener('pointerup', onPointerUp);
                        window.removeEventListener('pointercancel', onPointerUp);
                        if (clone.parentNode) clone.parentNode.removeChild(clone);

                        const droppedEl = document.elementFromPoint(upEvt.clientX, upEvt.clientY);
                        if (droppedEl) {
                            const digitBox = droppedEl.closest('.digit-box');
                            if (digitBox) {
                                const pKey = digitBox.dataset.player;
                                const slotIdx = parseInt(digitBox.dataset.slotIndex);
                                if (pKey && !isNaN(slotIdx)) {
                                    placeDigitInSlot(pKey, slotIdx, d);
                                }
                            }
                        }
                    }
                };

                window.addEventListener('pointermove', onPointerMove);
                window.addEventListener('pointerup', onPointerUp);
                window.addEventListener('pointercancel', onPointerUp);
            });

            dom.centerTokensContainer.appendChild(token);
        }
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
        const catTag = pKey === 'p1' ? dom.p1CatTag : dom.p2CatTag;
        const instruction = pKey === 'p1' ? dom.p1Instruction : dom.p2Instruction;
        const modeTag = pKey === 'p1' ? dom.p1ModeTag : dom.p2ModeTag;
        const roundDisp = pKey === 'p1' ? dom.p1RoundDisp : dom.p2RoundDisp;

        const digitGrid = pKey === 'p1' ? dom.p1DigitGrid : dom.p2DigitGrid;
        const compareGrid = pKey === 'p1' ? dom.p1CompareGrid : dom.p2CompareGrid;
        const sortGrid = pKey === 'p1' ? dom.p1SortGrid : dom.p2SortGrid;
        const sortPool = pKey === 'p1' ? dom.p1SortPool : dom.p2SortPool;
        const sortSlots = pKey === 'p1' ? dom.p1SortSlots : dom.p2SortSlots;

        roundDisp.textContent = (pKey === 'p1' ? state.p1CurrentRound : state.p2CurrentRound);
        modeTag.textContent = question.levelName;

        if (question.category === 'nilai_tempat') {
            if (catTag) catTag.textContent = '🧮 NILAI TEMPAT';
            if (instruction) instruction.textContent = 'Seret ATAU Klik angka 0-9 di tengah, lalu isi kotak nilai tempat!';
            numDisplay.textContent = question.formattedNumber;

            digitGrid.style.display = 'flex';
            compareGrid.style.display = 'none';
            sortGrid.style.display = 'none';

            if (dom.centerPoolInstruction) dom.centerPoolInstruction.textContent = '⚡ GAME CEPAT-CEPATAN! 2 PEMAIN BISA NGGESER BERSAMAAN ⚡';
            if (dom.centerTokensContainer) dom.centerTokensContainer.style.display = 'grid';
            if (dom.centerSelectionIndicators) dom.centerSelectionIndicators.style.display = 'grid';

            digitGrid.innerHTML = '';
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

                boxEl.addEventListener('click', () => {
                    const selectedVal = pKey === 'p1' ? state.p1SelectedDigitVal : state.p2SelectedDigitVal;
                    if (selectedVal !== null && !question.isComplete) {
                        placeDigitInSlot(pKey, idx, selectedVal);
                    }
                });

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

                digitGrid.appendChild(boxEl);
            });
        } else if (question.category === 'membandingkan') {
            if (catTag) catTag.textContent = '⚖️ MEMBANDINGKAN';
            if (instruction) instruction.textContent = 'Pilih operator perbandingan yang tepat (> , < , =)!';
            
            if (question.selectedOp) {
                numDisplay.textContent = `${question.numA}   [ ${question.selectedOp} ]   ${question.numB}`;
            } else {
                numDisplay.textContent = `${question.numA}   ❓   ${question.numB}`;
            }

            digitGrid.style.display = 'none';
            compareGrid.style.display = 'flex';
            sortGrid.style.display = 'none';

            if (dom.centerPoolInstruction) dom.centerPoolInstruction.textContent = '⚡ ADU CEPAT MEMBANDINGKAN BILANGAN! ⚡';
            if (dom.centerTokensContainer) dom.centerTokensContainer.style.display = 'none';
            if (dom.centerSelectionIndicators) dom.centerSelectionIndicators.style.display = 'none';

            const opBtns = compareGrid.querySelectorAll('.btn-op-choice');
            opBtns.forEach(btn => {
                const op = btn.dataset.op;
                btn.classList.toggle('selected', question.selectedOp === op);

                btn.onclick = () => {
                    if (question.isComplete) return;
                    AudioEngine.play('drag');
                    question.selectedOp = op;
                    renderPlayerSingleSoal(pKey, question);
                };
            });
        } else if (question.category === 'mengurutkan') {
            if (catTag) catTag.textContent = '🔢 MENGURUTKAN';
            const sortBadge = pKey === 'p1' ? document.getElementById('p1-sort-badge') : document.getElementById('p2-sort-badge');
            
            const isAsc = question.sortDir === 'asc';
            const dirLabel = isAsc ? '↗️ TERKECIL KE TERBESAR (NAIK)' : '↘️ TERBESAR KE TERKECIL (TURUN)';
            
            if (sortBadge) {
                sortBadge.textContent = dirLabel;
                sortBadge.className = `sort-dir-badge ${isAsc ? 'asc' : 'desc'}`;
            }

            if (instruction) instruction.textContent = `Pilih 3 angka di bawah untuk mengisi urutan dari ${isAsc ? 'TERKECIL ke TERBESAR' : 'TERBESAR ke TERKECIL'}!`;
            numDisplay.textContent = `${isAsc ? 'TERKECIL ➔ TERBESAR' : 'TERBESAR ➔ TERKECIL'}`;

            digitGrid.style.display = 'none';
            compareGrid.style.display = 'none';
            sortGrid.style.display = 'flex';

            if (dom.centerPoolInstruction) dom.centerPoolInstruction.textContent = '⚡ ADU CEPAT MENGURUTKAN BILANGAN! ⚡';
            if (dom.centerTokensContainer) dom.centerTokensContainer.style.display = 'none';
            if (dom.centerSelectionIndicators) dom.centerSelectionIndicators.style.display = 'none';

            // Target Slots (Vertical Ke Bawah)
            sortSlots.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const placedVal = question.targetSlots[i];
                const slotCard = document.createElement('div');
                slotCard.className = `sort-slot-card-vertical ${placedVal ? 'filled' : ''}`;
                
                const rankName = i === 0 ? 'URUTAN #1 (ATAS)' : (i === 1 ? 'URUTAN #2 (TENGAH)' : 'URUTAN #3 (BAWAH)');
                slotCard.innerHTML = `
                    <span class="slot-rank-label">${rankName}</span>
                    <span class="slot-value-text">${placedVal ? placedVal : '[ ? ]'}</span>
                `;

                slotCard.onclick = () => {
                    if (placedVal && !question.isComplete) {
                        AudioEngine.play('drag');
                        question.targetSlots.splice(i, 1);
                        renderPlayerSingleSoal(pKey, question);
                    }
                };

                sortSlots.appendChild(slotCard);

                if (i < 2) {
                    const arrowDiv = document.createElement('div');
                    arrowDiv.className = 'sort-vertical-arrow';
                    arrowDiv.textContent = '👇';
                    sortSlots.appendChild(arrowDiv);
                }
            }

            // Unplaced Pool (Vertical Ke Bawah)
            sortPool.innerHTML = '';
            const poolTitle = document.createElement('div');
            poolTitle.className = 'pool-title-sm';
            poolTitle.textContent = '👇 PILIH ANGKA UNTUK MENGISI URUTAN DI ATAS:';
            sortPool.appendChild(poolTitle);

            question.pool.forEach(numStr => {
                const isPlaced = question.targetSlots.includes(numStr);
                if (!isPlaced) {
                    const poolBtn = document.createElement('button');
                    poolBtn.className = 'btn-sort-num-vertical';
                    poolBtn.textContent = numStr;

                    poolBtn.onclick = () => {
                        if (question.targetSlots.length < 3 && !question.isComplete) {
                            AudioEngine.play('drag');
                            question.targetSlots.push(numStr);
                            renderPlayerSingleSoal(pKey, question);
                        }
                    };

                    sortPool.appendChild(poolBtn);
                }
            });
        }
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

    function checkPlayerAnswer(pKey) {
        const question = pKey === 'p1' ? state.p1Question : state.p2Question;
        const feedbackEl = pKey === 'p1' ? dom.p1Feedback : dom.p2Feedback;

        if (!question || question.isComplete) return;

        let isAllCorrect = false;

        if (question.category === 'nilai_tempat') {
            const unfilled = question.targetSlots.some(s => !s.filled);
            if (unfilled) {
                AudioEngine.play('wrong');
                feedbackEl.textContent = '❌ Isilah semua kotak nilai tempat terlebih dahulu!';
                feedbackEl.className = 'feedback-msg wrong';
                return;
            }

            let correctCount = 0;
            question.targetSlots.forEach(s => {
                if (s.filledDigit === s.expectedDigit) {
                    s.status = 'correct';
                    correctCount++;
                } else {
                    s.status = 'wrong';
                }
            });

            isAllCorrect = (correctCount === question.targetSlots.length);
        } else if (question.category === 'membandingkan') {
            if (!question.selectedOp) {
                AudioEngine.play('wrong');
                feedbackEl.textContent = '⚠️ Pilih operator (> , < , =) terlebih dahulu!';
                feedbackEl.className = 'feedback-msg wrong';
                return;
            }
            isAllCorrect = (question.selectedOp === question.expectedOp);
        } else if (question.category === 'mengurutkan') {
            if (question.targetSlots.length < 3) {
                AudioEngine.play('wrong');
                feedbackEl.textContent = '⚠️ Susun ketiga bilangan ke dalam urutan #1, #2, dan #3!';
                feedbackEl.className = 'feedback-msg wrong';
                return;
            }
            isAllCorrect = question.targetSlots.every((val, idx) => val === question.expectedSorted[idx]);
        }

        renderPlayerSingleSoal(pKey, question);

        if (isAllCorrect) {
            AudioEngine.play('correct');
            question.isComplete = true;

            const roundPoin = question.category === 'nilai_tempat' ? 100 * question.targetSlots.length : 300;
            if (pKey === 'p1') {
                state.p1Score += roundPoin;
                dom.p1Score.textContent = state.p1Score;
            } else {
                state.p2Score += roundPoin;
                dom.p2Score.textContent = state.p2Score;
            }

            const currentRound = pKey === 'p1' ? state.p1CurrentRound : state.p2CurrentRound;

            if (currentRound < state.totalRounds) {
                if (pKey === 'p1') {
                    state.p1CurrentRound++;
                    state.p1Question = buildPlayerQuestionFromSeq('p1', state.p1CurrentRound - 1);
                } else {
                    state.p2CurrentRound++;
                    state.p2Question = buildPlayerQuestionFromSeq('p2', state.p2CurrentRound - 1);
                }

                feedbackEl.textContent = `🔥 BENAR! +${roundPoin} POIN! Otomatis lanjut ke RONDE ${currentRound + 1}...`;
                feedbackEl.className = 'feedback-msg correct';

                setTimeout(() => {
                    feedbackEl.textContent = '';
                    renderPlayerSingleSoal(pKey, pKey === 'p1' ? state.p1Question : state.p2Question);
                }, 600);
            } else {
                if (pKey === 'p1') state.p1FinishedAll = true;
                else state.p2FinishedAll = true;

                feedbackEl.textContent = '🎉 BENAR! KAMU SUDAH MENYELESAIKAN SEMUA RONDE!';
                feedbackEl.className = 'feedback-msg correct';

                checkEndGame();
            }
        } else {
            AudioEngine.play('wrong');
            feedbackEl.textContent = '❌ Jawaban belum tepat, coba perbaiki pilihanmu!';
            feedbackEl.className = 'feedback-msg wrong';
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
        const rawAClean = dom.compareNumA.value.replace(/\D/g, '');
        const rawBClean = dom.compareNumB.value.replace(/\D/g, '');

        if (rawAClean === '') dom.compareNumA.value = '';
        else dom.compareNumA.value = formatDots(rawAClean);

        if (rawBClean === '') dom.compareNumB.value = '';
        else dom.compareNumB.value = formatDots(rawBClean);

        const rawA = rawAClean || '0';
        const rawB = rawBClean || '0';

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
            const rawClean = input.value.replace(/\D/g, '');
            if (rawClean === '') {
                input.value = '';
            } else {
                input.value = formatDots(rawClean);
            }

            const raw = rawClean || '0';
            items.push({
                origIdx: idx + 1,
                raw: raw,
                val: BigInt(raw),
                formatted: rawClean === '' ? '0' : formatDots(rawClean),
                words: rawClean === '' ? 'Nol' : terbilangTextPlain(rawClean)
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

        const cardColors = [
            { bg: '#fef9c3', border: '#eab308', badgeBg: '#fde047', icon: '🥇' }, // Rank 1 Gold
            { bg: '#e0f2fe', border: '#0284c7', badgeBg: '#7dd3fc', icon: '🥈' }, // Rank 2 Sky
            { bg: '#dcfce7', border: '#16a34a', badgeBg: '#86efac', icon: '🥉' }, // Rank 3 Emerald
            { bg: '#fae8ff', border: '#c026d3', badgeBg: '#f0abfc', icon: '🏅' }  // Rank 4 Purple
        ];

        if (dom.sortedCardsContainer) {
            let html = '';
            items.forEach((item, rankIdx) => {
                const theme = cardColors[rankIdx % cardColors.length];
                html += `
                    <div class="sorted-card-item rank-card-${rankIdx + 1}" style="background:${theme.bg}; border:2.5px solid var(--neo-black); box-shadow:4px 4px 0px #0f172a; padding:12px; border-radius:12px; min-width:180px; flex:1;">
                        <div class="rank-header-bar" style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--neo-black); padding-bottom:6px; margin-bottom:8px;">
                            <span class="rank-badge-colored" style="background:${theme.badgeBg}; color:var(--neo-black); border:1.5px solid var(--neo-black); font-weight:900; padding:3px 10px; border-radius:6px; font-size:0.8rem;">
                                ${theme.icon} Urutan #${rankIdx + 1}
                            </span>
                            <span style="font-size:0.75rem; font-weight:800; color:#475569;">(Bilangan ${item.origIdx})</span>
                        </div>
                        <div style="font-size:1.35rem; font-weight:900; color:var(--neo-black); margin-bottom:4px;">${item.formatted}</div>
                        <div style="font-size:0.8rem; font-weight:700; color:#334155; font-style:italic;">"${item.words}"</div>
                    </div>
                `;
                if (rankIdx < items.length - 1) {
                    html += `<div class="sort-arrow" style="font-size:1.8rem; font-weight:900; align-self:center; color:var(--neo-black);">➔</div>`;
                }
            });
            dom.sortedCardsContainer.innerHTML = html;
        }

        if (dom.sortAnalysisSteps) {
            const stepsHtml = items.map((item, rankIdx) => {
                const theme = cardColors[rankIdx % cardColors.length];
                return `
                    <div class="reason-step-item" style="border-left:6px solid ${theme.border}; background:var(--neo-white); margin-bottom:8px; padding:10px 14px; border-radius:8px; border-top:1px solid #cbd5e1; border-right:1px solid #cbd5e1; border-bottom:1px solid #cbd5e1; box-shadow:2px 2px 0px rgba(0,0,0,0.05);">
                        <span style="background:${theme.badgeBg}; color:var(--neo-black); font-weight:900; padding:3px 8px; border-radius:6px; border:1px solid var(--neo-black); font-size:0.75rem;">
                            ${theme.icon} Urutan #${rankIdx + 1}
                        </span>
                        <strong style="margin-left:8px; font-size:1.1rem; color:var(--neo-black);">${item.formatted}</strong> 
                        <span style="color:#64748b; font-size:0.82rem; font-weight:700; margin-left:4px;">(Dari Input Bilangan ${item.origIdx} - ${item.raw.length} Digit)</span>
                        <div style="font-size:0.85rem; color:#334155; margin-top:4px; font-weight:700;">📖 Terbilang: <em>"${item.words}"</em></div>
                    </div>
                `;
            }).join('');

            dom.sortAnalysisSteps.innerHTML = `
                <div class="reasoning-steps-list">
                    <span class="preset-label" style="display:block; margin-bottom:10px; font-weight:900; font-size:0.95rem; color:var(--neo-black);">📊 KETERANGAN PENJELASAN URUTAN (WARNA SAMA DENGAN KARTU):</span>
                    ${stepsHtml}
                </div>
            `;
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

    if (dom.catBtns) {
        dom.catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                dom.catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.category = btn.dataset.category;
            });
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

    // --- ALL MODAL CLOSE BUTTON HANDLERS ---
    if (dom.btnCert) dom.btnCert.addEventListener('click', () => dom.certOverlay.classList.add('active'));
    if (dom.btnCloseCert) dom.btnCloseCert.addEventListener('click', () => dom.certOverlay.classList.remove('active'));
    if (dom.btnCloseWelcome) dom.btnCloseWelcome.addEventListener('click', () => dom.welcomeHubOverlay.classList.remove('active'));
    if (dom.btnCloseStart) dom.btnCloseStart.addEventListener('click', () => dom.startOverlay.classList.remove('active'));
    if (dom.btnCloseVictory) dom.btnCloseVictory.addEventListener('click', () => dom.victoryOverlay.classList.remove('active'));

    // CLOSE MODAL WHEN CLICKING OUTSIDE (OVERLAY BACKDROP)
    const allOverlays = [dom.welcomeHubOverlay, dom.startOverlay, dom.victoryOverlay, dom.certOverlay];
    allOverlays.forEach(overlay => {
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        }
    });

    // CLOSE MODAL ON ESCAPE KEY
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            allOverlays.forEach(overlay => {
                if (overlay) overlay.classList.remove('active');
            });
        }
    });

    // --- START BATTLE LISTENERS ---
    if (dom.p1BtnCheck) {
        dom.p1BtnCheck.addEventListener('click', () => {
            checkPlayerAnswer('p1');
        });
    }

    if (dom.p2BtnCheck) {
        dom.p2BtnCheck.addEventListener('click', () => {
            checkPlayerAnswer('p2');
        });
    }

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

    const btnDismissPortrait = document.getElementById('btn-dismiss-portrait');
    if (btnDismissPortrait) {
        btnDismissPortrait.addEventListener('click', () => {
            const overlay = document.getElementById('portrait-warning-overlay');
            if (overlay) overlay.style.display = 'none';
        });
    }

    // INITIAL RENDER
    renderMateriTab();
    renderCompareModule();
    renderSortingModule();
});
