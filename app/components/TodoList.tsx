'use client';

import { useState, useEffect, useCallback } from 'react';

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

/**
 * TODO 列表组件
 * Midnight Studio 设计 - 优雅的任务列表
 */
export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    const completedCount = todos.filter((t) => t.completed).length;
    const totalCount = todos.length;

    return (
        <div className="glass-card flex flex-col h-full p-6">
            {/* 标题区域 */}
            <div className="text-center mb-4">
                <span className="section-label">待办事项</span>

                {/* 统计信息 */}
                <div
                    className="text-sm font-ui mt-2"
                    style={{ color: 'var(--text-tertiary)' }}
                >
                    <span style={{ color: 'var(--success)' }}>{completedCount}</span>
                    <span> / {totalCount} 已完成</span>
                </div>
            </div>

            {/* 添加新 TODO */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="添加新任务..."
                    className="input flex-1"
                />
                <button
                    onClick={handleAddTodo}
                    disabled={!newTitle.trim()}
                    className="btn btn-primary"
                >
                    添加
                </button>
            </div>

            {/* 错误提示 */}
            {error && (
                <div
                    className="text-sm mb-2 text-center font-ui"
                    style={{ color: 'var(--danger)' }}
                >
                    {error}
                </div>
            )}

            {/* TODO 列表 */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div
                        className="text-center py-8 font-ui"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        加载中...
                    </div>
                ) : todos.length === 0 ? (
                    <div
                        className="text-center py-8 font-ui"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        暂无待办事项
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {todos.map((todo, index) => (
                            <li
                                key={todo.id}
                                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                                style={{
                                    background: todo.completed
                                        ? 'rgba(125, 171, 140, 0.1)'
                                        : 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    animationDelay: `${index * 50}ms`,
                                }}
                            >
                                {/* 自定义复选框 */}
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggleComplete(todo.id, todo.completed)}
                                    className="custom-checkbox"
                                />

                                {/* 任务标题 */}
                                <span
                                    className="flex-1 font-ui transition-all duration-200"
                                    style={{
                                        color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                    }}
                                >
                                    {todo.title}
                                </span>

                                {/* 删除按钮 */}
                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className="p-1.5 rounded-lg transition-all duration-200 opacity-50 hover:opacity-100"
                                    style={{ color: 'var(--danger)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(196, 122, 122, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                    title="删除"
                                >
                                    <svg
                                        className="w-4 h-4"
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
