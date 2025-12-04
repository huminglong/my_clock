'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// 倒计时剩余时间结构
interface TimeRemaining {
    hours: number;
    minutes: number;
    seconds: number;
    total: number; // 总毫秒数
}

/**
 * 时间输入组件
 * 支持上下箭头调节和手动输入
 */
interface TimeInputProps {
    value: number;
    onChange: (value: number) => void;
    max: number;
    label: string;
    disabled?: boolean;
}

function TimeInput({ value, onChange, max, label, disabled = false }: TimeInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (isNaN(newValue)) {
            onChange(0);
        } else {
            // 确保值在有效范围内
            onChange(Math.min(Math.max(0, newValue), max));
        }
    };

    // 增加值
    const handleIncrement = () => {
        if (disabled) return;
        onChange(value >= max ? 0 : value + 1);
    };

    // 减少值
    const handleDecrement = () => {
        if (disabled) return;
        onChange(value <= 0 ? max : value - 1);
    };

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            handleIncrement();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleDecrement();
        }
    };

    // 格式化显示值
    const padZero = (num: number): string => String(num).padStart(2, '0');

    return (
        <div className="flex flex-col items-center">
            {/* 上箭头按钮 */}
            <button
                onClick={handleIncrement}
                disabled={disabled}
                className="w-12 h-8 flex items-center justify-center text-gray-500 hover:text-teal-600 
                           hover:bg-teal-50 dark:hover:bg-gray-700 rounded-t-lg transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            </button>

            {/* 数字输入框 */}
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={padZero(value)}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className="w-14 h-12 text-center text-2xl md:text-3xl font-bold font-mono
                           text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-700
                           border-2 border-gray-200 dark:border-gray-600 rounded-lg
                           focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* 下箭头按钮 */}
            <button
                onClick={handleDecrement}
                disabled={disabled}
                className="w-12 h-8 flex items-center justify-center text-gray-500 hover:text-teal-600 
                           hover:bg-teal-50 dark:hover:bg-gray-700 rounded-b-lg transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* 标签 */}
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</span>
        </div>
    );
}

/**
 * 倒计时组件
 * 支持设置时分秒，显示剩余时间，支持开始、暂停、重置
 */
export default function Countdown() {
    // 设置的时长（时分秒）
    const [inputHours, setInputHours] = useState(0);
    const [inputMinutes, setInputMinutes] = useState(0);
    const [inputSeconds, setInputSeconds] = useState(0);

    // 运行状态
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [pausedRemaining, setPausedRemaining] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    // 目标时间戳
    const [targetMs, setTargetMs] = useState<number | null>(null);

    // 计算剩余时间
    const calculateTimeRemaining = useCallback((endTime: number): TimeRemaining => {
        const now = Date.now();
        const total = endTime - now;

        if (total <= 0) {
            return { hours: 0, minutes: 0, seconds: 0, total: 0 };
        }

        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor(total / 1000 / 60 / 60);

        return { hours, minutes, seconds, total };
    }, []);

    // 获取总毫秒数
    const getTotalMs = useCallback((): number => {
        return (inputHours * 3600 + inputMinutes * 60 + inputSeconds) * 1000;
    }, [inputHours, inputMinutes, inputSeconds]);

    // 检查是否设置了有效时长
    const hasValidDuration = useCallback((): boolean => {
        return getTotalMs() > 0;
    }, [getTotalMs]);

    // 处理开始倒计时
    const handleStart = () => {
        if (!hasValidDuration()) {
            alert('请先设置倒计时时长');
            return;
        }

        const endTime = Date.now() + getTotalMs();
        setTargetMs(endTime);
        setIsRunning(true);
        setIsPaused(false);
        setIsFinished(false);
        setPausedRemaining(null);
    };

    // 处理暂停
    const handlePause = () => {
        if (timeRemaining) {
            setPausedRemaining(timeRemaining.total);
            setIsPaused(true);
            setIsRunning(false);
        }
    };

    // 处理继续
    const handleResume = () => {
        if (pausedRemaining !== null && pausedRemaining > 0) {
            const newEndTime = Date.now() + pausedRemaining;
            setTargetMs(newEndTime);
            setIsRunning(true);
            setIsPaused(false);
            setPausedRemaining(null);
        }
    };

    // 处理重置
    const handleReset = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsFinished(false);
        setPausedRemaining(null);
        setTimeRemaining(null);
        setTargetMs(null);
    };

    // 倒计时逻辑
    useEffect(() => {
        if (!isRunning || targetMs === null) return;

        // 立即计算一次
        setTimeRemaining(calculateTimeRemaining(targetMs));

        // 每秒更新
        const timer = setInterval(() => {
            const remaining = calculateTimeRemaining(targetMs);
            setTimeRemaining(remaining);

            // 倒计时结束
            if (remaining.total <= 0) {
                setIsRunning(false);
                setIsFinished(true);
                clearInterval(timer);
            }
        }, 100); // 使用 100ms 间隔以获得更精确的计时

        return () => clearInterval(timer);
    }, [isRunning, targetMs, calculateTimeRemaining]);

    // 格式化数字为两位
    const padZero = (num: number): string => String(num).padStart(2, '0');

    // 判断是否显示设置面板
    const showSettings = !isRunning && !isPaused && !isFinished;

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                倒计时
            </h2>

            {/* 时长设置输入 */}
            {showSettings && (
                <div className="flex items-center gap-2 mb-4">
                    <TimeInput
                        value={inputHours}
                        onChange={setInputHours}
                        max={99}
                        label="时"
                        disabled={isRunning}
                    />
                    <span className="text-2xl font-bold text-gray-400 mt-[-20px]">:</span>
                    <TimeInput
                        value={inputMinutes}
                        onChange={setInputMinutes}
                        max={59}
                        label="分"
                        disabled={isRunning}
                    />
                    <span className="text-2xl font-bold text-gray-400 mt-[-20px]">:</span>
                    <TimeInput
                        value={inputSeconds}
                        onChange={setInputSeconds}
                        max={59}
                        label="秒"
                        disabled={isRunning}
                    />
                </div>
            )}

            {/* 倒计时显示 */}
            {timeRemaining && (isRunning || isPaused) && (
                <div className="flex gap-2 md:gap-4 mb-4">
                    {/* 时 */}
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-bold text-teal-600 dark:text-teal-400 font-mono">
                            {padZero(timeRemaining.hours)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">时</span>
                    </div>

                    <span className="text-3xl md:text-5xl font-bold text-gray-400">:</span>

                    {/* 分 */}
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-bold text-teal-600 dark:text-teal-400 font-mono">
                            {padZero(timeRemaining.minutes)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">分</span>
                    </div>

                    <span className="text-3xl md:text-5xl font-bold text-gray-400">:</span>

                    {/* 秒 */}
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-bold text-teal-600 dark:text-teal-400 font-mono">
                            {padZero(timeRemaining.seconds)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">秒</span>
                    </div>
                </div>
            )}

            {/* 倒计时结束提示 */}
            {isFinished && (
                <div className="text-xl font-bold text-red-500 dark:text-red-400 mb-4 animate-pulse">
                    ⏰ 时间到！
                </div>
            )}

            {/* 控制按钮 */}
            <div className="flex gap-2">
                {!isRunning && !isPaused && !isFinished && (
                    <button
                        onClick={handleStart}
                        disabled={!hasValidDuration()}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg 
                                   transition-colors duration-200 font-medium
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        开始
                    </button>
                )}

                {isRunning && (
                    <button
                        onClick={handlePause}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg 
                                   transition-colors duration-200 font-medium"
                    >
                        暂停
                    </button>
                )}

                {isPaused && (
                    <button
                        onClick={handleResume}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                                   transition-colors duration-200 font-medium"
                    >
                        继续
                    </button>
                )}

                {(isRunning || isPaused || isFinished) && (
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
