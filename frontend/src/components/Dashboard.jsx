import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Settings, Users, FileText, MessageCircle, Play, Trophy, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const dashboardItems = [
    { id: 1, title: 'शब्दFusion', icon: Home, gradient: 'linear-gradient(135deg, #A0522D, #8B4513)' },
    { id: 2, title: 'वाक्यCraft', icon: BookOpen, gradient: 'linear-gradient(135deg, #DAA520, #B8860B)' },
    { id: 3, title: 'संख्याTrivia', icon: Settings, gradient: 'linear-gradient(135deg, #CD853F, #A0522D)' },
    { id: 4, title: 'धातुQuest', icon: Users, gradient: 'linear-gradient(135deg, #D2691E, #A0522D)' },
    { id: 5, title: 'कालMaster', icon: FileText, gradient: 'linear-gradient(135deg, #DAA520, #CD853F)' },
    { id: 6, title: 'Chat', icon: MessageCircle, gradient: 'linear-gradient(135deg, #B8860B, #8B4513)' }
  ];

  const leaderboardData = [
    { rank: 1, name: 'Anil', avatar: '🧑‍🎓', score: 2450, color: '#FFD700' },
  ];

  const progressData = [
    { day: 'M', value: 85, color: '#A0522D' },
    { day: 'T', value: 72, color: '#8B4513' },
    { day: 'W', value: 96, color: '#DAA520' },
    { day: 'T', value: 81, color: '#CD853F' },
    { day: 'F', value: 93, color: '#D2691E' },
    { day: 'S', value: 78, color: '#B8860B' },
    { day: 'S', value: 88, color: '#A0522D' }
  ];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Noto Sans Devanagari', sans-serif;
      background: linear-gradient(135deg, #A0522D 0%, #8B4513 25%, #DAA520 50%, #CD853F 75%, #F5DEB3 100%);
      background-size: 400% 400%;
      animation: gradientFlow 15s ease infinite;
      min-height: 100vh;
      overflow-x: hidden;
    }

    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .dashboard-container {
      min-height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 0 0.5rem;
      margin: 0;
      position: relative;
      transform: ${isLoaded ? 'translateY(0)' : 'translateY(30px)'};
      opacity: ${isLoaded ? 1 : 0};
      transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .parallax-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 25% 75%, rgba(160, 82, 45, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 75% 25%, rgba(218, 165, 32, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(245, 222, 179, 0.1) 0%, transparent 50%);
      transform: translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px);
      transition: transform 0.3s ease;
      pointer-events: none;
      z-index: -1;
    }

    .floating-particles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .particle {
      position: absolute;
      width: 6px;
      height: 6px;
      background: rgba(218, 165, 32, 0.6);
      border-radius: 50%;
      animation: particleFloat 8s ease-in-out infinite;
    }

    @keyframes particleFloat {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
      50% { transform: translateY(-100px) translateX(30px); opacity: 1; }
    }

    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: 2.5rem;
      margin-bottom: 2.2rem;
      animation: slideInDown 1s ease;
    }

    @keyframes slideInDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(25px);
      padding: 1.5rem 2rem;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .profile-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .profile-section:hover::before {
      left: 100%;
    }

    .profile-section:hover {
      transform: translateY(-5px);
      box-shadow: 
        0 25px 60px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #DAA520, #CD853F);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.2),
        0 0 30px rgba(218, 165, 32, 0.4);
      border: 4px solid rgba(255, 255, 255, 0.3);
      animation: avatarPulse 4s ease-in-out infinite;
    }

    @keyframes avatarPulse {
      0%, 100% { 
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 30px rgba(218, 165, 32, 0.4);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), 0 0 50px rgba(218, 165, 32, 0.7);
        transform: scale(1.05);
      }
    }

    .welcome-text {
      color: #fff;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 
        0 0 20px rgba(255, 255, 255, 0.5),
        0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .sanskrit-text {
      color: #F5DEB3;
      font-size: 1.4rem;
      font-weight: 500;
      text-shadow: 0 0 15px rgba(245, 222, 179, 0.8);
      animation: textGlow 3s ease-in-out infinite alternate;
    }

    @keyframes textGlow {
      from { text-shadow: 0 0 15px rgba(245, 222, 179, 0.8); }
      to { text-shadow: 0 0 25px rgba(245, 222, 179, 1), 0 0 35px rgba(218, 165, 32, 0.6); }
    }

    .main-content {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 1.2rem;
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      animation: fadeInUp 1s ease 0.3s both;
      min-width: 0;
      width: 600px;
      height: 150px;
    }

    @keyframes fadeInUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .flip-card {
      width: 170px;
      height: 140px;
      perspective: 800px;
      position: relative;
      overflow: hidden;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .flip-card-inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
      transform-style: preserve-3d;
      will-change: transform;
      overflow: hidden;
    }

    .flip-card:hover .flip-card-inner {
      transform: rotateY(180deg);
    }

    .flip-card-front, .flip-card-back {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border-radius: 18px;
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      box-shadow: 0 8px 18px rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.18);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin: 0;
      padding: 0;
      background: rgba(255,255,255,0.13);
    }

    .flip-card-front {
      z-index: 2;
      transform: rotateY(0deg);
    }

    .flip-card-back {
      z-index: 3;
      transform: rotateY(180deg);
    }

    .card-icon {
      font-size: 2.2rem;
      margin-bottom: 0.5rem;
      color: #fff;
      filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
      animation: iconFloat 4s ease-in-out infinite;
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }

    .card-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.02em;
    }

    .play-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
      height: 100%;
      justify-content: center;
    }

    .play-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1.8rem;
      font-weight: 700;
      cursor: pointer;
      outline: none;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      animation: playGlow 2s ease-in-out infinite alternate;
      letter-spacing: 0.05em;
    }

    @keyframes playGlow {
      from { text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); }
      to { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 2px 10px rgba(0, 0, 0, 0.5); }
    }

    .play-icon {
      animation: playPulse 2s ease-in-out infinite;
    }

    @keyframes playPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 220px;
      max-width: 240px;
      width: 100%;
      animation: slideInRight 1s ease 0.5s both;
    }

    @keyframes slideInRight {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .widget {
      background: rgba(255, 255, 255, 0.09);
      backdrop-filter: blur(15px);
      border-radius: 15px;
      padding: 1.1rem 0.7rem;
      border: 1px solid rgba(255, 255, 255, 0.13);
      box-shadow: 0 8px 18px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.13);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .widget::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .widget:hover::before {
      left: 100%;
    }

    .widget:hover {
      transform: translateY(-8px);
      box-shadow: 
        0 30px 70px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .widget-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.7rem;
      text-align: center;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .progress-container {
      display: flex;
      justify-content: space-between;
      align-items: end;
      height: 70px;
      margin-bottom: 0.7rem;
      padding: 0 0.2rem;
    }

    .progress-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-bar {
      width: 25px;
      border-radius: 15px;
      position: relative;
      transition: all 0.4s ease;
      animation: barGrow 1.5s ease;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    @keyframes barGrow {
      from { height: 0; opacity: 0; }
      to { height: var(--height); opacity: 1; }
    }

    .progress-bar:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .day-label {
      font-size: 0.9rem;
      color: #F5DEB3;
      font-weight: 500;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
    }

    .leaderboard-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .leaderboard-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.09);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.13);
      transition: all 0.3s ease;
      animation: slideIn 0.6s ease;
      position: relative;
      overflow: hidden;
    }

    .leaderboard-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .leaderboard-item:hover::before {
      left: 100%;
    }

    @keyframes slideIn {
      from { transform: translateX(-30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .leaderboard-item:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(8px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .rank-badge {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, #DAA520, #CD853F);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 0.85rem;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
      animation: rankPulse 3s ease-in-out infinite;
    }

    @keyframes rankPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .user-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .user-avatar {
      font-size: 1.1rem;
      animation: avatarBounce 2s ease-in-out infinite;
    }

    @keyframes avatarBounce {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }

    .user-name {
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
      font-size: 0.95rem;
    }

    .user-score {
      font-size: 0.9rem;
      color: #F5DEB3;
      font-weight: 600;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 1024px) {
      .main-content {
        flex-direction: column;
        align-items: center;
        gap: 1.2rem;
        max-width: 98vw;
      }
      .sidebar {
        order: 2;
        min-width: 0;
        max-width: 100vw;
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        width: 100%;
      }
      .header {
        flex-direction: column;
        gap: 0.7rem;
        text-align: center;
      }
      .dashboard-container {
        padding: 0.2rem;
      }
    }

    @media (max-width: 480px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
        width: 100%;
      }
      .flip-card {
        height: 110px;
        width: 98vw;
      }
      .main-content {
        max-width: 100vw;
        padding: 0;
      }
    }

    .floating-element-dashboard {
      position: fixed;
      width: var(--size);
      height: var(--size);
      left: var(--left);
      top: var(--top);
      background: linear-gradient(45deg, rgba(218, 165, 32, var(--opacity)), rgba(240, 230, 140, var(--opacity)));
      border-radius: 50%;
      animation: float-drift-dashboard var(--duration) ease-in-out infinite;
      animation-delay: var(--delay);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(218, 165, 32, 0.2);
      z-index: 0;
      pointer-events: none;
    }

    @keyframes float-drift-dashboard {
      0% {
        transform: translate(0px, 0px) rotate(0deg);
      }
      25% {
        transform: translate(var(--drift-x), calc(var(--drift-y) * 0.5)) rotate(90deg);
      }
      50% {
        transform: translate(calc(var(--drift-x) * 0.7), var(--drift-y)) rotate(180deg);
      }
      75% {
        transform: translate(calc(var(--drift-x) * 0.3), calc(var(--drift-y) * 0.7)) rotate(270deg);
      }
      100% {
        transform: translate(0px, 0px) rotate(360deg);
      }
    }
  `;

  const handlePlayClick = () => {
    window.location.href = '/play';
  };

  const FloatingElement = ({ delay, duration, size, left, top, opacity = 0.1 }) => {
    const driftX = Math.random() * 60 - 30; // -30px to +30px
    const driftY = Math.random() * 60 - 30; // -30px to +30px
    return (
      <div
        className="floating-element-dashboard"
        style={{
          '--delay': delay,
          '--duration': duration,
          '--size': size,
          '--left': left,
          '--top': top,
          '--opacity': opacity,
          '--drift-x': `${driftX}px`,
          '--drift-y': `${driftY}px`,
        }}
      />
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="parallax-bg" />
      
      <div className="dashboard-container">
        <div className="header">
          <div className="profile-section">
            <div className="avatar">👵🏻</div>
            <div>
              <div className="welcome-text">Welcome Back!</div>
              <div className="sanskrit-text">स्वागतम् छात्र!</div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="dashboard-grid">
            {dashboardItems.map((item, index) => (
              <div key={item.id} className="flip-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-icon">
                      <item.icon />
                    </div>
                    <div className="card-title">{item.title}</div>
                  </div>
                  <div className="flip-card-back">
                    <div className="play-content">
                      <button className="play-button" onClick={handlePlayClick}>
                        PLAY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar">
            <div className="widget">
              <div className="widget-title">📊 Weekly Progress</div>
              <div className="progress-container">
                {progressData.map((item, index) => (
                  <div key={index} className="progress-item">
                    <div
                      className="progress-bar"
                      style={{ 
                        '--height': `${item.value}%`,
                        height: `${item.value}%`,
                        background: `linear-gradient(to top, ${item.color}, ${item.color}dd)`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                    <div className="day-label">{item.day}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="widget">
              <div className="widget-title">🏆 Scoreboard</div>
              <div className="leaderboard-container">
                {leaderboardData.map((user, index) => (
                  <div key={user.rank} className="leaderboard-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="rank-badge">{user.rank}</div>
                    <div className="user-info">
                      <div className="user-avatar">{user.avatar}</div>
                      <div className="user-name">{user.name}</div>
                    </div>
                    <div className="user-score">{user.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;