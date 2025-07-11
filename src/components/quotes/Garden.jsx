import { FaPlus } from "react-icons/fa"
const GARDEN = [
  {
    title: "Garden Chair",
    dimensions: "85cm x 64 x 55 / 33inches x 25 x 21(HWD)"
  },
  {
    title: "2 Garden Chairs Stacked",
    dimensions: "170cm x 128 x 110 / 66inches x 50 x 43(HWD)"
  },
  {
    title: "Large BBQ",
    dimensions: "115cm x 140 x 65 / 45inches x 55 x 25(HWD)"
  },
  {
    title: "Large BBQ (Dismantled)",
    dimensions: "40cm x 140 x 65 / 16inches x 55 x 25(HWD)"
  },
  {
    title: "Large Garden Table",
    dimensions: "73cm x 90 x 200 / 28inches x 35 x 78(HWD)"
  },
  {
    title: "Large Garden Table (Dismantled)",
    dimensions: "20cm x 90 x 200 / 8inches x 35 x 78(HWD)"
  },
  {
    title: "Small BBQ",
    dimensions: "45cm x 40 x 45 / 18inches x 16 x 18(HWD)"
  },
  {
    title: "Small BBQ (Dismantled)",
    dimensions: "10cm x 40 x 45 / 4inches x 16 x 18(HWD)"
  },
  {
    title: "Small Garden Table",
    dimensions: "55cm x 80 x 80 / 21inches x 31 x 31(HWD)"
  },
  {
    title: "Small Garden Table (Dismantled)",
    dimensions: "10cm x 80 x 80 / 4inches x 31 x 31(HWD)"
  },
  {
    title: "Sun Lounger (Collapsed)",
    dimensions: "20cm x 60 x 120 / 8inches x 23 x 47(HWD)"
  }

]

const Garden = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
          <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
          <div className="space-y-4">
            {GARDEN.map((item, index) => (
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

export default Garden