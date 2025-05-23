import { Card } from "primereact/card"
import { useEffect, useState } from "react"

export const Collector = ({ collector }) => {

  const [activeItems, setActiveItems] = useState(() => {
    const stored = localStorage.getItem('activeCollectorItems');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  
  const collectorItems = () => {

    const collectorItems = collector?.objectives.flatMap((obj) => {
      return obj.items.map((item) => {
        return {
          name: item.name,
          img: item.image512pxLink
        }
      })
    })

    function handleItemClick(item) {
      setActiveItems(prev => {
        const updated = new Set(prev);
        if (updated.has(item.name)) {
          updated.delete(item.name);
        } else {
          updated.add(item.name);
        }

        localStorage.setItem('activeCollectorItems', JSON.stringify(Array.from(updated)));

        return updated;
      });
    }

    return (
      collectorItems?.map((item) => (
        <div
          key={item.name}
          className={`lg:col-2 md:col-12 flex align-items-center item ${activeItems.has(item.name) ? 'active' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          <img className="kappa-item" src={item.img} alt={item.name} />
          {item.name}
        </div>
      ))
    )
  }


  return (
    <div className="grid gap-1">
      {collectorItems()}
    </div>
  )
}