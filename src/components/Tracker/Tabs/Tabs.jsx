import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import { Collector } from "../../Collector/Collector";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Button } from "primereact/button";

export const Tabs = ({
  traders,
  onlyKappa,
  onlyLightKeeper,
  hideComplete,
  selectedTasks,
  handleSelectTask,
  wikiLink,
  neededItemsColumn,
  lightKeeperColumn,
  kappaColumn,
  tasks,
  playerLevel,
}) => {
  const [taskName, setTaskName] = useState('')
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <TabView
      scrollable
      activeIndex={activeIndex}
      className="regular"
      onTabChange={(e) => {
        setActiveIndex(e.index);
        setTaskName('');
      }}
    >
      {
        traders.map((trader, index) => {
          
          let traderTasks = tasks?.filter((task) => task.trader.name === trader);

          if (playerLevel > 0) {
            traderTasks = traderTasks.filter((task) => {
              if (typeof task.minPlayerLevel === 'number') {
                return playerLevel >= task.minPlayerLevel;
              }
              return true;
            });  
          }
          
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

          if (taskName.trim() !== '') {
            traderTasks = traderTasks.filter((task) =>
              task.name.toLowerCase().includes(taskName.toLowerCase())
            );
          }

          return (
            <TabPanel
              key={index}
              header={trader}
            >
              <div className="flex gap-2 align-items-center mt-4 pb-2">
                <FloatLabel>
                    <InputText id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                  <label htmlFor="taskName">Search Task Name</label>
                </FloatLabel>
                <Button
                  icon="pi pi-times"
                  rounded
                  text
                  severity="danger"
                  tooltip="Clear Search"
                  tooltipOptions={{ position: 'right' }}
                  aria-label="Cancel"
                  onClick={() => setTaskName('')}
                />
              </div>
              <DataTable
                selection={selectedTasks}
                onSelectionChange={(e) => handleSelectTask(e.value)} dataKey="id"
                // tableStyle={{ minWidth: '50rem' }}
                value={traderTasks}
                showSelectAll={false}
                scrollable
                scrollHeight="800px"
              >
                <Column selectionMode="multiple" style={{width: '5%' }}></Column>
                <Column
                  style={{ width: '20%' }}
                  field="wikiLink"
                  header=""
                  body={(rowData) => wikiLink(rowData)}
                ></Column>
                <Column style={{ width: '20%' }} field="objectives" header="" body={(rowData) => neededItemsColumn(rowData)}></Column>
                <Column style={{ width: '20%' }} field="lightkeeperRequired" header="" body={(rowData) => lightKeeperColumn(rowData)}></Column>
                <Column style={{ width: '20%' }} field="kappaRequired" header="" body={(rowData) => kappaColumn(rowData)}></Column>
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
  )
}