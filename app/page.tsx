import CurrentTime from './components/CurrentTime';
import Countdown from './components/Countdown';
import Stopwatch from './components/Stopwatch';
import TodoList from './components/TodoList';
import ThemeToggle from './components/ThemeToggle';

/**
 * 主页面组件
 * Midnight Studio 设计主题
 * 三列响应式布局：当前时间 | 倒计时+秒表 | TODO 列表
 */
export default function Home() {
  return (
    <div className="relative h-screen w-screen p-4 md:p-6 overflow-hidden">
      {/* 动态背景氛围 */}
      <div className="bg-atmosphere" />

      {/* 三列响应式布局容器 */}
      <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* 左侧：当前时间显示 */}
        <div className="min-h-[200px] lg:min-h-0 animate-fade-in animate-delay-1">
          <CurrentTime />
        </div>

        {/* 中间：倒计时 + 秒表 */}
        <div className="flex flex-col gap-4 md:gap-6 min-h-[400px] lg:min-h-0">
          <div className="flex-1 animate-fade-in animate-delay-2">
            <Countdown />
          </div>
          <div className="flex-1 animate-fade-in animate-delay-3">
            <Stopwatch />
          </div>
        </div>

        {/* 右侧：TODO 列表 */}
        <div className="min-h-[300px] lg:min-h-0 lg:h-full animate-fade-in animate-delay-4">
          <TodoList />
        </div>
      </div>

      {/* 主题切换按钮 */}
      <ThemeToggle />
    </div>
  );
}
