'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface TimeRemaining {
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

interface TimeInputProps {
    value: number;
    onChange: (value: number) => void;
    max: number;
    label: string;
    disabled?: boolean;
}

function TimeInput({ value, onChange, max, label, disabled = false }: TimeInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (isNaN(newValue)) {
            onChange(0);
        } else {
            onChange(Math.min(Math.max(0, newValue), max));
        }
    };

    const handleIncrement = () => {
        if (disabled) return;
        onChange(value >= max ? 0 : value + 1);
    };

    const handleDecrement = () => {
        if (disabled) return;
        onChange(value <= 0 ? max : value - 1);
    };

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

    const padZero = (num: number): string => String(num).padStart(2, '0');

    return (
        <div className="flex flex-col items-center">
            {/* 上箭头 */}
            <button
                onClick={handleIncrement}
                disabled={disabled}
                className="w-10 h-7 flex items-center justify-center rounded-t-lg transition-all duration-200 disabled:opacity-30"
                style={{
                    color: 'var(--text-tertiary)',
                }}
                onMouseEnter={(e) => !disabled && (e.currentTarget.style.color = 'var(--champagne)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                type="button"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            </button>

            {/* 输入框 */}
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={padZero(value)}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className="w-14 h-12 text-center text-2xl font-mono font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--champagne)',
                    outline: 'none',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--champagne)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 169, 98, 0.15)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            />

            {/* 下箭头 */}
            <button
                onClick={handleDecrement}
                disabled={disabled}
                className="w-10 h-7 flex items-center justify-center rounded-b-lg transition-all duration-200 disabled:opacity-30"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={(e) => !disabled && (e.currentTarget.style.color = 'var(--champagne)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                type="button"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* 标签 */}
            <span className="time-label mt-1">{label}</span>
        </div>
    );
}

/**
 * 倒计时组件
 * Midnight Studio 设计 - 玫瑰色紧迫提示
 */
export default function Countdown() {
    const [inputHours, setInputHours] = useState(0);
    const [inputMinutes, setInputMinutes] = useState(0);
    const [inputSeconds, setInputSeconds] = useState(0);

    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [pausedRemaining, setPausedRemaining] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const [targetMs, setTargetMs] = useState<number | null>(null);

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

    const getTotalMs = useCallback((): number => {
        return (inputHours * 3600 + inputMinutes * 60 + inputSeconds) * 1000;
    }, [inputHours, inputMinutes, inputSeconds]);

    const hasValidDuration = useCallback((): boolean => {
        return getTotalMs() > 0;
    }, [getTotalMs]);

    const handleStart = () => {
        if (!hasValidDuration()) {
            return;
        }

        const endTime = Date.now() + getTotalMs();
        setTargetMs(endTime);
        setIsRunning(true);
        setIsPaused(false);
        setIsFinished(false);
        setPausedRemaining(null);
    };

    const handlePause = () => {
        if (timeRemaining) {
            setPausedRemaining(timeRemaining.total);
            setIsPaused(true);
            setIsRunning(false);
        }
    };

    const handleResume = () => {
        if (pausedRemaining !== null && pausedRemaining > 0) {
            const newEndTime = Date.now() + pausedRemaining;
            setTargetMs(newEndTime);
            setIsRunning(true);
            setIsPaused(false);
            setPausedRemaining(null);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsFinished(false);
        setPausedRemaining(null);
        setTimeRemaining(null);
        setTargetMs(null);
    };

    useEffect(() => {
        if (!isRunning || targetMs === null) return;

        setTimeRemaining(calculateTimeRemaining(targetMs));

        const timer = setInterval(() => {
            const remaining = calculateTimeRemaining(targetMs);
            setTimeRemaining(remaining);

            if (remaining.total <= 0) {
                setIsRunning(false);
                setIsFinished(true);
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [isRunning, targetMs, calculateTimeRemaining]);

    const padZero = (num: number): string => String(num).padStart(2, '0');

    const showSettings = !isRunning && !isPaused && !isFinished;

    // 判断是否紧迫（少于60秒）
    const isUrgent = timeRemaining && timeRemaining.total > 0 && timeRemaining.total < 60000;

    return (
        <div className="glass-card flex flex-col items-center justify-center h-full p-6">
            {/* 标签 */}
            <span className="section-label mb-4">倒计时</span>

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
                    <span
                        className="text-2xl font-light mt-[-24px]"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        :
                    </span>
                    <TimeInput
                        value={inputMinutes}
                        onChange={setInputMinutes}
                        max={59}
                        label="分"
                        disabled={isRunning}
                    />
                    <span
                        className="text-2xl font-light mt-[-24px]"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        :
                    </span>
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
                <div className="flex items-baseline gap-1 md:gap-2 mb-4">
                    <div className="flex flex-col items-center">
                        <span
                            className={`text-3xl md:text-5xl font-mono font-medium ${isRunning && !isUrgent ? 'animate-glow' : ''}`}
                            style={{
                                color: isUrgent ? 'var(--rose)' : 'var(--champagne)',
                                textShadow: isUrgent ? '0 0 30px rgba(201, 169, 166, 0.4)' : undefined
                            }}
                        >
                            {padZero(timeRemaining.hours)}
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
                        <span
                            className={`text-3xl md:text-5xl font-mono font-medium ${isRunning && !isUrgent ? 'animate-glow' : ''}`}
                            style={{
                                color: isUrgent ? 'var(--rose)' : 'var(--champagne)',
                                textShadow: isUrgent ? '0 0 30px rgba(201, 169, 166, 0.4)' : undefined
                            }}
                        >
                            {padZero(timeRemaining.minutes)}
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
                        <span
                            className={`text-3xl md:text-5xl font-mono font-medium ${isUrgent ? 'animate-pulse' : isRunning ? 'animate-glow' : ''}`}
                            style={{
                                color: isUrgent ? 'var(--rose)' : 'var(--champagne)',
                                textShadow: isUrgent ? '0 0 30px rgba(201, 169, 166, 0.4)' : undefined
                            }}
                        >
                            {padZero(timeRemaining.seconds)}
                        </span>
                        <span className="time-label">秒</span>
                    </div>
                </div>
            )}

            {/* 倒计时结束提示 */}
            {isFinished && (
                <div
                    className="text-xl font-ui font-semibold mb-4 animate-pulse"
                    style={{ color: 'var(--rose)' }}
                >
                    ⏰ 时间到！
                </div>
            )}

            {/* 控制按钮 */}
            <div className="flex gap-3">
                {!isRunning && !isPaused && !isFinished && (
                    <button
                        onClick={handleStart}
                        disabled={!hasValidDuration()}
                        className="btn btn-primary"
                    >
                        开始
                    </button>
                )}

                {isRunning && (
                    <button onClick={handlePause} className="btn btn-secondary">
                        暂停
                    </button>
                )}

                {isPaused && (
                    <button onClick={handleResume} className="btn btn-primary">
                        继续
                    </button>
                )}

                {(isRunning || isPaused || isFinished) && (
                    <button onClick={handleReset} className="btn btn-secondary">
                        重置
                    </button>
                )}
            </div>
        </div>
    );
}
