import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// TODO 数据结构定义
interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

// 获取 storage 文件路径
function getStoragePath(): string {
    return path.join(process.cwd(), 'storage', 'todos.json');
}

// 读取 TODO 数据
async function readTodos(): Promise<Todo[]> {
    try {
        const filePath = getStoragePath();
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // 文件不存在或解析失败时返回空数组
        console.error('读取 TODO 数据失败:', error);
        return [];
    }
}

// 写入 TODO 数据
async function writeTodos(todos: Todo[]): Promise<void> {
    const filePath = getStoragePath();
    await fs.writeFile(filePath, JSON.stringify(todos, null, 2), 'utf-8');
}

// GET: 获取所有 TODO
export async function GET(): Promise<NextResponse> {
    try {
        const todos = await readTodos();
        return NextResponse.json(todos);
    } catch (error) {
        console.error('GET 请求失败:', error);
        return NextResponse.json({ error: '获取 TODO 列表失败' }, { status: 500 });
    }
}

// POST: 添加新 TODO
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { title } = body;

        // 参数验证
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
        }

        const todos = await readTodos();

        // 生成唯一 ID
        const newTodo: Todo = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            title: title.trim(),
            completed: false,
        };

        todos.push(newTodo);
        await writeTodos(todos);

        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        console.error('POST 请求失败:', error);
        return NextResponse.json({ error: '添加 TODO 失败' }, { status: 500 });
    }
}

// PUT: 更新 TODO 状态（切换 completed）
export async function PUT(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { id, completed } = body;

        // 参数验证
        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'ID 不能为空' }, { status: 400 });
        }

        if (typeof completed !== 'boolean') {
            return NextResponse.json({ error: 'completed 必须是布尔值' }, { status: 400 });
        }

        const todos = await readTodos();
        const todoIndex = todos.findIndex((todo) => todo.id === id);

        if (todoIndex === -1) {
            return NextResponse.json({ error: '未找到指定 TODO' }, { status: 404 });
        }

        todos[todoIndex].completed = completed;
        await writeTodos(todos);

        return NextResponse.json(todos[todoIndex]);
    } catch (error) {
        console.error('PUT 请求失败:', error);
        return NextResponse.json({ error: '更新 TODO 失败' }, { status: 500 });
    }
}

// DELETE: 删除指定 TODO
export async function DELETE(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // 参数验证
        if (!id) {
            return NextResponse.json({ error: 'ID 不能为空' }, { status: 400 });
        }

        const todos = await readTodos();
        const todoIndex = todos.findIndex((todo) => todo.id === id);

        if (todoIndex === -1) {
            return NextResponse.json({ error: '未找到指定 TODO' }, { status: 404 });
        }

        const deletedTodo = todos.splice(todoIndex, 1)[0];
        await writeTodos(todos);

        return NextResponse.json(deletedTodo);
    } catch (error) {
        console.error('DELETE 请求失败:', error);
        return NextResponse.json({ error: '删除 TODO 失败' }, { status: 500 });
    }
}
