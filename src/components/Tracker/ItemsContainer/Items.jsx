import { ProgressBar } from "primereact/progressbar"
import { Items } from "../../Items/Items"
import { InputSwitch } from "primereact/inputswitch"
import { FloatLabel } from "primereact/floatlabel"
import { InputNumber } from "primereact/inputnumber"

export const ItemsContainer = ({ 
  tasks,
  selectedTasks,
  kappaCompletion,
  lightKeeperCompletion,
  onlyKappa,
  onlyLightKeeper,
  hideComplete,
  setOnlyKappa,
  setOnlyLightkeeper,
  setHideComplete,
  playerLevel,
  setPlayerLevel
}) => {
  console.log('playerLevel', playerLevel)
  if (playerLevel > 0) {
    tasks = tasks.filter((task) => {
      if (typeof task.minPlayerLevel === 'number') {
        return playerLevel >= task.minPlayerLevel;
      }
      return true;
    });  
  }
  return (
    <div className="items-container">
      <Items
        tasks={tasks}
        completedTasks={selectedTasks}
        style={{marginTop: '55px'}}
      />
      <div className='mt-3 mb-3'>
        <div className='mb-2'>Kappa Progress: {kappaCompletion.toFixed(2)}%</div>
        <ProgressBar value={kappaCompletion.toFixed(2)} />
      </div>
      <div className='mt-3 mb-3'>
        <div className='mb-2'>Lightkeeper Progress: {lightKeeperCompletion.toFixed(2)}%</div>
        <ProgressBar value={lightKeeperCompletion.toFixed(2)} />
      </div>
      <div className='flex align-items-center justify-content-between'>
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
      <div className="mt-5 mb-3">
        <FloatLabel>
          <InputNumber
            id="player-number"
            value={playerLevel}
            min={0}
            max={72}
            showButtons='true'
            onValueChange={(e) => setPlayerLevel(e.value)} />
          <label htmlFor="player-number">Player Level</label>
      </FloatLabel>
      </div>
    </div>
  )
}