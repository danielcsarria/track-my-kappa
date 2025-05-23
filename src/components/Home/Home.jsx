import { useLazyQuery } from '@apollo/client';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { useEffect, useState } from 'react';
import { Loader } from '../Loader/Loader';
import { Tracker } from '../Tracker/Tracker';
import { GET_TASKS } from './../../api/quaries/get-tasks';
        

export const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loadTasks, { called, loading, data }] = useLazyQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
      localStorage.setItem('tasks', JSON.stringify(data.tasks));
    }
  }, [data]);


  function handleReload() {
    localStorage.removeItem('tasks');
    loadTasks();
  }

  function handleWipe() {
    localStorage.clear();
    loadTasks();
  }

  const start = <span>Kappa Tracker</span>
  const end = <Button
    icon="pi pi-refresh"
    rounded
    text
    raised
    aria-label="Reload"
    onClick={handleReload}
    tooltip="Reload Task Data"
    tooltipOptions={{ position: 'left' }}
  />

  return (
    <div className='relative' style={{height: '100vh'}}>
      <div className='wipe-button'>
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          text
          raised
          aria-label="Reload"
          onClick={handleWipe}
          tooltip="Wipe!"
          tooltipOptions={{ position: 'left' }}
        />
      </div>
      <Menubar start={start} end={end} />
      <div
         className="container"
      >
        {!loading ? (
          <div className="col-12">
            <Tracker tasks={tasks} />
          </div>
        ) : <Loader /> }
      </div>
    </div>
  );
};
