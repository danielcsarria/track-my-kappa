/* eslint-disable no-unused-vars */
import { useLazyQuery } from '@apollo/client';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import logo from '../../assets/trackmykappa_white.webp';
import { Loader } from '../Loader/Loader';
import { Tracker } from '../Tracker/Tracker';
import { GET_TASKS } from './../../api/quaries/get-tasks';
import { About } from './About/About';
import { TermsOfUse } from './TermsOfUse/TermsOfUse';
        

export const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loadTasks, { called, loading, data }] = useLazyQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  const [termsOfUseVisible, setTermsOfUseVisible] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      loadTasks();
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

  return (
    <div className='relative container'>
      <div className='navbar'>
        <div className="img-container">
          <img src={logo} alt="Track My Kappa" />
        </div>
        <div className="reload-button ml-2">
          <Button
            icon="pi pi-refresh"
            rounded
            text
            raised
            aria-label="Reload"
            onClick={handleReload}
            tooltip="Reload Task Data"
            tooltipOptions={{ position: 'bottom' }}
          />
        </div>
      </div>
      <div className="container">
        {!loading ? (
          <div className="col-12">
            <Tracker tasks={tasks} />
          </div>
        ) : <Loader /> }
      </div>
      <div className="footer">
        <div className='flex align-items-center justify-content-between w-full'>
          <div>
            <Button
              label="Terms of Use"
              severity="success"
              text
              className='ml-2'
              onClick={() => setTermsOfUseVisible(true)}
            />
            <Button
              label="About"
              severity="info"
              text
              className='ml-2'
              onClick={() => setAboutVisible(true)}
            />
          </div>

          <div className='center'>
            &copy;{new Date().getFullYear()} Track My Kappa. <br />
            Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved
          </div>
          
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
        </div>
        
      </div>
      <TermsOfUse
        termsOfUseVisible={termsOfUseVisible}
        setTermsOfUseVisible={setTermsOfUseVisible}
      />
      <About
        aboutVisible={aboutVisible}
        setAboutVisible={setAboutVisible}
      />
    </div>
  );
};
