import { FaPlus } from "react-icons/fa"
const DININ_ROOMS = [
  {
    title: "Dining Room Chair",
    dimensions: "90cm x 45 x 54 / 35inches x 18 x 21(HWD)"
  },
  {
    title: "2 Dining Room Chairs Stacked",
    dimensions: "180cm x 90 x 108 / 70inches x 35 x 42(HWD)"
  },
  {
    title: "Large Dining Room Table",
    dimensions: "76cm x 90 x 185 / 30inches x 35 x 72(HWD)"
  },
  {
    title: "Large Dining Room Table (Dismantled)",
    dimensions: "10cm x 90 x 185 / 4inches x 35 x 72(HWD)"
  },
  {
    title: "Small Dining Room Table",
    dimensions: "76cm x 70 x 90 / 30inches x 27 x 35(HWD)"
  },
  {
    title: "Small Dining Room Table (Dismantled)",
    dimensions: "10cm x 70 x 90 / 4inches x 27 x 35(HWD)"
  },

];

const DiningRoom = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
      <div className="space-y-4">
        {DININ_ROOMS.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm mb-4">
                  {item.dimensions}
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("large-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("large-box")}
                </span>
                <button
                  onClick={() => updateQuantity("large-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div> ))}

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Add Custom Item</h4>
              <p className="text-gray-600 text-sm mb-4">
                Already have some sturdy boxes you can use? Add them here.
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setShowAddBoxForm(true)}
                  className="px-4 py-2 bg-primary text-white cursor-pointer flex items-center gap-2 rounded-full"
                >
                  <FaPlus /> Add Box
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiningRoom