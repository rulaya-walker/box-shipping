import { FaPlus } from "react-icons/fa";
const OFFICE = [
  {
    title: "2 Drawer Filing Cabinet",
    dimensions: "60cm x 40 x 45 / 23inches x 16 x 18(HWD)"
  },
  {
    title: "3 Drawer Filing Cabinet",
    dimensions: "90cm x 40 x 40 / 35inches x 16 x 16(HWD)"
  },
  {
    title: "Large Office Desk",
    dimensions: "74cm x 166 x 90 / 29inches x 65 x 35(HWD)"
  },
  {
    title: "Large Office Desk (Dismantled)",
    dimensions: "20cm x 166 x 90 / 8inches x 65 x 35(HWD)"
  },
  {
    title: "Monitor 15-20 inch",
    dimensions: "60cm x 31 x 52.5 / 23inches x 12 x 20(HWD)"
  },
  {
    title: "Monitor 21-32 inch",
    dimensions: "91cm x 31 x 72.5 / 35inches x 12 x 28(HWD)"
  },
  {
    title: "Monitor 33-42 inch",
    dimensions: "116cm x 43 x 87.5 / 45inches x 17 x 34(HWD)"
  },
  {
    title: "Monitor 43-52 inch",
    dimensions: "155cm x 26 x 85 / 60inches x 10 x 33(HWD)"
  },
  {
    title: "Office Desk Chair",
    dimensions: "117cm x 63 x 64 / 46inches x 25 x 25(HWD)"
  },
  {
    title: "Small Office Desk",
    dimensions: "76cm x 100 x 50 / 30inches x 39 x 20(HWD)"
  },
  {
    title: "Small Office Desk (Dismantled)",
    dimensions: "20cm x 100 x 50 / 8inches x 39 x 20(HWD)"
  }
]

const Office = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
      <div className="space-y-4">
        {OFFICE.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{item.dimensions}</p>
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
          </div>
        ))}

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
  );
};

export default Office;
