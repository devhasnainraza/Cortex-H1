import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import {
  Brain,
  Cpu,
  Eye,
  Compass,
  Zap,
  Terminal,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  ExternalLink,
  ChevronRight,
  Activity,
  Bot,
  Flame,
} from 'lucide-react';

// --- Subtle Ambient Background ---
const AmbientBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    {/* Soft subtle ambient blurs */}
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[140px]" />
    <div className="absolute top-1/3 right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
    {/* Micro-grid overlay */}
    <div
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }}
    />
  </div>
);

// --- 1. HERO SECTION ---
const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 'perception',
      label: 'Perception',
      icon: Eye,
      badge: '30 FPS • RGB-D & LiDAR Fusion',
      title: 'Multimodal Spatial Perception',
      desc: 'Synchronized Intel RealSense depth sensors and solid-state LiDAR streams fused into 3D voxel grids for real-time obstacle avoidance and 6-DoF SLAM.',
      highlights: [
        'Point cloud voxel filtering (< 33ms latency)',
        'Visual-Inertial Odometry & pose tracking',
        'Dynamic semantic obstacle segmentation',
      ],
      link: '/docs/module-1-ros2/foundations-physical-ai',
      file: 'spatial_perception.py',
      code: [
        { text: '# 30Hz Spatial Sensor Fusion Node', type: 'comment' },
        { text: 'depth_map = realsense.get_depth_frame()', type: 'code' },
        { text: 'point_cloud = lidar.get_point_cloud()', type: 'code' },
        { text: 'voxel_grid = vslam.fuse(depth_map, point_cloud)', type: 'accent' },
        { text: 'obstacles = detector.segment_objects(voxel_grid)', type: 'code' },
      ],
      status: '[INFO] 3D Voxel Grid initialized. Spatial streams synchronized.',
    },
    {
      id: 'simulation',
      label: 'Digital Twin',
      icon: Layers,
      badge: '4,096 Parallel GPU Envs',
      title: 'High-Fidelity Isaac Sim Twin',
      desc: 'GPU-parallelized physics simulation with domain randomization to train whole-body reinforcement learning policies before physical deployment.',
      highlights: [
        'Sub-millimeter collision and contact physics',
        'Mass, friction, and motor latency randomization',
        'Zero-shot Sim-to-Real policy transfer',
      ],
      link: '/docs/module-2-digital-twin/intro-digital-twin',
      file: 'isaac_humanoid_env.py',
      code: [
        { text: '# NVIDIA Isaac Lab Parallel Simulation', type: 'comment' },
        { text: 'sim_cfg = IsaacSimConfig(physics_dt=1/1000)', type: 'code' },
        { text: 'env = IsaacLab.make("Cortex-H1-Bipedal", num_envs=4096)', type: 'accent' },
        { text: 'policy = PPO.load("models/whole_body_v3.pt")', type: 'code' },
        { text: 'actions = policy.forward(env.get_observations())', type: 'code' },
      ],
      status: '[SIM] 4096 environments active at 120,000 FPS aggregate.',
    },
    {
      id: 'reasoning',
      label: 'VLA Reasoning',
      icon: Brain,
      badge: 'OpenVLA-7B • Multimodal Transformer',
      title: 'Vision-Language-Action Models',
      desc: 'End-to-end multimodal foundation models that connect natural language intent and vision cameras directly to robot joint trajectory tokens.',
      highlights: [
        'Zero-shot natural language instruction following',
        '7-DoF end-effector trajectory prediction',
        'Edge inference quantized for NVIDIA Jetson Orin',
      ],
      link: '/docs/module-4-vla/intro-vla',
      file: 'vla_policy_node.py',
      code: [
        { text: '# OpenVLA Multimodal End-to-End Inference', type: 'comment' },
        { text: 'prompt = "Pick up the blue screwdriver from the bench"', type: 'code' },
        { text: 'inputs = processor(images=camera_feed, text=prompt)', type: 'code' },
        { text: 'tokens = vla_model.generate_actions(**inputs)', type: 'accent' },
        { text: 'trajectory = tokens.to_joint_trajectory()', type: 'code' },
      ],
      status: '[VLA] Trajectory generated in 180ms. Confidence: 94.8%.',
    },
    {
      id: 'control',
      label: 'Real-Time Control',
      icon: Zap,
      badge: '1,000 Hz Deterministic Loop',
      title: 'Low-Latency Actuator Control',
      desc: 'Deterministic PREEMPT_RT Linux kernel running CycloneDDS over EtherCAT for microsecond-level joint torque execution.',
      highlights: [
        '1 kHz deterministic cycle with < 20µs jitter',
        'Low-level motor current and position feedback',
        'Hardware safety interlocks and e-stop watchdog',
      ],
      link: '/docs/module-1-ros2/foundations-physical-ai',
      file: 'dds_actuator_loop.py',
      code: [
        { text: '# 1kHz Deterministic EtherCAT Joint Actuator', type: 'comment' },
        { text: 'rt_loop = RealTimeLoop(frequency_hz=1000)', type: 'code' },
        { text: 'while rt_loop.ok():', type: 'code' },
        { text: '    torques = controller.compute_dynamics(q, dq)', type: 'accent' },
        { text: '    dds_pub.send_actuator_torques(torques)', type: 'code' },
      ],
      status: '[REAL-TIME] 1000Hz loop active. EtherCAT Master connected.',
    },
  ];

  const currentTab = tabs[activeTab];

  return (
    <header className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      <AmbientBackground />

      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200 uppercase">
              Cortex-H1 • Physical AI Curriculum
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Open Access
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <Heading
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.08]"
          >
            Physical Intelligence for <br />
            <span className="text-gradient-emerald">Humanoid Robotics</span>
          </Heading>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            The comprehensive, open-source textbook and laboratory guide. Master Real-Time ROS 2, Digital Twins in Isaac Sim, and Vision-Language-Action (VLA) Foundation Models.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-16">
          <Link
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all no-underline"
            to="/docs/module-1-ros2/foundations-physical-ai"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm hover:-translate-y-0.5 transition-all no-underline"
            href="#curriculum"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Curriculum Overview</span>
          </a>

          <Link
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-base font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
            to="https://github.com/devhasnainraza/Cortex-H1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code2 className="w-4 h-4" />
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>

        {/* Hero Interactive Architecture Preview */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Sleek Segment Tab Bar */}
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5" role="tablist">
              {tabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isSelected = activeTab === idx;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTab(idx)}
                    className={clsx(
                      'hero-tab-btn py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 select-none',
                      isSelected && 'hero-tab-active'
                    )}
                  >
                    <Icon className={clsx('w-3.5 h-3.5', isSelected ? 'text-emerald-500' : 'text-slate-400')} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="p-6 sm:p-8">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Explanations & Highlights */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{currentTab.badge}</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {currentTab.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentTab.desc}
                </p>

                <div className="space-y-2 pt-1">
                  {currentTab.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    to={currentTab.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 no-underline group"
                  >
                    <span>Read {currentTab.label} Documentation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Sleek Developer Window */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-[#090d16] border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
                  {/* Window Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1422] border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-[11px] text-slate-400 font-sans">
                        {currentTab.file}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-sans">
                      Python 3.10
                    </span>
                  </div>

                  {/* Code Area */}
                  <div className="p-4 sm:p-5 overflow-x-auto text-[12px] leading-relaxed">
                    <div className="space-y-1 whitespace-pre">
                      {currentTab.code.map((line, lIdx) => (
                        <div key={lIdx} className="flex">
                          <span className="text-slate-600 select-none w-6 shrink-0 text-right pr-3 text-[11px]">
                            {lIdx + 1}
                          </span>
                          <span
                            className={clsx(
                              line.type === 'comment' && 'text-slate-500 italic',
                              line.type === 'accent' && 'text-emerald-400 font-semibold',
                              line.type === 'code' && 'text-slate-200'
                            )}
                          >
                            {line.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal Status Output */}
                  <div className="px-4 py-2 bg-black/40 border-t border-slate-800/60 text-[11px] text-emerald-400/90 flex items-center gap-2 overflow-x-auto">
                    <Activity className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className="truncate">{currentTab.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- 2. METRICS & IMPACT STRIP ---
const StatsStrip = () => {
  const stats = [
    { value: '4 Modules', label: 'Structured Core Curriculum', sub: 'ROS 2, Sim, AI Brain, VLA' },
    { value: '100% Free', label: 'Open Access Textbook', sub: 'No paywalls, MIT licensed labs' },
    { value: '1 kHz Loop', label: 'Deterministic Real-Time', sub: 'PREEMPT_RT & CycloneDDS' },
    { value: 'Sim-to-Real', label: 'Zero-Shot Physical Transfer', sub: 'Isaac Sim to Unitree Bipeds' },
  ];

  return (
    <section className="py-10 border-y border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((item, idx) => (
            <div key={idx} className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                {item.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 3. THE AUTONOMY PIPELINE ---
const AutonomyPipeline = () => {
  const steps = [
    {
      num: '01',
      title: 'Perception',
      desc: 'RGB-D + LiDAR spatial fusion & real-time depth mapping',
      icon: Eye,
    },
    {
      num: '02',
      title: 'World Model',
      desc: 'Visual SLAM, OctoMap 3D voxel grids & semantic scene graphs',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Embodied AI',
      desc: 'Vision-Language-Action (VLA) models for task decomposition',
      icon: Brain,
    },
    {
      num: '04',
      title: 'Motion Planning',
      desc: 'Nav2 bipedal navigation & MoveIt 2 obstacle-aware trajectories',
      icon: Layers,
    },
    {
      num: '05',
      title: 'Control & Actuation',
      desc: '1 kHz low-level joint torque control via DDS & EtherCAT',
      icon: Zap,
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-[#020617]">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-2">
            The Autonomous Architecture
          </div>
          <Heading as="h2" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How Physical AI Operates
          </Heading>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            From raw sensory photons to physical actuator torques. The textbook covers every link in the humanoid robotics stack.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-0">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- 4. MASTER CURRICULUM BENTO GRID ---
const MasterCurriculum = () => {
  const modules = [
    {
      num: 'MODULE 01',
      title: 'The Robotic Nervous System',
      badge: 'Core Middleware',
      desc: 'Build the digital backbone with ROS 2 Humble. Master computational graphs, nodes, DDS communication QoS, and URDF kinematic modeling.',
      tags: ['ROS 2 Humble', 'DDS QoS', 'URDF', 'C++ / Python'],
      link: '/docs/module-1-ros2/foundations-physical-ai',
      icon: Cpu,
    },
    {
      num: 'MODULE 02',
      title: 'The Digital Twin',
      badge: 'Simulation & Physics',
      desc: 'Create high-fidelity physics environments in NVIDIA Isaac Sim and Gazebo Harmonic. Generate synthetic training data and calibrate domain randomization.',
      tags: ['Isaac Sim', 'Gazebo', 'MuJoCo', 'Synthetic Data'],
      link: '/docs/module-2-digital-twin/intro-digital-twin',
      icon: Layers,
    },
    {
      num: 'MODULE 03',
      title: 'The AI-Robot Brain',
      badge: 'Spatial AI & Locomotion',
      desc: 'Implement Nav2 path planners, visual SLAM feature tracking, and Model Predictive Control (MPC) for stable bipedal and quadrupedal locomotion.',
      tags: ['Nav2 Planners', 'Visual SLAM', 'MPC Locomotion', 'Jetson Orin'],
      link: '/docs/module-3-ai-brain/intro-rl',
      icon: Brain,
    },
    {
      num: 'MODULE 04',
      title: 'Vision-Language-Action (VLA)',
      badge: 'Embodied Foundation Models',
      desc: 'Connect multimodal LLMs directly to robot physical manipulation. Train and evaluate OpenVLA and RT-2 for zero-shot natural language instruction following.',
      tags: ['OpenVLA-7B', 'RT-2', 'Multimodal LLMs', 'Manipulation'],
      link: '/docs/module-4-vla/intro-vla',
      icon: Sparkles,
    },
  ];

  return (
    <section id="curriculum" className="py-20 md:py-24 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-2">
              Curriculum Roadmap
            </div>
            <Heading as="h2" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              The 4 Core Engineering Modules
            </Heading>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl">
              A structured progression taking you from hardware interfacing to state-of-the-art multimodal robotics.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 no-underline"
            to="/docs/textbook/introduction"
          >
            <span>Read Textbook Overview</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                      {m.num}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {m.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                      <Icon className="w-5 h-5 text-slate-800 dark:text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {m.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 no-underline group"
                  to={m.link}
                >
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- 5. HARDWARE & CODE SHOWCASE ---
const HardwareStack = () => {
  const [copied, setCopied] = useState(false);

  const sampleCode = `# ros2_arm_controller.py
import rclpy
from rclpy.node import Node
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint

class HumanoidArmController(Node):
    def __init__(self):
        super().__init__('humanoid_arm_controller')
        self.pub = self.create_publisher(
            JointTrajectory, '/cortex/arm_controller/joint_trajectory', 10
        )
        self.get_logger().info('Cortex-H1 Real-Time Node Initialized.')

    def execute_pose(self, joint_angles):
        msg = JointTrajectory()
        msg.joint_names = ['shoulder_pitch', 'shoulder_roll', 'elbow_yaw', 'wrist_pitch']
        point = JointTrajectoryPoint()
        point.positions = joint_angles
        point.time_from_start.sec = 1
        msg.points.append(point)
        self.pub.publish(msg)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const specs = [
    { label: 'Compute Engine', val: 'NVIDIA Jetson AGX Orin (64GB, 275 TOPS)', icon: Cpu },
    { label: 'Spatial Vision', val: 'Intel RealSense D435i + Solid-State LiDAR', icon: Eye },
    { label: 'Actuators', val: 'High-Torque Quasi-Direct Drive (QDD) Motors', icon: Zap },
    { label: 'Real-Time Kernel', val: 'Ubuntu 22.04 LTS (PREEMPT_RT Low-Latency)', icon: Terminal },
  ];

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-[#020617] border-t border-slate-200/80 dark:border-slate-800">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left: Hardware Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-2">
                Physical Specifications
              </div>
              <Heading as="h2" className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                Production Hardware Stack
              </Heading>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Tested against real-world humanoid prototypes and commercial quadruped platforms (such as the Unitree Go2 & H1).
              </p>
            </div>

            <div className="space-y-3.5">
              {specs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 shrink-0">
                      <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase text-slate-400 dark:text-slate-500 font-semibold">
                        {item.label}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {item.val}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Code Sample */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-slate-400 text-xs font-sans">ros2_arm_controller.py</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-x-auto text-slate-300 leading-relaxed">
                <pre className="m-0 bg-transparent text-slate-300 p-0 font-mono text-xs">
                  <code>{sampleCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 6. ECOSYSTEM LOGOS ---
const Ecosystem = () => {
  const tools = [
    { name: 'ROS 2 Humble', role: 'DDS Middleware' },
    { name: 'NVIDIA Isaac Sim', role: 'GPU Physics Twin' },
    { name: 'PyTorch 2.x', role: 'Deep Learning' },
    { name: 'MoveIt 2', role: 'Kinematics & Motion' },
    { name: 'Nav2', role: 'Autonomous Navigation' },
    { name: 'MuJoCo', role: 'Fast Contact Physics' },
  ];

  return (
    <section className="py-14 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-8">
          Built on Industry-Standard Robotics & AI Frameworks
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {tools.map((t, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-sm"
            >
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                {t.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 7. ACTION-DRIVEN FOOTER CTA ---
const FooterCta = () => {
  return (
    <section className="py-20 md:py-24 bg-white dark:bg-[#020617] border-t border-slate-200/80 dark:border-slate-800 text-center relative overflow-hidden">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <Heading
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-5 tracking-tight"
        >
          Build the Future of <br />
          <span className="text-gradient-emerald">Physical Intelligence</span>
        </Heading>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
          Start with Chapter 1 Foundations, or jump straight into the ROS 2 Humble engineering modules and executable labs.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white rounded-xl bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all no-underline"
            to="/docs/module-1-ros2/foundations-physical-ai"
          >
            <span>Launch Module 1 Labs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all no-underline"
            to="/docs/textbook/introduction"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Full Book</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

// --- MAIN PAGE EXPORT ---
export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} | The Physical AI Handbook`}
      description="Build autonomous humanoid robots with ROS 2, NVIDIA Isaac Sim, and VLA Models."
    >
      <main className="bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 min-h-screen">
        <HeroSection />
        <StatsStrip />
        <AutonomyPipeline />
        <MasterCurriculum />
        <HardwareStack />
        <Ecosystem />
        <FooterCta />
      </main>
    </Layout>
  );
}