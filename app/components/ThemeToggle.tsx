'use client';

import { useState, useEffect } from 'react';

/**
 * 主题切换按钮组件
 * 固定在右下角，支持切换明暗主题
 */
export default function ThemeToggle() {
    // 主题状态：'light' | 'dark'
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    // 初始化：从 localStorage 或系统偏好读取主题
    useEffect(() => {
        setMounted(true);

        // 优先从 localStorage 读取
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            // 检测系统偏好
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const systemTheme = prefersDark ? 'dark' : 'light';
            setTheme(systemTheme);
            applyTheme(systemTheme);
        }
    }, []);

    // 应用主题到 HTML 元素
    const applyTheme = (newTheme: 'light' | 'dark') => {
        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    // 切换主题
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // 防止服务端渲染不匹配
    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-4 right-4 z-50 p-3 rounded-full 
                       bg-white dark:bg-gray-800 
                       shadow-lg hover:shadow-xl
                       border border-gray-200 dark:border-gray-700
                       transition-all duration-300 ease-in-out
                       hover:scale-110 active:scale-95"
            title={theme === 'light' ? '切换到夜间模式' : '切换到日间模式'}
            aria-label="切换主题"
        >
            {theme === 'light' ? (
                // 月亮图标 - 当前是日间模式，点击切换到夜间
                <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            ) : (
                // 太阳图标 - 当前是夜间模式，点击切换到日间
                <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            )}
        </button>
    );
}
