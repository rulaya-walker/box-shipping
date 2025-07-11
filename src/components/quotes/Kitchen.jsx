import { FaPlus } from "react-icons/fa";
const KITCHEN = [
  {
    title: "Blender",
    dimensions: "38cm x 17 x 17 / 15inches x 7 x 7(HWD)",
  },
  {
    title: "Chest Freezer",
    dimensions: "74cm x 50 x 45 / 29inches x 20 x 18(HWD)",
  },
  {
    title: "Coffee Machine",
    dimensions: "39cm x 30 x 37 / 15inches x 12 x 14(HWD)",
  },
  {
    title: "Microwave",
    dimensions: "32cm x 47 x 38 / 12inches x 18 x 15(HWD)",
  },
  {
    title: "Small Fridge",
    dimensions: "78cm x 46 x 50 / 30inches x 18 x 20(HWD)",
  },
  {
    title: "Standard Fridge Freezer",
    dimensions: "187cm x 78 x 64 / 73inches x 30 x 25(HWD)",
  },
  {
    title: "Tumble Dryer",
    dimensions: "86cm x 62 x 65 / 34inches x 24 x 25(HWD)",
  },
  {
    title: "Washing Machine",
    dimensions: "84cm x 60 x 56 / 33inches x 23 x 22(HWD)",
  },
  {
    title: "Upright Vacuum Cleaner",
    dimensions: "113cm x 28 x 21 / 44inches x 11 x 8(HWD)",
  },
];

const Kitchen = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
      <div className="space-y-4">
        {KITCHEN.map((item, index) => (
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

export default Kitchen;
