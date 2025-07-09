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
import { ImportExport } from './ImportExport/ImportExport';
        

export const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [hideout, setHideout] = useState([])
  const [loadTasks, { called, loading, data }] = useLazyQuery(GET_TASKS, {
    fetchPolicy: 'network-only',
  });

  const [termsOfUseVisible, setTermsOfUseVisible] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [importExportVisible, setImportExportVisible] = useState(false)
  const [importExport, setImportExport] = useState('')
  const [importExportData, setImportExportData] = useState('')

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedHideout = localStorage.getItem('hideout');
    if (storedTasks && storedHideout) {
      setTasks(JSON.parse(storedTasks));
      setHideout(JSON.parse(storedHideout));
    } else {
      loadTasks();
    }
  }, []);

  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
      localStorage.setItem('tasks', JSON.stringify(data.tasks));
    }
    if (data?.hideoutStations) {
      setHideout(data.hideoutStations)
      localStorage.setItem('hideout', JSON.stringify(data.hideoutStations))
    }
  }, [data]);


  function handleReload() {
    localStorage.removeItem('tasks');
    localStorage.removeItem('hideout');
    loadTasks();
  }

  function handleWipe() {
    localStorage.clear();
    loadTasks();
  }

  function getFinishedItems() {
    const finishedTasks = localStorage.getItem('selectedTasks');
    const finishedHideout = localStorage.getItem('completedHideoutStation');

    if (finishedTasks || finishedHideout) {
      setImportExportData(JSON.stringify({
        tasks: finishedTasks,
        hideout: finishedHideout
      }));
    }
  }

  function saveImportData(importData) {
    const { tasks, hideout } = JSON.parse(importData);
    localStorage.setItem('selectedTasks', tasks);
    localStorage.setItem('completedHideoutStation', hideout);
    setImportExportVisible(false)
    loadTasks()
  }

  return (
    <div className='relative container'>
      <div className='navbar flex justify-content-between mb-5'>
        <div></div>
        <div className="img-container">
          <img src={logo} alt="Track My Kappa" />
        </div>
        <div className="flex reload-button">
          <div className="flex gap-2">
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
            <Button
              icon="pi pi-file-import"
              rounded
              text
              raised
              aria-label="Import Data"
              severity='success'
              onClick={() => {
                setImportExportVisible(true);
                setImportExport('import');
              }}
              tooltip="Import Data"
              tooltipOptions={{ position: 'bottom' }}
            />
            <Button
              icon="pi pi-file-export"
              rounded
              text
              raised
              severity='danger'
              aria-label="Export Data"
              onClick={() => {
                getFinishedItems();
                setImportExportVisible(true)
                setImportExport('export');
              }}
              tooltip="Export Data"
              tooltipOptions={{ position: 'bottom' }}
            />  
          </div>
        </div>
      </div>
      <div className="container">
        {!loading ? (
          <div className="col-12">
            <Tracker
              tasks={tasks}
              hideout={hideout}
            />
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
            Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved <br />
            Created with the <a href="https://tarkov.dev/" target='_blank'>Tarko Dev API</a>
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
      <ImportExport
        importExportVisible={importExportVisible}
        setImportExportVisible={setImportExportVisible}
        importExport={importExport}
        importExportData={importExportData}
        saveImportData={saveImportData}
      />
    </div>
  );
};
