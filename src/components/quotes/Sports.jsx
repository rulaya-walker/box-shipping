import { FaPlus } from "react-icons/fa";
import { box } from "../../constants";

const Sports = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Shipping Boxes</h3>
      <div className="space-y-4">
        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Bicycle</h4>
              <p className="text-gray-600 text-sm mb-4">
                26cm x 155 x 85 / 10inches x 60 x 33(HWD)
              </p>
              <p className="text-gray-600 text-xs">
                61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max
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
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Child's Bicycle</h4>
              <p className="text-gray-600 text-sm mb-4">
                26cm x 116 x 87.5 / 10inches x 45 x 34(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("standard-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("standard-box")}
                </span>
                <button
                  onClick={() => updateQuantity("standard-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Exercise Bike</h4>
              <p className="text-gray-600 text-sm mb-4">
                126cm x 53 x 122 / 49inches x 21 x 48(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("book-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("book-box")}
                </span>
                <button
                  onClick={() => updateQuantity("book-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Exercise Bike (Dismantled)</h4>
              <p className="text-gray-600 text-sm mb-4">
                88cm x 38 x 122 / 34inches x 15 x 48(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("clothes-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("clothes-box")}
                </span>
                <button
                  onClick={() => updateQuantity("clothes-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Golf Bag</h4>
              <p className="text-gray-600 text-sm mb-4">
                33cm x 48 x 129 / 13inches x 19 x 50(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("book-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("book-box")}
                </span>
                <button
                  onClick={() => updateQuantity("book-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Pushchair (Collapsed)</h4>
              <p className="text-gray-600 text-sm mb-4">
                31cm x 72.5 x 91 / 12inches x 28 x 35(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("book-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("book-box")}
                </span>
                <button
                  onClick={() => updateQuantity("book-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Skis</h4>
              <p className="text-gray-600 text-sm mb-4">
                24cm x 24 x 182 / 9inches x 9 x 71(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("book-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("book-box")}
                </span>
                <button
                  onClick={() => updateQuantity("book-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Snowboard</h4>
              <p className="text-gray-600 text-sm mb-4">
                46cm x 162 x 23 / 18inches x 63 x 9(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("book-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("book-box")}
                </span>
                <button
                  onClick={() => updateQuantity("book-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Surfboard</h4>
              <p className="text-gray-600 text-sm mb-4">
                19cm x 240 x 62 / 7inches x 94 x 24(HWD)
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("book-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("book-box")}
                </span>
                <button
                  onClick={() => updateQuantity("book-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

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

export default Sports;
