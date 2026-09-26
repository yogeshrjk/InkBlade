import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Swords, Shield, Sparkles, Eye, Info, ChevronRight, Zap } from 'lucide-react';
import { imageLoader } from '../utils/imageLoader';
import { soundEngine } from '../utils/soundEngine';
import confetti from 'canvas-confetti';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
  type: 'ink' | 'petal' | 'spark' | 'calligraphy';
}

interface SlashTrail {
  points: { x: number; y: number; width: number }[];
  alpha: number;
  color: string;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
}

type OpponentType = 'dummy' | 'shadow_novice' | 'shadow_sensei';

export const CombatDojo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(soundEngine.getMuted());
  const [showHitboxes, setShowHitboxes] = useState<boolean>(false);
  const [opponentType, setOpponentType] = useState<OpponentType>('shadow_novice');
  const [ambientActive, setAmbientActive] = useState<boolean>(false);
  const [showMoveList, setShowMoveList] = useState<boolean>(false);
  const [loadedPercent, setLoadedPercent] = useState<number>(0);

  // Stats state for UI
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerInk, setPlayerInk] = useState<number>(100);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboDamage, setComboDamage] = useState<number>(0);
  const [currentMoveName, setCurrentMoveName] = useState<string>('Combat Ready Stance');
  const [lastFrameInfo, setLastFrameInfo] = useState<{ move: string; startup: number; active: number; recovery: number; advantage: string }>({
    move: 'Neutral Stance',
    startup: 0,
    active: 0,
    recovery: 0,
    advantage: '0',
  });

  // Track pressed keys
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Combat state container ref
  const simRef = useRef({
    // Player
    p1: {
      x: 280,
      y: 400,
      vx: 0,
      vy: 0,
      facing: 1, // 1: right, -1: left
      hp: 100,
      maxHp: 100,
      ink: 100,
      state: 'IDLE',
      frame: 0,
      stateTimer: 0,
      spriteKey: '01_movement_sheet_01.png',
      isGrounded: true,
      isInvulnerable: false,
      isBlocking: false,
      isParrying: false,
      comboChain: 0,
      lastAttackHit: false,
      hitStun: 0,
      knockdownTimer: 0,
    },
    // Opponent
    p2: {
      x: 680,
      y: 400,
      vx: 0,
      vy: 0,
      facing: -1,
      hp: 100,
      maxHp: 100,
      state: 'IDLE',
      frame: 0,
      stateTimer: 0,
      spriteKey: '01_movement_sheet_01.png',
      isGrounded: true,
      hitStun: 0,
      isBlocking: false,
      knockdownTimer: 0,
      aiActionCooldown: 40,
    },
    // Combat dynamics
    combo: 0,
    comboDamageTotal: 0,
    comboResetTimer: 0,
    screenShake: 0,
    superFreeze: 0,
    superFlash: 0,
    particles: [] as Particle[],
    slashTrails: [] as SlashTrail[],
    floatingTexts: [] as FloatingText[],
    ambientPetals: [] as Particle[],
  });

  // Preload sprites
  useEffect(() => {
    imageLoader.onProgress((loaded, total) => {
      setLoadedPercent(Math.round((loaded / total) * 100));
    });
    imageLoader.preloadAll().then(() => {
      setLoadedPercent(100);
    });

    // Populate ambient bamboo/sakura petals
    const petals: Particle[] = [];
    for (let i = 0; i < 28; i++) {
      petals.push({
        x: Math.random() * 960,
        y: Math.random() * 540,
        vx: -0.6 - Math.random() * 0.8,
        vy: 0.3 + Math.random() * 0.5,
        size: 3 + Math.random() * 4,
        alpha: 0.2 + Math.random() * 0.4,
        color: Math.random() > 0.4 ? '#2b2b28' : '#882222',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        type: 'petal',
      });
    }
    simRef.current.ambientPetals = petals;
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when pressing game controls
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = true;
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Reset match
  const handleReset = useCallback(() => {
    const sim = simRef.current;
    sim.p1.x = 280;
    sim.p1.y = 400;
    sim.p1.vx = 0;
    sim.p1.vy = 0;
    sim.p1.facing = 1;
    sim.p1.hp = 100;
    sim.p1.ink = 100;
    sim.p1.state = 'IDLE';
    sim.p1.stateTimer = 0;
    sim.p1.hitStun = 0;
    sim.p1.knockdownTimer = 0;

    sim.p2.x = 680;
    sim.p2.y = 400;
    sim.p2.vx = 0;
    sim.p2.vy = 0;
    sim.p2.facing = -1;
    sim.p2.hp = 100;
    sim.p2.state = 'IDLE';
    sim.p2.stateTimer = 0;
    sim.p2.hitStun = 0;
    sim.p2.knockdownTimer = 0;

    sim.combo = 0;
    sim.comboDamageTotal = 0;
    sim.comboResetTimer = 0;
    sim.particles = [];
    sim.slashTrails = [];
    sim.floatingTexts = [];

    setPlayerHp(100);
    setPlayerInk(100);
    setEnemyHp(100);
    setComboCount(0);
    setComboDamage(0);
    setCurrentMoveName('Combat Ready Stance');
  }, []);

  // Trigger move manually (e.g. from touch or UI buttons)
  const triggerPlayerAction = (action: string) => {
    const p1 = simRef.current.p1;
    if (p1.hitStun > 0 || p1.knockdownTimer > 0) return;

    if (action === 'LIGHT') {
      keysRef.current['KeyJ'] = true;
      setTimeout(() => { keysRef.current['KeyJ'] = false; }, 80);
    } else if (action === 'HEAVY') {
      keysRef.current['KeyK'] = true;
      setTimeout(() => { keysRef.current['KeyK'] = false; }, 80);
    } else if (action === 'SWORD') {
      keysRef.current['KeyU'] = true;
      setTimeout(() => { keysRef.current['KeyU'] = false; }, 80);
    } else if (action === 'SPECIAL') {
      keysRef.current['KeyI'] = true;
      setTimeout(() => { keysRef.current['KeyI'] = false; }, 80);
    } else if (action === 'BLOCK') {
      keysRef.current['KeyL'] = true;
      setTimeout(() => { keysRef.current['KeyL'] = false; }, 400);
    } else if (action === 'JUMP') {
      keysRef.current['Space'] = true;
      setTimeout(() => { keysRef.current['Space'] = false; }, 120);
    } else if (action === 'DASH') {
      keysRef.current['ShiftLeft'] = true;
      setTimeout(() => { keysRef.current['ShiftLeft'] = false; }, 200);
    }
  };

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const GROUND_Y = 415;
    const GRAVITY = 0.85;

    // Helper: spawn ink splatter
    const spawnInkSplatter = (x: number, y: number, count: number, force: number = 6, color: string = '#141411') => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * force;
        simRef.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: 2 + Math.random() * 5,
          alpha: 0.9,
          color,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          type: 'ink',
        });
      }
    };

    // Helper: spawn slash arc trail
    const spawnSlashTrail = (startX: number, startY: number, endX: number, endY: number, color: string = '#e6e4dc') => {
      const points = [];
      const steps = 14;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = startX + (endX - startX) * t;
        const py = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 45;
        const width = Math.sin(t * Math.PI) * 16;
        points.push({ x: px, y: py, width });
      }
      simRef.current.slashTrails.push({ points, alpha: 0.95, color });
    };

    // Game update tick
    const update = () => {
      const sim = simRef.current;
      const { p1, p2 } = sim;
      const keys = keysRef.current;

      // Handle super freeze
      if (sim.superFreeze > 0) {
        sim.superFreeze--;
        return;
      }

      // Combo reset timer
      if (sim.comboResetTimer > 0) {
        sim.comboResetTimer--;
        if (sim.comboResetTimer === 0 && sim.combo > 0) {
          sim.combo = 0;
          sim.comboDamageTotal = 0;
          setComboCount(0);
          setComboDamage(0);
        }
      }

      // Screen shake decay
      if (sim.screenShake > 0) sim.screenShake *= 0.88;

      // Super flash decay
      if (sim.superFlash > 0) sim.superFlash--;

      // ----------------- PLAYER 1 LOGIC -----------------
      p1.stateTimer++;

      // Orient facing towards opponent when grounded and not attacking
      if (p1.isGrounded && !['LIGHT_1', 'LIGHT_2', 'LIGHT_3', 'HEAVY_KICK', 'SWORD_SLASH', 'SWORD_THRUST', 'SWORD_CYCLONE', 'SUPER_INK', 'DODGE_ROLL'].includes(p1.state)) {
        p1.facing = p1.x < p2.x ? 1 : -1;
      }

      // Hitstun / Knockdown
      if (p1.hitStun > 0) {
        p1.hitStun--;
        p1.vx *= 0.85;
      } else if (p1.knockdownTimer > 0) {
        p1.knockdownTimer--;
        p1.spriteKey = '03_defence_sheet_11.png';
        if (p1.knockdownTimer === 0) {
          // Kip up
          p1.state = 'KIP_UP';
          p1.stateTimer = 0;
          p1.spriteKey = '03_defence_sheet_12.png';
          soundEngine.playDodge();
        }
      } else if (p1.state === 'KIP_UP') {
        if (p1.stateTimer > 18) {
          p1.state = 'IDLE';
          p1.stateTimer = 0;
          p1.spriteKey = '01_movement_sheet_01.png';
        }
      } else {
        // Player Action Inputs
        const left = keys['KeyA'] || keys['ArrowLeft'];
        const right = keys['KeyD'] || keys['ArrowRight'];
        const jump = keys['Space'] || keys['KeyW'] || keys['ArrowUp'];
        const block = keys['KeyL'] || keys['ShiftRight'];
        const light = keys['KeyJ'];
        const heavy = keys['KeyK'];
        const sword = keys['KeyU'];
        const special = keys['KeyI'];
        const dash = keys['ShiftLeft'];

        // Block / Parry
        if (block && p1.isGrounded) {
          if (p1.state !== 'BLOCK' && p1.state !== 'PARRY') {
            p1.state = 'PARRY';
            p1.stateTimer = 0;
            p1.spriteKey = '03_defence_sheet_02.png'; // Inward Parry Sweep
            p1.isParrying = true;
            p1.isBlocking = true;
            setCurrentMoveName('Tactical Parry Stance');
          } else if (p1.state === 'PARRY' && p1.stateTimer > 12) {
            // Drop to regular block
            p1.state = 'BLOCK';
            p1.isParrying = false;
            p1.spriteKey = '03_defence_sheet_03.png'; // Iron Cross Guard
            setCurrentMoveName('Crossed Arm Iron Guard');
          }
          p1.vx = 0;
        } else if (p1.state === 'BLOCK' || p1.state === 'PARRY') {
          p1.state = 'IDLE';
          p1.isBlocking = false;
          p1.isParrying = false;
        }

        // Special Move: Sumi-e Ink Slash (Ultimate)
        if (special && p1.ink >= 50 && p1.isGrounded && !['SUPER_INK', 'DODGE_ROLL'].includes(p1.state)) {
          p1.state = 'SUPER_INK';
          p1.stateTimer = 0;
          p1.ink -= 50;
          setPlayerInk(p1.ink);
          sim.superFreeze = 16;
          sim.superFlash = 24;
          sim.screenShake = 18;
          soundEngine.playSpecial();
          setCurrentMoveName('墨痕一闪 · Black Ink Flash');
          setLastFrameInfo({ move: 'Black Ink Flash', startup: 4, active: 16, recovery: 18, advantage: '+12' });

          // Dash through opponent
          const targetX = p1.facing === 1 ? Math.min(880, p2.x + 130) : Math.max(80, p2.x - 130);
          spawnSlashTrail(p1.x, p1.y - 80, targetX, p1.y - 80, '#dc2626');
          p1.x = targetX;
          p1.spriteKey = '04_sword_sheet_03.png';

          // Opponent heavy damage & knockdown
          p2.hp = Math.max(0, p2.hp - 35);
          setEnemyHp(p2.hp);
          p2.hitStun = 45;
          p2.knockdownTimer = 55;
          p2.spriteKey = '03_defence_sheet_10.png';
          p2.vx = p1.facing * 8;
          p2.vy = -7;
          p2.isGrounded = false;

          spawnInkSplatter(p2.x, p2.y - 80, 45, 12, '#991b1b');
          sim.combo += 4;
          sim.comboDamageTotal += 35;
          sim.comboResetTimer = 110;
          setComboCount(sim.combo);
          setComboDamage(sim.comboDamageTotal);

          sim.floatingTexts.push({
            x: p2.x,
            y: p2.y - 120,
            text: '一刀两断! 35 DMG',
            color: '#dc2626',
            alpha: 1,
            scale: 1.4,
          });

          if (p2.hp <= 0) {
            confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
          }
        }
        // Sword Slash Moves (U key)
        else if (sword && p1.isGrounded && !['SUPER_INK', 'DODGE_ROLL', 'SWORD_SLASH', 'SWORD_THRUST', 'SWORD_CYCLONE'].includes(p1.state)) {
          if (keys['KeyS'] || keys['ArrowDown']) {
            // Low thrust
            p1.state = 'SWORD_THRUST';
            p1.stateTimer = 0;
            p1.spriteKey = '04_sword_sheet_07.png';
            p1.vx = p1.facing * 8;
            soundEngine.playSlash('heavy');
            setCurrentMoveName('Two-Handed Piercing Thrust (Tsuki)');
            setLastFrameInfo({ move: 'Tsuki Thrust', startup: 9, active: 6, recovery: 15, advantage: '+2' });
          } else if (keys['KeyW'] || keys['ArrowUp']) {
            // Cyclone Whirlwind
            p1.state = 'SWORD_CYCLONE';
            p1.stateTimer = 0;
            p1.spriteKey = '04_sword_sheet_10.png';
            p1.vx = p1.facing * 5;
            soundEngine.playSlash('heavy');
            setCurrentMoveName('Spinning Cyclone Slash');
            setLastFrameInfo({ move: 'Cyclone Cleave', startup: 8, active: 8, recovery: 14, advantage: '+4' });
          } else {
            // Horizontal Cleave
            p1.state = 'SWORD_SLASH';
            p1.stateTimer = 0;
            p1.spriteKey = '04_sword_sheet_03.png';
            p1.vx = p1.facing * 6;
            soundEngine.playSlash('light');
            setCurrentMoveName('Horizontal Cleave Slash (Ichimonji)');
            setLastFrameInfo({ move: 'Ichimonji Slash', startup: 7, active: 5, recovery: 12, advantage: '+3' });
          }
        }
        // Heavy Kick / Strike (K key)
        else if (heavy && p1.isGrounded && !['SUPER_INK', 'DODGE_ROLL', 'HEAVY_KICK', 'SWORD_SLASH'].includes(p1.state)) {
          if (keys['KeyS'] || keys['ArrowDown']) {
            // Low Dragon Sweep
            p1.state = 'HEAVY_KICK';
            p1.stateTimer = 0;
            p1.spriteKey = '02_attack_sheet_12.png';
            p1.vx = p1.facing * 5;
            soundEngine.playKick();
            setCurrentMoveName('Low Dragon Leg Sweep');
            setLastFrameInfo({ move: 'Low Sweep', startup: 10, active: 6, recovery: 18, advantage: '+1' });
          } else {
            // Roundhouse High Kick
            p1.state = 'HEAVY_KICK';
            p1.stateTimer = 0;
            p1.spriteKey = '02_attack_sheet_10.png';
            p1.vx = p1.facing * 4;
            soundEngine.playKick();
            setCurrentMoveName('High Roundhouse Kick (Mawashi-geri)');
            setLastFrameInfo({ move: 'Mawashi Kick', startup: 8, active: 5, recovery: 14, advantage: '+5' });
          }
        }
        // Light Attack (J key)
        else if (light && p1.isGrounded && !['SUPER_INK', 'DODGE_ROLL', 'LIGHT_1', 'LIGHT_2', 'LIGHT_3'].includes(p1.state)) {
          // Combo branching
          if (p1.comboChain === 0) {
            p1.state = 'LIGHT_1';
            p1.spriteKey = '02_attack_sheet_01.png'; // Lead snap jab
            p1.comboChain = 1;
            soundEngine.playPunch();
            setCurrentMoveName('Lead Snap Jab');
            setLastFrameInfo({ move: 'Lead Jab', startup: 4, active: 3, recovery: 8, advantage: '+3' });
          } else if (p1.comboChain === 1) {
            p1.state = 'LIGHT_2';
            p1.spriteKey = '02_attack_sheet_02.png'; // Rear cross
            p1.comboChain = 2;
            soundEngine.playPunch();
            setCurrentMoveName('Rear Cross Strike');
            setLastFrameInfo({ move: 'Rear Cross', startup: 6, active: 4, recovery: 10, advantage: '+2' });
          } else {
            p1.state = 'LIGHT_3';
            p1.spriteKey = '02_attack_sheet_03.png'; // Iron palm thrust
            p1.comboChain = 0;
            soundEngine.playPunch();
            setCurrentMoveName('Iron Palm Internal Thrust');
            setLastFrameInfo({ move: 'Iron Palm', startup: 8, active: 5, recovery: 12, advantage: '+4' });
          }
          p1.stateTimer = 0;
          p1.vx = p1.facing * 3;
        }
        // Dodge Roll (Shift or S+A/D)
        else if (dash && p1.isGrounded && p1.state !== 'DODGE_ROLL') {
          p1.state = 'DODGE_ROLL';
          p1.stateTimer = 0;
          p1.spriteKey = '01_movement_sheet_15.png';
          p1.vx = p1.facing * 9;
          p1.isInvulnerable = true;
          soundEngine.playDodge();
          setCurrentMoveName('Tactical Ground Roll');
          setLastFrameInfo({ move: 'Evade Roll', startup: 2, active: 14, recovery: 8, advantage: '+0' });
        }
        // Jump
        else if (jump && p1.isGrounded && !['SUPER_INK', 'DODGE_ROLL'].includes(p1.state)) {
          p1.isGrounded = false;
          p1.vy = -16;
          p1.state = 'JUMP';
          p1.stateTimer = 0;
          p1.spriteKey = '01_movement_sheet_11.png';
          soundEngine.playFootstep();
          setCurrentMoveName('Airborne Ascension');
        }
        // Locomotion (Walk / Idle)
        else if (['IDLE', 'WALK_FWD', 'WALK_BACK'].includes(p1.state)) {
          p1.comboChain = 0;
          if (right) {
            p1.vx = 4;
            p1.state = p1.facing === 1 ? 'WALK_FWD' : 'WALK_BACK';
            // Stride animation frames
            const strideFrame = Math.floor(p1.stateTimer / 6) % 4;
            const walkSprites = ['01_movement_sheet_03.png', '01_movement_sheet_04.png', '01_movement_sheet_05.png', '01_movement_sheet_02.png'];
            p1.spriteKey = walkSprites[strideFrame];
            setCurrentMoveName('Forward Advance Stride');
            if (p1.stateTimer % 12 === 0) soundEngine.playFootstep();
          } else if (left) {
            p1.vx = -4;
            p1.state = p1.facing === -1 ? 'WALK_FWD' : 'WALK_BACK';
            const strideFrame = Math.floor(p1.stateTimer / 6) % 4;
            const walkSprites = ['01_movement_sheet_03.png', '01_movement_sheet_04.png', '01_movement_sheet_05.png', '01_movement_sheet_02.png'];
            p1.spriteKey = walkSprites[strideFrame];
            setCurrentMoveName('Tactical Repositioning');
            if (p1.stateTimer % 12 === 0) soundEngine.playFootstep();
          } else {
            p1.vx = 0;
            p1.state = 'IDLE';
            // Idle breathing
            const idleFrame = Math.floor(p1.stateTimer / 28) % 2;
            p1.spriteKey = idleFrame === 0 ? '01_movement_sheet_01.png' : '01_movement_sheet_02.png';
            setCurrentMoveName('Combat Ready Stance');
          }
        }
      }

      // Attack Animation Timer Expire
      if (['LIGHT_1', 'LIGHT_2', 'LIGHT_3'].includes(p1.state) && p1.stateTimer > 15) {
        p1.state = 'IDLE';
        p1.stateTimer = 0;
      }
      if (p1.state === 'HEAVY_KICK' && p1.stateTimer > 20) {
        p1.state = 'IDLE';
        p1.stateTimer = 0;
      }
      if (['SWORD_SLASH', 'SWORD_THRUST'].includes(p1.state) && p1.stateTimer > 22) {
        p1.state = 'IDLE';
        p1.stateTimer = 0;
      }
      if (p1.state === 'SWORD_CYCLONE' && p1.stateTimer > 26) {
        p1.state = 'IDLE';
        p1.stateTimer = 0;
      }
      if (p1.state === 'DODGE_ROLL') {
        if (p1.stateTimer > 12) {
          p1.spriteKey = '01_movement_sheet_16.png'; // roll recover squat
        }
        if (p1.stateTimer > 20) {
          p1.state = 'IDLE';
          p1.isInvulnerable = false;
          p1.stateTimer = 0;
        }
      }
      if (p1.state === 'SUPER_INK' && p1.stateTimer > 32) {
        p1.state = 'IDLE';
        p1.stateTimer = 0;
      }

      // Physics integration for P1
      p1.x += p1.vx;
      p1.y += p1.vy;
      if (!p1.isGrounded) {
        p1.vy += GRAVITY;
        if (p1.vy > 0) {
          p1.spriteKey = '01_movement_sheet_13.png'; // aerial dive
        }
        if (p1.y >= GROUND_Y) {
          p1.y = GROUND_Y;
          p1.vy = 0;
          p1.isGrounded = true;
          p1.state = 'IDLE';
          p1.spriteKey = '01_movement_sheet_14.png'; // impact landing
          soundEngine.playFootstep();
        }
      }
      // Stage boundaries
      p1.x = Math.max(60, Math.min(900, p1.x));

      // ----------------- OPPONENT LOGIC (P2) -----------------
      p2.stateTimer++;

      if (opponentType === 'dummy') {
        // Dummy logic: reacts to hits, wobbles, stays still
        p2.facing = p2.x < p1.x ? 1 : -1;
        if (p2.hitStun > 0) {
          p2.hitStun--;
          p2.x += p2.vx;
          p2.vx *= 0.88;
        } else {
          p2.state = 'IDLE';
          p2.spriteKey = '01_movement_sheet_01.png';
          p2.vx = 0;
        }
      } else {
        // Shadow Warrior AI (Novice / Sensei)
        p2.aiActionCooldown--;
        if (p2.isGrounded && p2.hitStun === 0 && p2.knockdownTimer === 0) {
          p2.facing = p2.x < p1.x ? 1 : -1;
        }

        if (p2.hitStun > 0) {
          p2.hitStun--;
          p2.vx *= 0.85;
        } else if (p2.knockdownTimer > 0) {
          p2.knockdownTimer--;
          p2.spriteKey = '03_defence_sheet_11.png';
          if (p2.knockdownTimer === 0) {
            p2.state = 'IDLE';
            p2.spriteKey = '03_defence_sheet_12.png';
            soundEngine.playDodge();
          }
        } else {
          const dist = Math.abs(p1.x - p2.x);
          const isSensei = opponentType === 'shadow_sensei';

          if (p2.aiActionCooldown <= 0) {
            p2.aiActionCooldown = isSensei ? 28 + Math.floor(Math.random() * 20) : 45 + Math.floor(Math.random() * 35);

            if (dist > 220) {
              // Close distance
              p2.state = 'WALK_FWD';
              p2.vx = p2.facing * (isSensei ? 4.5 : 3.0);
              p2.spriteKey = '01_movement_sheet_04.png';
            } else if (dist < 110) {
              // Attack options
              const dice = Math.random();
              if (dice < 0.35) {
                // Katana slash
                p2.state = 'SWORD_SLASH';
                p2.stateTimer = 0;
                p2.spriteKey = '04_sword_sheet_03.png';
                p2.vx = p2.facing * 5;
                soundEngine.playSlash('light');
              } else if (dice < 0.70) {
                // Roundhouse kick
                p2.state = 'HEAVY_KICK';
                p2.stateTimer = 0;
                p2.spriteKey = '02_attack_sheet_10.png';
                p2.vx = p2.facing * 3;
                soundEngine.playKick();
              } else if (isSensei && dice < 0.90) {
                // High block
                p2.state = 'BLOCK';
                p2.isBlocking = true;
                p2.spriteKey = '03_defence_sheet_01.png';
              } else {
                // Jab
                p2.state = 'LIGHT_1';
                p2.stateTimer = 0;
                p2.spriteKey = '02_attack_sheet_01.png';
                soundEngine.playPunch();
              }
            } else {
              // Medium range: pace or jump
              if (Math.random() < 0.3 && p2.isGrounded) {
                p2.vy = -14;
                p2.isGrounded = false;
                p2.spriteKey = '01_movement_sheet_11.png';
              } else {
                p2.state = 'IDLE';
                p2.spriteKey = '01_movement_sheet_01.png';
                p2.vx = 0;
              }
            }
          }

          // Expire AI attacks
          if (['LIGHT_1', 'HEAVY_KICK', 'SWORD_SLASH'].includes(p2.state) && p2.stateTimer > 18) {
            p2.state = 'IDLE';
            p2.isBlocking = false;
            p2.spriteKey = '01_movement_sheet_01.png';
          }
        }

        // P2 physics
        p2.x += p2.vx;
        p2.y += p2.vy;
        if (!p2.isGrounded) {
          p2.vy += GRAVITY;
          if (p2.y >= GROUND_Y) {
            p2.y = GROUND_Y;
            p2.vy = 0;
            p2.isGrounded = true;
          }
        }
      }
      p2.x = Math.max(60, Math.min(900, p2.x));

      // ----------------- HIT DETECTION & COLLISION -----------------
      const dist = Math.abs(p1.x - p2.x);
      const yDist = Math.abs(p1.y - p2.y);

      // P1 attacking P2
      const p1Attacking = ['LIGHT_1', 'LIGHT_2', 'LIGHT_3', 'HEAVY_KICK', 'SWORD_SLASH', 'SWORD_THRUST', 'SWORD_CYCLONE'].includes(p1.state);
      const isFacingP2 = (p1.facing === 1 && p1.x < p2.x) || (p1.facing === -1 && p1.x > p2.x);

      if (p1Attacking && isFacingP2 && dist < 125 && yDist < 60 && p1.stateTimer === 5) {
        // Hit confirmed!
        let dmg = 8;
        let knockback = 5;
        let stun = 18;
        let isDown = false;
        let hitType = 'light';

        if (p1.state === 'LIGHT_1') {
          dmg = 8; knockback = 4; stun = 14; hitType = 'light';
        } else if (p1.state === 'LIGHT_2') {
          dmg = 12; knockback = 6; stun = 18; hitType = 'medium';
        } else if (p1.state === 'LIGHT_3') {
          dmg = 16; knockback = 8; stun = 24; hitType = 'heavy';
        } else if (p1.state === 'HEAVY_KICK') {
          dmg = 20; knockback = 12; stun = 30; isDown = true; hitType = 'heavy';
          spawnSlashTrail(p1.x + p1.facing * 30, p1.y - 70, p2.x, p2.y - 70, '#ffffff');
        } else if (p1.state === 'SWORD_SLASH') {
          dmg = 24; knockback = 9; stun = 28; hitType = 'sword';
          spawnSlashTrail(p1.x + p1.facing * 20, p1.y - 85, p2.x + p1.facing * 40, p2.y - 85, '#e5e7eb');
        } else if (p1.state === 'SWORD_THRUST') {
          dmg = 26; knockback = 11; stun = 32; isDown = true; hitType = 'sword';
          spawnSlashTrail(p1.x + p1.facing * 20, p1.y - 75, p2.x + p1.facing * 60, p2.y - 75, '#e5e7eb');
        } else if (p1.state === 'SWORD_CYCLONE') {
          dmg = 28; knockback = 10; stun = 30; hitType = 'sword';
          spawnSlashTrail(p1.x - 60, p1.y - 80, p1.x + 60, p1.y - 80, '#ffffff');
        }

        // Check if P2 is blocking
        if (p2.isBlocking) {
          dmg = Math.floor(dmg * 0.2);
          soundEngine.playParry();
          spawnInkSplatter(p2.x, p2.y - 80, 8, 4, '#ffffff');
          p2.vx = p1.facing * 3;
          sim.floatingTexts.push({
            x: p2.x,
            y: p2.y - 110,
            text: 'GUARD! -' + dmg,
            color: '#60a5fa',
            alpha: 1,
            scale: 0.9,
          });
        } else {
          // Clean hit
          p2.hp = Math.max(0, p2.hp - dmg);
          setEnemyHp(p2.hp);
          p2.hitStun = stun;
          p2.vx = p1.facing * knockback;
          p1.ink = Math.min(100, p1.ink + 12);
          setPlayerInk(p1.ink);

          sim.screenShake = dmg > 18 ? 10 : 5;
          sim.combo++;
          sim.comboDamageTotal += dmg;
          sim.comboResetTimer = 90;
          setComboCount(sim.combo);
          setComboDamage(sim.comboDamageTotal);

          // Ink splatter particles
          spawnInkSplatter(p2.x, p2.y - 80, dmg > 18 ? 25 : 14, 8, '#1e1e1a');

          // Sprite reaction
          if (isDown) {
            p2.knockdownTimer = 45;
            p2.spriteKey = '03_defence_sheet_10.png'; // tumble
            p2.vy = -6;
            p2.isGrounded = false;
          } else {
            p2.spriteKey = dmg > 14 ? '03_defence_sheet_08.png' : '03_defence_sheet_07.png';
          }

          sim.floatingTexts.push({
            x: p2.x,
            y: p2.y - 110,
            text: `${dmg} DMG`,
            color: dmg > 20 ? '#dc2626' : '#f59e0b',
            alpha: 1,
            scale: dmg > 20 ? 1.3 : 1.0,
          });

          if (p2.hp <= 0 && opponentType !== 'dummy') {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
          }
        }
      }

      // P2 attacking P1 (Shadow AI attacks)
      const p2Attacking = ['LIGHT_1', 'HEAVY_KICK', 'SWORD_SLASH'].includes(p2.state);
      const p2FacingP1 = (p2.facing === 1 && p2.x < p1.x) || (p2.facing === -1 && p2.x > p1.x);

      if (p2Attacking && p2FacingP1 && dist < 120 && yDist < 60 && p2.stateTimer === 6 && !p1.isInvulnerable) {
        if (p1.isParrying) {
          // Perfect PARRY!
          soundEngine.playParry();
          sim.screenShake = 12;
          p2.hitStun = 50; // Freeze attacker
          p2.spriteKey = '03_defence_sheet_08.png';
          p1.ink = Math.min(100, p1.ink + 30);
          setPlayerInk(p1.ink);
          spawnInkSplatter(p1.x + p1.facing * 40, p1.y - 80, 20, 9, '#ffffff');

          sim.floatingTexts.push({
            x: p1.x,
            y: p1.y - 120,
            text: 'PARRY! 見切り',
            color: '#38bdf8',
            alpha: 1,
            scale: 1.4,
          });
        } else if (p1.isBlocking) {
          // Regular Block
          soundEngine.playParry();
          p1.hp = Math.max(0, p1.hp - 3);
          setPlayerHp(p1.hp);
          p1.vx = p2.facing * 3;
          spawnInkSplatter(p1.x, p1.y - 80, 6, 3, '#ffffff');
        } else {
          // P1 hit
          const dmg = p2.state === 'SWORD_SLASH' ? 18 : (p2.state === 'HEAVY_KICK' ? 14 : 7);
          p1.hp = Math.max(0, p1.hp - dmg);
          setPlayerHp(p1.hp);
          p1.hitStun = 22;
          p1.vx = p2.facing * 6;
          p1.spriteKey = '03_defence_sheet_07.png';
          soundEngine.playPunch();
          spawnInkSplatter(p1.x, p1.y - 80, 16, 7, '#1e1e1a');
          sim.screenShake = 8;
        }
      }

      // Update ambient petals
      sim.ambientPetals.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        if (p.x < -20) p.x = 980;
        if (p.y > 550) p.y = -10;
      });

      // Update particles
      sim.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // particle gravity
        p.alpha -= 0.025;
      });
      sim.particles = sim.particles.filter((p) => p.alpha > 0);

      // Update slash trails
      sim.slashTrails.forEach((s) => {
        s.alpha -= 0.07;
      });
      sim.slashTrails = sim.slashTrails.filter((s) => s.alpha > 0);

      // Update floating texts
      sim.floatingTexts.forEach((ft) => {
        ft.y -= 1.0;
        ft.alpha -= 0.02;
      });
      sim.floatingTexts = sim.floatingTexts.filter((ft) => ft.alpha > 0);
    };

    // Draw frame
    const draw = () => {
      const sim = simRef.current;
      const { p1, p2 } = sim;

      ctx.save();

      // Screen shake translation
      if (sim.screenShake > 0.5) {
        const shakeX = (Math.random() - 0.5) * sim.screenShake;
        const shakeY = (Math.random() - 0.5) * sim.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // Clear Canvas
      ctx.fillStyle = '#161614';
      ctx.fillRect(0, 0, 960, 540);

      // Background Dojo Art: Bamboo moonlit sumi-e aesthetic
      // Moon gradient
      const moonGrad = ctx.createRadialGradient(480, 140, 10, 480, 140, 180);
      moonGrad.addColorStop(0, 'rgba(245, 240, 225, 0.18)');
      moonGrad.addColorStop(0.5, 'rgba(210, 200, 180, 0.06)');
      moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGrad;
      ctx.fillRect(0, 0, 960, 400);

      // Giant Moon Disc
      ctx.beginPath();
      ctx.arc(480, 140, 68, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240, 235, 220, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(240, 235, 220, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Distant mountain silhouette
      ctx.beginPath();
      ctx.moveTo(0, 360);
      ctx.lineTo(160, 290);
      ctx.lineTo(340, 340);
      ctx.lineTo(480, 270);
      ctx.lineTo(650, 330);
      ctx.lineTo(820, 280);
      ctx.lineTo(960, 350);
      ctx.lineTo(960, 420);
      ctx.lineTo(0, 420);
      ctx.closePath();
      ctx.fillStyle = '#1a1a17';
      ctx.fill();

      // Bamboo stalks in background
      ctx.strokeStyle = '#22221e';
      ctx.lineWidth = 4;
      [80, 120, 200, 760, 840, 890].forEach((bx) => {
        ctx.beginPath();
        ctx.moveTo(bx, 80);
        ctx.lineTo(bx + 4, 420);
        ctx.stroke();
      });

      // Wooden Dojo Floor / Tatami stage
      ctx.fillStyle = '#22221d';
      ctx.fillRect(0, GROUND_Y, 960, 125);

      // Floor grain lines
      ctx.strokeStyle = '#2c2c25';
      ctx.lineWidth = 2;
      for (let y = GROUND_Y; y <= 540; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(960, y);
        ctx.stroke();
      }

      // Dojo Calligraphy Banners (Left & Right)
      ctx.fillStyle = '#1c1c19';
      ctx.fillRect(30, 80, 44, 240);
      ctx.fillRect(886, 80, 44, 240);
      ctx.strokeStyle = '#383830';
      ctx.strokeRect(30, 80, 44, 240);
      ctx.strokeRect(886, 80, 44, 240);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 22px "Noto Serif JP", serif';
      ctx.textAlign = 'center';
      ctx.fillText('墨', 52, 130);
      ctx.fillText('刃', 52, 175);
      ctx.fillText('道', 52, 220);

      ctx.fillText('心', 908, 130);
      ctx.fillText('如', 908, 175);
      ctx.fillText('鏡', 908, 220);

      // Ambient floating sakura / ink petals
      sim.ambientPetals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Super Flash negative effect
      if (sim.superFlash > 0) {
        ctx.fillStyle = `rgba(245, 245, 240, ${sim.superFlash / 24 * 0.45})`;
        ctx.fillRect(0, 0, 960, 540);
      }

      // Draw Character Shadows
      [p1, p2].forEach((p) => {
        ctx.save();
        ctx.beginPath();
        const shadowWidth = 55;
        const shadowScale = Math.max(0.4, 1 - Math.abs(p.y - GROUND_Y) / 180);
        ctx.ellipse(p.x, GROUND_Y + 4, shadowWidth * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fill();
        ctx.restore();
      });

      // Helper function to draw character sprite
      const drawFighter = (
        p: { spriteKey: string; x: number; y: number; facing: number; state: string; stateTimer: number },
        isShadow: boolean = false
      ) => {
        const img = imageLoader.getImage(p.spriteKey);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.facing, 1);

        // Render height target: ~170px
        const renderH = 175;
        const aspect = img ? img.width / img.height : 0.65;
        const renderW = renderH * aspect;

        // If shadow opponent, add dark charcoal aura and invert filter
        if (isShadow && opponentType !== 'dummy') {
          ctx.shadowColor = '#dc2626';
          ctx.shadowBlur = 14;
        }

        if (img) {
          // Draw sprite anchored at bottom center
          ctx.drawImage(img, -renderW / 2, -renderH, renderW, renderH);

          // If shadow opponent, overlay dark tint
          if (isShadow && opponentType !== 'dummy') {
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = 'rgba(25, 25, 25, 0.85)';
            ctx.fillRect(-renderW / 2, -renderH, renderW, renderH);
            ctx.globalCompositeOperation = 'source-over';

            // Glowing red eyes
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(p.facing === 1 ? 6 : -6, -renderH + 28, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Placeholder silhouette if image loading
          ctx.fillStyle = isShadow ? '#333' : '#e6e4dc';
          ctx.fillRect(-25, -renderH, 50, renderH);
        }

        // Debug Hitboxes / Hurtboxes
        if (showHitboxes) {
          // Hurtbox (Green)
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-renderW * 0.35, -renderH + 10, renderW * 0.7, renderH - 12);

          // Hitbox (Red) if in active attack frame
          const isAttacking = ['LIGHT_1', 'LIGHT_2', 'LIGHT_3', 'HEAVY_KICK', 'SWORD_SLASH', 'SWORD_THRUST', 'SWORD_CYCLONE'].includes(p.state);
          if (isAttacking && p.stateTimer >= 4 && p.stateTimer <= 10) {
            ctx.strokeStyle = '#ef4444';
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
            const hx = 20;
            const hy = -renderH + 30;
            const hw = 55;
            const hh = 45;
            ctx.fillRect(hx, hy, hw, hh);
            ctx.strokeRect(hx, hy, hw, hh);
          }
        }

        ctx.restore();
      };

      // Draw P1 (Player)
      drawFighter(p1, false);

      // Draw P2 (Opponent / Dummy)
      if (opponentType === 'dummy') {
        // Draw training straw dummy
        ctx.save();
        ctx.translate(p2.x, p2.y);
        ctx.fillStyle = '#8b5a2b';
        // Post
        ctx.fillRect(-10, -170, 20, 170);
        // Straw head
        ctx.fillStyle = '#bfa15f';
        ctx.beginPath();
        ctx.arc(0, -160, 22, 0, Math.PI * 2);
        ctx.fill();
        // Arms
        ctx.fillStyle = '#785023';
        ctx.fillRect(-45, -125, 90, 14);
        // Base plate
        ctx.fillStyle = '#443322';
        ctx.fillRect(-35, -6, 70, 12);

        if (showHitboxes) {
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-25, -175, 50, 175);
        }
        ctx.restore();
      } else {
        drawFighter(p2, true);
      }

      // Draw Slash Trails (Canvas Calligraphy Strokes)
      sim.slashTrails.forEach((s) => {
        if (s.points.length < 2) return;
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = s.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) {
          ctx.lineWidth = s.points[i].width;
          ctx.lineTo(s.points[i].x, s.points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw Particles (Ink Splatters)
      sim.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Floating Damage & Calligraphy Text
      sim.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${Math.round(18 * ft.scale)}px "Noto Serif JP", serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();
    };

    // Animation ticker
    const loop = () => {
      if (isPlaying) {
        update();
      }
      draw();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, showHitboxes, opponentType]);

  // Audio mute toggle
  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setSoundMuted(muted);
  };

  const handleToggleAmbient = () => {
    const active = soundEngine.toggleAmbient();
    setAmbientActive(active);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Banner / Match Info Bar */}
      <div className="bg-[#1a1a18] border border-stone-800 rounded-xl p-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Player 1 Health & Ink Meter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-serif text-stone-300">
              <span className="font-bold tracking-wider text-amber-200">INKBLADE (P1)</span>
              <span className="font-mono">{playerHp} / 100 HP</span>
            </div>
            {/* Health bar */}
            <div className="w-full h-3 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-150"
                style={{ width: `${playerHp}%` }}
              />
            </div>
            {/* Ink Gauge ("墨" Super meter) */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-serif text-red-500 font-bold">墨 INK</span>
              <div className="flex-1 h-2 bg-stone-900 rounded-full overflow-hidden border border-red-950">
                <div
                  className="h-full bg-gradient-to-r from-red-800 via-red-600 to-amber-500 transition-all duration-100"
                  style={{ width: `${playerInk}%` }}
                />
              </div>
              <span className={`text-[10px] font-mono ${playerInk >= 50 ? 'text-red-400 font-bold animate-pulse' : 'text-stone-500'}`}>
                {playerInk >= 50 ? 'SUPER READY [I]' : `${playerInk}%`}
              </span>
            </div>
          </div>

          {/* Center Combo & Move Status */}
          <div className="flex flex-col items-center justify-center text-center">
            {comboCount > 0 ? (
              <div className="animate-bounce">
                <span className="text-2xl font-black font-serif text-amber-400 tracking-wider">
                  {comboCount} HITS!
                </span>
                <p className="text-xs font-mono text-red-400 font-semibold">{comboDamage} TOTAL DAMAGE</p>
              </div>
            ) : (
              <div className="text-xs text-stone-400 flex flex-col items-center">
                <span className="text-stone-500 text-[11px] uppercase tracking-widest font-mono">Current Action</span>
                <span className="text-amber-100 font-serif font-semibold text-sm">{currentMoveName}</span>
              </div>
            )}
          </div>

          {/* Opponent Health Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-serif text-stone-300">
              <div className="flex items-center gap-2">
                <span className="font-mono">{enemyHp} / 100 HP</span>
              </div>
              <span className="font-bold tracking-wider text-stone-300">
                {opponentType === 'dummy' ? 'PRACTICE DUMMY' : (opponentType === 'shadow_novice' ? 'SHADOW CLONE (NOVICE)' : 'SHADOW MASTER (SENSEI)')}
              </span>
            </div>
            <div className="w-full h-3 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-700">
              <div
                className="h-full bg-gradient-to-l from-red-600 to-amber-600 rounded-full transition-all duration-150"
                style={{ width: `${enemyHp}%` }}
              />
            </div>
            {/* Opponent selector */}
            <div className="flex justify-end gap-1.5 mt-0.5 text-[11px]">
              <button
                onClick={() => { setOpponentType('dummy'); handleReset(); }}
                className={`px-2 py-0.5 rounded transition ${opponentType === 'dummy' ? 'bg-amber-800/60 text-amber-200 border border-amber-600/40' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Dummy
              </button>
              <button
                onClick={() => { setOpponentType('shadow_novice'); handleReset(); }}
                className={`px-2 py-0.5 rounded transition ${opponentType === 'shadow_novice' ? 'bg-red-900/60 text-red-200 border border-red-700/40' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Novice AI
              </button>
              <button
                onClick={() => { setOpponentType('shadow_sensei'); handleReset(); }}
                className={`px-2 py-0.5 rounded transition ${opponentType === 'shadow_sensei' ? 'bg-red-950 text-amber-300 border border-red-500' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Sensei AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-[#141412] shadow-2xl">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-auto aspect-video block object-contain"
        />

        {/* Loading overlay if sprites still loading */}
        {loadedPercent < 100 && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 z-30">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-serif text-stone-300 text-sm">Preparing InkBlade Sprites ({loadedPercent}%)...</span>
          </div>
        )}

        {/* In-Game Toolbar Overlay (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-stone-800 text-xs text-stone-300 z-10">
          <button
            onClick={() => setShowHitboxes(!showHitboxes)}
            className={`p-1.5 rounded transition flex items-center gap-1 ${showHitboxes ? 'bg-emerald-900/70 text-emerald-300 border border-emerald-600/50' : 'hover:bg-stone-800'}`}
            title="Toggle Hitbox / Hurtbox Overlay"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Hitboxes</span>
          </button>
          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded hover:bg-stone-800 transition ${soundMuted ? 'text-stone-500' : 'text-amber-300'}`}
            title="Toggle Sound Effects"
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleToggleAmbient}
            className={`p-1.5 rounded transition ${ambientActive ? 'bg-amber-900/60 text-amber-200 border border-amber-600/40' : 'hover:bg-stone-800 text-stone-400'}`}
            title="Toggle Ambient Bamboo Wind"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-300 hover:text-white transition"
            title="Reset Match"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Frame Data Inspector Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 flex items-center gap-4 z-10 font-mono">
          <div>
            <span className="text-stone-500 text-[10px] block">MOVE</span>
            <span className="text-amber-200 font-semibold">{lastFrameInfo.move}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-stone-500 text-[10px] block">STARTUP</span>
            <span>{lastFrameInfo.startup}f</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-stone-500 text-[10px] block">ACTIVE</span>
            <span className="text-red-400">{lastFrameInfo.active}f</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-stone-500 text-[10px] block">RECOVERY</span>
            <span>{lastFrameInfo.recovery}f</span>
          </div>
          <div>
            <span className="text-stone-500 text-[10px] block">ADVANTAGE</span>
            <span className="text-emerald-400 font-bold">{lastFrameInfo.advantage}</span>
          </div>
        </div>
      </div>

      {/* Touch & Quick Action Virtual Controls (Great for mobile & quick testing) */}
      <div className="bg-[#181816] border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Direction & Movement Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-serif mr-2 hidden sm:inline">Tactics:</span>
          <button
            onClick={() => triggerPlayerAction('JUMP')}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
          >
            Jump (Space)
          </button>
          <button
            onClick={() => triggerPlayerAction('DASH')}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
          >
            Roll / Dash (Shift)
          </button>
          <button
            onClick={() => triggerPlayerAction('BLOCK')}
            className="px-3.5 py-2 bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-700/50 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" /> Parry / Guard (L)
          </button>
        </div>

        {/* Combat Attacks Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => triggerPlayerAction('LIGHT')}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-100 rounded-lg text-xs font-bold border border-stone-600 shadow"
          >
            Punch [J]
          </button>
          <button
            onClick={() => triggerPlayerAction('HEAVY')}
            className="px-4 py-2 bg-amber-950/70 hover:bg-amber-900/70 active:scale-95 text-amber-200 rounded-lg text-xs font-bold border border-amber-700/50 shadow"
          >
            Kick [K]
          </button>
          <button
            onClick={() => triggerPlayerAction('SWORD')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 active:scale-95 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-700/50 shadow flex items-center gap-1"
          >
            <Swords className="w-3.5 h-3.5" /> Katana [U]
          </button>
          <button
            onClick={() => triggerPlayerAction('SPECIAL')}
            disabled={playerInk < 50}
            className={`px-4 py-2 rounded-lg text-xs font-bold shadow flex items-center gap-1.5 transition ${playerInk >= 50 ? 'bg-red-700 hover:bg-red-600 text-white animate-pulse' : 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'}`}
          >
            <Zap className="w-3.5 h-3.5" /> 墨痕一闪 [I]
          </button>
          <button
            onClick={() => setShowMoveList(!showMoveList)}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-400 rounded-lg text-xs font-medium border border-stone-800"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Move List & Mechanics Guide */}
      {showMoveList && (
        <div className="bg-[#181816] border border-stone-800 rounded-xl p-5 text-sm animate-fade-in shadow-xl">
          <h3 className="font-serif font-bold text-amber-200 text-base mb-3 flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-500" />
            InkBlade Dojo Combat Manual & Move List
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="bg-stone-900/80 p-3 rounded-lg border border-stone-800">
              <span className="font-bold text-amber-300 font-serif block mb-1">Locomotion</span>
              <ul className="space-y-1 text-stone-400">
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">A / D</kbd> : Walk Forward / Back</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">Space</kbd> : Airborne Leap (Ascend / Apex)</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">Shift</kbd> : Tactical Ground Roll (i-Frames)</li>
              </ul>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-lg border border-stone-800">
              <span className="font-bold text-amber-300 font-serif block mb-1">Unarmed Combos</span>
              <ul className="space-y-1 text-stone-400">
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">J</kbd> : Lead Snap Jab (4f startup)</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">J &gt; J</kbd> : Rear Cross Strike (12 dmg)</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">J &gt; J &gt; J</kbd> : Iron Palm Internal Thrust</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">K</kbd> : High Roundhouse Kick (Wall bounce)</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">S + K</kbd> : Low Dragon Leg Sweep</li>
              </ul>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-lg border border-stone-800">
              <span className="font-bold text-amber-300 font-serif block mb-1">Katana Techniques</span>
              <ul className="space-y-1 text-stone-400">
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">U</kbd> : Ichimonji Cleave Slash (24 dmg)</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">W + U</kbd> : Spinning Cyclone Whirlwind</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">S + U</kbd> : Two-Handed Piercing Tsuki</li>
              </ul>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-lg border border-stone-800">
              <span className="font-bold text-amber-300 font-serif block mb-1">Defensive Mastery & Super</span>
              <ul className="space-y-1 text-stone-400">
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">L</kbd> (Instant) : Timed Parry (Freezes foe!)</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">L</kbd> (Hold) : Crossed Iron Guard (80% block)</li>
                <li><kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-200">I</kbd> : 墨痕一闪 Black Ink Flash (50% Ink)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
