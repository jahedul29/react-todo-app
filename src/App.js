import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppContent from './components/AppContent';
import AppHeader from './components/AppHeader';
import PageTitle from './components/PageTitle';
import styles from './styles/modules/app.module.scss';
import { TodoProvider } from './context/TodoContext';

function App() {
  const contentRef = React.useRef();

  return (
    <TodoProvider>
      <div className="container">
        <PageTitle>TODO List</PageTitle>
        <div className={styles.app__wrapper}>
          <AppHeader refreshTodos={() => contentRef.current?.fetchTodos()} />
          <AppContent ref={contentRef} />
        </div>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: '1.4rem',
          },
        }}
      />
    </TodoProvider>
  );
}

export default App;
