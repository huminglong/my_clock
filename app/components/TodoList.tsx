'use client';

import { useState, useEffect, useCallback } from 'react';

// TODO 数据结构
interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

/**
 * TODO 列表组件
 * 支持增删改查，通过 API 路由实现数据持久化
 */
export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 获取 TODO 列表
    const fetchTodos = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/todos');

            if (!response.ok) {
                throw new Error('获取 TODO 列表失败');
            }

            const data = await response.json();
            setTodos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : '未知错误');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 初始化加载
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // 添加新 TODO
    const handleAddTodo = async () => {
        const trimmedTitle = newTitle.trim();

        if (!trimmedTitle) {
            return;
        }

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: trimmedTitle }),
            });

            if (!response.ok) {
                throw new Error('添加 TODO 失败');
            }

            const newTodo = await response.json();
            setTodos((prev) => [...prev, newTodo]);
            setNewTitle('');
        } catch (err) {
            setError(err instanceof Error ? err.message : '添加失败');
        }
    };

    // 切换 TODO 完成状态
    const handleToggleComplete = async (id: string, currentCompleted: boolean) => {
        try {
            const response = await fetch('/api/todos', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, completed: !currentCompleted }),
            });

            if (!response.ok) {
                throw new Error('更新 TODO 失败');
            }

            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === id ? { ...todo, completed: !currentCompleted } : todo
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : '更新失败');
        }
    };

    // 删除 TODO
    const handleDeleteTodo = async (id: string) => {
        try {
            const response = await fetch(`/api/todos?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('删除 TODO 失败');
            }

            setTodos((prev) => prev.filter((todo) => todo.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : '删除失败');
        }
    };

    // 处理键盘事件（Enter 键添加）
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    // 统计信息
    const completedCount = todos.filter((t) => t.completed).length;
    const totalCount = todos.length;

    return (
        <div className="flex flex-col h-full p-4 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">
                待办事项
            </h2>

            {/* 统计信息 */}
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
                已完成 {completedCount} / {totalCount}
            </div>

            {/* 添加新 TODO */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="添加新任务..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                     focus:outline-none focus:ring-2 focus:ring-amber-500
                     placeholder:text-gray-400"
                />
                <button
                    onClick={handleAddTodo}
                    disabled={!newTitle.trim()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg 
                     transition-colors duration-200 font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    添加
                </button>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="text-red-500 text-sm mb-2 text-center">
                    {error}
                </div>
            )}

            {/* TODO 列表 */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        加载中...
                    </div>
                ) : todos.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                        暂无待办事项
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200
                           ${todo.completed
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : 'bg-white dark:bg-gray-700'
                                    }`}
                            >
                                {/* 完成状态复选框 */}
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggleComplete(todo.id, todo.completed)}
                                    className="w-5 h-5 rounded border-gray-300 text-amber-500 
                             focus:ring-amber-500 cursor-pointer"
                                />

                                {/* 任务标题 */}
                                <span
                                    className={`flex-1 ${todo.completed
                                            ? 'line-through text-gray-400 dark:text-gray-500'
                                            : 'text-gray-800 dark:text-gray-200'
                                        }`}
                                >
                                    {todo.title}
                                </span>

                                {/* 删除按钮 */}
                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 
                             dark:hover:bg-red-900/30 rounded transition-colors duration-200"
                                    title="删除"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
