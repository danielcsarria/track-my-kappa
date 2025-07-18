import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from "react";
import { ItemsContainer } from './ItemsContainer/Items';
import { Tabs } from './Tabs/Tabs';
import { TabPanel, TabView } from 'primereact/tabview';
import { Hideout } from './Hideout/Hideout';
        
export const Tracker = ({
  tasks,
  hideout,
}) => {
  const [traders, setTraders] = useState([])
  const [selectedTasks, setSelectedTasks] = useState(null);
  const [kappaCompletion, setKappaCompletion] = useState(0)
  const [lightkeerpCompletion, setLightkeeperCompletion] = useState(0);

  const [onlyKappa, setOnlyKappa] = useState(null);
  const [onlyLightKeeper, setOnlyLightkeeper] = useState(null);
  const [hideComplete, setHideComplete] = useState(null);
  const [playerLevel, setPlayerLevel] = useState(null);

  const [itemsDialogVisible, setItemsDialogVisible] = useState(false)
  const [selectedQuestItems, setSelectedQuestItems] = useState([])

  
  

  useEffect(() => {
    const storedTasks = loadSelectedTasks()
    if (storedTasks) setSelectedTasks(storedTasks);
    createTabs();
  }, [tasks])

  useEffect(() => {
    setOnlyKappa(localStorage.getItem('onlyKappa') === 'true');
    setOnlyLightkeeper(localStorage.getItem('onlyLightKeeper') === 'true');
    setHideComplete(localStorage.getItem('hideComplete') === 'true');
    setPlayerLevel(localStorage.getItem('playerLevel'));
  }, [])

  useEffect(() => {
    if (selectedTasks) {
      kappaProgress(selectedTasks);
      lightKeeperProgress(selectedTasks);
    }
  }, [selectedTasks]);

  useEffect(() => {
    localStorage.setItem('onlyKappa', onlyKappa)
    localStorage.setItem('onlyLightKeeper', onlyLightKeeper)
    localStorage.setItem('hideComplete', hideComplete)
    localStorage.setItem('playerLevel', playerLevel)
  }, [onlyKappa, onlyLightKeeper, hideComplete, playerLevel])

  

  function handleSelectTask(value) {
    setSelectedTasks(value);
    localStorage.setItem('selectedTasks', JSON.stringify(value))
  }

  function createTabs() {    
    const excludedTraders = ['Lightkeeper', 'BTR Driver', 'Ref'];
    const traders = [];

    tasks.forEach((task) => {
      const traderName = task.trader.name;
      if (!excludedTraders.includes(traderName) && !traders.includes(traderName)) {
        traders.push(traderName);
      }
    });

    setTraders(traders);
  }

  function loadSelectedTasks() {
    const data = localStorage.getItem('selectedTasks');

    if (!data) return null
    
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }


  function kappaProgress(completedTasks) {
    const totalKappaTasks = tasks.filter((task) => task.kappaRequired)?.length;
    const totalCompletedKappaTasks = completedTasks.filter((task) => task.kappaRequired)?.length;
    const percentageCompleted = (totalCompletedKappaTasks / totalKappaTasks) * 100

    setKappaCompletion(percentageCompleted)
  }

  function lightKeeperProgress(completedTasks) {
    const totalKappaTasks = tasks.filter((task) => task.kappaRequired)?.length;
    const totalCompletedLightKeeperTasks = completedTasks.filter((task) => task.lightkeeperRequired)?.length;
    const percentageCompleted = (totalCompletedLightKeeperTasks / totalKappaTasks) * 100

    setLightkeeperCompletion(percentageCompleted)
  }

  function handleItemsButtonClick(items) {
    setItemsDialogVisible(true)
    setSelectedQuestItems(items)
  }

  const WikiLink = (rowData) => {
    return (
      <a href={rowData.wikiLink} target="_blank">{ rowData.name }</a>
    )
  }

  const KappaColumn = (rowData) => {
    return (
      rowData.kappaRequired ? <span style={{color: '#7483bd'}}>Kappa</span> : null
    )
  }

  const LightKeeperColumn = (rowData) => {
    return (
      rowData.lightkeeperRequired ? <span style={{color: '#b14e46'}}>LightKeeper</span> : null
    )
  }

  const NeededItemsColumn = ({ objectives }) => {
    const itemCounts = new Map();

    objectives
      .filter(obj => obj.type === 'giveItem')
      .forEach(obj => {
        const uniqueItemNames = new Set(obj.items?.map(item => item.name));
        uniqueItemNames.forEach(name => {
          const existing = itemCounts.get(name) || 0;
          itemCounts.set(name, existing + (obj.count || 0));
        });
      });
  

    return (
      <div>
        {
          itemCounts.size > 0 ? (
            <Button
              label="Items"
              severity="info"
              text
              onClick={() => handleItemsButtonClick(itemCounts)}
              size='small'
            />
          ) : null
        }
      </div>
    );
  };

  return (
    <div>
      <TabView
        className='black-background'
      >
        <TabPanel
          key={1}
          header='Tasks'
        >
          <div className="grid mt-5 card">
            <div className="lg:col-8 md:col-12 card">
              <Tabs
                traders={traders}
                onlyKappa={onlyKappa}
                onlyLightKeeper={onlyLightKeeper}
                hideComplete={hideComplete}
                selectedTasks={selectedTasks}
                handleSelectTask={handleSelectTask}
                wikiLink={WikiLink}
                neededItemsColumn={NeededItemsColumn}
                lightKeeperColumn={LightKeeperColumn}
                kappaColumn={KappaColumn}
                tasks={tasks}
                playerLevel={playerLevel}
              />
            </div>
            <div className="lg:col-4 md:col-12">
              <ItemsContainer
                tasks={tasks}
                selectedTasks={selectedTasks}
                kappaCompletion={kappaCompletion}
                lightKeeperCompletion={lightkeerpCompletion}
                onlyKappa={onlyKappa}
                onlyLightKeeper={onlyLightKeeper}
                hideComplete={hideComplete}
                setOnlyKappa={setOnlyKappa}
                setOnlyLightkeeper={setOnlyLightkeeper}
                setHideComplete={setHideComplete}
                playerLevel={playerLevel}
                setPlayerLevel={setPlayerLevel}
              />
            </div>
          </div>
          <Dialog header="Required FIR Items"
            visible={itemsDialogVisible}
            style={{ width: '50vw' }}
            onHide={() => { if (!itemsDialogVisible) return; setItemsDialogVisible(false); }}
            closeOnEscape='true'
            dismissableMask
          >
              <div className="m-0">
                {[...selectedQuestItems.entries()].map(([name, count]) => (
                    <div key={name}>
                      {count}x {name} 
                    </div>
                  ))}
              </div>
          </Dialog>
        </TabPanel>
        <TabPanel
          key={2}
          header='Hideout'
        >
          <Hideout
            hideout={hideout}
          /> 
        </TabPanel>
      </TabView>
      
    </div>
  )
}