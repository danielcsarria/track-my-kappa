import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { TabPanel, TabView } from 'primereact/tabview';
import { useEffect, useState } from "react";
import { Items } from "../Items/Items";
import { ProgressBar } from 'primereact/progressbar';
import { InputSwitch } from 'primereact/inputswitch';
import { Collector } from '../Collector/Collector';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
        
export const Tracker = ({
  tasks
}) => {
  const [traders, setTraders] = useState([])
  const [selectedTasks, setSelectedTasks] = useState(null);
  const [kappaCompletion, setKappaCompletion] = useState(0)

  const [onlyKappa, setOnlyKappa] = useState(null)
  const [onlyLightKeeper, setOnlyLightkeeper] = useState(null)
  const [hideComplete, setHideComplete] = useState(null)

  const [itemsDialogVisible, setItemsDialogVisible] = useState(false)
  const [selectedQuestItems, setSelectedQuestItems] = useState([])

  useEffect(() => {
    const stored = loadSelectedTasks()
    if (stored) setSelectedTasks(stored);

    createTabs();
  }, [tasks])

  useEffect(() => {
    setOnlyKappa(localStorage.getItem('onlyKappa') === 'true');
    setOnlyLightkeeper(localStorage.getItem('onlyLightKeeper') === 'true');
    setHideComplete(localStorage.getItem('hideComplete') === 'true');
  }, [])

  useEffect(() => {
    if (selectedTasks) {
      kappaProgress(selectedTasks);
    }
  }, [selectedTasks]);

  useEffect(() => {
    localStorage.setItem('onlyKappa', onlyKappa)
    localStorage.setItem('onlyLightKeeper', onlyLightKeeper)
    localStorage.setItem('hideComplete', hideComplete)
  }, [onlyKappa, onlyLightKeeper, hideComplete])

  function handleSelectTask(value) {
    localStorage.setItem('selectedTasks', JSON.stringify(value));
    setSelectedTasks(value);
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

  function handleItemsButtonClick(items) {
    console.log('items', items)
    setItemsDialogVisible(true)
    setSelectedQuestItems(items)
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

  function kappaProgress(completedTasks) {
    const totalKappaTasks = tasks.filter((task) => task.kappaRequired)?.length;
    const totalCompletedKappaTasks = completedTasks.filter((task) => task.kappaRequired)?.length;
    const percentageCompleted = (totalCompletedKappaTasks / totalKappaTasks) * 100

    setKappaCompletion(percentageCompleted)
  }


  return (
    <div>
      <div className="grid mt-5 card">
        <div className="lg:col-8 md:col-12 card">
          <TabView scrollable>
            {
              traders.map((trader, index) => {

                let traderTasks = tasks.filter((task) => task.trader.name === trader);

                if (onlyKappa) {
                  traderTasks = traderTasks.filter((task) => task.kappaRequired);
                }

                if (onlyLightKeeper) {
                  traderTasks = traderTasks.filter((task) => task.lightkeeperRequired);
                }

                if (hideComplete && selectedTasks) {
                  const completedTaskIds = new Set(selectedTasks.map((t) => t.id));
                  traderTasks = traderTasks.filter((task) => !completedTaskIds.has(task.id));
                }

                return (
                  <TabPanel
                    key={index}
                    header={trader}
                  >
                    <DataTable
                      selection={selectedTasks}
                      onSelectionChange={(e) => handleSelectTask(e.value)} dataKey="id"
                      tableStyle={{ minWidth: '50rem' }}
                      value={traderTasks}
                      showSelectAll={false}
                      scrollable
                      scrollHeight="800px"
                    >
                      <Column selectionMode="multiple" style={{width: '5%' }}></Column>
                      <Column style={{ width: '20%' }} field="wikiLink" header="Task" body={(rowData) => WikiLink(rowData)}></Column>
                      <Column style={{ width: '20%' }} field="objectives" header="" body={(rowData) => NeededItemsColumn(rowData)}></Column>
                      <Column style={{ width: '20%' }} field="lightkeeperRequired" header="" body={(rowData) => LightKeeperColumn(rowData)}></Column>
                      <Column style={{ width: '20%' }} field="kappaRequired" header="" body={(rowData) => KappaColumn(rowData)}></Column>
                    </DataTable>
                  </TabPanel>
                )
              })
            }
            <TabPanel
              header='Collector'
            >
              <Collector collector={tasks.find((task) => task.name === 'Collector')} />
            </TabPanel>
          </TabView>
        </div>
        <div className="lg:col-4 md:col-12">
          <Items
            tasks={tasks}
            completedTasks={selectedTasks}
            style={{marginTop: '55px'}}
          />
          <div className='mt-3 mb-3'>
            Kappa Progress: {kappaCompletion.toFixed(2)}% <ProgressBar value={kappaCompletion.toFixed(2)} />
          </div>
          <div className='flex align-items-center gap-4'>
            <div className='flex align-items-center gap-2'>
              <InputSwitch checked={onlyKappa} onChange={(e) => setOnlyKappa(e.value)} />Only Kappa
            </div>
            <div className='flex align-items-center gap-2'>
              <InputSwitch checked={onlyLightKeeper} onChange={(e) => setOnlyLightkeeper(e.value)} />Only Lightkeeper
            </div>
            <div className='flex align-items-center gap-2'>
              <InputSwitch checked={hideComplete} onChange={(e) => setHideComplete(e.value)} />Hide Complete
            </div>
          </div>
        </div>
      </div>
      <Dialog header="Required FIR Items" visible={itemsDialogVisible} style={{ width: '50vw' }} onHide={() => {if (!itemsDialogVisible) return; setItemsDialogVisible(false); }}>
          <div className="m-0">
            {[...selectedQuestItems.entries()].map(([name, count]) => (
                <div key={name}>
                  {count}x {name} 
                </div>
              ))}
          </div>
      </Dialog>
    </div>
  )
}