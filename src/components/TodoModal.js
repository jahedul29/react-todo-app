import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import styles from '../styles/modules/modal.module.scss';
import Button from './Button';
import { createTodo, updateTodo } from '../api/todos';
import { useTodoContext } from '../context/TodoContext';

const dropIn = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  visible: {
    transform: 'scale(1)',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
};

function TodoModal({ type, modalOpen, setModalOpen, todo }) {
  const { refreshTodos } = useTodoContext();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incomplete');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (type === 'update' && todo) {
      setTitle(todo.title);
      setStatus(todo.status);
    } else {
      setTitle('');
      setStatus('incomplete');
    }
  }, [type, todo, modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === '') {
      toast.error('Please enter a title');
      return;
    }

    if (title && status) {
      try {
        setIsSubmitting(true);
        if (type === 'add') {
          await createTodo({
            _id: uuid(),
            name: title,
            progress: status === 'complete' ? 100 : 0,
            description: 'test description',
          });
          toast.success('Task added successfully');
          refreshTodos();
        }

        if (type === 'update') {
          if (todo.title !== title || todo.status !== status) {
            await updateTodo({
              _id: todo.id,
              name: title,
              progress: status === 'complete' ? 100 : 0,
              description: todo.description || 'test description',
            });
            toast.success('Task Updated successfully');
            refreshTodos();
          } else {
            toast.error('No changes made');
            return;
          }
        }

        setModalOpen(false);
      } catch (error) {
        toast.error(error.message || 'Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Loading...';
    return type === 'add' ? 'Add Task' : 'Update Task';
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>

            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {type === 'add' ? 'Add' : 'Update'} TODO
              </h1>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </label>
              <label htmlFor="type">
                Status
                <select
                  id="type"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Completed</option>
                </select>
              </label>
              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {getSubmitButtonText()}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;
