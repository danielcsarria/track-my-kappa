import { Dialog } from "primereact/dialog";
import BuyMeACoffee from "../BuyMeACoffee/BuyMeACofee";

export const About = ({
  aboutVisible,
  setAboutVisible
}) => {
  return (
    <Dialog
      header="About"
      visible={aboutVisible}
      style={{ width: '50vw' }}
      onHide={() => { if (!aboutVisible) return; setAboutVisible(false); }}
    >
      <p>
        Hello!
      </p>
      <p>
        My name is Danny. I built this application as a little passion project for one of my favorite games
      </p>
      <p>
        I found myself constantly looking for a light weight, simple to use application that I can use hand in hand with the wiki to keep track of my progress towards Kappa. <strong>No database, no API, no login</strong>
      </p>
      <p>
        Why? Because it keeps things as simple as possible. This application uses your browsers storage to persist your progress
      </p>
      <p>
        Worried if you need an item for a quest? Use the Kappa Quest Item search to see if you need to keep or if you're safe to sell it. As you complete quests, the items will disappear from that list. 
      </p>
      <p>
        This application is <strong>free to use, and advertisment free</strong>
      </p>
      <p>
        If you have any suggestions for new features, or if you encounter a bug, please email me at <a href="mailto:savillemediallc@gmail.com">savillemediallc@gmail.com</a>. 
      </p>
      <p>
        Thank you for stopping by and I hope this helps you on your questing journey!
      </p>

      <p>
        PS: Plz unban me Burnt Peanut
      </p>

      <BuyMeACoffee />
    </Dialog>
  )
}