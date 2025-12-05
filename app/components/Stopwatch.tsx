'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 秒表组件
 * 支持正向计时、开始/暂停/继续/重置
 */
export default function Stopwatch() {
    // 运行状态
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // 总流逝时间（毫秒）

    // 用于精确计时的引用
    const startTimeRef = useRef<number>(0);
    const accumulatedTimeRef = useRef<number>(0);

    // 格式化时间显示 (HH:MM:SS)
    const formatTime = useCallback((ms: number): { hours: string; minutes: string; seconds: string } => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
        };
    }, []);

    // 开始计时
    const handleStart = () => {
        startTimeRef.current = Date.now();
        accumulatedTimeRef.current = 0;
        setElapsedTime(0);
        setIsRunning(true);
    };

    // 暂停计时
    const handlePause = () => {
        accumulatedTimeRef.current = elapsedTime;
        setIsRunning(false);
    };

    // 继续计时
    const handleResume = () => {
        startTimeRef.current = Date.now();
        setIsRunning(true);
    };

    // 重置
    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        accumulatedTimeRef.current = 0;
    };

    // 计时器逻辑
    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const elapsed = accumulatedTimeRef.current + (now - startTimeRef.current);
            setElapsedTime(elapsed);
        }, 100);

        return () => clearInterval(timer);
    }, [isRunning]);

    const time = formatTime(elapsedTime);
    const hasStarted = elapsedTime > 0 || isRunning;

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                秒表
            </h2>

            {/* 时间显示 */}
            <div className="flex items-center gap-2 md:gap-4 mb-4">
                {/* 时 */}
                <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 font-mono">
                        {time.hours}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">时</span>
                </div>

                <span className="text-3xl md:text-5xl font-bold text-gray-400">:</span>

                {/* 分 */}
                <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 font-mono">
                        {time.minutes}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">分</span>
                </div>

                <span className="text-3xl md:text-5xl font-bold text-gray-400">:</span>

                {/* 秒 */}
                <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 font-mono">
                        {time.seconds}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">秒</span>
                </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex gap-2">
                {/* 开始按钮 - 初始状态 */}
                {!hasStarted && (
                    <button
                        onClick={handleStart}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg 
                                   transition-colors duration-200 font-medium"
                    >
                        开始
                    </button>
                )}

                {/* 暂停按钮 - 运行中 */}
                {isRunning && (
                    <button
                        onClick={handlePause}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg 
                                   transition-colors duration-200 font-medium"
                    >
                        暂停
                    </button>
                )}

                {/* 继续按钮 - 暂停状态 */}
                {!isRunning && hasStarted && (
                    <button
                        onClick={handleResume}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                                   transition-colors duration-200 font-medium"
                    >
                        继续
                    </button>
                )}

                {/* 重置按钮 - 已开始后显示 */}
                {hasStarted && (
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg 
                                   transition-colors duration-200 font-medium"
                    >
                        重置
                    </button>
                )}
            </div>
        </div>
    );
}
