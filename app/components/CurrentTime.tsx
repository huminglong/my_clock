'use client';

import { useState, useEffect } from 'react';

/**
 * 当前时间显示组件
 * 实时显示当前日期和时间，每秒更新一次
 */
export default function CurrentTime() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        // 初始化时间
        setCurrentTime(new Date());

        // 每秒更新时间
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // 清理定时器
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

    // 格式化时间：HH:MM:SS
    const formatTime = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    };

    // 服务端渲染时显示占位符，避免 hydration mismatch
    if (!currentTime) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="text-lg text-gray-500 dark:text-gray-400">
                    加载中...
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                当前时间
            </h2>

            {/* 日期显示 */}
            <div className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-2">
                {formatDate(currentTime)}
            </div>

            {/* 时间显示 */}
            <div className="text-4xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">
                {formatTime(currentTime)}
            </div>
        </div>
    );
}
