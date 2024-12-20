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
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (type === 'update' && todo) {
      setTitle(todo.title);
      setProgress(todo.progress || 0);
      setDescription(todo.description || '');
    } else {
      setTitle('');
      setProgress(0);
      setDescription('');
    }
  }, [type, todo, modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === '') {
      toast.error('Please enter a title');
      return;
    }

    if (title) {
      try {
        setIsSubmitting(true);
        if (type === 'add') {
          await createTodo({
            _id: uuid(),
            name: title,
            progress,
            description,
          });
          toast.success('Task added successfully');
          refreshTodos();
        }

        if (type === 'update') {
          if (
            todo.title !== title ||
            todo.progress !== progress ||
            todo.description !== description
          ) {
            await updateTodo({
              id: todo.id,
              name: title,
              progress,
              description,
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
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                />
              </label>
              <label htmlFor="progress">
                Progress
                <input
                  type="number"
                  id="progress"
                  value={progress}
                  onChange={(e) =>
                    Number(e.target.value) <= 100 &&
                    setProgress(Number(e.target.value))
                  }
                  disabled={isSubmitting}
                  min="0"
                  max="100"
                />
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
