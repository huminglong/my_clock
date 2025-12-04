import CurrentTime from './components/CurrentTime';
import Countdown from './components/Countdown';
import TodoList from './components/TodoList';
import ThemeToggle from './components/ThemeToggle';

/**
 * 主页面组件
 * 三列响应式布局：当前时间 | 倒计时 | TODO 列表
 * 大屏幕三列并排，小屏幕竖向堆叠
 */
export default function Home() {
  return (
    <div className="h-screen w-screen p-4 bg-gray-100 dark:bg-gray-950">
      {/* 三列响应式布局容器 */}
      <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 左侧：当前时间显示 */}
        <div className="min-h-[200px] lg:min-h-0">
          <CurrentTime />
        </div>

        {/* 中间：倒计时功能 */}
        <div className="min-h-[250px] lg:min-h-0">
          <Countdown />
        </div>

        {/* 右侧：TODO 列表 */}
        <div className="min-h-[300px] lg:min-h-0 lg:h-full">
          <TodoList />
        </div>
      </div>

      {/* 主题切换按钮 */}
      <ThemeToggle />
    </div>
  );
}
