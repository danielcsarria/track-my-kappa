import { useEffect, useState } from "react"
import { OrderList } from 'primereact/orderlist';
        

export const Items = ({
  tasks,
  completedTasks = []
}) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    createItemList()
    
  }, [completedTasks, tasks])

  function createItemList() {
    const questItemsMap = new Map();

    const completedTaskIds = new Set(completedTasks?.map(task => task.id));

    const handInItemsTasks = tasks?.filter(
      (task) =>
        !completedTaskIds.has(task.id) &&
        task?.objectives?.some((obj) => obj.type === 'giveItem' && obj.foundInRaid)
    );

    handInItemsTasks.forEach((task) => {
      task.objectives
        .filter((obj) => obj.type === 'giveItem' && task.kappaRequired)
        .forEach((obj) => {
          // Get unique item names for this objective
          const uniqueItems = new Map();

          obj.items?.forEach(item => {
            if (!uniqueItems.has(item.name)) {
              uniqueItems.set(item.name, item);
            }
          });

          uniqueItems.forEach((item, name) => {
            const existing = questItemsMap.get(name) || {
              count: 0,
              img: item.image512pxLink,
            };
            questItemsMap.set(name, {
              count: existing.count + (obj.count || 0),
              img: existing.img || item.image512pxLink,
            });
          });
        });
    });

    const questItems = Array.from(questItemsMap.entries()).map(
      ([name, data]) => ({
        name,
        count: data.count,
        img: data.img,
      })
    );

    setItems(questItems);
  }

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
    <div>
      <div className="xl:flex xl:justify-content-center">
        <OrderList
          dataKey="id"
          value={items}
          itemTemplate={itemTemplate}
          header="Kappa Quest Items"
          filter
          filterBy="name"
          className="w-full"
        />
      </div>
    </div>
  )
}