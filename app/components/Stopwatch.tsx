'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 秒表组件
 * Midnight Studio 设计 - 霜蓝色主题
 */
export default function Stopwatch() {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    const startTimeRef = useRef<number>(0);
    const accumulatedTimeRef = useRef<number>(0);

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

    const handleStart = () => {
        startTimeRef.current = Date.now();
        accumulatedTimeRef.current = 0;
        setElapsedTime(0);
        setIsRunning(true);
    };

    const handlePause = () => {
        accumulatedTimeRef.current = elapsedTime;
        setIsRunning(false);
    };

    const handleResume = () => {
        startTimeRef.current = Date.now();
        setIsRunning(true);
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        accumulatedTimeRef.current = 0;
    };

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
        <div className="glass-card flex flex-col items-center justify-center h-full p-6">
            {/* 标签 */}
            <span className="section-label mb-4">秒表</span>

            {/* 时间显示 */}
            <div className="flex items-baseline gap-1 md:gap-2 mb-4">
                <div className="flex flex-col items-center">
                    <span className={`time-digit-frost text-3xl md:text-5xl font-mono font-medium ${isRunning ? 'animate-glow' : ''}`}>
                        {time.hours}
                    </span>
                    <span className="time-label">时</span>
                </div>

                <span
                    className="text-2xl md:text-4xl font-light"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    :
                </span>

                <div className="flex flex-col items-center">
                    <span className={`time-digit-frost text-3xl md:text-5xl font-mono font-medium ${isRunning ? 'animate-glow' : ''}`}>
                        {time.minutes}
                    </span>
                    <span className="time-label">分</span>
                </div>

                <span
                    className="text-2xl md:text-4xl font-light"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    :
                </span>

                <div className="flex flex-col items-center">
                    <span className={`time-digit-frost text-3xl md:text-5xl font-mono font-medium ${isRunning ? 'animate-glow' : ''}`}>
                        {time.seconds}
                    </span>
                    <span className="time-label">秒</span>
                </div>
            </div>

            {/* 运行指示器 */}
            {isRunning && (
                <div className="flex items-center gap-2 mb-4">
                    <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: 'var(--frost)' }}
                    />
                    <span className="text-xs font-ui" style={{ color: 'var(--frost)' }}>
                        计时中
                    </span>
                </div>
            )}

            {/* 控制按钮 */}
            <div className="flex gap-3">
                {!hasStarted && (
                    <button onClick={handleStart} className="btn btn-primary">
                        开始
                    </button>
                )}

                {isRunning && (
                    <button onClick={handlePause} className="btn btn-secondary">
                        暂停
                    </button>
                )}

                {!isRunning && hasStarted && (
                    <button onClick={handleResume} className="btn btn-primary">
                        继续
                    </button>
                )}

                {hasStarted && (
                    <button onClick={handleReset} className="btn btn-secondary">
                        重置
                    </button>
                )}
            </div>
        </div>
    );
}
