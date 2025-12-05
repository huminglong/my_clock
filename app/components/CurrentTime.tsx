'use client';

import { useState, useEffect } from 'react';

/**
 * 当前时间显示组件
 * Midnight Studio 设计 - 优雅的时间展示
 */
export default function CurrentTime() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 格式化日期：YYYY年MM月DD日 星期X
    const formatDate = (date: Date): string => {
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekDay = weekDays[date.getDay()];

        return `${year}年${month}月${day}日 星期${weekDay}`;
    };

    // 格式化时间组件
    const getTimeComponents = (date: Date) => ({
        hours: String(date.getHours()).padStart(2, '0'),
        minutes: String(date.getMinutes()).padStart(2, '0'),
        seconds: String(date.getSeconds()).padStart(2, '0'),
    });

    if (!currentTime) {
        return (
            <div className="glass-card flex flex-col items-center justify-center h-full p-6">
                <div className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                    加载中...
                </div>
            </div>
        );
    }

    const time = getTimeComponents(currentTime);

    return (
        <div className="glass-card flex flex-col items-center justify-center h-full p-6">
            {/* 标签 */}
            <span className="section-label mb-6">当前时间</span>

            {/* 日期显示 */}
            <div
                className="font-ui text-base md:text-lg mb-4"
                style={{ color: 'var(--text-secondary)' }}
            >
                {formatDate(currentTime)}
            </div>

            {/* 时间显示 */}
            <div className="flex items-baseline gap-1 md:gap-2">
                <span className="time-digit text-5xl md:text-7xl">{time.hours}</span>
                <span
                    className="text-4xl md:text-6xl font-light animate-gentle-pulse"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    :
                </span>
                <span className="time-digit text-5xl md:text-7xl">{time.minutes}</span>
                <span
                    className="text-4xl md:text-6xl font-light animate-gentle-pulse"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    :
                </span>
                <span className="time-digit text-5xl md:text-7xl animate-glow">{time.seconds}</span>
            </div>

            {/* 时间单位标签 */}
            <div className="flex gap-12 md:gap-16 mt-3">
                <span className="time-label">时</span>
                <span className="time-label">分</span>
                <span className="time-label">秒</span>
            </div>
        </div>
    );
}
