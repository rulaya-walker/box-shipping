import { FaPlus } from "react-icons/fa"

const Bedrooms = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {

  const BEDROOMS = [
    {
      title: "Bed Side Table",
      dimensions: "56cm x 38 x 38 / 22inches x 15 x 15(HWD)"
    },
    {
      title: "Bed Side Table (Dismantled)",
      dimensions: "56cm x 38 x 10 / 22inches x 15 x 4(HWD)"
    },
    {
      title: "Child's Bed",
      dimensions: "95cm x 100 x 175 / 37inches x 39 x 68(HWD)"
    },
    {
      title: "Child's Bed (Dismantled)",
      dimensions: "20cm x 100 x 175 / 8inches x 39 x 68(HWD)"
    },
    {
      title: "Children's Cot",
      dimensions: "90cm x 135 x 70 / 35inches x 53 x 27(HWD)"
    },
    {
      title: "Children's Cot (Dismantled)",
      dimensions: "90cm x 20 x 135 / 35inches x 8 x 53(HWD)"
    },
    {
      title: "Double Bed",
      dimensions: "90cm x 145 x 198 / 35inches x 57 x 77(HWD)"
    },
    {
      title: "Double Bed (Dismantled)",
      dimensions: "20cm x 145 x 198 / 8inches x 57 x 77(HWD)"
    },
    {
      title: "Large Chest Of Drawers",
      dimensions: "90cm x 75 x 30 / 35inches x 29 x 12(HWD)"
    },
    {
      title: "Large Chest of Drawers (Dismantled)",
      dimensions: "90cm x 75 x 10 / 35inches x 29 x 4(HWD)"
    },
    {
      title: "Large Wardrobe",
      dimensions: "195cm x 150 x 55 / 76inches x 58 x 21(HWD)"
    },
    {
      title: "Large Wardrobe (Dismantled)",
      dimensions: "195cm x 20 x 55 / 76inches x 8 x 21(HWD)"
    },
    {
      title: "Single Bed",
      dimensions: "85cm x 100 x 200 / 33inches x 39 x 78(HWD)"
    },
    {
      title: "Single Bed (Dismantled)",
      dimensions: "20cm x 100 x 200 / 8inches x 39 x 78(HWD)"
    },
    {
      title: "Small Chest Of Drawers",
      dimensions: "53cm x 66 x 30 / 21inches x 26 x 12(HWD)"
    },
    {
      title: "Small Chest of Drawers (Dismantled)",
      dimensions: "53cm x 66 x 10 / 21inches x 26 x 4(HWD)"
    },
    {
      title: "Small Wardrobe",
      dimensions: "180cm x 60 x 55 / 70inches x 23 x 21(HWD)"
    },
    {
      title: "Small Wardrobe (Dismantled)",
      dimensions: "180cm x 20 x 55 / 70inches x 8 x 21(HWD)"
    }
  ]
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Bedrooms</h3>
      <div className="space-y-4">
        {BEDROOMS.map((item, index) => (
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

export default Bedrooms