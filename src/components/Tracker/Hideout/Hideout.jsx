import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { FloatLabel } from "primereact/floatlabel"
import { InputSwitch } from "primereact/inputswitch"
import { InputText } from "primereact/inputtext"
import { OrderList } from "primereact/orderlist"
import { useEffect, useState } from "react"

export const Hideout = ({
  hideout
}) => {
  const [stations, setStations] = useState([])
  const [hideoutStationVisisble, setHideoutStationVisisble] = useState(false)
  const [selectedHideoutStation, setSelectedHideoutStation] = useState(null)
  const [selectedHideoutStations, setSelectedHideoutStations] = useState([]);
  const [hideComplete, setHideComplete] = useState(null)
  const [hideoutItems, setHideoutItems] = useState([])
  const [stationName, setStationName] = useState('')

  useEffect(() => {
    const storedCompletedHideoutStations = loadCompletedHideoutStations();
    if (storedCompletedHideoutStations) setSelectedHideoutStations(storedCompletedHideoutStations);
  }, [stations])

  useEffect(() => {
    const hideoutStations = flattenHideout(hideout)
    setStations(hideoutStations)
  }, [hideout])

  useEffect(() => {
    localStorage.setItem('hideComplete', hideComplete)
  }, [hideComplete])

  useEffect(() => {
    createHideoutItemsList();
  }, [selectedHideoutStations])

  function flattenHideout() {
    const stations = hideout.flatMap(station =>
      station.levels.map(level => ({
        id: level.id,
        name: `${station.name} ${level.level}`,
        items: level.itemRequirements
      }))
    );

    return stations
  }

  function createHideoutItemsList() {
    const hideoutItemsMap = new Map();

    const flattenedStations = flattenHideout(hideout);

    // Collect just the completed station IDs
    const completedStationIds = new Set(
      selectedHideoutStations.map((station) => station.id)
    );

    // Only include stations that are NOT completed
    const handInStations = flattenedStations.filter(
      (station) => !completedStationIds.has(station.id)
    );

    handInStations.forEach((station) => {
      station.items?.forEach((req) => {
        const name = req.item.name;
        const img = req.item.image512pxLink || '';
        const existing = hideoutItemsMap.get(name) || { count: 0, img };

        hideoutItemsMap.set(name, {
          count: existing.count + (req.count || 0),
          img: existing.img || img,
        });
      });
    });

    const blacklist = new Set(["Dollars", "Euros", "Roubles"]);

    const neededHideoutItems = Array.from(hideoutItemsMap.entries())
      .map(([name, data]) => ({
        id: name,
        name,
        count: data.count,
        img: data.img,
      }))
      .filter(item => !blacklist.has(item.name)); // <- exclude unwanted currencies

    setHideoutItems([...neededHideoutItems]);
  }

  function handleItemsButtonClick(items) {
    setSelectedHideoutStation(items);
    setHideoutStationVisisble(true);
  }

  function loadCompletedHideoutStations() {
    const data = localStorage.getItem('completedHideoutStation');

    if (!data) return null
    
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  function handleSelectStation(value) {
    setSelectedHideoutStations(value);
    localStorage.setItem('completedHideoutStation', JSON.stringify(value))
  }

  const NeededItemsColumn = ( {items} ) => {
  
    return (
      <div>
        <Button
          label="Items"
          severity="info"
          text
          onClick={() => handleItemsButtonClick(items)}
          size='small'
        />
      </div>
    );
  };

  const itemTemplate = (item) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-3">
        <img loading="lazy" className="w-3rem shadow-2 flex-shrink-0 border-round" src={item.img} alt={item.name} />
        <div className="flex-1 flex flex-column gap-2 xl:mr-8">
            <span className="font-bold">{item.name}</span>
        </div>
        <span className="font-bold text-900">{item.count}X</span>
      </div>
    );
  };

  return (
    <div className="grid">
      <div className="lg:col-8 md:col-12 card">
        <div className="flex gap-2 align-items-center mt-4 pb-2">
          <FloatLabel>
              <InputText id="taskName" value={stationName} onChange={(e) => setStationName(e.target.value)} />
            <label htmlFor="taskName">Search Station</label>
          </FloatLabel>
          <Button
            icon="pi pi-times"
            rounded
            text
            severity="danger"
            tooltip="Clear Search"
            tooltipOptions={{ position: 'right' }}
            aria-label="Cancel"
            onClick={() => setStationName('')}
          />
        </div>
        <DataTable
          value={stations
            .filter((station) =>
              !hideComplete || !selectedHideoutStations.some(s => s.id === station.id)
            )
            .filter((station) =>
              station.name.toLowerCase().includes(stationName.toLowerCase())
            )
          }
          scrollable
          scrollHeight="800px"
          showSelectAll={false}
          onSelectionChange={(e) => handleSelectStation(e.value)} dataKey="id"
          selection={selectedHideoutStations}
        >
          <Column selectionMode="multiple" style={{width: '5%' }}></Column>
          <Column style={{ width: '20%' }} field="name" header="" />
          <Column style={{ width: '20%' }} field="objectives" header="" body={(rowData) => NeededItemsColumn(rowData)}></Column>
        </DataTable>
      </div>
      <div className="lg:col-4 md:col-12 card hideout-items">
        <OrderList
          dataKey="id"
          value={hideoutItems}
          itemTemplate={itemTemplate}
          header="Hideout Items"
          filter
          filterBy="name"
          className="w-full"
        />
        <div className='flex align-items-center justify-content-between mt-3'>
          <div className='flex align-items-center gap-2'>
            <InputSwitch checked={hideComplete} onChange={(e) => setHideComplete(e.value)} />Hide Complete
          </div>
        </div>
      </div>
      <Dialog
        header="Requred FIR Items"
        style={{ width: '50vw' }}
        visible={hideoutStationVisisble}
        onHide={() => { if (!hideoutStationVisisble) return; setHideoutStationVisisble(false); }}
        closeOnEscape='true'
        dismissableMask
      >
        <div className="m-0">
          {selectedHideoutStation &&
            Object.entries(selectedHideoutStation).map(([_, value]) => (
              <div key={value.item.name}>
                {value.count}x {value.item.name}
              </div>
            ))}
        </div>
      </Dialog>
    </div>
  )
}