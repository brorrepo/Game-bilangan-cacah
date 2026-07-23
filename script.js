/* ==========================================================================
   PETUALANGAN BILANGAN TRILIUNAN - DUAL-PLAYER INDEPENDENT ACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- APP GLOBAL STATE ---
    const state = {
        activeTab: 'tab-battle',
        soundEnabled: true,
        
        // Battle State
        mode: 'campuran',
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

        questionsSequence: [],

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
        roundBtns: document.querySelectorAll('.btn-round'),

        // Materi Guru Elements
        materiNumInput: document.getElementById('materi-num-input'),
        btnSpeakMateri: document.getElementById('btn-speak-materi'),
        materiWordsText: document.getElementById('materi-words-text'),
        materiMatrixGrid: document.getElementById('materi-matrix-grid'),
        materiExpansionText: document.getElementById('materi-expansion-text'),
        btnPresets: document.querySelectorAll('.btn-preset')
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
        ]
    };

    function generateQuestionsSequence() {
        const availableKeys = ['triliunan', 'miliaran', 'ratusan_juta', 'puluhan_juta', 'jutaan', 'ratusan_ribu', 'puluhan_ribu', 'ribuan'];
        const seq = [];

        for (let r = 1; r <= state.totalRounds; r++) {
            let levelKey = state.mode;
            if (state.mode === 'campuran') {
                levelKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
            }

            const pvDefList = ALL_PV_LEVELS[levelKey];
            const numDigits = pvDefList.length;

            const digits = [];
            for (let i = 0; i < numDigits; i++) {
                digits.push(i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10));
            }
            const formattedNumber = formatDots(digits.join(''));
            seq.push({ roundNum: r, levelKey, levelName: levelKey.replace('_', ' ').toUpperCase(), formattedNumber, digits, pvDefList });
        }
        return seq;
    }

    function buildPlayerQuestionFromSeq(pKey, roundIndex) {
        const qData = state.questionsSequence[roundIndex];
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

    // --- MODE & ROUNDS SELECTOR IN MODAL ---
    dom.modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dom.modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;
        });
    });

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

    // INITIAL RENDER
    renderMateriTab();
});
