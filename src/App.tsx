import React, { useEffect } from 'react';
import { useGameStore, store } from './store';
import { constraintTick } from './engine';

import LandingScreen from './screens/LandingScreen';
import SimScreen from './screens/SimScreen';
import MissionsScreen from './screens/MissionsScreen';
import SkillsScreen from './screens/SkillsScreen';
import CertScreen from './screens/CertScreen';
import DarScreen from './screens/DarScreen';
import TeacherScreen from './screens/TeacherScreen';

import BottomNav from './components/BottomNav';
import Modals from './components/Modals';
import Toasts from './components/Toasts';

export default function App() {
  const { currentScreen } = useGameStore();

  useEffect(() => {
    const iv = setInterval(constraintTick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="w-full h-dvh flex flex-col overflow-hidden text-[#E8E4DC] font-sans bg-[#060608]">
      <div className="flex-1 relative overflow-hidden">
        {currentScreen === 'landing' && <LandingScreen />}
        {currentScreen === 'sim' && <SimScreen />}
        {currentScreen === 'missions' && <MissionsScreen />}
        {currentScreen === 'skills' && <SkillsScreen />}
        {currentScreen === 'cert' && <CertScreen />}
        {currentScreen === 'dar' && <DarScreen />}
        {currentScreen === 'teacher' && <TeacherScreen />}
      </div>
      {currentScreen !== 'landing' && <BottomNav />}
      
      <Modals />
      <Toasts />
    </div>
  );
}
