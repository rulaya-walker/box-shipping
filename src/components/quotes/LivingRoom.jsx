import { FaPlus } from "react-icons/fa";
const LIVING_ROOM = [
  {
    title: "Armchair",
    dimensions: "80cm x 94 x 91 / 31inches x 37 x 35(HWD)",
  },
  {
    title: "Foot Stool",
    dimensions: "46cm x 65 x 65 / 18inches x 25 x 25(HWD)",
  },
  {
    title: "Living Room Table",
    dimensions: "40cm x 90 x 50 / 16inches x 35 x 20(HWD)",
  },
  {
    title: "Living Room Table (Dismantled)",
    dimensions: "10cm x 90 x 50 / 4inches x 35 x 20(HWD)",
  },
  {
    title: "TV 15-20 Inch",
    dimensions: "60cm x 31 x 52.5 / 23inches x 12 x 20(HWD)",
  },
  {
    title: "TV 21-32 Inch",
    dimensions: "91cm x 31 x 72.5 / 35inches x 12 x 28(HWD)",
  },
  {
    title: "TV 33-42 Inch",
    dimensions: "116cm x 43 x 87.5 / 45inches x 17 x 34(HWD)",
  },
  {
    title: "TV 43-52 Inch",
    dimensions: "155cm x 26 x 85 / 60inches x 10 x 33(HWD)",
  },
  {
    title: "2 Seater Sofa",
    dimensions: "84cm x 175 x 96 / 33inches x 68 x 37(HWD)",
  },
  {
    title: "3 Seater Sofa",
    dimensions: "75cm x 180 x 80 / 29inches x 70 x 31(HWD)",
  },
];

const LivingRoom = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
      <div className="space-y-4">
        {LIVING_ROOM.map((item, index) => (
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
                    onClick={() => updateQuantity("living-large-box", -1)}
                    className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x">
                    {getQuantity("living-large-box")}
                  </span>
                  <button
                    onClick={() => updateQuantity("living-large-box", 1)}
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

export default LivingRoom;
