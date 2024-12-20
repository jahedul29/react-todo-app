import { AnimatePresence, motion } from 'framer-motion';
import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/modules/app.module.scss';
import TodoItem from './TodoItem';
import { getTodos } from '../api/todos';
import { useTodoContext } from '../context/TodoContext';

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const AppContent = forwardRef((props, ref) => {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const filterStatus = useSelector((state) => state.todo.filterStatus);
  const { refreshTrigger } = useTodoContext();

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTodos();
      setTodoList(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      fetchTodos,
    }),
    [fetchTodos]
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos, refreshTrigger]);

  if (isLoading) {
    return (
      <motion.p variants={child} className={styles.emptyText}>
        Loading todos...
      </motion.p>
    );
  }

  if (error) {
    return (
      <motion.p variants={child} className={styles.emptyText}>
        Error: {error}
      </motion.p>
    );
  }

  const transformedTodoList = todoList.map((todo) => ({
    id: todo._id,
    title: todo.name,
    status: todo.progress === 100 ? 'complete' : 'incomplete',
    time: new Date().toISOString(),
    description: todo.description,
    progress: todo.progress,
  }));

  const sortedTodoList = [...transformedTodoList];
  sortedTodoList.sort((a, b) => new Date(b.time) - new Date(a.time));

  const filteredTodoList = sortedTodoList.filter((item) => {
    if (filterStatus === 'all') {
      return true;
    }
    return item.status === filterStatus;
  });

  return (
    <motion.div
      className={styles.content__wrapper}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {filteredTodoList && filteredTodoList.length > 0 ? (
          filteredTodoList.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))
        ) : (
          <motion.p variants={child} className={styles.emptyText}>
            No Todos
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default AppContent;
